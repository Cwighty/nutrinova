namespace NutrinovaData.Features.Meals;

public class RecordMealRequest
{
  public Guid PatientId { get; set; }

  public decimal Amount { get; set; }

  public DateOnly RecordedDate { get; set; }

  public int UnitId { get; set; }

  public Guid SelectedMealItemId { get; set; }

  public MealType MealTypeRaw { get; set; }
}

public enum MealType
{
  CustomFood,
  Recipe,
  USDAFood,
}
