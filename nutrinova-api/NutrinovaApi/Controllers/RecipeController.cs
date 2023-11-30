using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;
using NutrinovaData.Extensions;
using NutrinovaData.Features.Recipes;
using NutrinovaData.ResponseModels;

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

    var recipeUnit = await context.Units
      .Include(u => u.Category)
      .FirstOrDefaultAsync(u => u.Id == createRecipeRequestModel.ServingSizeUnitId);

    var recipePlan = new RecipePlan
    {
      Id = Guid.NewGuid(),
      Description = createRecipeRequestModel.Description,
      CreatedBy = customer.Id,
      CreatedAt = DateTime.UtcNow,
      Tags = tags,
      ServingSizeUnitNavigation = recipeUnit ?? throw new Exception("Invalid unit id"),
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
      logger.LogInformation($"Recipe plan: {recipePlan.Id} successfully saved to the database");
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
  public async Task<ActionResult<RecipeResponseModel>> GetRecipe(Guid id)
  {
    var recipe = await context.RecipePlans
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.ServingSizeUnitNavigation)
      .ThenInclude(u => u.Category)
      .FirstOrDefaultAsync(r => r.Id == id);

    var recipeFoodNutrients = await context.RecipeFoods
      .Include(rf => rf.Food)
      .ThenInclude(f => f.ServingSizeUnitNavigation)
      .ThenInclude(u => u.Category)
      .Include(rf => rf.Food)
      .ThenInclude(f => f.FoodPlanNutrients)
      .ThenInclude(fn => fn.Nutrient)
      .ThenInclude(n => n.PreferredUnitNavigation)
      .ThenInclude(u => u.Category)
      .Where(rf => rf.RecipeId == id)
      .ToListAsync();

    foreach (var food in recipeFoodNutrients)
    {
      var foodUnit = await context.Units
        .Include(u => u.Category)
        .FirstOrDefaultAsync(u => u.Id == food.UnitId);
      food.Food.ServingSizeUnitNavigation = foodUnit ?? throw new Exception("Invalid foodUnit id");
    }

    if (recipe == null)
    {
      return NotFound();
    }

    var recipeUnit = await context.Units
      .Include(u => u.Category)
      .FirstOrDefaultAsync(u => u.Id == recipe.ServingSizeUnit);

    recipe.ServingSizeUnitNavigation = recipeUnit ?? throw new Exception("Invalid recipeUnit id");
    recipe.RecipeFoods = recipeFoodNutrients;
    var recipeRes = recipe.ToRecipeResponseModel();
    return recipeRes;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<RecipeResponseModel>>> GetRecipes()
  {
    var recipes = await context.RecipePlans
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.FoodPlanNutrients)
      .ThenInclude(fn => fn.Nutrient)
      .ThenInclude(n => n.PreferredUnitNavigation)
      .Include(r => r.RecipeFoods)
      .ThenInclude(rf => rf.Food)
      .ThenInclude(f => f.ServingSizeUnitNavigation)
      .ThenInclude(u => u.Category)
      .ToListAsync();

    var recipeResponseModels = recipes.Select(r => r.ToRecipeResponseModel()).ToList();
    return recipeResponseModels;
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

    try
    {
      var recipesFoodsToBeDeleted = recipePlan.RecipeFoods.Where(rf => !editRecipeRequest.RecipeFoods.Any(rf2 => rf2.Id == rf.Id)).ToList();

      // delete all existing recipe foods
      context.RecipeFoods.RemoveRange(recipesFoodsToBeDeleted);
      recipePlan.RecipeFoods.Clear();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to delete recipe foods: {ex.Message}");
      return StatusCode(500, "Failed to delete recipe foods");
    }

    var recipeUnit = await context.Units
      .Include(u => u.Category)
      .FirstOrDefaultAsync(u => u.Id == editRecipeRequest.UnitId);

    if (recipeUnit == null)
    {
      return NotFound("Invalid unit id");
    }

    recipePlan.Description = editRecipeRequest.Description;
    recipePlan.Notes = editRecipeRequest.Notes;
    recipePlan.Tags = editRecipeRequest.Tags?.Aggregate((a, b) => $"{a},{b}");
    recipePlan.Amount = editRecipeRequest.Amount;
    recipePlan.ServingSizeUnit = editRecipeRequest.UnitId;
    recipePlan.ServingSizeUnitNavigation = recipeUnit;

    logger.LogInformation($"Recipe plan: {editRecipeRequest.ServingsUnit.CategoryId} ");

    foreach (var rf in editRecipeRequest.RecipeFoods)
    {
      if (rf.Unit == null)
      {
        return BadRequest("Invalid unit");
      }

      var foodUnit = await context.Units
        .Include(u => u.Category)
        .FirstOrDefaultAsync(u => u.Id == rf.Unit.Id);

      var recipeFood = new RecipeFood
      {
        Id = Guid.NewGuid(),
        RecipeId = recipePlan.Id,
        FoodId = rf.Id ?? throw new Exception("Invalid food id on recipe food"),
        Amount = rf.ServingSize ?? throw new Exception("Invalid serving size on recipe food"),
        UnitId = rf?.Unit?.Id ?? throw new Exception("Invalid unit id on recipe food"),
        Unit = foodUnit ?? throw new Exception("Invalid foodUnit on recipe food"),
      };

      recipePlan.RecipeFoods.Add(recipeFood);
    }

    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save recipe to the database: {ex.InnerException?.Message ?? ex.Message}");
      return StatusCode(500, "Failed to save recipe to the database");
    }

    return Ok(recipePlan);
  }
}
