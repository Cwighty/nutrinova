using NutrinovaData.Features.Recipes;

namespace NutrinovaData.Features.Meals;

public class MealRecipeHistoryResponse
{
  public Guid Id { get; set; }

  public Guid RecipeHistoryId { get; set; }

  public Guid MealHistoryId { get; set; }

  public decimal Amount { get; set; }

  public DateTime CreatedAt { get; set; }

  public int UnitId { get; set; }

  public virtual RecipeHistoryResponse RecipeHistoryResponse { get; set; } = null!;
}
