using NutrinovaData.Entities;

namespace NutrinovaData.Features.Recipes;

public interface IRecipeFoodTotaler
{
  List<NutrientSummary> GetNutrientSummaries(List<RecipeFood> recipeFoods);
}
