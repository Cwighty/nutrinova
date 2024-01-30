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

  public class RecordMealTests : MealControllerTests
  {
    public RecordMealTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }
  }
}
