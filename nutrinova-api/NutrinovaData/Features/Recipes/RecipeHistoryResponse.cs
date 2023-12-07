using NutrinovaData.Features.Foods;

namespace NutrinovaData.Features.Recipes;

public class RecipeHistoryResponse
{
  public Guid Id { get; set; }

  public string? Description { get; set; }

  public string? Tags { get; set; }

  public string? Notes { get; set; }

  public decimal Amount { get; set; }

  public int ServingSizeUnit { get; set; }

  public DateTime CreatedAt { get; set; }

  public Guid? CreatedBy { get; set; }

  public List<FoodHistoryResponse> FoodHistoryResponses { get; set; } = null!;
}
