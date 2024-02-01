namespace NutrinovaData.Features.Goals;

public class NutrientGoalReportItem
{
  public int NutrientId { get; set; }

  public string NutrientName { get; set; } = string.Empty;

  public UnitOption PrefferedUnit { get; set; } = new UnitOption();

  public decimal DailyGoalAmount { get; set; }

  public decimal ConsumedAmount { get; set; }

  public decimal RemainingAmount { get; set; }

  public string GoalStatus { get; set; } = string.Empty;
}
