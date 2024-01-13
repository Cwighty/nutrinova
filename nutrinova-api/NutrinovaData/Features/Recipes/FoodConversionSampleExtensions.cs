using NutrinovaData.Entities;

namespace NutrinovaData.Features.Recipes;

public static class FoodConversionSampleExtensions
{
  public static FoodConversionSample? GetMatchingFoodConversionSample(this List<FoodConversionSample> foodConversionSamples, Guid foodPlanId, int measurementUnitId)
  {
    return foodConversionSamples
      .FirstOrDefault(fms => fms.FoodPlanId == foodPlanId && fms.MeasurementUnit.Id == measurementUnitId);
  }
}
