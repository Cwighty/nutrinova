using NutrinovaData.Entities;

namespace NutrinovaData.Features.Nutrients;

public interface INutrientRecommendationService
{
  Task<UsdaRecommendedNutrientValue> GetNutrientRecommendationAsync(UsdaNutrient nutrient, int age, Sex sex);
}
