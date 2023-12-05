using NutrinovaData.Entities;
using NutrinovaData.Features.Recipes;

namespace NutrinovaData.Extensions;

public static class RecipeHistoryExtension
{
  public static RecipeHistoryResponse ToRecipeHistoryResponse(this RecipeHistory recipeHistory)
  {
    return new RecipeHistoryResponse
    {
      Id = recipeHistory.Id,
      Description = recipeHistory.Description,
      CreatedBy = recipeHistory.CreatedBy,
      CreatedAt = recipeHistory.CreatedAt,
      Notes = recipeHistory.Notes,
      RecipeFoodHistoryResponses = recipeHistory.RecipeFoodHistories.Select(x => x.ToRecipeFoodHistoryResponse()).ToList(),
    };
  }
}
