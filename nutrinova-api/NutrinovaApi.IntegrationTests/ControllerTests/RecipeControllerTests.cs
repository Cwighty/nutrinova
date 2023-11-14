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
  public async Task CreateValidRecipePlan_ShouldReturnOk()
  {
    var createFoodRequestModel = new CreateFoodRequestModel
    {
      Description = "Test food plan",
      Note = "Test note",
      FoodNutrients = new List<CreateFoodNutrientRequestModel>
      {
        new()
        {
          NutrientId = 1005,
          Amount = 10,
        },
      },
    };

    var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);

    var foodId = await response.Content.ReadFromJsonAsync<string>();

    var createRecipeRequest = new CreateRecipeRequestModel
    {
      Description = "Test recipe plan",
      Notes = "Test note",
      RecipeFoods = new List<CreateRecipeFoodRequestModel>
      {
        new()
        {
          FoodId = Guid.Parse(foodId ?? string.Empty),
          Amount = 10,
          UnitId = 1,
        },
      },
    };

    response = await httpClient.PostAsJsonAsync("be/food", createRecipeRequest);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }
}
