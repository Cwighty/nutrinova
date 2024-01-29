using NutrinovaData.Features.Goals;

namespace NutrinovaApi.IntegrationTests;

public abstract class GoalControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  internal HttpClient HttpClient { get; set; }

  internal NutrinovaApiWebApplicationFactory Factory { get; set; }

  internal NutrinovaDbContext DbContext { get; set; }

  internal TestDataUtility DataUtility { get; private set; }

  public GoalControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    HttpClient = factory.CreateClient();
    this.Factory = factory;
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
    DataUtility = new TestDataUtility(dbContext);
  }

  public class GetPatientNutrientGoals : GoalControllerTests
  {
    public GetPatientNutrientGoals(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task GetPatientNutrientGoals_ShouldReturnOk()
    {
      // Arrange
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.CreatePatientAsync(customer);
      var nutrient = await DataUtility.EnsureNutrientExistsAsync();

      var testGoal = new PatientNutrientGoal
      {
        Id = Guid.NewGuid(),
        PatientId = patient.Id,
        NutrientId = nutrient.Id,
        DailyGoalAmount = 100,
      };
      DbContext.PatientNutrientGoals.Add(testGoal);
      await DbContext.SaveChangesAsync();

      // Act
      var response = await HttpClient.GetAsync($"be/goal/all");

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalResponse = await response.Content.ReadFromJsonAsync<IEnumerable<PatientNutrientGoalResponse>>();
      Assert.NotNull(goalResponse);
      Assert.Equal(testGoal.DailyGoalAmount, goalResponse!.FirstOrDefault()?.DailyGoalAmount);
    }
  }

  public class PostPatientNutrientGoal : GoalControllerTests
  {
    public PostPatientNutrientGoal(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task PostPatientNutrientGoal_ShouldReturnOk()
    {
      // Arrange
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.CreatePatientAsync(customer);
      var nutrient = await DataUtility.EnsureNutrientExistsAsync();

      var testGoal = new PatientNutrientGoalRequestModel
      {
        PatientId = patient.Id,
        NutrientId = nutrient.Id,
        DailyGoalAmount = 100,
      };

      // Act
      var response = await HttpClient.PostAsJsonAsync($"be/goal", testGoal);

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalResponse = await response.Content.ReadFromJsonAsync<PatientNutrientGoalResponse>();
      Assert.NotNull(goalResponse);
      Assert.Equal(testGoal.DailyGoalAmount, goalResponse!.DailyGoalAmount);

      var goal = await DbContext.PatientNutrientGoals.FirstOrDefaultAsync(g => g.Id == goalResponse.Id);
      Assert.NotNull(goal);
      Assert.Equal(testGoal.DailyGoalAmount, goal!.DailyGoalAmount);
    }
  }

  public class UpdatePatientNutrientGoal : GoalControllerTests
  {
    public UpdatePatientNutrientGoal(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task UpdatePatientNutrientGoal_ShouldReturnOk()
    {
      // Arrange
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.CreatePatientAsync(customer);
      var nutrient = await DataUtility.EnsureNutrientExistsAsync();

      var testGoal = new PatientNutrientGoal
      {
        Id = Guid.NewGuid(),
        PatientId = patient.Id,
        NutrientId = nutrient.Id,
        DailyGoalAmount = 100,
      };
      DbContext.PatientNutrientGoals.Add(testGoal);
      await DbContext.SaveChangesAsync();

      var testGoalUpdate = new PatientNutrientGoalRequestModel
      {
        PatientId = patient.Id,
        NutrientId = nutrient.Id,
        DailyGoalAmount = 200,
      };

      // Act
      var response = await HttpClient.PutAsJsonAsync($"be/goal/{testGoal.Id}", testGoalUpdate);

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalResponse = await response.Content.ReadFromJsonAsync<PatientNutrientGoalResponse>();
      Assert.NotNull(goalResponse);
      Assert.Equal(testGoalUpdate.DailyGoalAmount, goalResponse!.DailyGoalAmount);

      DbContext.Entry(testGoal).Reload();

      Assert.Equal(testGoalUpdate.DailyGoalAmount, testGoal!.DailyGoalAmount);
    }
  }
}
