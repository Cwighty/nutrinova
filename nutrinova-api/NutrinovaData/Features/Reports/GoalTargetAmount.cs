namespace NutrinovaData.Features.Reports;

public class GoalTargetAmount
{
  public decimal? LowerLimit { get; set; }

  public decimal? UpperLimit { get; set; }

  public decimal? MaxLimit { get; set; }

  public string Type { get; set; } = string.Empty;
}
