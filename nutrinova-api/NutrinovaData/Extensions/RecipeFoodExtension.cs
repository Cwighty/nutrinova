using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class RecipeFoodExtension
{
  public static FoodResponse ToFood(this RecipeFood recipeFood)
  {
    return new FoodResponse
    {
      Id = recipeFood.FoodId,
      Description = recipeFood.Food.Description,
      Ingredients = recipeFood.Food.Ingredients ?? string.Empty,
      Note = recipeFood.Food.Note ?? string.Empty,
      UnitId = recipeFood.UnitId,
      ServingSize = recipeFood.Amount,
      Unit = recipeFood.Unit.ToUnitOption(),
      ServingSizeUnit = recipeFood.Unit.Abbreviation,
    };
  }
}
