using NutrinovaData.Entities;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

[Binding]
public class SharedSteps
{
  private readonly ScenarioContext _scenarioContext;

  public SharedSteps(ScenarioContext scenarioContext)
  {
    _scenarioContext = scenarioContext;
  }

  [Given(@"the following foods")]
  public void GivenTheFollowingFoods(Table table)
  {
    var foods = table.CreateSet<FoodPlan>().ToList();
    _scenarioContext["Foods"] = foods;
  }

  [Given(@"the following nutrients")]
  public void GivenTheFollowingNutrients(Table table)
  {
    var nutrients = table.CreateSet<Nutrient>().ToList();
    _scenarioContext["Nutrients"] = nutrients;
  }

  [Given(@"the following Unit Categories")]
  public void GivenTheFollowingUnitCategories(Table table)
  {
    var unitCategories = table.CreateSet<UnitCategory>().ToList();
    _scenarioContext["UnitCategories"] = unitCategories;
  }

  [Given(@"the following units")]
  public void GivenTheFollowingUnits(Table table)
  {
    var units = table.CreateSet<Unit>().ToList();
    var unitCategories = _scenarioContext.Get<List<UnitCategory>>("UnitCategories");

    foreach (var unit in units)
    {
      unit.Category = unitCategories?.FirstOrDefault(uc => uc.Id == unit.CategoryId);
    }

    _scenarioContext["Units"] = units;
  }

  [Given(@"the following food nutrients")]
  public void GivenTheFollowingFoodNutrients(Table table)
  {
    var foodNutrients = table.CreateSet<FoodPlanNutrient>().ToList();
    var foods = _scenarioContext.Get<List<FoodPlan>>("Foods");
    var nutrients = _scenarioContext.Get<List<Nutrient>>("Nutrients");

    foreach (var foodNutrient in foodNutrients)
    {
      foodNutrient.Foodplan = foods?.FirstOrDefault(f => f.Id == foodNutrient.FoodplanId) ?? new FoodPlan { Id = foodNutrient.FoodplanId };
      foodNutrient.Nutrient = nutrients?.FirstOrDefault(n => n.Id == foodNutrient.NutrientId) ?? new Nutrient { Id = foodNutrient.NutrientId };
    }

    _scenarioContext["FoodNutrients"] = foodNutrients;
  }

  [Given(@"the following recipe foods")]
  public void GivenTheFollowingRecipeFoods(Table table)
  {
    var recipeFoods = table.CreateSet<RecipeFood>().ToList();
    var foods = _scenarioContext.Get<List<FoodPlan>>("Foods");
    var recipes = _scenarioContext.Get<List<RecipePlan>>("Recipes");

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

    _scenarioContext["RecipeFoods"] = recipeFoods;
  }

  [When(@"I calculate nutrient summaries")]
  public void WhenICalculateNutrientSummaries()
  {
    var recipeFoods = _scenarioContext.Get<List<RecipeFood>>("RecipeFoods");
    var result = RecipeFoodTotaler.GetNutrientSummaries(recipeFoods);
    _scenarioContext["Result"] = result;
  }

  [Then(@"the nutrient summaries should be")]
  public void ThenTheNutrientSummariesShouldBe(Table table)
  {
    var expected = table.CreateSet<NutrientSummary>().ToList();
    var result = _scenarioContext.Get<List<NutrientSummary>>("Result");

    Assert.That(result, Is.EqualTo(expected));
  }
}
