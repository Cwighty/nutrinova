using NutrinovaData.Entities;

namespace NutrinovaData.Features.Nutrients;

public interface INutrientRecommendationService
{
  Task<UsdaRecommendedNutrientValue> GetNutrientReccomendationAsync(UsdaNutrient nutrient, int age, Sex sex);
}
