using System.Web;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaApi.User.Controllers;

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
            BaseAddress = new Uri("https://api.nal.usda.gov/fdc/v1/foods/"),
        };
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<FlattenedFood>>> RetrieveAllOfName([FromQuery] string foodName, [FromQuery] string? brandOwner, [FromQuery] string filterOption = "Branded", [FromQuery] int maxReturnedResults = 25)
    {
        logger.LogInformation("RetrieveAllOfName");

        string query = "search?";

        if (brandOwner != null)
        {
            query += $"brandOwner={HttpUtility.UrlEncode(brandOwner)}&";
        }

        query += $"query={HttpUtility.UrlEncode(foodName)}&dataType={HttpUtility.UrlEncode(filterOption)}&pageSize={maxReturnedResults}&api_key={HttpUtility.UrlEncode($"{configuration["USDA_API_KEY"]}")}";
        logger.LogInformation(query);
        var res = await httpClient.GetAsync($"{query}");
        logger.LogInformation(res.StatusCode.ToString());
        logger.LogInformation(httpClient?.BaseAddress?.ToString() + query);

        var deserRes = await res.Content.ReadFromJsonAsync<FoodSearchResponseModel>(new System.Text.Json.JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });
        var rawContent = await res.Content.ReadAsStringAsync();
        logger.LogInformation("Raw Content: " + rawContent);
        logger.LogInformation("Response Content: " + deserRes?.foods);

        var simplifiedFoods = deserRes?.foods.Select(f => f.MakeFlattenedFood()).ToList();
        return simplifiedFoods ?? throw new Exception("No foods found");
    }

    [HttpGet("details")]
    public ActionResult<bool> RetrieveFoodDetailByName()
    {
        logger.LogInformation("RetrieveFoodDetailByName");

        // get the response from the usda api
        return true;
    }
}
