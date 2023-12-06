using NutrinovaData.Entities;
using NutrinovaData.Features.Foods;

namespace NutrinovaData.Features.Recipes;

public static class RecipeHistoryExtension
{
  public static RecipeHistoryResponse ToRecipeHistoryResponse(this RecipeHistory recipeHistory)
  {
    return new RecipeHistoryResponse
    {
      Id = recipeHistory.Id,
      Description = recipeHistory.Description,
      Tags = recipeHistory.Tags,
      Notes = recipeHistory.Notes,
      Amount = recipeHistory.Amount,
      ServingSizeUnit = recipeHistory.ServingSizeUnit,
      CreatedBy = recipeHistory.CreatedBy,
      CreatedAt = recipeHistory.CreatedAt,
      FoodHistoryResponses = recipeHistory.RecipeFoodHistories.Select(x => x.Food.ToFoodHistoryResponse()).ToList(),
    };
  }
}
