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

  public class RecordRecipeMealTests : MealControllerTests
  {
    public RecordRecipeMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Record_Recipe_As_Meal()
    {
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.EnsurePatientExistsAsync(customer);
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
      var stringResponse = await response.Content.ReadAsStringAsync();
      var desResponse = await response.Content.ReadFromJsonAsync<MealResponse>();

      // Asserts
      Assert.NotNull(response);
      response.EnsureSuccessStatusCode();

      var dbMeal = await HttpClient.GetFromJsonAsync<MealResponse>("be/meal/" + desResponse?.Id ?? throw new InvalidOperationException());
      Assert.NotNull(dbMeal);
      Assert.Equal(recordMealRequest.PatientId, dbMeal.PatientId);
      Assert.True(dbMeal.NutrientSummaries.Any());
      Assert.True(dbMeal.NutrientSummaries.All(mn => mn.Amount > 0));
      Assert.Equal(recordMealRequest.UnitId, dbMeal.UnitId);
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
      var patient = await DataUtility.EnsurePatientExistsAsync(customer);
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
  }

  public class UpdateMealTests : MealControllerTests
  {
    public UpdateMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Update_Meal()
    {
      // Arrange
      var meal = await DataUtility.CreateMealAsync();
      var mealId = meal.Id;
      var newDate = DateTime.UtcNow;
      var updateMealRequest = new EditMealRequest
      {
        Id = mealId,
        Amount = 6,
        RecordedAt = newDate,
        UnitId = 1,
      };

      // Act
      var response = await HttpClient.PutAsJsonAsync("be/meal", updateMealRequest);

      // Assert
      response.EnsureSuccessStatusCode();
      var dbMeal = await HttpClient.GetFromJsonAsync<MealResponse>("be/meal/" + mealId);
      Assert.NotNull(dbMeal);
      Assert.True(dbMeal.NutrientSummaries.Any());
      Assert.True(dbMeal.NutrientSummaries.All(mn => mn.Amount > 0));
      Assert.Equal(updateMealRequest.UnitId, dbMeal.UnitId);
      foreach (var nutrient in dbMeal.NutrientSummaries)
      {
        var originalNutrientAmount = meal.MealNutrients.First(n => n.NutrientId == nutrient.NutrientId).Amount;
        Assert.Equal(nutrient.Amount, originalNutrientAmount * (updateMealRequest.Amount / meal.Amount));
      }

      Assert.Equal(updateMealRequest.Amount, dbMeal.Amount);
      Assert.NotNull(dbMeal.RecordedAt);
    }
  }

  public class DeleteMealTests : MealControllerTests
  {
    public DeleteMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task Delete_Meal()
    {
      // Arrange
      var meal = await DataUtility.CreateMealAsync();
      var mealId = meal.Id;
      var newDate = DateTime.UtcNow;

      // Act
      var dbMeal = await DbContext.Meals
        .Include(m => m.MealNutrients)
        .FirstOrDefaultAsync(
          m => m.PatientId == meal.PatientId &&
          m.Description == meal.Description);

      var response = await HttpClient.DeleteAsync("be/meal/" + mealId);

      dbMeal = await DbContext.Meals
        .Include(m => m.MealNutrients)
        .FirstOrDefaultAsync(
          m => m.PatientId == meal.PatientId &&
          m.Description == meal.Description);

      // Assert
      response.EnsureSuccessStatusCode();
      Assert.Null(dbMeal);
    }
  }
}
