using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Goals;

public static class GoalExtensions
{
  public static IEnumerable<NutrientGoalResponse> ToResponseModels(this IEnumerable<PatientNutrientDailyGoal> goals)
  {
    return goals.Select(g => g.ToResponseModel());
  }

  public static NutrientGoalResponse ToResponseModel(this PatientNutrientDailyGoal goal)
  {
    return new NutrientGoalResponse
    {
      Id = goal.Id,
      NutrientId = goal.NutrientId,
      NutrientName = goal.Nutrient.Description,
      NutrientUnit = goal.Nutrient.PreferredUnitNavigation.ToUnitOption(),
      PatientId = goal.PatientId,
      PatientName = goal.Patient.GetFullName(),
      CustomUpperTarget = goal.CustomUpperTarget,
      CustomLowerTarget = goal.CustomLowerTarget,
      RecommendedUpperTarget = goal.RecommendedUpperTarget,
      RecommendedLowerTarget = goal.RecommendedLowerTarget,
      RecommendedMax = goal.RecommendedMax,
    };
  }

  public static IQueryable<PatientNutrientDailyGoal> IncludeAllGoalDependencies(this IQueryable<PatientNutrientDailyGoal> query)
  {
    return query
          .Include(g => g.Patient)
          .Include(g => g.Nutrient)
              .ThenInclude(n => n.PreferredUnitNavigation)
                  .ThenInclude(u => u.Category);
  }
}
