using System.Net;
using NutrinovaApi.IntegrationTests.TestEntities;

namespace NutrinovaApi.IntegrationTests;

public class RecipeControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  private readonly HttpClient httpClient;

  public RecipeControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    httpClient = factory.CreateClient();
  }

  [Fact]
  public async Task CreateRecipe_ShouldReturnBadRequest_WhenDescriptionIsMissing()
  {
    var createRecipeRequest = new CreateRecipeRequestModel
    {
      // Description is missing
    };

    var response = await httpClient.PostAsJsonAsync("be/recipe", createRecipeRequest);
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task CreateRecipe_ShouldReturnBadRequest_WhenNoIngredients()
  {
    var createRecipeRequest = new CreateRecipeRequestModel
    {
      Description = "Test recipe plan",
      Notes = "Test note",
      RecipeFoods = new List<CreateRecipeFoodRequestModel>(),
    };

    var response = await httpClient.PostAsJsonAsync("be/recipe", createRecipeRequest);
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task CreateValidRecipePlan_ShouldReturnOk()
  {
    var createRecipeRequest = new CreateRecipeRequestModel
    {
      Description = "Test recipe plan",
      Notes = "Test note",
      RecipeFoods = new List<CreateRecipeFoodRequestModel>
      {
        new()
        {
          FoodId = TestFoodPlan.Id,
          Amount = 10,
          UnitId = 1,
        },
      },
    };

    var response = await httpClient.PostAsJsonAsync("be/recipe", createRecipeRequest);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task GetRecipes_ShouldReturnOk()
  {
    var response = await httpClient.GetAsync("be/recipe");
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task GetRecipe_ShouldReturnOk()
  {
    var response = await httpClient.GetAsync($"be/recipe/{TestRecipePlan.Id}");
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task GetRecipe_ShouldReturnNotFound()
  {
    var response = await httpClient.GetAsync($"be/recipe/{Guid.NewGuid()}");
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }

  [Fact]
  public async Task EditRecipe_ShouldReturnNotFound()
  {
    var recipe = new EditRecipeRequestModel
    {
      Id = TestRecipePlan.Id,
      Description = "Test recipe plan",
      Notes = "Test note",
      Tags = new List<string> { "Test tag", "another test tag" },
      RecipeFoods = new List<EditFoodRequestModel>
      {
        new()
        {
          Id = TestFoodPlan.Id,
          ServingSize = 10,
          Unit = new NutrinovaData.Entities.Unit { Id = 1 },
        },
      },
    };
    var response = await httpClient.PutAsJsonAsync($"be/recipe", recipe);
    Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
  }
}
