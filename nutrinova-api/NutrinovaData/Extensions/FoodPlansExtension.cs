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

  public static Food ToFood(this FoodPlan foodPlan)
  {
    if (foodPlan.ServingSizeUnitNavigation == null)
    {
      throw new Exception($"Please include {nameof(FoodPlan.ServingSizeUnitNavigation)} in the model");
    }

    if (foodPlan.ServingSizeUnitNavigation.Category == null)
    {
      throw new Exception($"Please include {nameof(FoodPlan.ServingSizeUnitNavigation.Category)} in the model");
    }

    return new Food()
    {
      fdcId = foodPlan.Fdcid ?? 0,
      id = foodPlan.Id,
      description = foodPlan.Description,
      note = foodPlan.Note ?? string.Empty,
      brandName = foodPlan.BrandName ?? string.Empty,
      ingredients = foodPlan.Ingredients ?? string.Empty,
      servingSize = foodPlan.ServingSize,
      servingSizeUnitCategory = foodPlan.ServingSizeUnitNavigation.Category.Description,
      servingSizeUnit = foodPlan.ServingSizeUnitNavigation.Abbreviation,
      unit = foodPlan.ServingSizeUnitNavigation.ToUnitOption(),
      servingSizeWithUnits = $"{foodPlan.ServingSize} {foodPlan.ServingSizeUnitNavigation.Abbreviation}",
      foodNutrients = foodPlan.FoodPlanNutrients.Select(fpn => fpn.ToFoodNutrient()).ToList(),
    };
  }
}
