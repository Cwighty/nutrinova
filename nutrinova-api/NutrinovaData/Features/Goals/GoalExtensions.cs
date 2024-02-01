using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Goals;

public static class GoalExtensions
{
  public static IEnumerable<NutrientGoalResponse> ToResponseModels(this IEnumerable<PatientNutrientGoal> goals)
  {
    return goals.Select(g => g.ToResponseModel());
  }

  public static NutrientGoalResponse ToResponseModel(this PatientNutrientGoal goal)
  {
    return new NutrientGoalResponse
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

  public static IQueryable<PatientNutrientGoal> IncludeAllGoalDependencies(this IQueryable<PatientNutrientGoal> query)
  {
    return query
          .Include(g => g.Patient)
          .Include(g => g.Nutrient)
              .ThenInclude(n => n.PreferredUnitNavigation)
                  .ThenInclude(u => u.Category);
  }
}
