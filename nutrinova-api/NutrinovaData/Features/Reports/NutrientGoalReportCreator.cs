using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Reports;

public class NutrientGoalReportCreator : INutrientGoalReportCreator
{
  public NutrientGoalReportCreator()
  {
  }

  public PatientNutrientReport CreateNutrientGoalReportForPatient(Patient patientWithMealsAndGoals, DateTime beginDate, DateTime endDate)
  {
    ValidateParameters(patientWithMealsAndGoals, beginDate, endDate);

    var days = new List<DateTime>();
    for (var date = beginDate; date <= endDate; date = date.AddDays(1))
    {
      days.Add(date);
    }

    var dailyReports = new List<DailyNutrientGoalReport>();

    foreach (var day in days)
    {
      var dailyReport = CreateNutrientGoalReportItems(patientWithMealsAndGoals, day.Date, day.AddDays(1).AddSeconds(-1));
      var dayReport = new DailyNutrientGoalReport
      {
        Date = day,
        NutrientGoalReportItems = dailyReport,
      };

      dailyReports.Add(dayReport);
    }

    var report = new PatientNutrientReport()
    {
      PatientId = patientWithMealsAndGoals.Id.ToString(),
      PatientName = patientWithMealsAndGoals.GetFullName(),
      Days = dailyReports,
      MaxConsumption = dailyReports.Max(d => d.NutrientGoalReportItems.Max(n => n.ConsumedAmount)),
      AvgConsumption = dailyReports.Average(d => d.NutrientGoalReportItems.Average(n => n.ConsumedAmount)),
      DaysAchievedCount = dailyReports.Count(d => d.NutrientGoalReportItems.All(n => n.GoalStatus == NutrientGoalStatus.Met)),
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

    if (patientWithMealsAndGoals.PatientNutrientDailyGoals == null)
    {
      throw new ArgumentNullException(nameof(patientWithMealsAndGoals.PatientNutrientDailyGoals) + " is required");
    }
  }

  private IEnumerable<NutrientGoalReportItem> CreateNutrientGoalReportItems(Patient p, DateTime beginDate, DateTime endDate)
  {
    // Aggregate eached consumed nutrient from meals with corresponding nutrient goals
    var mealsInDateRange = p.Meals
      .Where(m => m.Recordedat >= beginDate && m.Recordedat <= endDate)
      .ToList();
    Dictionary<int, NutrientSummary> consumedNutrientSummaries = GetConsumedNutrientTotals(mealsInDateRange);

    var nutrientGoals = p.PatientNutrientDailyGoals.ToList();
    var reportItems = nutrientGoals
    .GroupJoin(
      consumedNutrientSummaries,
      g => g.NutrientId,
      n => n.Key,
      (g, nGroup) => new { g, nGroup })
    .SelectMany(
        x => x.nGroup.DefaultIfEmpty(),
        (x, n) => new NutrientGoalReportItem
        {
          NutrientId = x.g.NutrientId,
          NutrientName = x.g.Nutrient.Description,
          PreferredUnit = x.g.Nutrient.PreferredUnitNavigation.ToUnitOption(),
          CustomTargetAmount = new GoalTargetAmount
          {
            UpperLimit = x.g.CustomUpperTarget,
            LowerLimit = x.g.CustomLowerTarget,
          },
          RecommendedTargetAmount = new GoalTargetAmount
          {
            UpperLimit = x.g.RecommendedUpperTarget,
            LowerLimit = x.g.RecommendedLowerTarget,
            MaxLimit = x.g.RecommendedMax,
          },
          ConsumedAmount = n.Value != null ? n.Value.Amount : 0,
          GoalStatus = CalculateGoalStatus(n.Value != null ? n.Value.Amount : 0, new GoalTargetAmount
          {
            LowerLimit = x.g.CustomLowerTarget,
            UpperLimit = x.g.CustomUpperTarget,
            MaxLimit = x.g.RecommendedMax,
          }),
        });

    return reportItems;
  }

  private NutrientGoalStatus CalculateGoalStatus(decimal consumedAmount, GoalTargetAmount targetAmount)
  {
    if (consumedAmount == 0)
    {
      return NutrientGoalStatus.NotStarted;
    }

    if (targetAmount.LowerLimit != null && targetAmount.UpperLimit != null)
    {
      // range
      if (consumedAmount < targetAmount.LowerLimit)
      {
        return NutrientGoalStatus.NotMet;
      }

      if (consumedAmount > targetAmount.UpperLimit)
      {
        return NutrientGoalStatus.Exceeded;
      }

      return NutrientGoalStatus.Met;
    }

    if (targetAmount.LowerLimit != null && targetAmount.UpperLimit == null)
    {
      // RDA
      if (consumedAmount < targetAmount.LowerLimit)
      {
        return NutrientGoalStatus.NotMet;
      }

      if (consumedAmount > targetAmount.LowerLimit)
      {
        return NutrientGoalStatus.Met;
      }

      if (consumedAmount > targetAmount.MaxLimit)
      {
        return NutrientGoalStatus.Exceeded;
      }
    }

    if (targetAmount.LowerLimit == null && targetAmount.UpperLimit != null)
    {
      // UL
      if (consumedAmount < targetAmount.UpperLimit)
      {
        return NutrientGoalStatus.Met;
      }
    }

    return NutrientGoalStatus.NotMet;
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
