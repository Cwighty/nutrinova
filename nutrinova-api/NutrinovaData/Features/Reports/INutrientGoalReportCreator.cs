using NutrinovaData.Entities;

namespace NutrinovaData.Features.Reports;

public interface INutrientGoalReportCreator
{
  PatientNutrientGoalReport CreateNutrientGoalReportForPatient(Patient patientWithMealsAndGoals, DateTime beginDate, DateTime endDate);
}
