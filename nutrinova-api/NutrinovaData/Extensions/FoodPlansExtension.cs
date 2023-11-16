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
    return new Food()
    {
      fdcId = foodPlan.Fdcid ?? 0,
      id = foodPlan.Id.ToString(),
      description = foodPlan.Description,
      note = foodPlan.Note ?? string.Empty,
      brandName = foodPlan.BrandName ?? string.Empty,
      ingredients = foodPlan.Ingredients ?? string.Empty,
      servingSize = foodPlan.ServingSize ?? 0,

      servingSizeUnit = foodPlan.ServingSizeUnitNavigation.Abreviation,
      servingSizeWithUnits = $"{foodPlan.ServingSize} {foodPlan.ServingSizeUnitNavigation.Abreviation}",
      foodNutrients = foodPlan.FoodPlanNutrients.Select(fpn => fpn.ToFoodNutrient()).ToList(),
    };
  }
}
