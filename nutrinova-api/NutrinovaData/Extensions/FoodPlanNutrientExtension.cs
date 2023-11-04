using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;

namespace NutrinovaData.Extensions;

public static class FoodPlanNutrientExtension
{
    public static FlattenedFoodNutrient ToFlattenedFoodNutrient(this FoodPlanNutrient foodPlanNutrient)
    {
        return new FlattenedFoodNutrient(foodPlanNutrient);
    }
}
