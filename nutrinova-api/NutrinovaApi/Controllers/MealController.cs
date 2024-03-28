using NutrinovaData.Features.Meals;
using NutrinovaData.Features.Recipes;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class MealController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly IRecipeFoodTotaler recipeFoodTotaler;
  private readonly ILogger<MealController> logger;

  public MealController(ILogger<MealController> logger, NutrinovaDbContext context, IRecipeFoodTotaler recipeFoodTotaler)
  {
    this.logger = logger;
    this.context = context;
    this.recipeFoodTotaler = recipeFoodTotaler;
  }

  [HttpGet("searchFoodItems")]
  public async Task<ActionResult<IEnumerable<MealSelectionItem>>> SearchFoodItems(string? query)
  {
    var mealSelectionItems = new List<MealSelectionItem>();

    var foodItems = await context.FoodPlans
      .Include(f => f.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .Where(f => query == null || f.Description.Contains(query))
      .Take(10)
      .ToListAsync();

    mealSelectionItems.AddRange(foodItems.Select(f => new MealSelectionItem
    {
      Id = f.Id,
      Description = f.Description,
      ServingSize = f.ServingSize,
      ServingSizeUnit = f.ServingSizeUnitNavigation.ToUnitOption(),
      Type = MealSelectionItemType.CustomFood.ToString(),
    }));

    var recipeItems = await context.RecipePlans
      .Include(r => r.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .Where(r => query == null || (r.Description != null && r.Description.Contains(query)))
      .Take(10)
      .ToListAsync();

    mealSelectionItems.AddRange(recipeItems.Select(r => new MealSelectionItem
    {
      Id = r.Id,
      Description = r.Description!,
      ServingSize = r.Amount,
      ServingSizeUnit = r.ServingSizeUnitNavigation.ToUnitOption(),
      Type = MealSelectionItemType.Recipe.ToString(),
    }));

    return Ok(mealSelectionItems);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<MealResponse>> GetMeal(Guid id)
  {
    var meal = await context.Meals.IncludeMealResponseDetails()
      .FirstOrDefaultAsync(m => m.Id == id);

    if (meal is null)
    {
      return NotFound();
    }

    return Ok(meal.ToMealResponse());
  }

  [HttpGet("getMealHistory")]
  public async Task<ActionResult<IEnumerable<MealResponse>>> GetMeals(DateTime beginDate, DateTime endDate)
  {
    beginDate = DateTime.SpecifyKind(beginDate, DateTimeKind.Utc);
    endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

    var customer = await GetCustomer();
    if (customer is null)
    {
      return Unauthorized();
    }

    var meals = new List<Meal>();
    meals = await context.Meals
      .IncludeMealResponseDetails()
      .Where(m =>
        m.Patient.CustomerId == customer.Id &&
        m.Recordedat >= beginDate.Date &&
        m.Recordedat <= endDate.Date)
      .ToListAsync();

    return Ok(meals.ToMealResponses());
  }

  [HttpPost]
  public async Task<ActionResult> RecordMeal(RecordMealRequest recordMealRequest)
  {
    using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
      var customer = await GetCustomer();
      if (customer is null)
      {
        return Unauthorized();
      }

      var mealEntity = new Meal
      {
        Id = Guid.NewGuid(),
        Amount = recordMealRequest.Amount,
        PatientId = recordMealRequest.PatientId,
        Recordedby = User.Identity!.Name!,
        Recordedat = recordMealRequest.RecordedAt,
        Unit = recordMealRequest.UnitId,
      };

      if (recordMealRequest.MealSelectionType == MealSelectionItemType.CustomFood.ToString())
      {
        var foodPlan = await context.FoodPlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (foodPlan is null)
        {
          return NotFound();
        }

        mealEntity.Description = foodPlan.Description;
        mealEntity.Ingredients = foodPlan.Ingredients;

        var foodPlanNutrients = await context.FoodPlanNutrients
          .Where(f => f.FoodplanId == foodPlan.Id)
          .ToListAsync();

        foreach (var foodPlanNutrient in foodPlanNutrients)
        {
          var mealNutrient = new MealNutrient
          {
            Id = Guid.NewGuid(),
            MealId = mealEntity.Id,
            NutrientId = foodPlanNutrient.NutrientId,
            Amount = foodPlanNutrient.Amount * recordMealRequest.Amount / foodPlan.ServingSize, // TODO: Handle unit conversion
          };

          await context.MealNutrients.AddAsync(mealNutrient);
        }
      }
      else if (recordMealRequest.MealSelectionType == MealSelectionItemType.Recipe.ToString())
      {
        var recipePlan = await context.RecipePlans
        .Include(r => r.ServingSizeUnitNavigation)
          .ThenInclude(u => u.Category)
          .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Food)
              .ThenInclude(f => f.FoodPlanNutrients)
                .ThenInclude(fpn => fpn.Nutrient)
                  .ThenInclude(n => n.PreferredUnitNavigation)
                   .ThenInclude(u => u.Category)
          .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Food)
              .ThenInclude(f => f.FoodPlanNutrients)
               .ThenInclude(fpn => fpn.Unit)
                 .ThenInclude(u => u.Category)
          .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Food)
              .ThenInclude(f => f.ServingSizeUnitNavigation)
                .ThenInclude(u => u.Category)
          .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Unit)
              .ThenInclude(u => u.Category)
          .FirstOrDefaultAsync(r => r.Id == recordMealRequest.SelectedMealItemId);

        if (recipePlan is null)
        {
          return NotFound();
        }

        mealEntity.Description = recipePlan.Description;
        mealEntity.Ingredients = recipePlan.RecipeFoods
          .Select(rf => $"{rf.Food.Description}: {rf.Amount} {rf.Unit.Abbreviation}")
          .Aggregate((a, b) => $"{a}\n{b}");

        List<FoodConversionSample> conversionSamples = GetFoodConversionSamples();
        var summaries = recipeFoodTotaler.GetRecipeNutrientSummaries(recipePlan.RecipeFoods.ToList(), conversionSamples);

        foreach (var summary in summaries)
        {
          var mealNutrient = new MealNutrient
          {
            Id = Guid.NewGuid(),
            MealId = mealEntity.Id,
            NutrientId = summary.NutrientId,
            Amount = summary.Amount * recordMealRequest.Amount / recipePlan.Amount, // TODO: Handle unit conversion
          };

          await context.MealNutrients.AddAsync(mealNutrient);
        }
      }
      else if (recordMealRequest.MealSelectionType == MealSelectionItemType.ClonedMeal.ToString())
      {
        var clonedMeal = await context.Meals
          .Include(m => m.MealNutrients)
          .FirstOrDefaultAsync(m => m.Id == recordMealRequest.SelectedMealItemId);

        if (clonedMeal is null)
        {
          return NotFound();
        }

        mealEntity.Description = clonedMeal.Description;
        mealEntity.Ingredients = clonedMeal.Ingredients;

        foreach (var mealNutrient in clonedMeal.MealNutrients)
        {
          var newMealNutrient = new MealNutrient
          {
            Id = Guid.NewGuid(),
            MealId = mealEntity.Id,
            NutrientId = mealNutrient.NutrientId,
            Amount = mealNutrient.Amount * recordMealRequest.Amount / clonedMeal.Amount, // TODO: Handle unit conversion
          };

          await context.MealNutrients.AddAsync(newMealNutrient);
        }
      }
      else
      {
        return BadRequest();
      }

      await context.Meals.AddAsync(mealEntity);
      await context.SaveChangesAsync();

      await transaction.CommitAsync();

      var meal = await context.Meals.IncludeMealResponseDetails()
        .FirstOrDefaultAsync(m => m.Id == mealEntity.Id);

      var mealResponse = meal?.ToMealResponse();

      return CreatedAtAction(nameof(GetMeal), new { id = mealEntity.Id }, mealResponse);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error recording meal");
      await transaction.RollbackAsync();
      throw;
    }
  }

  [HttpPut]
  public async Task<ActionResult> UpdateMeal(EditMealRequest incomingMealRequest)
  {
    if (incomingMealRequest.Id == Guid.Empty)
    {
      return BadRequest("Invalid Meal Id");
    }
    else if (incomingMealRequest.Amount <= 0)
    {
      return BadRequest("Amount must be greater then 0");
    }

    var customer = await GetCustomer();

    var meal = await context.Meals
      .Include(m => m.Patient)
      .ThenInclude(p => p.Customer)
      .FirstOrDefaultAsync(m => m.Id == incomingMealRequest.Id);

    if (customer is null || meal?.Patient?.Customer?.Id != customer.Id)
    {
      return Unauthorized();
    }

    using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
      // check if the meal exists
      var currentMeal = await context.Meals.Include(m => m.MealNutrients).FirstOrDefaultAsync(m => m.Id == incomingMealRequest.Id);

      // return not found if it doesn't
      if (currentMeal == null)
      {
        return BadRequest("Invalid Meal Id");
      }

      // update the meal with the new values
      // if current meal amount is different from the new amount, update the meal nutrients
      if (currentMeal.Amount != incomingMealRequest.Amount)
      {
        // get the meal nutrients
        var mealNutrients = await context.MealNutrients.Where(mn => mn.MealId == incomingMealRequest.Id).ToListAsync();

        // update the meal nutrients
        foreach (var mealNutrient in mealNutrients)
        {
          mealNutrient.Amount = mealNutrient.Amount * (incomingMealRequest.Amount / currentMeal.Amount);
        }
      }

      currentMeal.Unit = incomingMealRequest.UnitId;
      currentMeal.UnitNavigation = await context.Units.FirstOrDefaultAsync(u => u.Id == incomingMealRequest.UnitId) ?? throw new InvalidOperationException("Unit not found");
      currentMeal.Amount = incomingMealRequest.Amount;
      currentMeal.Recordedat = incomingMealRequest.RecordedAt;

      currentMeal.Notes = incomingMealRequest.Notes;

      // save the changes
      await context.SaveChangesAsync();
      await transaction.CommitAsync();

      return Ok("Meal updated");
    }
    catch (Exception ex)
    {
      await transaction.RollbackAsync();
      logger.LogError(ex, "Error updating meal");
      return StatusCode(500, "Error updating meal");
    }
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteMeal(Guid id)
  {
    if (id == Guid.Empty)
    {
      return BadRequest("Invalid Meal Id");
    }

    var customer = await GetCustomer();
    var meal = await context.Meals
      .Include(m => m.Patient)
      .ThenInclude(p => p.Customer)
      .FirstOrDefaultAsync(m => m.Id == id);
    if (customer is null || meal?.Patient.Customer?.Id != customer.Id)
    {
      return Unauthorized();
    }

    using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
      // delete the meal
      var mealToDelete = await context.Meals.FirstOrDefaultAsync(m => m.Id == id);
      if (mealToDelete == null)
      {
        return BadRequest("Invalid Meal Id");
      }

      var mealNutrients = await context.MealNutrients.Where(mn => mn.MealId == id).ToListAsync();
      context.MealNutrients.RemoveRange(mealNutrients);
      context.Meals.Remove(mealToDelete);
      await context.SaveChangesAsync();
      await transaction.CommitAsync();

      return Ok("Meal deleted");
    }
    catch (Exception ex)
    {
      await transaction.RollbackAsync();
      logger.LogError(ex, "Error deleting meal");
      return StatusCode(500, "Error deleting meal");
    }
  }

  private async Task<Customer?> GetCustomer()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);
    return customer;
  }

  private List<FoodConversionSample> GetFoodConversionSamples()
  {
    return context.FoodConversionSamples
      .Include(fms => fms.MeasurementUnit).ThenInclude(u => u.Category)
      .Include(fms => fms.FoodPlan).ThenInclude(fp => fp.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .ToList();
  }
}
