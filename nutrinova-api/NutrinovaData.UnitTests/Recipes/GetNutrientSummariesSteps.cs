using NutrinovaData.Entities;
using TechTalk.SpecFlow;

[Binding]
public class GetNutrientSummariesSteps
{
  private List<RecipeFood> recipeFoods = new();
  private List<NutrientSummary> result = new();
  private Nutrient nutrient = new();

  [Given(@"I have a food item with (.*) of (.*) (.*)")]
  public void GivenIHaveAFoodItemWith(string nutrientName, int nutrientAmount, string unit)
  {
    nutrient = new Nutrient { NutrientName = nutrientName };
    var foodNutrient = new FoodPlanNutrient
    {
      NutrientId = 1, // Assuming a unique ID for each nutrient
      Amount = nutrientAmount,
      Unit = new() { Description = unit, Abreviation = unit },
      Nutrient = nutrient,
    };
    var recipeFood = new RecipeFood
    {
      Food = new() { FoodPlanNutrients = new List<FoodPlanNutrient> { foodNutrient } },
      Amount = 1,
    };
    recipeFoods = new List<RecipeFood> { recipeFood };
  }

  [Given(@"the recipe amount is (.*)")]
  public void GivenTheRecipeAmountIs(int recipeAmount)
  {
    recipeFoods[0].Amount = recipeAmount;
  }

  [When(@"I calculate the nutrient summaries")]
  public void WhenICalculateTheNutrientSummaries()
  {
    result = RecipeFoodTotaler.GetNutrientSummaries(recipeFoods);
  }

  [Then(@"the total nutrient count should be (.*)")]
  public void ThenTheTotalNutrientCountShouldBe(int totalCount)
  {
    Assert.That(result.Count, Is.EqualTo(totalCount));
  }

  [Then(@"the nutrient summary for (.*) should be (.*) (.*)")]
  public void ThenTheNutrientSummaryForShouldBe(string nutrientName, int expectedAmount, string unit)
  {
    var nutrientSummary = result.FirstOrDefault(n => n.Name == nutrientName);
    Assert.IsNotNull(nutrientSummary);
    Assert.That(nutrientSummary.Amount, Is.EqualTo(expectedAmount));
    Assert.That(nutrientSummary.Unit?.Abreviation, Is.EqualTo(unit));
  }
}
