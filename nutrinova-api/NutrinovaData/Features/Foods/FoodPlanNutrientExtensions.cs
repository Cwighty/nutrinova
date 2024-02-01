using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Features.Foods;

public static class FoodPlanNutrientExtensions
{
  public static FoodNutrient ToFoodNutrient(this FoodPlanNutrient foodPlanNutrient)
  {
    return new FoodNutrient()
    {
      nutrientId = foodPlanNutrient.NutrientId,
      nutrientName = foodPlanNutrient.Nutrient.Description,
      unitId = foodPlanNutrient.Nutrient.PreferredUnit,
      unitName = foodPlanNutrient.Nutrient.PreferredUnitNavigation.Abbreviation,
      value = foodPlanNutrient.Amount,
    };
  }

  public static IEnumerable<FoodNutrient> ToFoodNutrients(this IEnumerable<FoodPlanNutrient> foodPlanNutrients)
  {
    return foodPlanNutrients.Select(fpn => fpn.ToFoodNutrient());
  }
}
