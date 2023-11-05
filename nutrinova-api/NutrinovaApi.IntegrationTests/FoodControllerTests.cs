using System.Net;
using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;

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
    var customerID = Guid.Parse("94fa3168-d0a5-4107-a28e-52f89e6af3a1");
    var testCustomer = new Customer
    {
      Id = customerID,
      Email = "filterNameAndNotes@gmail.com",
    };

    var testFoodPlan = new CreateFoodRequestModel
    {
      Description = "Test food plan",
      Note = "Test note",
    };

    // Act
    var res = await httpClient.PostAsJsonAsync<Customer>("be/Customer/create", testCustomer);
    var resFoodCreation = await httpClient.PostAsJsonAsync<CreateFoodRequestModel>("be/food", testFoodPlan);
    var resFoodPlanFilter = await httpClient.GetAsync("be/food/all-foods?filteroption=Test");

    // Assert
    Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodCreation.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilter.StatusCode);
    Assert.Equal(1, (await resFoodPlanFilter.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);
  }

  private static void CreateTestCustomer(NutrinovaDbContext context)
  {
    var testCustomer = new Customer
    {
      Id = Guid.Parse("94fa3168-d0a5-4107-a28e-52f89e6af3a1"),
      Email = "test@email.com",
    };

    context.Customers.Add(testCustomer);
    context.SaveChanges();
  }
}
