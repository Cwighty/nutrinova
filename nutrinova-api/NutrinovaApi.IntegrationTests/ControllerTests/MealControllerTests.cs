using NutrinovaData.Features.Meals;

namespace NutrinovaApi.IntegrationTests.ControllerTests;

public class MealControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  internal HttpClient HttpClient { get; set; }

  internal NutrinovaApiWebApplicationFactory Factory { get; set; }

  internal NutrinovaDbContext DbContext { get; set; }

  internal TestDataUtility DataUtility { get; private set; }

  public MealControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    HttpClient = factory.CreateClient();
    Factory = factory;
    var scope = factory.Services.GetService<IServiceScopeFactory>()?.CreateScope();
    if (scope == null)
    {
      throw new InvalidOperationException("Service scope could not be created.");
    }

    var dbContext = scope.ServiceProvider.GetRequiredService<NutrinovaDbContext>();
    if (dbContext == null)
    {
      throw new InvalidOperationException("Database context could not be obtained.");
    }

    DbContext = dbContext;
    DataUtility = new TestDataUtility(dbContext, factory);
  }

  public class GetMealTests : MealControllerTests
  {
    public GetMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Get_Meal()
    {
      // Arrange
      var meal = await DataUtility.CreateMealAsync();
      var mealId = meal.Id;

      // Act
      var response = await HttpClient.GetAsync("be/meal/" + mealId);

      // Assert
      response.EnsureSuccessStatusCode();
      var mealResponse = await response.Content.ReadFromJsonAsync<MealResponse>();
      Assert.NotNull(mealResponse);
      Assert.True(mealResponse.Id == mealId);
    }
  }

  public class GetMealHistoryTest : MealControllerTests
  {
    public GetMealHistoryTest(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Get_Meal_History()
    {
      // Arrange
      var utcDate = DateTime.SpecifyKind(new DateTime(2022, 1, 1), DateTimeKind.Utc);
      var meal = await DataUtility.CreateMealAsync(utcDate);
      var mealId = meal.Id;

      // Act
      var response = await HttpClient.GetAsync("be/meal/getMealHistory?beginDate=2022-01-01&endDate=2022-01-01");

      // Assert
      response.EnsureSuccessStatusCode();
      var mealResponses = await response.Content.ReadFromJsonAsync<IEnumerable<MealResponse>>();
      Assert.NotNull(mealResponses);
      Assert.Contains(mealResponses, m => m.Id == mealId);
    }
  }

  public class RecordMealTests : MealControllerTests
  {
    public RecordMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Record_Food_As_Meal()
    {
      // Arrange
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.CreatePatientAsync(customer);
      var food = await DataUtility.CreateFoodAsync();
      var recordMealRequest = new RecordMealRequest
      {
        PatientId = patient.Id,
        SelectedMealItemId = food.Id,
        MealSelectionType = MealSelectionItemType.CustomFood.ToString(),
        RecordedAt = DateTime.UtcNow,
        Amount = 1,
        UnitId = food.ServingSizeUnit,
      };

      // Act
      var response = await HttpClient.PostAsJsonAsync("be/meal", recordMealRequest);

      // Assert
      response.EnsureSuccessStatusCode();

      var dbMeal = await DbContext.Meals
        .Include(m => m.MealNutrients)
        .FirstOrDefaultAsync(
          m => m.PatientId == patient.Id &&
          m.Description == food.Description);

      Assert.NotNull(dbMeal);
      Assert.Equal(recordMealRequest.PatientId, dbMeal.PatientId);
      Assert.True(dbMeal.MealNutrients.Any());
      Assert.True(dbMeal.MealNutrients.All(mn => mn.Amount > 0));
    }

    [Fact]
    public async Task Record_Recipe_As_Meal()
    {
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.CreatePatientAsync(customer);
      var recipe = await DataUtility.CreateRecipeAsync();
      var recordMealRequest = new RecordMealRequest
      {
        PatientId = patient.Id,
        SelectedMealItemId = recipe.Id,
        MealSelectionType = MealSelectionItemType.Recipe.ToString(),
        RecordedAt = DateTime.UtcNow,
        Amount = 1,
        UnitId = recipe.ServingSizeUnit,
      };

      // Act
      var response = await HttpClient.PostAsJsonAsync("be/meal", recordMealRequest);

      // Assert
      Assert.NotNull(response);
      response.EnsureSuccessStatusCode();

      var dbMeal = await DbContext.Meals
        .Include(m => m.MealNutrients)
        .FirstOrDefaultAsync(
          m => m.PatientId == patient.Id &&
          m.Description == recipe.Description);
      Assert.NotNull(dbMeal);
      Assert.Equal(recordMealRequest.PatientId, dbMeal.PatientId);
      Assert.True(dbMeal.MealNutrients.Any());
      Assert.True(dbMeal.MealNutrients.All(mn => mn.Amount > 0));
    }
  }
}
