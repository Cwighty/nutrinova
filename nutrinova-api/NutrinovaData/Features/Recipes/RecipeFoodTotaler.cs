using NutrinovaData.Entities;
using NutrinovaData.Extensions;
using NutrinovaData.Features.Units;

namespace NutrinovaData.Features.Recipes;

public class RecipeFoodTotaler : IRecipeFoodTotaler
{
  private readonly IUnitConverter unitConverter;

  public RecipeFoodTotaler(IUnitConverter unitConverter)
  {
    this.unitConverter = unitConverter;
  }

  public List<NutrientSummary> GetRecipeNutrientSummaries(List<RecipeFood> recipeFoods, List<FoodConversionSample> foodMeasurementSamples)
  {
    var nutrientSummaries = new Dictionary<int, NutrientSummary>();
    foreach (var recipeFood in recipeFoods)
    {
      foreach (var foodNutrient in recipeFood.Food.FoodPlanNutrients)
      {
        var foodServingUnit = recipeFood.Food.ServingSizeUnitNavigation;
        var recipeFoodUnit = recipeFood.Unit;

        var requiresFoodConversionSample = !(foodServingUnit.Category == recipeFoodUnit.Category);

        var foodConversionSample = foodMeasurementSamples
          .FirstOrDefault(fms => fms.FoodPlanId == recipeFood.FoodId && fms.MeasurementUnit.Category == recipeFoodUnit.Category);

        decimal foodNutrientAmountInRecipeFood = 0;
        var amountPerSingleFoodUnit = foodNutrient.GetNutrientAmountPerFoodServingUnit();

        if (!requiresFoodConversionSample)
        {
          foodNutrientAmountInRecipeFood = amountPerSingleFoodUnit.Amount * unitConverter.Convert(1, recipeFoodUnit, foodServingUnit) * recipeFood.Amount;
        }
        else if (foodConversionSample != null)
        {
          foodNutrientAmountInRecipeFood = amountPerSingleFoodUnit.Amount * foodConversionSample.FoodServingsPerMeasurement * recipeFood.Amount;
        }
        else
        {
          nutrientSummaries.TryAdd(foodNutrient.NutrientId, new NutrientSummary
          {
            Name = foodNutrient.Nutrient.Description + " (Could not calculate)",
            Amount = 0,
            Unit = foodServingUnit.ToUnitOption(),
          });
        }

        AggregateSameNutrients(nutrientSummaries, foodNutrient, foodNutrientAmountInRecipeFood);
      }
    }

    return nutrientSummaries.Values.ToList();
  }

  private static void AggregateSameNutrients(Dictionary<int, NutrientSummary> nutrientSummaries, FoodPlanNutrient foodNutrient, decimal foodNutrientAmountInRecipeFood)
  {
    if (nutrientSummaries.ContainsKey(foodNutrient.NutrientId))
    {
      nutrientSummaries[foodNutrient.NutrientId].Amount += foodNutrientAmountInRecipeFood;
    }
    else
    {
      nutrientSummaries.Add(foodNutrient.NutrientId, new NutrientSummary
      {
        Name = foodNutrient.Nutrient.Description,
        Amount = foodNutrientAmountInRecipeFood,
        Unit = foodNutrient.Unit.ToUnitOption(),
      });
    }
  }
}
