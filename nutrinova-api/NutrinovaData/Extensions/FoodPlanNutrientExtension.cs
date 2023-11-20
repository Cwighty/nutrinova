using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class FoodPlanNutrientExtension
{
  public static FlattenedFoodNutrient ToFlattenedFoodNutrient(this FoodPlanNutrient foodPlanNutrient)
  {
    return new FlattenedFoodNutrient(foodPlanNutrient);
  }

  public static FoodNutrient ToFoodNutrient(this FoodPlanNutrient foodPlanNutrient)
  {
    return new FoodNutrient()
    {
      nutrientId = foodPlanNutrient.NutrientId,
      nutrientName = foodPlanNutrient.Nutrient.NutrientName,
      unitId = foodPlanNutrient.Nutrient.PreferredUnit,

      // nutrientNumber = foodPlanNutrient.Nutrient.,
      // unitName = foodPlanNutrient.Nutrient.PreferredUnitNavigation.Abreviation,
      value = (double)foodPlanNutrient.Amount,
    };
  }
}
