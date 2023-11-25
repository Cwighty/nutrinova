using System.Net;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaApi.IntegrationTests;

public class FoodControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  private readonly HttpClient httpClient;
  private readonly NutrinovaApiWebApplicationFactory factory;

  public FoodControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    httpClient = factory.CreateClient();
    this.factory = factory;
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
      Description = " food plan",
      Note = "this is a string",
      ServingSize = 1,
      Unit = 1,
      FoodNutrients = new List<CreateFoodNutrientRequestModel>
      {
        new()
        {
          NutrientId = 5,
          Amount = 10,
        },
      },
    };

    var response = await httpClient.PostAsJsonAsync("be/food", createFoodRequestModel);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CheckFiltering_ByNutrient_WithFilterOptions()
  {
    // Arrange
    var customerID = Guid.Empty.ToString();
    var testFoodPlan = new CreateFoodRequestModel
    {
      Description = "Test food plan",
      Note = "note",
      ServingSize = 1,
      Unit = 1,
      FoodNutrients = new List<CreateFoodNutrientRequestModel>
      {
        new()
        {
          NutrientId = 2,
          Amount = 10,
        },
      },
    };

    var testFoodPlan2 = new CreateFoodRequestModel
    {
      Description = "food plan",
      Note = "this is a note",
      ServingSize = 1,
      Unit = 1,
      FoodNutrients = new List<CreateFoodNutrientRequestModel>
      {
        new()
        {
          NutrientId = 2,
          Amount = 10,
        },
      },
    };

    // Act
    var res = await httpClient.GetAsync($"be/Customer/exists?id={customerID}");
    var resFoodCreation = await httpClient.PostAsJsonAsync("be/food", testFoodPlan);
    var resFoodCreation2 = await httpClient.PostAsJsonAsync("be/food", testFoodPlan2);

    var resFoodPlanFilterComplex = await httpClient.GetAsync("be/food/all-foods?filterOption=test&nutrientFilter=Protein&nutrientFilterOperator=lt&nutrientFilterValue=11");
    var resFoodPlanFilter_Just_Description = await httpClient.GetAsync("be/food/all-foods?filterOption=test");
    var resFoodPlanFilter_Just_Nutrient = await httpClient.GetAsync("be/food/all-foods?nutrientFilter=Protein&nutrientFilterOperator=lt&nutrientFilterValue=11");
    var resFoodPlanFilter_Just_Nutrient_With_Invalid_Operator = await httpClient.GetAsync("be/food/all-foods?nutrientFilter=Protein&nutrientFilterOperator=invalid&nutrientFilterValue=11");
    var resFoodPlanFilter_Just_Note = await httpClient.GetAsync("be/food/all-foods?filterOption=note");

    // Assert
    Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodCreation.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodCreation2.StatusCode);
    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilterComplex.StatusCode);
    Assert.Equal(1, (await resFoodPlanFilterComplex.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);

    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilter_Just_Description.StatusCode);
    Assert.Equal(2, (await resFoodPlanFilter_Just_Description.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);

    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilter_Just_Nutrient.StatusCode);
    Assert.Equal(2, (await resFoodPlanFilter_Just_Nutrient.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);

    Assert.Equal(HttpStatusCode.InternalServerError, resFoodPlanFilter_Just_Nutrient_With_Invalid_Operator.StatusCode);

    Assert.Equal(HttpStatusCode.OK, resFoodPlanFilter_Just_Note.StatusCode);
    Assert.Equal(3, (await resFoodPlanFilter_Just_Note.Content.ReadFromJsonAsync<List<FlattenedFood>>())?.Count);
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
      Unit = new NutrinovaData.Entities.Unit
      {
        Id = 1,
        Description = "G",
        CategoryId = 1,
        Category = new NutrinovaData.Entities.UnitCategory
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
          },
        },
    };

    var resFoodEdit = await httpClient.PutAsJsonAsync("be/food", editFood);

    // Assert
    var newEditFood = await httpClient.GetFromJsonAsync<Food>("be/food/food-details/" + editFood.Id);
    Assert.Equal(HttpStatusCode.OK, resFoodEdit.StatusCode);
    Assert.Equal("Edited", newEditFood?.description);
    Assert.Equal("Edited", newEditFood?.note);
    Assert.Equal("Edited", newEditFood?.brandName);
    Assert.Equal("Edited", newEditFood?.ingredients);
    Assert.Equal(10, newEditFood?.servingSize);
    Assert.Equal("G", newEditFood?.servingSizeUnit);
    Assert.Equal("10 G", newEditFood?.servingSizeWithUnits);
  }
}
