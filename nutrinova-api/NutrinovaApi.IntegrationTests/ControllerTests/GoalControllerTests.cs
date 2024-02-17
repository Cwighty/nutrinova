using NutrinovaData.Features.Goals;
using NutrinovaData.Features.Reports;

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
    DataUtility = new TestDataUtility(dbContext, factory);
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
      var patient = await DataUtility.EnsurePatientExistsAsync(customer);
      var nutrient = await DataUtility.EnsureNutrientExistsAsync();

      var testGoal = new PatientNutrientDailyGoal
      {
        Id = Guid.NewGuid(),
        PatientId = patient.Id,
        NutrientId = nutrient.Id,

        // DailyGoalAmount = 100,
      };
      DbContext.PatientNutrientDailyGoals.Add(testGoal);
      await DbContext.SaveChangesAsync();

      // Act
      var response = await HttpClient.GetAsync($"be/goal/all");

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalResponse = await response.Content.ReadFromJsonAsync<IEnumerable<NutrientGoalResponse>>();
      Assert.NotNull(goalResponse);

      // Assert.Equal(testGoal.DailyGoalAmount, goalResponse!.FirstOrDefault()?.DailyGoalAmount);
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
      var patient = await DataUtility.EnsurePatientExistsAsync(customer);

      var testGoal = new NutrientGoalRequestModel
      {
        PatientId = patient.Id,
        NutrientId = 2, // protein
        DailyLowerLimit = 10,
        DailyUpperLimit = 100,
        UseRecommended = false,
      };

      // Act
      var response = await HttpClient.PostAsJsonAsync($"be/goal", testGoal);

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalResponse = await response.Content.ReadFromJsonAsync<NutrientGoalResponse>();
      Assert.NotNull(goalResponse);

      var goal = await DbContext.PatientNutrientDailyGoals.FirstOrDefaultAsync(g => g.Id == goalResponse.Id);
      Assert.NotNull(goal);

      Assert.Equal(testGoal.DailyLowerLimit, goal.CustomLowerTarget);
    }
  }

  /*
  public class GetNutrientGoalReport : GoalControllerTests
  {
    public GetNutrientGoalReport(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task GetNutrientGoalReport_ShouldReturnValidReport()
    {
      // Arrange
      var utcDate = DateTime.SpecifyKind(new DateTime(2022, 1, 1), DateTimeKind.Utc);
      var meals = await DataUtility.CreateMealAsync(utcDate);
      var goal = await DataUtility.CreatePatientGoalAsync();

      // Act
      var response = await HttpClient.GetAsync($"be/goal/report?beginDate=2022-01-01&endDate=2022-01-01");

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var goalReportResponse = await response.Content.ReadFromJsonAsync<IEnumerable<PatientNutrientGoalReport>>();

      Assert.NotNull(goalReportResponse);

      var goalReport = goalReportResponse.FirstOrDefault();
      Assert.NotNull(goalReport);

      Assert.Single(goalReport.NutrientGoalReportItems);
      Assert.Equal(goal.NutrientId, goalReport.NutrientGoalReportItems.FirstOrDefault()?.NutrientId);
      Assert.Equal(10, goalReport.NutrientGoalReportItems.FirstOrDefault()?.ConsumedAmount);
      Assert.Equal(90, goalReport.NutrientGoalReportItems.FirstOrDefault()?.RemainingAmount);
      Assert.Equal(NutrientGoalStatus.NotMet, goalReport.NutrientGoalReportItems.FirstOrDefault()?.GoalStatus);
    }
  }
  */

  public class GetNutrientRecommendation : GoalControllerTests
  {
    public GetNutrientRecommendation(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    [Fact]
    public async Task GetNutrientRecommendation_ShouldReturnOk()
    {
      // Arrange
      var nutrient = await DbContext.Nutrients.Where(n => n.Description == "Protein").FirstOrDefaultAsync();
      var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
      var patient = await DataUtility.EnsurePatientExistsAsync(customer);

      // Act
      var response = await HttpClient.GetAsync($"be/goal/reccomendation?nutrientId={nutrient!.Id}&patientId={patient.Id}");

      // Assert
      Assert.Equal(HttpStatusCode.OK, response.StatusCode);
      var recommendation = await response.Content.ReadFromJsonAsync<UsdaRecommendedNutrientValue>();
      Assert.NotNull(recommendation);
      Assert.True(recommendation.RecommendedValue == 46);
    }
  }
}
