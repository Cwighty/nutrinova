using NutrinovaData.Features.Foods;

namespace NutrinovaData.Features.Recipes;

public class RecipeFoodHistoryResponse
{
  public Guid Id { get; set; }

  public Guid RecipeHistoryId { get; set; }

  public Guid FoodHistoryId { get; set; }

  public decimal Amount { get; set; }

  public DateTime CreatedAt { get; set; }

  public int UnitId { get; set; }

  public virtual FoodHistoryResponse FoodHistoryResponse { get; set; } = null!;
}
