using NutrinovaData.Entities;

public static class FoodTotaler
{
    public static List<NutrientSummary> GetNutrientSummaries(List<FoodPlan> foodPlans)
    {
        var nutrientSummaries = new Dictionary<int, NutrientSummary>();
        foreach (var foodPlan in foodPlans)
        {
            var food = foodPlan;
            foreach (var nutrient in food.FoodPlanNutrients)
            {
                if (!nutrientSummaries.ContainsKey(nutrient.NutrientId))
                {
                    nutrientSummaries.Add(nutrient.NutrientId, new NutrientSummary
                    {
                        Name = nutrient.Nutrient.NutrientName,
                        Amount = nutrient.Amount,
                        Unit = nutrient.Unit,
                    });
                }
                else
                {
                    nutrientSummaries[nutrient.NutrientId].Amount += nutrient.Amount;
                }
            }
        }

        return nutrientSummaries.Values.ToList();
    }
}
