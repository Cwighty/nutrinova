namespace NutrinovaData.Features.Goals;

public class NutrientGoalResponse
{
  public Guid Id { get; set; }

  public Guid PatientId { get; set; }

  public string PatientName { get; set; } = string.Empty;

  public int NutrientId { get; set; }

  public string NutrientName { get; set; } = string.Empty;

  public UnitOption NutrientUnit { get; set; } = new UnitOption();

  public decimal DailyGoalAmount { get; set; }
}
