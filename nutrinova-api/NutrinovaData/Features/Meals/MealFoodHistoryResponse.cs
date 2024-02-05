using NutrinovaData.Features.Foods;

namespace NutrinovaData.Features.Meals;

public class MealFoodHistoryResponse
{
  public Guid Id { get; set; }

  public Guid MealHistoryId { get; set; }

  public Guid FoodId { get; set; }

  public decimal? Amount { get; set; }

  public virtual FoodHistoryResponse FoodResponse { get; set; } = null!;
}
