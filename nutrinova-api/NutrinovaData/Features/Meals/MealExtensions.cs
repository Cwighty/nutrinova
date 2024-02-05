using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;
using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Meals;

public static class MealExtensions
{
  public static MealResponse ToMealResponse(this Meal meal)
  {
    return new MealResponse
    {
      Id = meal.Id,
      Description = meal.Description,
      Ingredients = meal.Ingredients,
      Amount = meal.Amount,
      Recordedby = meal.Recordedby,
      PatientId = meal.PatientId,
      Unit = meal.UnitNavigation.ToUnitOption(),
      RecordedAt = meal.Recordedat,
      UnitId = meal.Unit,
      Notes = meal.Notes,
      NutrientSummaries = meal.MealNutrients.ToNutrientSummaries(),
      PatientResponse = meal.Patient.ToPatientResponse(),
    };
  }

  public static List<MealResponse> ToMealResponses(this ICollection<Meal> meals)
  {
    return meals.Select(m => m.ToMealResponse()).ToList();
  }

  public static NutrientSummary ToNutrientSummary(this MealNutrient mealNutrient)
  {
    return new NutrientSummary
    {
      Amount = mealNutrient.Amount,
      NutrientId = mealNutrient.NutrientId,
      Name = mealNutrient.Nutrient?.Description,
      Unit = mealNutrient.Nutrient?.PreferredUnitNavigation?.ToUnitOption(),
    };
  }

  public static List<NutrientSummary> ToNutrientSummaries(this ICollection<MealNutrient> mealNutrients)
  {
    return mealNutrients.Select(mn => mn.ToNutrientSummary()).ToList();
  }

  public static IQueryable<Meal> IncludeMealResponseDetails(this IQueryable<Meal> meals)
  {
    return meals
      .Include(m => m.Patient)
        .ThenInclude(p => p.Customer)
      .Include(m => m.UnitNavigation)
        .ThenInclude(u => u.Category)
      .Include(m => m.MealNutrients)
        .ThenInclude(mn => mn.Nutrient)
          .ThenInclude(n => n.PreferredUnitNavigation)
            .ThenInclude(un => un.Category);
  }
}
