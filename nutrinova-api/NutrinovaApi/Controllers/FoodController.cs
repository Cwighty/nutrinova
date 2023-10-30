using System.Text.Json;
using System.Web;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaApi.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class FoodController : ControllerBase
{
    // USDA API Documentation: https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFood
    private readonly ILogger<FoodController> logger;
    private readonly IConfiguration configuration;

    private readonly HttpClient httpClient;

    public FoodController(ILogger<FoodController> logger, IConfiguration configuration)
    {
        this.logger = logger;
        this.configuration = configuration;
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
                return NotFound("No foods found");
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
}
