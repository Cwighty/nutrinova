using NutrinovaData.Entities;

public class TestFoodPlan : ITestDbInitializer
{
    public static Guid Id { get; } = Guid.Parse("00000000-0000-0000-0000-000000000001");

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
        context.FoodPlans.Add(CreateTestFood());
        await context.SaveChangesAsync();
    }
}
