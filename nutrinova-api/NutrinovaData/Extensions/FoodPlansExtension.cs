using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class FoodPlansExtension
{
  public static FlattenedFood ToFlattenedFood(this FoodPlan foodPlan)
  {
    return new FlattenedFood(foodPlan);
  }

  public static FoodResponse ToFood(this FoodPlan foodPlan)
  {
    if (foodPlan.ServingSizeUnitNavigation == null)
    {
      throw new Exception($"Please include {nameof(FoodPlan.ServingSizeUnitNavigation)} in the model");
    }

    if (foodPlan.ServingSizeUnitNavigation.Category == null)
    {
      throw new Exception($"Please include {nameof(FoodPlan.ServingSizeUnitNavigation.Category)} in the model");
    }

    return new FoodResponse()
    {
      FdcId = foodPlan.Fdcid ?? 0,
      Id = foodPlan.Id,
      Description = foodPlan.Description,
      Note = foodPlan.Note ?? string.Empty,
      BrandName = foodPlan.BrandName ?? string.Empty,
      Ingredients = foodPlan.Ingredients ?? string.Empty,
      ServingSize = foodPlan.ServingSize,
      ServingSizeUnitCategory = foodPlan.ServingSizeUnitNavigation.Category.Description,
      ServingSizeUnit = foodPlan.ServingSizeUnitNavigation.Abbreviation,
      Unit = foodPlan.ServingSizeUnitNavigation.ToUnitOption(),
      ServingSizeWithUnits = $"{foodPlan.ServingSize} {foodPlan.ServingSizeUnitNavigation.Abbreviation}",
      FoodNutrients = foodPlan.FoodPlanNutrients.Select(fpn => fpn.ToFoodNutrient()).ToList(),
    };
  }
}
