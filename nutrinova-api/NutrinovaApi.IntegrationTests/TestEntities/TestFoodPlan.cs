using NutrinovaData.Entities;

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
            FoodPlanNutrients = new List<FoodPlanNutrient>
            {
                new()
                {
                    NutrientId = 1005,
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
