using NutrinovaData.Entities;

namespace NutrinovaData.UnitTests;

public class FoodTotalerTests
{
    [Test]
    public void GetNutrientSummariesWithEmptyFoodPlanListReturnsEmptyList()
    {
        // Arrange
        var emptyFoodPlans = new List<FoodPlan>();

        // Act
        var result = FoodTotaler.GetNutrientSummaries(emptyFoodPlans);

        // Assert
        Assert.IsNotNull(result);
        Assert.IsEmpty(result);
    }

    [Test]
    public void GetNutrientSummariesWithSingleFoodPlanReturnsCorrectSummaries()
    {
        // Arrange
        var foodPlans = new List<FoodPlan>
        {
            new() {
                FoodPlanNutrients = new List<FoodPlanNutrient>
                {
                    new()
                    {
                        Nutrient = new Nutrient { NutrientName = "Vitamin C", Id = 1 },
                        Amount = 100,
                        Unit = new Unit { Id = 1, Description = "mg" },
                        NutrientId = 1,
                    },
                },
            },
        };

        // Act
        var result = FoodTotaler.GetNutrientSummaries(foodPlans);

        // Assert
        Assert.IsNotNull(result);
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].Name, Is.EqualTo("Vitamin C"));
        Assert.That(result[0].Amount, Is.EqualTo(100));
        Assert.That(result[0].Unit?.Description, Is.EqualTo("mg"));
    }

    [Test]
    public void GetNutrientSummariesWithMultipleFoodsSameNutrientReturnsCorrectSum()
    {
        // Arrange
        var foodPlans = new List<FoodPlan>
    {
        new()
        {
            FoodPlanNutrients = new List<FoodPlanNutrient>
            {
                new()
                {
                    Nutrient = new Nutrient { NutrientName = "Vitamin C", Id = 1 },
                    Amount = 50,
                    Unit = new Unit { Id = 1, Description = "mg" },
                    NutrientId = 1,
                },
                new()
                {
                    Nutrient = new Nutrient { NutrientName = "Vitamin C", Id = 1 },
                    Amount = 75,
                    Unit = new Unit { Id = 1, Description = "mg" },
                    NutrientId = 1,
                },
            },
        },
    };

        // Act
        var result = FoodTotaler.GetNutrientSummaries(foodPlans);

        // Assert
        Assert.IsNotNull(result);
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].Name, Is.EqualTo("Vitamin C"));
        Assert.That(result[0].Amount, Is.EqualTo(125)); // Sum of 50 and 75
        Assert.That(result[0].Unit?.Description, Is.EqualTo("mg"));
    }
}
