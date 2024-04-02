namespace NutrinovaData.Features.Meals;

public class RecordMealRequest
{
  public Guid PatientId { get; set; }

  public decimal Amount { get; set; }

  public DateTime RecordedAt { get; set; }

  public int UnitId { get; set; }

  public Guid SelectedMealItemId { get; set; }

  public string MealSelectionType { get; set; } = null!;
}

public enum MealSelectionItemType
{
  CustomFood,
  Recipe,
  USDAFood,
  ClonedMeal,
}
