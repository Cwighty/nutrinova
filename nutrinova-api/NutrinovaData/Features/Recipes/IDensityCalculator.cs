using NutrinovaData.Entities;

namespace NutrinovaData.Features.Recipes;

public interface IDensityCalculator
{
  /// <summary>
  /// Calculates the density in g/ml given a food serving unit and a measurement unit and the food servings per measurement.
  /// </summary>
  /// <param name="foodServingsPerMeasurement">The number of food servings per measurement.</param>
  /// <param name="foodServingUnit">The unit of the food.</param>
  /// <param name="measurementUnit">The unit of the ingredient.</param>
  /// <returns>The calculated density in g/ml.</returns>
  decimal? CalculateDensity(decimal? foodServingsPerMeasurement, Unit foodServingUnit, Unit measurementUnit);
}
