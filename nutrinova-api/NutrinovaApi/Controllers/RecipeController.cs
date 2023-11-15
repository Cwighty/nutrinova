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
}
