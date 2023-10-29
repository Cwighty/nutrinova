using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFoodNutrient
{
    public string NutrientName { get; set; }

    public string NameWithAmountAndUnit { get; set; }

    public string UnitName { get; set; }

    public double Value { get; set; }

    public FlattenedFoodNutrient(FoodNutrient foodNutrient)
    {
        this.NameWithAmountAndUnit = $"{foodNutrient.nutrientName}: {foodNutrient.value} {foodNutrient.unitName}";

        this.UnitName = foodNutrient.unitName;

        this.Value = foodNutrient.value;

        this.NutrientName = foodNutrient.nutrientName;
    }
}
