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

    public bool StringContainsForNullableValue(string? container, string containee) => container?.Contains(containee, StringComparison.OrdinalIgnoreCase) ?? false;

    public bool NumberComparsionViaOperatorString(double? leftOperand, double rightOperand, string operatorString)
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
    public async Task<ActionResult<IEnumerable<FlattenedFood>>> RetrieveAllOfName([FromQuery] string foodName, [FromQuery] string? brandOwner, [FromQuery] string filterOption = "Branded", [FromQuery] int maxReturnedResults = 25)
    {
        try
        {
            logger.LogInformation("RetrieveAllOfName");

            string query = "foods/search?";
            if (brandOwner != null)
            {
                query += $"brandOwner={HttpUtility.UrlEncode(brandOwner)}&";
            }

            query += $"query={HttpUtility.UrlEncode(foodName)}&dataType={HttpUtility.UrlEncode(filterOption)}&pageSize={maxReturnedResults}&api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}";

            var res = await httpClient.GetAsync($"{query}");
            if (!res.IsSuccessStatusCode)
            {
                logger.LogError($"Failed to retrieve data: {res.StatusCode}");
                return StatusCode((int)res.StatusCode); // or you can return a custom error message
            }

            var deserRes = await res.Content.ReadFromJsonAsync<FoodSearchResponseModel>(new System.Text.Json.JsonSerializerOptions
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
    public async Task<ActionResult<FlattenedFood>> RetrieveFoodDetailById(int foodId, [FromQuery] string format = "full")
    {
        try
        {
            string query = $"food/{foodId}?api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}&format={format}";

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
    public async Task<ActionResult<IEnumerable<FlattenedFood>>> RetrieveAllFoodForUserById([FromQuery] string? filterOption = "", [FromQuery] double nutrientFilterValue = 0, [FromQuery] string nutrientFilterOperator = "gt", [FromQuery] string nutrientFilter = "")
    {
        try
        {
            var userObjectId = User.GetObjectIdFromClaims();

            var customer = await context.Customers.FirstAsync(c => c.Objectid == userObjectId);

            if (customer?.Id is null)
            {
                return NotFound("Couldn't find the user id");
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

            // bool FilterNutrientOptionsAndValue(FoodPlanNutrient fpn)
            // {
            //    if (nutrientFilter.IsNullOrEmpty())
            //    {
            //        return true;
            //    }
            //    return fpn.Nutrient.NutrientName.Contains(nutrientFilter, StringComparison.OrdinalIgnoreCase) &&
            //        NumberComparsionViaOperatorString(decimal.ToDouble(fpn.Amount), nutrientFilterValue, nutrientFilterOperator);
            // }
            if (!string.IsNullOrEmpty(filterOption))
            {
                // this is when you are given a filter option we will apply the nutrient filters
                // needs to apply value filter
                // if there are no nutrient filters we hot wire that to true so that it will return all of the food plans based just on the filter option
                // if there are nutrient filters we will apply the nutrient filters to the food plans
                result = await context.FoodPlans
                    .Where(fp =>
                        fp.CreatedBy == customer.Id &&
                            (
                                (
                                    fp.Description.Contains(filterOption, StringComparison.OrdinalIgnoreCase) ||
                                    StringContainsForNullableValue(fp.Note, filterOption)) &&
                                    !string.IsNullOrEmpty(nutrientFilter) ?
                                    fp.FoodPlanNutrients.Any(fpn =>
                                        StringContainsForNullableValue(fpn.Nutrient.NutrientName, nutrientFilter) &&
                                        NumberComparsionViaOperatorString(decimal.ToDouble(fpn.Amount), nutrientFilterValue, nutrientFilterOperator)) : true))
                    .ToListAsync();
            }
            else
            {
                // if there are no filter options we will just return all of the food plans
                // if there are nutrient filters we will apply the nutrient filters to the food plans
                result = await context.FoodPlans
                    .Where(fp => fp.CreatedBy == customer.Id &&
                                    !string.IsNullOrEmpty(nutrientFilter) ?
                                    fp.FoodPlanNutrients.Any(fpn =>
                                        StringContainsForNullableValue(fpn.Nutrient.NutrientName, nutrientFilter) &&
                                        NumberComparsionViaOperatorString(decimal.ToDouble(fpn.Amount), nutrientFilterValue, nutrientFilterOperator)) : true)
                    .ToListAsync();
            }

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
}
