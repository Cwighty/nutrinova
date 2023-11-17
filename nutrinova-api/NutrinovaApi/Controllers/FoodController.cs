using System.Text.Json;
using System.Web;
using Microsoft.EntityFrameworkCore;
using NutrinovaApi.Extensions;
using NutrinovaData;
using NutrinovaData.Entities;
using NutrinovaData.Extensions;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class FoodController : ControllerBase
{
  // USDA API Documentation: https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFood
  private readonly ILogger<FoodController> logger;
  private readonly IConfiguration configuration;
  private readonly NutrinovaDbContext context;
  private readonly HttpClient httpClient;

  public FoodController(ILogger<FoodController> logger, IConfiguration configuration, NutrinovaDbContext context)
  {
    this.logger = logger;
    this.configuration = configuration;
    this.context = context;

    this.httpClient = new HttpClient()
    {
      BaseAddress = new Uri("https://api.nal.usda.gov/fdc/v1/"),
    };
  }

  [HttpGet("search")]
  public async Task<ActionResult<IEnumerable<FlattenedFood>>> RetrieveAllOfName(
    [FromQuery] string foodName,
    [FromQuery] string? brandOwner,
    [FromQuery] string filterOption = "Branded",
    [FromQuery] int maxReturnedResults = 25)
  {
    try
    {
      logger.LogInformation("RetrieveAllOfName");

      string query = "foods/search?";
      if (brandOwner != null)
      {
        query += $"brandOwner={HttpUtility.UrlEncode(brandOwner)}&";
      }

      query +=
        $"query={HttpUtility.UrlEncode(foodName)}&dataType={HttpUtility.UrlEncode(filterOption)}&pageSize={maxReturnedResults}&api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}";

      var res = await httpClient.GetAsync($"{query}");
      if (!res.IsSuccessStatusCode)
      {
        logger.LogError($"Failed to retrieve data: {res.StatusCode}");
        return StatusCode((int)res.StatusCode); // or you can return a custom error message
      }

      var deserRes = await res.Content.ReadFromJsonAsync<FoodSearchResponseModel>(
        new System.Text.Json.JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true,
        });

      if (deserRes?.foods == null || !deserRes.foods.Any())
      {
        return new List<FlattenedFood>();
      }

      var simplifiedFoods = deserRes.foods.Select(f => f.MakeFlattenedFood(onlyPrimaryNutrients: true)).ToList();
      return simplifiedFoods;
    }
    catch (HttpRequestException ex)
    {
      logger.LogError($"HTTP request failed: {ex.Message}");
      return StatusCode(503, "Service unavailable");
    }
    catch (JsonException ex)
    {
      logger.LogError($"JSON deserialization failed: {ex.Message}");
      return BadRequest("Invalid response format");
    }
    catch (Exception ex)
    {
      logger.LogError($"An unexpected error occurred: {ex.Message}");
      return StatusCode(500, "Internal server error");
    }
  }

  [HttpGet("details/{foodId}")]
  public async Task<ActionResult<FlattenedFood>> RetrieveFoodDetailUSDAById(int foodId, [FromQuery] string format = "full")
  {
    try
    {
      string query =
        $"food/{foodId}?api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}&format={format}";

      var res = await httpClient.GetAsync($"{query}");
      if (!res.IsSuccessStatusCode)
      {
        logger.LogError($"Failed to retrieve data: {res.StatusCode}");
        return StatusCode((int)res.StatusCode); // or you can return a custom error message
      }

      var deserRes = await res.Content.ReadFromJsonAsync<Food>(new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true,
      });

      logger.LogInformation($"RetrieveFoodDetailById, {deserRes?.ingredients}");
      if (deserRes?.description == null)
      {
        return NotFound("No foods found");
      }

      return deserRes.MakeFlattenedFood();
    }
    catch (HttpRequestException ex)
    {
      logger.LogError($"HTTP request failed: {ex.Message}");
      return StatusCode(503, "Service unavailable");
    }
    catch (JsonException ex)
    {
      logger.LogError($"JSON deserialization failed: {ex.Message}");
      return BadRequest("Invalid response format");
    }
    catch (Exception ex)
    {
      logger.LogError($"An unexpected error occurred: {ex.Message}");
      return StatusCode(500, "Internal server error");
    }
  }

  [HttpGet("all-foods")]
  public async Task<ActionResult<IEnumerable<FlattenedFood>>> RetrieveAllFoodForUserById(
      [FromQuery] string? filterOption = null,
      [FromQuery] double nutrientFilterValue = 0,
      [FromQuery] string nutrientFilterOperator = "gt",
      [FromQuery] string? nutrientFilter = null)
  {
    try
    {
      var userObjectId = User.GetObjectIdFromClaims();

      var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

      if (customer?.Id is null)
      {
        return Unauthorized();
      }

      if (nutrientFilterValue < 0)
      {
        return BadRequest("Nutrient value must be greater than 0");
      }

      if (string.IsNullOrEmpty(nutrientFilter) && nutrientFilterValue != 0)
      {
        return BadRequest("Nutrient filter is required when non-zero nutrient value is provided");
      }

      List<FoodPlan> result;

      if (!string.IsNullOrEmpty(filterOption))
      {
        result = await context.FoodPlans
          .Include(fp => fp.FoodPlanNutrients) // Include the related nutrients
          .ThenInclude(fpn => fpn.Nutrient)
          .Where(fp =>
            fp.CreatedBy == customer.Id && (
          EF.Functions.ILike(fp.Description, $"%{filterOption}%") ||
          (fp.Note != null && EF.Functions.ILike(fp.Note, $"%{filterOption}%"))))
          .ToListAsync();
      }
      else
      {
        result = await context.FoodPlans
          .Include(fp => fp.FoodPlanNutrients) // Include the related nutrients
          .ThenInclude(fpn => fpn.Nutrient)
          .Where(fp => fp.CreatedBy == customer.Id)
          .ToListAsync();
      }

      result = result
        .Where(fp => string.IsNullOrEmpty(nutrientFilter) ||
                     fp.FoodPlanNutrients.Any(fpn =>
                       fpn.Nutrient.Description != null &&
                       fpn.Nutrient.Description.Contains(nutrientFilter, StringComparison.OrdinalIgnoreCase) &&
                       NumberComparisonViaOperatorString(
                         decimal.ToDouble(fpn.Amount),
                         nutrientFilterValue,
                         nutrientFilterOperator)))
        .ToList();

      return result.Select(fp => fp.ToFlattenedFood()).ToList();
    }
    catch (HttpRequestException ex)
    {
      logger.LogError($"HTTP request failed: {ex.Message}");
      return StatusCode(503, "Service unavailable");
    }
    catch (JsonException ex)
    {
      logger.LogError($"JSON deserialization failed: {ex.Message}");
      return BadRequest("Invalid response format");
    }
    catch (Exception ex)
    {
      logger.LogError($"An unexpected error occurred: {ex.Message}");
      return StatusCode(500, "Internal server error");
    }

    bool NumberComparisonViaOperatorString(double? leftOperand, double rightOperand, string operatorString)
    {
      if (leftOperand == null)
      {
        return false;
      }

      switch (operatorString)
      {
        case "gt":
          return leftOperand > rightOperand;
        case "gte":
          return leftOperand >= rightOperand;
        case "lt":
          return leftOperand < rightOperand;
        case "lte":
          return leftOperand <= rightOperand;
        case "eq":
          return leftOperand == rightOperand;
        default:
          throw new InvalidOperationException("operatingString was not given a valid option");
      }
    }
  }

  [HttpGet("food-details/{foodId}")]
  public async Task<ActionResult<Food>> RetrieveFoodForUserById(
    string? foodId = null)
  {
    try
    {
      var userObjectId = User.GetObjectIdFromClaims();

      var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

      if (customer?.Id is null)
      {
        return Unauthorized();
      }

      var result = await context.FoodPlans
        .Include(fp => fp.ServingSizeUnitNavigation)
        .Include(fp => fp.FoodPlanNutrients) // Include the related nutrients
        .ThenInclude(fpn => fpn.Nutrient)
        .FirstOrDefaultAsync(fp => fp.CreatedBy == customer.Id && fp.Id.ToString() == foodId);
      logger.LogInformation($"RetrieveFoodForUserById, {result?.Ingredients}");
      if (result == null)
      {
        return NotFound("No food found");
      }

      return result.ToFood();
    }
    catch (HttpRequestException ex)
    {
      logger.LogError($"HTTP request failed: {ex.Message}");
      return StatusCode(503, "Service unavailable");
    }
    catch (JsonException ex)
    {
      logger.LogError($"JSON deserialization failed: {ex.Message}");
      return BadRequest("Invalid response format");
    }
    catch (Exception ex)
    {
      logger.LogError($"An unexpected error occurred: {ex.Message}");
      return StatusCode(500, "Internal server error");
    }
  }

  [HttpPost]
  public async Task<IActionResult> CreateFoodPlan(CreateFoodRequestModel createFoodRequestModel)
  {
    // Validate the input
    if (createFoodRequestModel == null)
    {
      return BadRequest("Invalid food plan data");
    }

    if (string.IsNullOrWhiteSpace(createFoodRequestModel.Description))
    {
      return BadRequest("Description is required");
    }

    if (createFoodRequestModel.ServingSize <= 0)
    {
      return BadRequest("Serving size must be greater than 0");
    }

    if (createFoodRequestModel.FoodNutrients == null || !createFoodRequestModel.FoodNutrients.Any())
    {
      return BadRequest("At least one nutrient is required");
    }

    if (createFoodRequestModel.FoodNutrients.Any(n => n.Amount <= 0))
    {
      return BadRequest("Nutrient amounts must be greater than 0");
    }

    var userObjectId = User.GetObjectIdFromClaims();
    Console.WriteLine($"User id: {userObjectId}");

    var customer = context.Customers.FirstOrDefault(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var foodPlan = new FoodPlan
    {
      Id = Guid.NewGuid(),
      Description = createFoodRequestModel.Description,
      CreatedBy = customer.Id,
      CreatedAt = DateTime.UtcNow,
      ServingSize = createFoodRequestModel.ServingSize,
      ServingSizeUnit = createFoodRequestModel.Unit ?? 0,
      Note = createFoodRequestModel.Note,
      FoodPlanNutrients = createFoodRequestModel.FoodNutrients.Select(n => new FoodPlanNutrient
      {
        Id = Guid.NewGuid(),
        NutrientId = n.NutrientId,
        Amount = n.Amount,
        UnitId = n.UnitId,
      }).ToList(),
    };

    // Save to the database
    await context.FoodPlans.AddAsync(foodPlan);
    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save to the database: {ex.Message}");
      return StatusCode(500, "Failed to save to the database");
    }

    return Ok(new { message = "Food created successfully", id = foodPlan.Id });
  }

  [HttpPost("import/{fdcid}")]
  public async Task<ActionResult<Guid>> ImportFood(long fdcid)
  {
    var format = "full";
    try
    {
      string query = $"food/{fdcid}?api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}&format={format}";

      var result = await httpClient.GetAsync($"{query}");
      if (!result.IsSuccessStatusCode)
      {
        logger.LogError($"Failed to retrieve data: {result.StatusCode}");
        return StatusCode((int)result.StatusCode);
      }

      var deserializedResult = await result.Content.ReadFromJsonAsync<Food>(new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true,
      });

      logger.LogInformation($"RetrieveFoodDetailById, {deserializedResult?.ingredients}");
      if (deserializedResult?.description == null)
      {
        return NotFound("No foods found");
      }

      var userObjectId = User.GetObjectIdFromClaims();

      var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

      var foodPlan = new FoodPlan
      {
        Id = Guid.NewGuid(),
        Description = deserializedResult.description,
        Ingredients = deserializedResult.ingredients,
        CreatedBy = customer.Id,
        CreatedAt = DateTime.UtcNow,
        ServingSize = (decimal?)deserializedResult.servingSize,
        ServingSizeUnit = deserializedResult.servingSizeUnit != null ? GetUnitId(deserializedResult.servingSizeUnit) ?? 0 : 0,
        Note = deserializedResult.ingredients,
      };

      var foodPlanNutrients = new List<FoodPlanNutrient>();
      foreach (var nutrient in deserializedResult.foodNutrients)
      {
        var unitId = nutrient.unitName != null ? GetUnitId(nutrient.unitName) : null;
        if (unitId == null)
        {
          // only take nutrients with units that we are tracking
          continue;
        }

        foodPlanNutrients.Add(new FoodPlanNutrient
        {
          Id = Guid.NewGuid(),
          NutrientId = nutrient.nutrientId,
          Amount = (decimal)nutrient.value,
          UnitId = unitId.Value,
        });
      }

      foodPlan.FoodPlanNutrients = foodPlanNutrients;

      // Save to the database
      await context.FoodPlans.AddAsync(foodPlan);
      try
      {
        await context.SaveChangesAsync();
      }
      catch (Exception ex)
      {
        logger.LogError($"Failed to import food to the database: {ex.Message}");
        return StatusCode(500, "Failed to import food to the database");
      }

      return Ok(new { message = "Food imported successfully", id = foodPlan.Id });
    }
    catch (HttpRequestException ex)
    {
      logger.LogError($"HTTP request failed: {ex.Message}");
      return StatusCode(503, "Service unavailable");
    }
    catch (JsonException ex)
    {
      logger.LogError($"JSON deserialization failed: {ex.Message}");
      return BadRequest("Invalid response format");
    }
    catch (Exception ex)
    {
      logger.LogError($"An unexpected error occurred: {ex.Message}");
      return StatusCode(500, "Internal server error");
    }
  }

  [HttpPut]
  public async Task<IActionResult> EditFoodPlan(EditFoodRequestModel editFoodRequestModel)
  {
    // Validate the input
    if (editFoodRequestModel == null)
    {
      return BadRequest("Invalid food plan data for editing");
    }

    if (string.IsNullOrWhiteSpace(editFoodRequestModel.Description))
    {
      return BadRequest("Description is required");
    }

    if (editFoodRequestModel.ServingSize <= 0)
    {
      return BadRequest("Serving size must be greater than 0");
    }

    if (editFoodRequestModel.FoodNutrients == null || !editFoodRequestModel.FoodNutrients.Any())
    {
      return BadRequest("At least one nutrient is required");
    }

    if (editFoodRequestModel.FoodNutrients.Any(n => n.Amount <= 0))
    {
      return BadRequest("Nutrient amounts must be greater than 0");
    }

    var userObjectId = User.GetObjectIdFromClaims();

    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var foodPlan = await context.FoodPlans
      .Include(fp => fp.FoodPlanNutrients)
      .ThenInclude(fpn => fpn.Nutrient)
      .FirstOrDefaultAsync(fp => fp.Id.ToString() == editFoodRequestModel.Id);

    if (foodPlan == null)
    {
      return NotFound("No food found");
    }

    if (editFoodRequestModel.Id == null)
    {
      return BadRequest("Edit food Id is required");
    }

    var foodPlanNutrients = await context.FoodPlanNutrients.Where(fpn => fpn.FoodplanId == foodPlan.Id).ToListAsync();
    try
    {
      context.RemoveRange(foodPlanNutrients);
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed remove association in FoodPlanNutrients: {ex.Message}");
    }

    // update food plan
    foodPlan.Description = editFoodRequestModel.Description;
    foodPlan.ServingSize = editFoodRequestModel.ServingSize;
    foodPlan.Id = Guid.Parse(editFoodRequestModel.Id);
    foodPlan.ServingSizeUnit = editFoodRequestModel.Unit;
    foodPlan.Note = editFoodRequestModel.Note;
    foodPlan.BrandName = editFoodRequestModel.BrandName;
    foodPlan.Ingredients = editFoodRequestModel.Ingredients;
    foodPlan.FoodPlanNutrients = editFoodRequestModel.FoodNutrients.Select(n => new FoodPlanNutrient
    {
      Id = Guid.NewGuid(),
      NutrientId = n.NutrientId,
      Amount = n.Amount,
      UnitId = n.UnitId,
    }).ToList();

    // Save to the database
    try
    {
      await context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
      logger.LogError($"Failed to save to the database: {ex.Message}");
      return StatusCode(500, "Failed to save to the database");
    }

    return Ok(new { message = "Food created successfully", id = foodPlan.Id });
  }

  private int? GetUnitId(string unitAbbreviation)
  {
    var unit = context.Units.FirstOrDefault(u => EF.Functions.ILike(u.Abbreviation, unitAbbreviation) || EF.Functions.ILike(u.Description, unitAbbreviation));
    if (unit == null)
    {
      logger.LogError($"Failed to find unit with abbreviation {unitAbbreviation}, skipping");
      return null;
    }

    return unit.Id;
  }
}
