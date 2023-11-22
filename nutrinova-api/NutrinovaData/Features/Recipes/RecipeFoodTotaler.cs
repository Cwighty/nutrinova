using NutrinovaData.Entities;
using NutrinovaData.Features.Units;

namespace NutrinovaData.Features.Recipes;

public class RecipeFoodTotaler : IRecipeFoodTotaler
{
  private readonly IUnitConverter unitConverter;

  public RecipeFoodTotaler(IUnitConverter unitConverter)
  {
    this.unitConverter = unitConverter;
  }

  public List<NutrientSummary> GetNutrientSummaries(List<RecipeFood> recipeFoods)
  {
    var nutrientSummaries = new Dictionary<int, NutrientSummary>();
    foreach (var recipeFood in recipeFoods)
    {
      foreach (var nutrient in recipeFood.Food.FoodPlanNutrients)
      {
        if (!nutrientSummaries.ContainsKey(nutrient.NutrientId))
        {
          nutrientSummaries.Add(nutrient.NutrientId, new NutrientSummary
          {
            Name = nutrient.Nutrient.Description,
            Amount = nutrient.Amount * unitConverter.Convert(recipeFood.Amount, recipeFood.Unit, recipeFood.Food.ServingSizeUnitNavigation),
            Unit = nutrient.Unit,
          });
        }
        else
        {
          nutrientSummaries[nutrient.NutrientId].Amount += nutrient.Amount * unitConverter.Convert(recipeFood.Amount, recipeFood.Unit, recipeFood.Food.ServingSizeUnitNavigation);
        }
      }
    }

    return nutrientSummaries.Values.ToList();
  }
}
