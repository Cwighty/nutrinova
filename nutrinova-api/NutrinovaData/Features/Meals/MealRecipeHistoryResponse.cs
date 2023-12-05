using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Features.Meals;

public class MealRecipeHistoryResponse
{
  public Guid Id { get; set; }

  public Guid MealHistoryId { get; set; }

  public Guid RecipeId { get; set; }

  public decimal Amount { get; set; }

  public virtual RecipeResponseModel RecipeResponseModel { get; set; } = null!;
}
