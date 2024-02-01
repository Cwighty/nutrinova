using System.Text.Json;
using System.Web;
using NutrinovaData.Features.Foods;
using NutrinovaData.Features.Nutrients;
using NutrinovaData.FlattenedResponseModels;

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
  private readonly IFoodNutrientMapper foodNutrientMapper;

  private readonly INutrientMatcher nutrientMatcher;

  private readonly HttpClient httpClient;

  public FoodController(ILogger<FoodController> logger, IConfiguration configuration, NutrinovaDbContext context, IFoodNutrientMapper foodNutrientMapper, INutrientMatcher nutrientMatcher)
  {
    this.logger = logger;
    this.configuration = configuration;
    this.context = context;
    this.foodNutrientMapper = foodNutrientMapper;
    this.nutrientMatcher = nutrientMatcher;
    this.nutrientMatcher.SetExistingNutrients(context.Nutrients.Select(n => new NutrientOption
    {
      Id = n.Id,
      Description = n.Description,
      PreferredUnitId = n.PreferredUnit,
    }).ToList());
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

      var simplifiedFoods = deserRes.foods.Select(f => f.MakeFlattenedFood()).ToList();
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

      foreach (var nutrient in TrackedNutrients.IDs)
      {
        query += $"&nutrient={nutrient}";
      }

      var res = await httpClient.GetAsync($"{query}");
      if (!res.IsSuccessStatusCode)
      {
        logger.LogError($"Failed to retrieve data: {res.StatusCode}");
        return StatusCode((int)res.StatusCode); // or you can return a custom error message
      }

      var deserRes = await res.Content.ReadFromJsonAsync<FoodResponse>(new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true,
      });

      logger.LogInformation($"RetrieveFoodDetailById, {deserRes?.Ingredients}");
      if (deserRes?.Description == null)
      {
        return NotFound("No foods found");
      }

      var foodPlanNutrients = foodNutrientMapper.MapNutrients(deserRes.FoodNutrients);
      deserRes.FoodNutrients = foodPlanNutrients.ToFoodNutrients().ToList();

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
          .ThenInclude(n => n.PreferredUnitNavigation)
          .Include(fp => fp.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
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
          .ThenInclude(n => n.PreferredUnitNavigation)
          .Include(fp => fp.ServingSizeUnitNavigation).ThenInclude(u => u.Category)
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
  public async Task<ActionResult<FoodResponse>> RetrieveFoodForUserById(
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
          .ThenInclude(u => u.Category)
        .Include(fp => fp.FoodPlanNutrients) // Include the related nutrients
          .ThenInclude(fpn => fpn.Nutrient)
            .ThenInclude(n => n.PreferredUnitNavigation)
              .ThenInclude(u => u.Category)
        .FirstOrDefaultAsync(fp => fp.CreatedBy == customer.Id && fp.Id.ToString() == foodId);
      if (result == null)
      {
        return NotFound("No food found");
      }

      var res = result.ToFood();
      return res;
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

    if (!createFoodRequestModel.ServingSize.HasValue || createFoodRequestModel.ServingSize <= 0)
    {
      return BadRequest("Serving size must be greater than 0");
    }

    if (createFoodRequestModel.Unit == null)
    {
      return BadRequest("Serving size unit is required");
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
      ServingSize = createFoodRequestModel.ServingSize.Value,
      ServingSizeUnit = createFoodRequestModel.Unit ?? 0,
      Note = createFoodRequestModel.Note,
      FoodPlanNutrients = createFoodRequestModel.FoodNutrients.Select(n =>
      {
        var nutrient = context.Nutrients.FirstOrDefault(nu => nu.Id == n.NutrientId);
        if (nutrient == null)
        {
          throw new InvalidOperationException("Nutrient does not exist");
        }

        return new FoodPlanNutrient
        {
          Id = Guid.NewGuid(),
          NutrientId = n.NutrientId,
          Amount = n.Amount,
          UnitId = nutrient.PreferredUnit,
        };
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
    logger.LogInformation($"Importing Food, {fdcid}");
    try
    {
      string query = $"food/{fdcid}?api_key={HttpUtility.UrlEncode(configuration["USDA_API_KEY"])}";

      foreach (var nutrient in TrackedNutrients.IDs)
      {
        query += $"&nutrient={nutrient}";
      }

      FoodResponse? deserializedResult = null;
      int maxRetries = 3; // Maximum number of retries
      int delayBetweenRetries = 1000; // Delay between retries in milliseconds

      for (int attempt = 0; attempt < maxRetries; attempt++)
      {
        try
        {
          var result = await httpClient.GetAsync(query);

          if (!result.IsSuccessStatusCode)
          {
            logger.LogError($"Attempt {attempt + 1}: Failed to retrieve data: {result.StatusCode}");

            if (attempt < maxRetries - 1)
            {
              await Task.Delay(delayBetweenRetries); // Wait before retrying
              continue;
            }
            else
            {
              return StatusCode((int)result.StatusCode); // All retries failed, return error status
            }
          }

          deserializedResult = await result.Content.ReadFromJsonAsync<FoodResponse>(new JsonSerializerOptions
          {
            PropertyNameCaseInsensitive = true,
          });

          // If successful, break out of the retry loop
          break;
        }
        catch (HttpRequestException ex)
        {
          logger.LogError($"Attempt {attempt + 1}: HTTP request failed: {ex.Message}");

          if (attempt < maxRetries - 1)
          {
            await Task.Delay(delayBetweenRetries); // Wait before retrying
            continue;
          }
          else
          {
            return StatusCode(503, "Service unavailable"); // All retries failed, return service unavailable
          }
        }
        catch (JsonException ex)
        {
          logger.LogError($"JSON deserialization failed: {ex.Message}");
          return BadRequest("Invalid response format"); // JSON error, no retry
        }
      }

      // Check if deserializedResult is null after retries
      if (deserializedResult == null)
      {
        return StatusCode(503, "Service unavailable after retries");
      }

      logger.LogInformation($"RetrieveFoodDetailById, {deserializedResult?.Ingredients}");
      if (deserializedResult?.Description == null)
      {
        return NotFound("No foods found");
      }

      var userObjectId = User.GetObjectIdFromClaims();

      var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

      var foodPlan = new FoodPlan
      {
        Id = Guid.NewGuid(),
        Description = deserializedResult.Description,
        Ingredients = deserializedResult.Ingredients,
        CreatedBy = customer.Id,
        CreatedAt = DateTime.UtcNow,
        ServingSize = deserializedResult.ServingSize == 0 ? 100 : deserializedResult.ServingSize,
        ServingSizeUnit = GetUnit(deserializedResult.ServingSizeUnit)?.Id ?? 1, // default to 100 grams
        Note = deserializedResult.Ingredients,
      };

      var foodPlanNutrients = foodNutrientMapper.MapNutrients(deserializedResult.FoodNutrients);
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

      logger.LogInformation($"Finished Importing Food, {fdcid}");
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
  }

  [HttpPut]
  public async Task<IActionResult> EditFoodPlan(EditFoodRequestModel editFoodRequestModel)
  {
    // Validate the input
    logger.LogInformation($"EditFoodPlan, {editFoodRequestModel?.Id} {editFoodRequestModel?.Description} {editFoodRequestModel?.ServingSize} {editFoodRequestModel?.Unit} {editFoodRequestModel?.Note}  {editFoodRequestModel?.BrandName} {editFoodRequestModel?.Ingredients}   {editFoodRequestModel?.FoodNutrients} {editFoodRequestModel?.FoodNutrients?.Count} {editFoodRequestModel?.FoodNutrients?[0]?.NutrientId} {editFoodRequestModel?.Unit} {editFoodRequestModel?.FoodNutrients?[0]?.Amount} {editFoodRequestModel?.FoodNutrients?[0]?.UnitId}");
    if (editFoodRequestModel == null)
    {
      return BadRequest("Invalid food plan data for editing");
    }

    if (string.IsNullOrWhiteSpace(editFoodRequestModel.Description))
    {
      return BadRequest("Description is required");
    }

    if (!editFoodRequestModel.ServingSize.HasValue || editFoodRequestModel.ServingSize <= 0)
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
      .FirstOrDefaultAsync(fp => fp.Id == editFoodRequestModel.Id);

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

    if (editFoodRequestModel.Unit == null)
    {
      return BadRequest("Serving size unit is required");
    }

    var foodPlanUnit = await context.Units.FirstOrDefaultAsync(u => u.Id == editFoodRequestModel.Unit.Id);

    if (foodPlanUnit == null)
    {
      return BadRequest("Unit does not exist");
    }

    // update food plan
    foodPlan.Description = editFoodRequestModel.Description;
    foodPlan.ServingSize = editFoodRequestModel.ServingSize.Value;
    foodPlan.ServingSizeUnit = editFoodRequestModel?.Unit?.Id ?? throw new InvalidOperationException("Unit is required");
    foodPlan.ServingSizeUnitNavigation = foodPlanUnit;
    foodPlan.Note = editFoodRequestModel.Note;
    foodPlan.BrandName = editFoodRequestModel.BrandName;
    foodPlan.Ingredients = editFoodRequestModel.Ingredients;

    var allNutrients = await context.Nutrients.Include(n => n.PreferredUnitNavigation).ToListAsync();

    foodPlan.FoodPlanNutrients = allNutrients.Join(
      editFoodRequestModel.FoodNutrients,
      allN => allN.Id,
      fpn => fpn.NutrientId,
      (nutrient, editNutrient) => new FoodPlanNutrient
      {
        Id = Guid.NewGuid(),
        NutrientId = editNutrient.NutrientId,
        Amount = editNutrient.Amount,
        UnitId = nutrient.PreferredUnitNavigation.Id,
      })
    .ToList();

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

  private UnitOption? GetUnit(string unitAbbreviation)
  {
    var unit = context.Units.FirstOrDefault(u => EF.Functions.ILike(u.Abbreviation, unitAbbreviation) || EF.Functions.ILike(u.Description, unitAbbreviation));
    if (unit == null)
    {
      logger.LogError($"Failed to find unit with abbreviation {unitAbbreviation}, skipping");
      return null;
    }

    return new UnitOption
    {
      Id = unit.Id,
      Abbreviation = unit.Abbreviation,
      Description = unit.Description,
    };
  }
}
