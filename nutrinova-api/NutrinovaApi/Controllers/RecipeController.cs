using Microsoft.EntityFrameworkCore;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class RecipeController : ControllerBase
{
  private readonly ILogger<RecipeController> logger;
  private readonly NutrinovaDbContext context;

  public RecipeController(ILogger<RecipeController> logger, NutrinovaDbContext context)
  {
    this.logger = logger;
    this.context = context;
  }

  [HttpPost]
  public async Task<IActionResult> CreateRecipe(CreateRecipeRequestModel createRecipeRequestModel)
  {
    // Validate the input
    if (createRecipeRequestModel == null)
    {
      return BadRequest("Invalid food plan data");
    }

    if (string.IsNullOrWhiteSpace(createRecipeRequestModel.Description))
    {
      return BadRequest("Description is required");
    }

    if (createRecipeRequestModel.RecipeFoods == null || !createRecipeRequestModel.RecipeFoods.Any())
    {
      return BadRequest("At least one food ingredient is required");
    }

    if (createRecipeRequestModel.RecipeFoods.Any(f => f.Amount <= 0))
    {
      return BadRequest("Food/Ingredient amounts must be greater than 0");
    }

    if (createRecipeRequestModel.RecipeFoods.Any(f => f.UnitId <= 0))
    {
      return BadRequest("Food/Ingredient units are required with every food amount");
    }

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = context.Customers.FirstOrDefault(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var foodPlan = new RecipePlan
    {
      Id = Guid.NewGuid(),
      Description = createRecipeRequestModel.Description,
      CreatedBy = customer.Id,
      CreatedAt = DateTime.UtcNow,
      Tags = createRecipeRequestModel.Tags?.Aggregate((a, b) => $"{a},{b}") ?? string.Empty,
      Notes = createRecipeRequestModel.Notes,
      RecipeFoods = createRecipeRequestModel.RecipeFoods.Select(rf => new RecipeFood
      {
        Id = Guid.NewGuid(),
        FoodId = rf.FoodId,
        Amount = rf.Amount,
        UnitId = rf.UnitId,
      }).ToList(),
    };

    // Save to the database
    await context.RecipePlans.AddAsync(foodPlan);
    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save recipe to the database: {ex.Message}");
      return StatusCode(500, "Failed to save recipe to the database");
    }

    return Ok(new { message = "Recipe created successfully", id = foodPlan.Id });
  }

  [HttpGet("tags")]
  public async Task<ActionResult<IEnumerable<string>>> GetRecipeTags()
  {
    var tags = new List<string>();
    var recipes = await context.RecipePlans.ToListAsync();
    foreach (var recipe in recipes)
    {
      if (!string.IsNullOrWhiteSpace(recipe.Tags))
      {
        tags.AddRange(recipe.Tags.Split(','));
      }
    }

    return Ok(tags.Distinct());
  }

  [HttpPost("summarize")]
  public ActionResult<IEnumerable<NutrientSummary>> SummarizeRecipeNutrients(IEnumerable<CreateRecipeFoodRequestModel> tentativeRecipeFoods)
  {
    if (tentativeRecipeFoods == null || !tentativeRecipeFoods.Any())
    {
      return BadRequest("At least one food ingredient is required");
    }

    var recipeFoods = tentativeRecipeFoods.Select(rf => new RecipeFood
    {
      FoodId = rf.FoodId,
      Food = context.FoodPlans
        .Include(f => f.FoodPlanNutrients)
        .ThenInclude(fn => fn.Nutrient)
        .FirstOrDefault(f => f.Id == rf.FoodId) ?? throw new Exception("Invalid food id"),
      Amount = rf.Amount,
      UnitId = rf.UnitId,
      Unit = context.Units.FirstOrDefault(u => u.Id == rf.UnitId) ?? throw new Exception("Invalid unit id"),
    }).ToList();

    Console.WriteLine($"Recipe foods: {recipeFoods.FirstOrDefault()?.Food.Description}");

    var summaries = RecipeFoodTotaler.GetNutrientSummaries(recipeFoods);
    return Ok(summaries);
  }
}
