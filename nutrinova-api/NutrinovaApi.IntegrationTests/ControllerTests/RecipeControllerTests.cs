using System.Net;

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
}
