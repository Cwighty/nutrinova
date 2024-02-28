namespace NutrinovaData.Features.Reports;

public class PatientNutrientReport
{
  public string PatientId { get; set; } = string.Empty;

  public string PatientName { get; set; } = string.Empty;

  public int DaysAchievedCount { get; set; }

  public decimal MaxConsumption { get; set; }

  public decimal AvgConsumption { get; set; }

  public IEnumerable<DailyNutrientGoalReport> Days { get; set; } = default!;
}
