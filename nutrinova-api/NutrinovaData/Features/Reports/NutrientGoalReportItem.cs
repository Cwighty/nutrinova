namespace NutrinovaData.Features.Reports;

public class NutrientGoalReportItem
{
  public int NutrientId { get; set; }

  public string NutrientName { get; set; } = string.Empty;

  public UnitOption PreferredUnit { get; set; } = new UnitOption();

  public GoalTargetAmount CustomTargetAmount { get; set; } = default!;

  public GoalTargetAmount RecommendedTargetAmount { get; set; } = default!;

  public decimal ConsumedAmount { get; set; }

  public NutrientGoalStatus GoalStatus { get; set; } = default;
}

public enum NutrientGoalStatus
{
  NotStarted,
  NotMet,
  Met,
  Exceeded,
}
