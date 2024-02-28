namespace NutrinovaData.Features.Reports;

public class DailyNutrientGoalReport
{
  public DateTime Date { get; set; }

  public IEnumerable<NutrientGoalReportItem> NutrientGoalReportItems { get; set; } = new List<NutrientGoalReportItem>();
}
