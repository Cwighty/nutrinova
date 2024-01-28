using NutrinovaData.ResponseModels;
using System.Net;

namespace NutrinovaApi.IntegrationTests.ControllerTests;

public class FoodControllerTests2 : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  private readonly HttpClient httpClient;
  private readonly NutrinovaApiWebApplicationFactory factory;

  public FoodControllerTests2(NutrinovaApiWebApplicationFactory factory)
  {
    httpClient = factory.CreateClient();
    this.factory = factory;
  }

  [Fact]
  public async Task Edit_Food_Plan()
  {
    var editFood = new EditFoodRequestModel
    {
      Id = TestFoodPlan.Id,
      Description = "Edited",
      Note = "Edited",
      BrandName = "Edited",
      Ingredients = "Edited",
      ServingSize = 10,
      Unit = new UnitOption
      {
        Id = 1,
        Description = "G",
        CategoryId = 1,
        Abbreviation = "G",
        CategoryName = "Weight",
        Category = new UnitCategoryRequestModel
        {
          Id = 1,
          Description = "Weight",
        },
      },
      FoodNutrients = new List<EditFoodNutrientRequestModel>
      {
        new()
        {
          NutrientId = 2,
          Amount = 10,
          UnitId = 1,
          UnitCategoryId = 1,
        },
      },
    };

    var resFoodEdit = await httpClient.PutAsJsonAsync("be/food", editFood);

    // Assert
    var newEditFood = await httpClient.GetFromJsonAsync<FoodResponse>("be/food/food-details/" + editFood.Id);
    Assert.Equal(HttpStatusCode.OK, resFoodEdit.StatusCode);
    Assert.Equal("Edited", newEditFood?.Description);
    Assert.Equal("Edited", newEditFood?.Note);
    Assert.Equal("Edited", newEditFood?.BrandName);
    Assert.Equal("Edited", newEditFood?.Ingredients);
    Assert.Equal(10, newEditFood?.ServingSize);
    Assert.Equal("G", newEditFood?.ServingSizeUnit);
    Assert.Equal("10 G", newEditFood?.ServingSizeWithUnits);
  }
}
