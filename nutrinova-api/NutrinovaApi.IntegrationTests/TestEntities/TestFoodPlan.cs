public class TestFoodPlan : ITestDbInitializer
{
  public static Guid Id { get; } = Guid.NewGuid();

  public static FoodPlan CreateTestFood()
  {
    return new FoodPlan
    {
      Id = Id,
      Description = "Test food plan",
      Note = "Test note",
      CreatedBy = TestCustomer.Id,
      CreatedAt = DateTime.UtcNow,
      ServingSize = 10,
      ServingSizeUnit = 1,
      FoodPlanNutrients = new List<FoodPlanNutrient>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    NutrientId = 1,
                    UnitId = 1,
                    Amount = 10,
                },
            },
    };
  }

  public async Task InitializeDbTestData(NutrinovaDbContext context)
  {
    await context.FoodPlans.AddAsync(CreateTestFood());
    await context.SaveChangesAsync();
  }
}
