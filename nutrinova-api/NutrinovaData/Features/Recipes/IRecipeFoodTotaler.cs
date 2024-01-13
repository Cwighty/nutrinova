using NutrinovaData.Entities;

namespace NutrinovaData.Features.Recipes;

public interface IRecipeFoodTotaler
{
  List<NutrientSummary> GetRecipeNutrientSummaries(List<RecipeFood> recipeFoods, List<FoodConversionSample> foodMeasurementSamples);
}
