using NutrinovaData.Calculators;
using NutrinovaData.Entities;

public static class RecipeFoodTotaler
{
  public static List<NutrientSummary> GetNutrientSummaries(List<RecipeFood> recipeFoods)
  {
    var nutrientSummaries = new Dictionary<int, NutrientSummary>();
    foreach (var recipeFood in recipeFoods)
    {
      foreach (var nutrient in recipeFood.Food.FoodPlanNutrients)
      {
        if (!nutrientSummaries.ContainsKey(nutrient.NutrientId))
        {
          nutrientSummaries.Add(nutrient.NutrientId, new NutrientSummary
          {
            Name = nutrient.Nutrient.Description,
            Amount = nutrient.Amount * UnitConverter.Convert(recipeFood.Amount, recipeFood.Unit, recipeFood.Food.ServingSizeUnitNavigation),
            Unit = nutrient.Unit,
          });
        }
        else
        {
          nutrientSummaries[nutrient.NutrientId].Amount += nutrient.Amount * UnitConverter.Convert(recipeFood.Amount, recipeFood.Unit, recipeFood.Food.ServingSizeUnitNavigation);
        }
      }
    }

    return nutrientSummaries.Values.ToList();
  }
}
