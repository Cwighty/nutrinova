using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class RecipeFoodExtension
{
  public static Food ToFood(this RecipeFood recipeFood)
  {
    return new Food
    {
      id = recipeFood.FoodId,
      description = recipeFood.Food.Description,
      ingredients = recipeFood.Food.Ingredients ?? string.Empty,
      note = recipeFood.Food.Note ?? string.Empty,
      unitId = recipeFood.UnitId,
      servingSize = recipeFood.Food.ServingSize,
      servingSizeUnit = recipeFood.Food.ServingSizeUnitNavigation.Abbreviation,
    };
  }
}
