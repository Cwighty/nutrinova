using NutrinovaData.Entities;

namespace NutrinovaApi.IntegrationTests.TestEntities;

public class TestRecipePlan : ITestDbInitializer
{
  public static Guid Id { get; } = Guid.NewGuid();

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
          Id = Guid.NewGuid(),
          FoodId = TestFoodPlan.Id,
          Amount = 10,
          UnitId = 1,
        },
      },
    };
  }

  public async Task InitializeDbTestData(NutrinovaDbContext context)
  {
    await context.RecipePlans.AddAsync(CreateTestRecipePlan());
    await context.SaveChangesAsync();
  }
}
