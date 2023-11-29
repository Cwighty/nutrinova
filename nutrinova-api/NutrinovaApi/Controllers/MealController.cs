using Microsoft.EntityFrameworkCore;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class MealController : ControllerBase
{
  private readonly ILogger<MealController> logger;
  private readonly NutrinovaDbContext context;

  public MealController(ILogger<MealController> logger, NutrinovaDbContext context)
  {
    this.logger = logger;
    this.context = context;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<MealSelectionItem>>> SearchFoodItems(string query)
  {
    var mealSelectionItems = new List<MealSelectionItem>();

    var foodItems = await context.FoodPlans
      .Include(f => f.ServingSizeUnitNavigation)
      .Where(f => f.Description.Contains(query))
      .Take(10)
      .ToListAsync();

    mealSelectionItems.AddRange(foodItems.Select(f => new MealSelectionItem
    {
      Id = f.Id,
      Description = f.Description,
      ServingSize = f.ServingSize,
      ServingSizeUnit = f.ServingSizeUnitNavigation!.Abbreviation,
      Type = "Custom Food",
    }));

    var recipeItems = await context.RecipePlans
      .Include(r => r.ServingSizeUnitNavigation)
      .Where(r => r.Description != null && r.Description.Contains(query))
      .Take(10)
      .ToListAsync();

    mealSelectionItems.AddRange(recipeItems.Select(r => new MealSelectionItem
    {
      Id = r.Id,
      Description = r.Description!,
      ServingSize = r.Amount,
      ServingSizeUnit = r.ServingSizeUnitNavigation!.Abbreviation,
      Type = "Recipe",
    }));

    return Ok(mealSelectionItems);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<MealHistory>> GetMeal(Guid id)
  {
    var mealHistory = await context.MealHistories.FindAsync(id);

    if (mealHistory is null)
    {
      return NotFound();
    }

    return Ok(mealHistory);
  }

  [HttpPost]
  public async Task<ActionResult> AddMeal(RecordMealRequest recordMealRequest)
  {
    using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
      var userObjectId = User.GetObjectIdFromClaims();

      var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

      if (customer?.Id is null)
      {
        return Unauthorized();
      }

      var mealHistoryEntity = new MealHistory // rename to meal record?
      {
        Id = Guid.NewGuid(),
        PatientId = recordMealRequest.PatientId,
        Recordedby = User.Identity!.Name!,
        Recordeddate = recordMealRequest.RecordedDate,
      };

      if (recordMealRequest.MealTypeRaw == MealType.CustomFood)
      {
        var foodPlan = await context.FoodPlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (foodPlan is null)
        {
          return NotFound();
        }

        var foodHistory = new FoodHistory
        {
          Id = Guid.NewGuid(),
          Fdcid = foodPlan.Fdcid,
          Description = foodPlan.Description,
          BrandName = foodPlan.BrandName,
          Ingredients = foodPlan.Ingredients,
          CreatedBy = customer.Id,
          CreatedAt = DateTime.UtcNow,
          ServingSize = foodPlan.ServingSize,
          ServingSizeUnit = foodPlan.ServingSizeUnit,
          Note = foodPlan.Note,
        };

        await context.FoodHistories.AddAsync(foodHistory);

        var mealFoodHistory = new MealFoodHistory
        {
          Id = Guid.NewGuid(),
          MealHistoryId = mealHistoryEntity.Id,
          FoodId = foodHistory.Id,
          Amount = recordMealRequest.Amount,
          UnitId = recordMealRequest.UnitId,
        };

        await context.MealFoodHistories.AddAsync(mealFoodHistory);

        mealHistoryEntity.MealFoodHistories.Add(mealFoodHistory);
      }
      else if (recordMealRequest.MealTypeRaw == MealType.Recipe)
      {
        var recipePlan = await context.RecipePlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (recipePlan is null)
        {
          return NotFound();
        }

        var recipeHistory = new RecipeHistory
        {
          Id = Guid.NewGuid(),
          Description = recipePlan.Description,
          CreatedBy = customer.Id,
          CreatedAt = DateTime.UtcNow,
          Amount = recipePlan.Amount,
          ServingSizeUnit = recipePlan.ServingSizeUnit,
          Notes = recipePlan.Notes,
        };

        await context.RecipeHistories.AddAsync(recipeHistory);

        var mealRecipeHistory = new MealRecipeHistory
        {
          Id = Guid.NewGuid(),
          MealHistoryId = mealHistoryEntity.Id,
          RecipeHistoryId = recipeHistory.Id,
          Amount = recordMealRequest.Amount,
          UnitId = recordMealRequest.UnitId,
        };

        await context.MealRecipeHistories.AddAsync(mealRecipeHistory);

        mealHistoryEntity.MealRecipeHistories.Add(mealRecipeHistory);
      }
      else
      {
        return BadRequest();
      }

      await context.MealHistories.AddAsync(mealHistoryEntity);
      await context.SaveChangesAsync();

      await transaction.CommitAsync();

      return CreatedAtAction(nameof(GetMeal), new { id = mealHistoryEntity.Id }, mealHistoryEntity);
    }
    catch
    {
      await transaction.RollbackAsync();
      throw;
    }
  }
}
