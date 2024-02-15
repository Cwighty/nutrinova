using NutrinovaData.Entities;

namespace NutrinovaData.Features.Nutrients;

public interface INutrientReccomendationService
{
  Task<UsdaReccomendedNutrientValue> GetNutrientReccomendationAsync(UsdaNutrient nutrient, int age, Sex sex);
}
