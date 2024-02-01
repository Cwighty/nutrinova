namespace NutrinovaData.Features.Reports;

public class PatientNutrientGoalReport
{
  public string PatientName { get; set; } = string.Empty;

  public DateTime ReportBegin { get; set; }

  public DateTime ReportEnd { get; set; }

  public IEnumerable<NutrientGoalReportItem> NutrientGoalReportItems { get; set; } = new List<NutrientGoalReportItem>();
}
