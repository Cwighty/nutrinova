namespace NutrinovaData.Features.Reports;

public class AggregatePatientNutrientReport
{
  public DateTime BeginDate { get; set; }

  public DateTime EndDate { get; set; }

  public int DaysCount { get; set; }

  public IEnumerable<PatientNutrientReport> PatientReports { get; set; } = new List<PatientNutrientReport>();
}
