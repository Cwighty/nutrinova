using NutrinovaData.Entities;
using NutrinovaData.FlattenedResponseModels;

namespace NutrinovaData.Extensions;

public static class FoodPlansExtension
{
    public static FlattenedFood ToFlattenedFood(this FoodPlan foodPlan)
    {
        return new FlattenedFood(foodPlan);
    }
}
