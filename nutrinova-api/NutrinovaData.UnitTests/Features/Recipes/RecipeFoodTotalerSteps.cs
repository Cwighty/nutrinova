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
    var units = this.scenarioContext.Get<List<Unit>>("Units");
    this.scenarioContext["Foods"] = foods;
    foreach (var food in foods)
    {
      food.FoodPlanNutrients = new List<FoodPlanNutrient>();
      food.ServingSizeUnitNavigation = units?.FirstOrDefault(u => u.Id == food.ServingSizeUnit) ?? new Unit { Id = food.ServingSizeUnit };
    }
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

    foreach (var food in foods)
    {
      food.FoodPlanNutrients = foodNutrients.Where(fn => fn.FoodplanId == food.Id).ToList();
    }

    this.scenarioContext["Foods"] = foods;
    this.scenarioContext["FoodNutrients"] = foodNutrients;
  }

  [Given(@"the following recipe foods")]
  public void GivenTheFollowingRecipeFoods(Table table)
  {
    var recipeFoods = table.CreateSet<RecipeFood>().ToList();
    var foods = this.scenarioContext.Get<List<FoodPlan>>("Foods");
    var recipes = this.scenarioContext.Get<List<RecipePlan>>("Recipes");
    var units = this.scenarioContext.Get<List<Unit>>("Units");

    foreach (var recipeFood in recipeFoods)
    {
      recipeFood.Food = foods?.FirstOrDefault(f => f.Id == recipeFood.FoodId) ?? new FoodPlan { Id = recipeFood.FoodId };
      recipeFood.Unit = units?.FirstOrDefault(u => u.Id == recipeFood.UnitId) ?? new Unit { Id = recipeFood.UnitId };
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

  [Given(@"the following recipes")]
  public void GivenTheFollowingRecipes(Table table)
  {
    var recipes = table.CreateSet<RecipePlan>().ToList();
    var recipeFoods = this.scenarioContext.ContainsKey("RecipeFoods")
        ? this.scenarioContext.Get<List<RecipeFood>>("RecipeFoods")
        : new List<RecipeFood>();

    foreach (var recipe in recipes)
    {
      recipe.RecipeFoods = recipeFoods.Where(rf => rf.RecipeId == recipe.Id).ToList();
    }

    this.scenarioContext["Recipes"] = recipes;
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

    Assert.That(result.Count, Is.EqualTo(expected.Count));
    Assert.That(result[0].Name, Is.EqualTo(expected[0].Name));
    Assert.That(result[0].Amount, Is.EqualTo(expected[0].Amount));
  }
}
