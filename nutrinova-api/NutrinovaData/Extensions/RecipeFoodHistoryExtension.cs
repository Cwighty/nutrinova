using NutrinovaData.Entities;
using NutrinovaData.Features.Recipes;

namespace NutrinovaData.Extensions;

public static class RecipeFoodHistoryExtension
{
    public static RecipeFoodHistoryResponse ToRecipeFoodHistoryResponse(this RecipeFoodHistory recipeFoodHistory)
    {
        return new RecipeFoodHistoryResponse
        {
            Id = recipeFoodHistory.Id,
            RecipeHistoryId = recipeFoodHistory.RecipeId,
            FoodHistoryId = recipeFoodHistory.FoodId,
            Amount = recipeFoodHistory.Amount,
            UnitId = recipeFoodHistory.UnitId,
            FoodHistoryResponse = recipeFoodHistory.Food.ToFoodHistoryResponse(),
        };
    }
}
