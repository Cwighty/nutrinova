using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;
using NutrinovaData.Features.Recipes;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class RecipeController : ControllerBase
{
  private readonly ILogger<RecipeController> logger;
  private readonly NutrinovaDbContext context;
  private readonly IRecipeFoodTotaler recipeFoodTotaler;

  public RecipeController(ILogger<RecipeController> logger, NutrinovaDbContext context, IRecipeFoodTotaler recipeFoodTotaler)
  {
    this.logger = logger;
    this.context = context;
    this.recipeFoodTotaler = recipeFoodTotaler;
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

    var tags = string.Empty;

    if (!createRecipeRequestModel.Tags.IsNullOrEmpty())
    {
      tags = createRecipeRequestModel.Tags?.Aggregate((a, b) => $"{a},{b}");
    }

    var recipePlan = new RecipePlan
    {
      Id = Guid.NewGuid(),
      Description = createRecipeRequestModel.Description,
      CreatedBy = customer.Id,
      CreatedAt = DateTime.UtcNow,
      Tags = tags,
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
    await context.RecipePlans.AddAsync(recipePlan);
    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save recipe to the database: {ex.Message}");
      return StatusCode(500, "Failed to save recipe to the database");
    }

    return Ok(new { message = "Recipe created successfully", id = recipePlan.Id });
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
        .Include(f => f.FoodPlanNutrients).ThenInclude(fn => fn.Nutrient)
        .Include(f => f.FoodPlanNutrients).ThenInclude(fn => fn.Unit).ThenInclude(u => u.Category)
        .Include(f => f.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
        .FirstOrDefault(f => f.Id == rf.FoodId) ?? throw new Exception("Invalid food id"),
      Amount = rf.Amount,
      UnitId = rf.UnitId,
      Unit = context.Units.Include(u => u.Category).FirstOrDefault(u => u.Id == rf.UnitId) ?? throw new Exception("Invalid unit id"),
    }).ToList();

    var summaries = recipeFoodTotaler.GetNutrientSummaries(recipeFoods);
    return Ok(summaries);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<RecipePlan>> GetRecipe(Guid id)
  {
    var recipe = await context.RecipePlans
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.FoodPlanNutrients)
      .ThenInclude(fn => fn.Nutrient)
      .FirstOrDefaultAsync(r => r.Id == id);

    if (recipe == null)
    {
      return NotFound();
    }

    return Ok(recipe);
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<RecipePlan>>> GetRecipes()
  {
    var recipes = await context.RecipePlans
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.FoodPlanNutrients)
      .ThenInclude(fn => fn.Nutrient)
      .ToListAsync();

    return Ok(recipes);
  }

  [HttpPut]
  public async Task<ActionResult> EditRecipes(EditRecipeRequestModel editRecipeRequest)
  {
    if (editRecipeRequest == null)
    {
      return BadRequest("Invalid recipe data");
    }

    if (string.IsNullOrWhiteSpace(editRecipeRequest.Description))
    {
      return BadRequest("Description is required");
    }

    if (editRecipeRequest.RecipeFoods == null || !editRecipeRequest.RecipeFoods.Any())
    {
      return BadRequest("At least one food is required");
    }

    if (editRecipeRequest.RecipeFoods.Any(f => f.ServingSize <= 0))
    {
      return BadRequest("Food/Ingredient amounts must be greater than 0");
    }

    var userObjectId = User.GetObjectIdFromClaims();

    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var recipePlan = await context.RecipePlans
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.FoodPlanNutrients)
      .ThenInclude(fn => fn.Nutrient)
      .Include(r => r.ServingSizeUnitNavigation)
      .FirstOrDefaultAsync(r => r.Id == editRecipeRequest.Id);

    if (recipePlan == null)
    {
      return NotFound("Recipe not found");
    }

    recipePlan.Description = editRecipeRequest.Description;
    recipePlan.Notes = editRecipeRequest.Note;
    recipePlan.Tags = editRecipeRequest.Tags?.Aggregate((a, b) => $"{a},{b}");
    recipePlan.Amount = editRecipeRequest.Amount;
    recipePlan.ServingSizeUnit = editRecipeRequest.UnitId;
    recipePlan.ServingSizeUnitNavigation = new Unit
    {
      Id = editRecipeRequest.UnitId,
      CategoryId = editRecipeRequest.ServingsUnit.CategoryId,
      Description = editRecipeRequest.ServingsUnit.Description,
      Abbreviation = editRecipeRequest.ServingsUnit.Abbreviation,
      Category = await context.UnitCategories.FirstOrDefaultAsync(uc => uc.Id == editRecipeRequest.ServingsUnit.CategoryId),
    };

    try
    {
      // delete all existing recipe foods
      context.RecipeFoods.RemoveRange(recipePlan.RecipeFoods);
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to delete recipe foods: {ex.Message}");
      return StatusCode(500, "Failed to delete recipe foods");
    }

    recipePlan.RecipeFoods = editRecipeRequest.RecipeFoods.Select(rf => new RecipeFood
    {
      Id = rf.Id ?? Guid.NewGuid(),
      FoodId = rf.Id ?? throw new Exception("Invalid food id on recipe food"),
      Amount = rf.ServingSize ?? throw new Exception("Invalid serving size on recipe food"),
      UnitId = rf.Unit.Id,
    }).ToList();

    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save recipe to the database: {ex.Message}");
      return StatusCode(500, "Failed to save recipe to the database");
    }

    return Ok(recipePlan);
  }
}
