using NutrinovaData.FlattenedResponseModels;

namespace NutrinovaData.ResponseModels;

public class FoodNutrient
{
    public int nutrientId { get; set; }

    public string nutrientName { get; set; }

    public string nutrientNumber { get; set; }

    public string unitName { get; set; }

    public string derivationCode { get; set; }

    public string derivationDescription { get; set; }

    public double value { get; set; }

    public bool IsPrimaryFoodNutrient()
    {
        return nutrientName == "Total lipid (fat)" || nutrientName == "Carbohydrate, by difference" || nutrientName == "Energy" || nutrientName == "Protein";
    }

    public FlattenedFoodNutrient MakeFlattenedFoodNutrient() => new FlattenedFoodNutrient(this);
}
