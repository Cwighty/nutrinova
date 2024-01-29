using NutrinovaData.Features.Meals;
using NutrinovaData.Features.Patients;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class MealController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<MealController> logger;

  public MealController(ILogger<MealController> logger, NutrinovaDbContext context)
  {
    this.logger = logger;
    this.context = context;
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
  public async Task<ActionResult<Meal>> GetMeal(Guid id)
  {
    var meal = await context.Meals
      .FirstOrDefaultAsync(m => m.Id == id);

    if (meal is null)
    {
      return NotFound();
    }

    var mealResponse = new MealResponse
    {
      Id = meal.Id,
      PatientId = meal.PatientId,
      RecordedAt = meal.Recordedat,
      Recordedby = meal.Recordedby,
      Notes = meal.Notes,
      PatientResponse = meal.Patient.ToPatientResponse(),
    };

    return Ok(mealResponse);
  }

  [HttpGet("getMealHistory")]
  public async Task<ActionResult<IEnumerable<MealResponse>>> GetMealHistory(DateTime beginDate, DateTime endDate)
  {
    var customer = await GetCustomer();
    if (customer is null)
    {
      return Unauthorized();
    }

    var mealHistories = await context.Meals
      .Where(m => m.Patient.CustomerId == customer.Id && m.Recordedat >= beginDate.Date && m.Recordedat <= endDate.Date)
      .ToListAsync();

    var mealResponses = mealHistories.Select(m => new MealResponse
    {
      Id = m.Id,
      PatientId = m.PatientId,
      RecordedAt = m.Recordedat,
      Recordedby = m.Recordedby,
      Notes = m.Notes,
      PatientResponse = m.Patient.ToPatientResponse(),
    });

    return Ok(mealResponses);
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

      var mealEntity = new Meal // rename to meal record?
      {
        Id = Guid.NewGuid(),
        PatientId = recordMealRequest.PatientId,
        Recordedby = User.Identity!.Name!,
        Recordedat = recordMealRequest.RecordedAt,
      };

      if (recordMealRequest.MealSelectionType == MealSelectionItemType.CustomFood.ToString())
      {
        var foodPlan = await context.FoodPlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (foodPlan is null)
        {
          return NotFound();
        }
      }
      else if (recordMealRequest.MealSelectionType == MealSelectionItemType.Recipe.ToString())
      {
        var recipePlan = await context.RecipePlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (recipePlan is null)
        {
          return NotFound();
        }
      }
      else
      {
        return BadRequest();
      }

      await context.Meals.AddAsync(mealEntity);
      await context.SaveChangesAsync();

      await transaction.CommitAsync();

      return CreatedAtAction(nameof(GetMeal), new { id = mealEntity.Id }, mealEntity);
    }
    catch
    {
      await transaction.RollbackAsync();
      throw;
    }
  }

  private async Task<Customer?> GetCustomer()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);
    return customer;
  }
}
