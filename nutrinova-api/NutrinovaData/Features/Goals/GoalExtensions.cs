using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Goals;

public static class GoalExtensions
{
  public static IEnumerable<PatientNutrientGoalResponse> ToResponseModels(this IEnumerable<PatientNutrientGoal> goals)
  {
    return goals.Select(g => g.ToResponseModel());
  }

  public static PatientNutrientGoalResponse ToResponseModel(this PatientNutrientGoal goal)
  {
    return new PatientNutrientGoalResponse
    {
      Id = goal.Id,
      NutrientId = goal.NutrientId,
      NutrientName = goal.Nutrient.Description,
      DailyGoalAmount = goal.DailyGoalAmount,
      NutrientUnit = goal.Nutrient.PreferredUnitNavigation.ToUnitOption(),
      PatientId = goal.PatientId,
      PatientName = goal.Patient.GetFullName(),
    };
  }
}
