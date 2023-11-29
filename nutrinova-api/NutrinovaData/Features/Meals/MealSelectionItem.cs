namespace NutrinovaData.Features.Meals;

public class MealSelectionItem
{
  // Everything Recipies and Foods And USda foods have in common
  public Guid Id { get; set; }

  public int? Fdcid { get; set; }

  public string Description { get; set; } = null!;

  public decimal ServingSize { get; set; }

  public string? ServingSizeUnit { get; set; }

  public string? Note { get; set; }

  public string Type { get; set; } = null!;
}
