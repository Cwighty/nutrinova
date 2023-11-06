using System.Net;
using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

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
    };

    var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CreateFoodPlan_ShouldAttatchUserId_WhenUserIsAuthenticated()
  {
    var createFoodRequestModel = new CreateFoodRequestModel
    {
      Description = "Test food plan",
    };

    var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var foodPlan = await response.Content.ReadFromJsonAsync<FoodPlan>();
    Assert.NotNull(foodPlan);
    Assert.NotEqual(Guid.Empty, foodPlan.CreatedBy);
  }

  [Fact]
  public async Task CheckFilteringByFoodNameAndNotes()
  {
    // Arrange
    var customerID = Guid.Empty.ToString();
    var testFoodPlan = new CreateFoodRequestModel
    {
      Description = "Test food plan",
      Note = "Test note",
    };

    var testFoodPlan2 = new CreateFoodRequestModel
    {
      Description = "food plan",
      Note = "note",
    };

    // Act
    var res = await httpClient.GetAsync($"be/Customer/exists?id={customerID}");
    var resFoodCreation = await httpClient.PostAsJsonAsync<CreateFoodRequestModel>("be/food", testFoodPlan);
    var resFoodCreation2 = await httpClient.PostAsJsonAsync<CreateFoodRequestModel>("be/food", testFoodPlan2);
    var resFoodPlanFilter = await httpClient.GetAsync("be/food/all-foods?filteroption=Test");

    // Assert
    Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodCreation.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilter.StatusCode);
    Assert.Equal(1, (await resFoodPlanFilter.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);
  }
}
