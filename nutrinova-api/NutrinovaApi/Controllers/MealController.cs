using Microsoft.EntityFrameworkCore;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;
using NutrinovaData.Features.Meals;

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
  public async Task<ActionResult<MealHistory>> GetMeal(Guid id)
  {
    var mealHistory = await context.MealHistories.FindAsync(id);

    if (mealHistory is null)
    {
      return NotFound();
    }

    return Ok(mealHistory);
  }

  [HttpGet("getMealHistory")]
  public async Task<ActionResult<IEnumerable<MealHistoryResponse>>> GetMealHistory(DateTime beginDate, DateTime endDate)
  {
    Customer? customer = await GetCustomer();
    if (customer is null)
    {
      return Unauthorized();
    }

    var mealHistories = await context.MealHistories
      .Include(m => m.MealFoodHistories).ThenInclude(m => m.Food).ThenInclude(f => f.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .Include(m => m.MealRecipeHistories).ThenInclude(m => m.RecipeHistory).ThenInclude(r => r.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .Where(m => m.Patient.CustomerId == customer.Id && m.RecordedAt >= beginDate.Date && m.RecordedAt <= endDate.Date)
      .ToListAsync();

    var mealHistoryResponses = mealHistories.Select(m => new MealHistoryResponse
    {
      Id = m.Id,
      PatientId = m.PatientId,
      RecordedAt = m.RecordedAt,
      RecordedBy = m.RecordedBy,
      Notes = m.Notes,
      MealFoodHistoryResponses = m.MealFoodHistories.Select(mfh => new MealFoodHistoryResponse
      {
        Id = mfh.Id,
        MealHistoryId = mfh.MealHistoryId,
        FoodId = mfh.FoodId,
        Amount = mfh.Amount,
        FoodResponse = mfh.Food,
      }).ToList(),
      MealRecipeHistoryResponses = m.MealRecipeHistories.Select(mrh => new MealRecipeHistoryResponse
      {
        Id = mrh.Id,
        MealHistoryId = mrh.MealHistoryId,
        RecipeId = mrh.RecipeId,
        Amount = mrh.Amount,
        Recipe = mrh.Recipe.ToRecipePlan(),
      }).ToList(),
    });

    return Ok(mealHistoryResponses);
  }

  [HttpPost]
  public async Task<ActionResult> AddMeal(RecordMealRequest recordMealRequest)
  {
    using var transaction = await context.Database.BeginTransactionAsync();

    try
    {
      Customer? customer = await GetCustomer();
      if (customer is null)
      {
        return Unauthorized();
      }

      var mealHistoryEntity = new MealHistory // rename to meal record?
      {
        Id = Guid.NewGuid(),
        PatientId = recordMealRequest.PatientId,
        RecordedBy = User.Identity!.Name!,
        RecordedDate = DateOnly.FromDateTime(recordMealRequest.RecordedDate.Date),
      };

      if (recordMealRequest.MealSelectionType == MealSelectionItemType.CustomFood.ToString())
      {
        var foodPlan = await context.FoodPlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (foodPlan is null)
        {
          return NotFound();
        }

        var foodHistory = foodPlan.ToFoodHistory(customer.Id);

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
      else if (recordMealRequest.MealSelectionType == MealSelectionItemType.Recipe.ToString())
      {
        var recipePlan = await context.RecipePlans.FindAsync(recordMealRequest.SelectedMealItemId);

        if (recipePlan is null)
        {
          return NotFound();
        }

        var recipeHistory = recipePlan.ToRecipeHistory(customer.Id);

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

  private async Task<Customer?> GetCustomer()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);
    return customer;
  }
}
