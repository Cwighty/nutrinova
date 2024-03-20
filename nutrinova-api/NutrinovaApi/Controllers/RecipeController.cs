using Microsoft.IdentityModel.Tokens;
using Nutrinova.Features.Recipes;
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
  private readonly IDensityCalculator densityCalculator;

  public RecipeController(ILogger<RecipeController> logger, NutrinovaDbContext context, IRecipeFoodTotaler recipeFoodTotaler, IDensityCalculator densityCalculator)
  {
    this.logger = logger;
    this.context = context;
    this.recipeFoodTotaler = recipeFoodTotaler;
    this.densityCalculator = densityCalculator;
  }

  [HttpPost]
  public async Task<IActionResult> CreateRecipe(CreateRecipeRequestModel createRecipeRequestModel)
  {
    var validator = new RecipeValidator();
    var validationErrors = validator.Validate(createRecipeRequestModel);

    if (validationErrors.Any())
    {
      return BadRequest(validationErrors);
    }

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = context.Customers.FirstOrDefault(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    // Build the recipe plan
    var tags = FormatTags(createRecipeRequestModel.Tags);

    var recipeUnitLink = await context.Units
      .Include(u => u.Category)
      .FirstOrDefaultAsync(u => u.Id == createRecipeRequestModel.ServingSizeUnitId);

    var recipePlan = new RecipePlan
    {
      Id = Guid.NewGuid(),
      Description = createRecipeRequestModel.Description,
      CreatedBy = customer.Id,
      CreatedAt = DateTime.UtcNow,
      Tags = tags,
      Amount = createRecipeRequestModel.ServingSize,
      ServingSizeUnitNavigation = recipeUnitLink ?? throw new Exception("Invalid unit id"),
      Notes = createRecipeRequestModel.Notes,
    };

    var recipeFoods = ProcessRecipeFoodRequests(createRecipeRequestModel.RecipeFoods);

    recipePlan.RecipeFoods = recipeFoods;

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
      Amount = rf.Measurement,
      UnitId = rf.MeasurementUnitId,
      Unit = context.Units.Include(u => u.Category).FirstOrDefault(u => u.Id == rf.MeasurementUnitId) ?? throw new Exception("Invalid unit id"),
    }).ToList();

    List<FoodConversionSample> conversionSamples = GetFoodConversionSamples();

    var summaries = recipeFoodTotaler.GetRecipeNutrientSummaries(recipeFoods, conversionSamples);
    return Ok(summaries);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<RecipeResponseModel>> GetRecipe(Guid id)
  {
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == User.GetObjectIdFromClaims());

    if (customer == null)
    {
      return Unauthorized();
    }

    var recipe = await context.RecipePlans
        .Include(r => r.RecipeFoods)
            .ThenInclude(u => u.Unit)
                .ThenInclude(u => u.Category)
        .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Food)
                .ThenInclude(f => f.ServingSizeUnitNavigation)
                    .ThenInclude(u => u.Category)
        .Include(r => r.RecipeFoods)
            .ThenInclude(rf => rf.Food)
                .ThenInclude(f => f.FoodPlanNutrients)
                    .ThenInclude(fn => fn.Nutrient)
                        .ThenInclude(n => n.PreferredUnitNavigation)
                            .ThenInclude(u => u.Category)
        .Include(r => r.ServingSizeUnitNavigation)
            .ThenInclude(u => u.Category)
        .Where(r => r.CreatedBy == customer.Id)
        .FirstOrDefaultAsync(r => r.Id == id);

    if (recipe == null)
    {
      return NotFound();
    }

    var conversionSamples = GetFoodConversionSamples();

    var summaries = recipeFoodTotaler.GetRecipeNutrientSummaries(recipe.RecipeFoods.ToList(), conversionSamples);

    var recipeRes = recipe.ToRecipeResponseModel(summaries);
    return recipeRes;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<RecipeResponseModel>>> GetRecipes()
  {
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == User.GetObjectIdFromClaims());

    if (customer == null)
    {
      return Unauthorized();
    }

    var recipes = await context.RecipePlans
      .Include(r => r.RecipeFoods)
        .ThenInclude(u => u.Unit)
          .ThenInclude(u => u.Category)
      .Include(r => r.RecipeFoods)
        .ThenInclude(rf => rf.Food)
          .ThenInclude(f => f.ServingSizeUnitNavigation)
            .ThenInclude(u => u.Category)
      .Include(r => r.RecipeFoods)
        .ThenInclude(rf => rf.Food)
          .ThenInclude(f => f.FoodPlanNutrients)
            .ThenInclude(fn => fn.Nutrient)
              .ThenInclude(n => n.PreferredUnitNavigation)
                .ThenInclude(u => u.Category)
      .Include(r => r.ServingSizeUnitNavigation)
        .ThenInclude(u => u.Category)
      .Where(r => r.CreatedBy == customer.Id)
      .ToListAsync();

    foreach (var recipe in recipes)
    {
      var recipeUnit = await context.Units
        .Include(u => u.Category)
        .FirstOrDefaultAsync(u => u.Id == recipe.ServingSizeUnit);

      recipe.ServingSizeUnitNavigation = recipeUnit ?? throw new Exception("Invalid recipeUnit id");
    }

    if (recipes == null)
    {
      return NotFound();
    }

    var recipeResponseModels = new List<RecipeResponseModel>();

    var conversionSamples = GetFoodConversionSamples();

    foreach (var recipe in recipes)
    {
      var summaries = recipeFoodTotaler.GetRecipeNutrientSummaries(recipe.RecipeFoods.ToList(), conversionSamples);
      var recipeRes = recipe.ToRecipeResponseModel(summaries);
      recipeResponseModels.Add(recipeRes);
    }

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

    if (editRecipeRequest.Tags != null && editRecipeRequest.Tags.Count > 0)
    {
      recipePlan.Tags = string.Join(",", editRecipeRequest.Tags);
    }
    else
    {
      recipePlan.Tags = null;
    }

    recipePlan.Description = editRecipeRequest.Description;
    recipePlan.Notes = editRecipeRequest.Notes;
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

  private string? FormatTags(List<string>? tags)
  {
    if (!tags.IsNullOrEmpty())
    {
      return tags!.Aggregate((a, b) => $"{a},{b}");
    }

    return null;
  }

  private List<RecipeFood> ProcessRecipeFoodRequests(List<CreateRecipeFoodRequestModel> recipeFoodRequests)
  {
    var ingredients = new List<RecipeFood>();
    foreach (var ingredient in recipeFoodRequests)
    {
      var foodPlan = context.FoodPlans
        .Include(f => f.FoodPlanNutrients).ThenInclude(fn => fn.Nutrient)
        .Include(f => f.FoodPlanNutrients).ThenInclude(fn => fn.Unit).ThenInclude(u => u.Category)
        .Include(f => f.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
        .FirstOrDefault(f => f.Id == ingredient.FoodId);

      if (foodPlan == null)
      {
        throw new Exception("Invalid food id");
      }

      var measurementUnit = context.Units
        .Include(u => u.Category)
        .FirstOrDefault(u => u.Id == ingredient.MeasurementUnitId);

      var foodUnit = foodPlan.ServingSizeUnitNavigation;

      if (measurementUnit == null || measurementUnit.Category == null)
      {
        throw new Exception($"Invalid measurement unit id {ingredient.MeasurementUnitId}");
      }

      if (foodUnit == null || foodUnit.Category == null)
      {
        throw new Exception("Invalid food unit");
      }

      if (measurementUnit.Category.Description != foodUnit.Category.Description && ingredient.FoodServingsPerMeasurement == null)
      {
        throw new Exception("Food servings per measurement is required for any ingredient that has a different unit category than the food serving unit");
      }
      else if (measurementUnit.Category.Description != foodUnit.Category.Description && ingredient.FoodServingsPerMeasurement != null)
      {
        var foodSample = new FoodConversionSample
        {
          Id = Guid.NewGuid(),
          FoodPlanId = foodPlan.Id,
          FoodServingsPerMeasurement = ingredient.FoodServingsPerMeasurement ?? throw new Exception("Invalid food servings per measurement"),
          MeasurementUnitId = ingredient.MeasurementUnitId,
        };

        context.FoodConversionSamples.Add(foodSample);
      }

      var recipeFood = new RecipeFood
      {
        Id = Guid.NewGuid(),
        Food = foodPlan,
        Amount = ingredient.Measurement,
        UnitId = ingredient.MeasurementUnitId,
      };

      ingredients.Add(recipeFood);
    }

    return ingredients;
  }

  private List<FoodConversionSample> GetFoodConversionSamples()
  {
    return context.FoodConversionSamples
      .Include(fms => fms.MeasurementUnit).ThenInclude(u => u.Category)
      .Include(fms => fms.FoodPlan).ThenInclude(fp => fp.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
      .ToList();
  }
}
