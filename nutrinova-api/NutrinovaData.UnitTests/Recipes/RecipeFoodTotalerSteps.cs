using NutrinovaData.Entities;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

[Binding]
public class RecipeFoodTotalerSteps
{
  private readonly ScenarioContext scenarioContext;

  public RecipeFoodTotalerSteps(ScenarioContext scenarioContext)
  {
    this.scenarioContext = scenarioContext;
  }

  [Given(@"the following foods")]
  public void GivenTheFollowingFoods(Table table)
  {
    var foods = table.CreateSet<FoodPlan>().ToList();
    this.scenarioContext["Foods"] = foods;
  }

  [Given(@"the following nutrients")]
  public void GivenTheFollowingNutrients(Table table)
  {
    var nutrients = table.CreateSet<Nutrient>().ToList();
    this.scenarioContext["Nutrients"] = nutrients;
  }

  [Given(@"the following Unit Categories")]
  public void GivenTheFollowingUnitCategories(Table table)
  {
    var unitCategories = table.CreateSet<UnitCategory>().ToList();
    this.scenarioContext["UnitCategories"] = unitCategories;
  }

  [Given(@"the following units")]
  public void GivenTheFollowingUnits(Table table)
  {
    var units = table.CreateSet<Unit>().ToList();
    var unitCategories = this.scenarioContext.Get<List<UnitCategory>>("UnitCategories");

    foreach (var unit in units)
    {
      unit.Category = unitCategories?.FirstOrDefault(uc => uc.Id == unit.CategoryId);
    }

    this.scenarioContext["Units"] = units;
  }

  [Given(@"the following food nutrients")]
  public void GivenTheFollowingFoodNutrients(Table table)
  {
    var foodNutrients = table.CreateSet<FoodPlanNutrient>().ToList();
    var foods = this.scenarioContext.Get<List<FoodPlan>>("Foods");
    var nutrients = this.scenarioContext.Get<List<Nutrient>>("Nutrients");

    foreach (var foodNutrient in foodNutrients)
    {
      foodNutrient.Foodplan = foods?.FirstOrDefault(f => f.Id == foodNutrient.FoodplanId) ?? new FoodPlan { Id = foodNutrient.FoodplanId };
      foodNutrient.Nutrient = nutrients?.FirstOrDefault(n => n.Id == foodNutrient.NutrientId) ?? new Nutrient { Id = foodNutrient.NutrientId };
    }

    this.scenarioContext["FoodNutrients"] = foodNutrients;
  }

  [Given(@"the following recipe foods")]
  public void GivenTheFollowingRecipeFoods(Table table)
  {
    var recipeFoods = table.CreateSet<RecipeFood>().ToList();
    var foods = this.scenarioContext.Get<List<FoodPlan>>("Foods");
    var recipes = this.scenarioContext.Get<List<RecipePlan>>("Recipes");

    foreach (var recipeFood in recipeFoods)
    {
      recipeFood.Food = foods?.FirstOrDefault(f => f.Id == recipeFood.FoodId) ?? new FoodPlan { Id = recipeFood.FoodId };
      var recipe = recipes?.FirstOrDefault(r => r.Id == recipeFood.RecipeId) ?? new RecipePlan { Id = recipeFood.RecipeId };
      if (recipe != null)
      {
        if (recipe.RecipeFoods == null)
        {
          recipe.RecipeFoods = new List<RecipeFood>();
        }

        recipe.RecipeFoods.Add(recipeFood);
      }
    }

    this.scenarioContext["RecipeFoods"] = recipeFoods;
  }

  [When(@"I calculate nutrient summaries")]
  public void WhenICalculateNutrientSummaries()
  {
    var recipeFoods = this.scenarioContext.Get<List<RecipeFood>>("RecipeFoods");
    var result = RecipeFoodTotaler.GetNutrientSummaries(recipeFoods);
    this.scenarioContext["Result"] = result;
  }

  [Then(@"the nutrient summaries should be")]
  public void ThenTheNutrientSummariesShouldBe(Table table)
  {
    var expected = table.CreateSet<NutrientSummary>().ToList();
    var result = this.scenarioContext.Get<List<NutrientSummary>>("Result");

    Assert.That(result, Is.EqualTo(expected));
  }
}
