using NutrinovaData.Entities;

namespace NutrinovaApi.IntegrationTests.TestEntities;

public class TestRecipePlan : ITestDbInitializer
{
  public static Guid Id { get; } = Guid.Parse("00000000-0000-0000-0000-000000000002");

  public static RecipePlan CreateTestRecipePlan()
  {
    return new RecipePlan
    {
      Id = Id,
      Description = "Test recipe plan",
      Notes = "Test notes",
      RecipeFoods = new List<RecipeFood>
      {
        new()
        {
          FoodId = TestFoodPlan.Id,
          Amount = 10,
          UnitId = 1000,
        },
      },
    };
  }

  public Task InitializeDbTestData(NutrinovaDbContext context)
  {
    context.RecipePlans.Add(CreateTestRecipePlan());
    return context.SaveChangesAsync();
  }
}
