using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFoodNutrient
{
    public string? NutrientName { get; set; }

    public string? NameWithAmountAndUnit { get; set; }

    public string? UnitName { get; set; }

    public double Value { get; set; }

    public FlattenedFoodNutrient(FoodPlanNutrient fpn)
    {
        this.NameWithAmountAndUnit = $"{fpn.Nutrient.NutrientName}: {fpn.Amount} {fpn?.Unit?.UnitName}";

        this.UnitName = fpn?.Unit?.UnitName;

        this.Value = decimal.ToDouble(fpn?.Amount ?? 0);

        this.NutrientName = fpn?.Nutrient.NutrientName;
    }

    public FlattenedFoodNutrient(FoodNutrient foodNutrient)
    {
        this.NameWithAmountAndUnit = $"{foodNutrient.nutrientName}: {foodNutrient.value} {foodNutrient.unitName}";

        this.UnitName = foodNutrient.unitName;

        this.Value = foodNutrient.value;

        this.NutrientName = foodNutrient.nutrientName;
    }
}
