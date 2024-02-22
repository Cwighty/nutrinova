using NutrinovaData.Entities;

namespace NutrinovaData.Features.Reports;

public interface INutrientGoalReportCreator
{
  PatientNutrientReport CreateNutrientGoalReportForPatient(Patient patientWithMealsAndGoals, DateTime beginDate, DateTime endDate);
}
