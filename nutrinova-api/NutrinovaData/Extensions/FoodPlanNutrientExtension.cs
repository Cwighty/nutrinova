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
      nutrientName = foodPlanNutrient.Nutrient.Description,
      unitId = foodPlanNutrient.Nutrient.PreferredUnit,
      unitName = foodPlanNutrient.Nutrient.PreferredUnitNavigation.Abbreviation,
      value = foodPlanNutrient.Amount,
    };
  }

  public static NutrientSummary GetNutrientAmountPerFoodServingUnit(this FoodPlanNutrient foodPlanNutrient)
  {
    var foodServingUnit = foodPlanNutrient.Foodplan.ServingSizeUnitNavigation;
    var foodServingSize = foodPlanNutrient.Foodplan.ServingSize;
    var amountPerFoodServingUnit = foodPlanNutrient.Amount / foodServingSize;
    return new NutrientSummary()
    {
      Amount = amountPerFoodServingUnit,
      Name = foodPlanNutrient.Nutrient.Description,
      Unit = foodServingUnit.ToUnitOption(),
    };
  }
}
