using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFoodNutrient
{
  public string? NutrientName { get; set; }

  public string? NameWithAmountAndUnit { get; set; }

  public string? UnitName { get; set; }

  public double Value { get; set; }

  public double? UnitId { get; set; }

  public FlattenedFoodNutrient()
  {
  }

  public FlattenedFoodNutrient(FoodPlanNutrient fpn)
  {
    this.NameWithAmountAndUnit = $"{fpn.Nutrient.NutrientName}: {fpn.Amount} {fpn?.Unit?.Description}";

    this.UnitName = fpn?.Unit?.Description;

    this.Value = decimal.ToDouble(fpn?.Amount ?? 0);

    this.NutrientName = fpn?.Nutrient.NutrientName;

    this.UnitId = fpn?.UnitId;
  }

  public FlattenedFoodNutrient(FoodNutrient foodNutrient)
  {
    this.NameWithAmountAndUnit = $"{foodNutrient.nutrientName}: {foodNutrient.value} {foodNutrient.unitName}";

    this.UnitName = foodNutrient.unitName;

    this.Value = foodNutrient.value;

    this.NutrientName = foodNutrient.nutrientName;

    this.UnitId = foodNutrient?.unitId;
  }
}
