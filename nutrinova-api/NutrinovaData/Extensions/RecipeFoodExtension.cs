using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class RecipeFoodExtension
{
  public static Food ToFood(this RecipeFood recipeFood)
  {
    Console.WriteLine($"recipeFood.FoodId: {recipeFood.FoodId}");
    return new Food
    {
      id = recipeFood.FoodId,
      description = recipeFood.Food.Description,
      ingredients = recipeFood.Food.Ingredients ?? string.Empty,
      note = recipeFood.Food.Note ?? string.Empty,
      unitId = recipeFood.UnitId,
      servingSize = recipeFood.Amount,
      unit = recipeFood.Unit.ToUnitOption(),
      servingSizeUnit = recipeFood.Unit.Abbreviation,
    };
  }
}
