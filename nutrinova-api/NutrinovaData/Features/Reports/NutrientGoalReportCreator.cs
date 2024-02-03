using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Reports;

public class NutrientGoalReportCreator : INutrientGoalReportCreator
{
  public NutrientGoalReportCreator()
  {
  }

  public PatientNutrientGoalReport CreateNutrientGoalReportForPatient(Patient patientWithMealsAndGoals, DateTime beginDate, DateTime endDate)
  {
    ValidateParameters(patientWithMealsAndGoals, beginDate, endDate);

    var reportItems = CreateNutrientGoalReportItems(patientWithMealsAndGoals, beginDate, endDate);
    var report = new PatientNutrientGoalReport()
    {
      ReportBegin = beginDate,
      ReportEnd = endDate,
      PatientName = patientWithMealsAndGoals.GetFullName(),
      NutrientGoalReportItems = reportItems,
    };
    return report;
  }

  private void ValidateParameters(Patient patientWithMealsAndGoals, DateTime beginDate, DateTime endDate)
  {
    if (patientWithMealsAndGoals == null)
    {
      throw new ArgumentNullException(nameof(patientWithMealsAndGoals));
    }

    if (beginDate > endDate)
    {
      throw new ArgumentException("Begin date must be before end date");
    }

    if (patientWithMealsAndGoals.Meals == null)
    {
      throw new ArgumentNullException(nameof(patientWithMealsAndGoals.Meals) + " is required");
    }

    if (patientWithMealsAndGoals.PatientNutrientGoals == null)
    {
      throw new ArgumentNullException(nameof(patientWithMealsAndGoals.PatientNutrientGoals) + " is required");
    }
  }

  private IEnumerable<NutrientGoalReportItem> CreateNutrientGoalReportItems(Patient p, DateTime beginDate, DateTime endDate)
  {
    // Aggregate eached consumed nutrient from meals with corresponding nutrient goals
    var mealsInDateRange = p.Meals
      .Where(m => m.Recordedat >= beginDate && m.Recordedat <= endDate)
      .ToList();
    Dictionary<int, NutrientSummary> consumedNutrientSummaries = GetConsumedNutrientTotals(mealsInDateRange);

    var nutrientGoals = p.PatientNutrientGoals.ToList();
    var reportItems = consumedNutrientSummaries
      .Join(nutrientGoals, n => n.Key, g => g.NutrientId, (n, g) => new { n, g })
      .Select(ng => new NutrientGoalReportItem
      {
        NutrientId = ng.n.Key,
        NutrientName = ng.n.Value.Name!,
        PreferredUnit = ng.n.Value.Unit!,
        DailyGoalAmount = ng.g.DailyGoalAmount,
        ConsumedAmount = ng.n.Value.Amount,
        RemainingAmount = ng.g.DailyGoalAmount - ng.n.Value.Amount,
        GoalStatus = ng.n.Value.Amount >= ng.g.DailyGoalAmount * 1.1M
          ? NutrientGoalStatus.Exceeded
          : ng.n.Value.Amount >= ng.g.DailyGoalAmount
            ? NutrientGoalStatus.Met
            : NutrientGoalStatus.NotMet,
      });

    return reportItems;
  }

  private Dictionary<int, NutrientSummary> GetConsumedNutrientTotals(List<Meal> meals)
  {
    var consumedNutrientSummaries = new Dictionary<int, NutrientSummary>();
    foreach (var meal in meals)
    {
      foreach (var mealNutrient in meal.MealNutrients)
      {
        AggregateMealNutrient(consumedNutrientSummaries, mealNutrient);
      }
    }

    return consumedNutrientSummaries;
  }

  private void AggregateMealNutrient(Dictionary<int, NutrientSummary> nutrientSummaries, MealNutrient mealNutrient)
  {
    if (nutrientSummaries.TryGetValue(mealNutrient.NutrientId, out NutrientSummary? value))
    {
      value.Amount += mealNutrient.Amount;
    }
    else
    {
      nutrientSummaries.Add(mealNutrient.NutrientId, new NutrientSummary
      {
        NutrientId = mealNutrient.NutrientId,
        Name = mealNutrient.Nutrient.Description,
        Amount = mealNutrient.Amount,
        Unit = mealNutrient.Nutrient.PreferredUnitNavigation.ToUnitOption(),
      });
    }
  }
}
