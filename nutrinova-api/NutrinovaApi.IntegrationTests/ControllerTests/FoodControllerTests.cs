using System.Net;

namespace NutrinovaApi.IntegrationTests;

public class FoodControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
    private readonly HttpClient httpClient;

    public FoodControllerTests(NutrinovaApiWebApplicationFactory factory)
    {
        httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task CreateFoodPlan_ShouldReturnBadRequest_WhenModelIsNull()
    {
        var response = await httpClient.PostAsJsonAsync<CreateFoodRequestModel?>("be/food", null);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateFoodPlan_ShouldReturnBadRequest_WhenDescriptionIsMissing()
    {
        var createFoodRequestModel = new CreateFoodRequestModel
        {
            // Description is missing
        };

        var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateValidFoodPlan_ShouldReturnOk()
    {
        var createFoodRequestModel = new CreateFoodRequestModel
        {
            Description = "Test food plan",
            Note = "Test note",
            FoodNutrients = new List<CreateFoodNutrientRequestModel>
            {
                new()
                {
                    NutrientId = 1003,
                    Amount = 10,
                },
            },
        };

        var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
