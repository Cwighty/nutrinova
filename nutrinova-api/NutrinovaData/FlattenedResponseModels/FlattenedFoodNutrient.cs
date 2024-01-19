using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFoodNutrient
{
  public string? NutrientName { get; set; }

  public string? NameWithAmountAndUnit { get; set; }

  public string? UnitName { get; set; }

  public decimal? Value { get; set; }

  public double? UnitId { get; set; }

  public double? UnitCategoryId { get; set; }

  public FlattenedFoodNutrient()
  {
  }

  public FlattenedFoodNutrient(FoodPlanNutrient fpn)
  {
    NameWithAmountAndUnit = $"{fpn.Nutrient.Description}: {fpn.Amount} {fpn?.Unit?.Description}";
    UnitName = fpn?.Unit?.Description;
    NutrientName = fpn?.Nutrient.Description;
    Value = fpn?.Amount;
    UnitId = fpn?.UnitId;
    UnitCategoryId = fpn?.Unit?.CategoryId;
  }

  public FlattenedFoodNutrient(FoodNutrient foodNutrient)
  {
    NameWithAmountAndUnit = $"{foodNutrient.nutrientName}: {foodNutrient.value} {foodNutrient.unitName}";

    UnitName = foodNutrient.unitName;

    Value = foodNutrient.value;

    NutrientName = foodNutrient.nutrientName;

    UnitId = foodNutrient?.unitId;

    UnitCategoryId = foodNutrient?.UnitCategoryId;
  }
}
