using NutrinovaData.Entities;
using NutrinovaData.Features.Units;

namespace NutrinovaData.Features.Recipes;

public class DensityCalculator : IDensityCalculator
{
  private IUnitConverter unitConverter;

  public DensityCalculator(IUnitConverter unitConverter)
  {
    this.unitConverter = unitConverter;
  }

  /// <summary>
  /// Calculates the density in g/ml given a food serving unit and a measurement unit and the food servings per measurement.
  /// </summary>
  /// <param name="foodServingsPerMeasurement">The number of food servings per measurement.</param>
  /// <param name="foodServingUnit">The unit of the food.</param>
  /// <param name="measurementUnit">The unit of the ingredient.</param>
  /// <returns>The calculated density in g/ml.</returns>
  public decimal? CalculateDensity(decimal? foodServingsPerMeasurement, Unit foodServingUnit, Unit measurementUnit)
  {
    if (measurementUnit == null || foodServingUnit == null || foodServingsPerMeasurement == null)
    {
      return null;
    }

    if (foodServingUnit.Category == null || measurementUnit.Category == null)
    {
      throw new Exception("Unit category is required");
    }

    decimal? density = null;

    var gramUnit = new Unit { Category = new UnitCategory { Description = "Mass" }, Description = "gram" };
    var milliliterUnit = new Unit { Category = new UnitCategory { Description = "Volume" }, Description = "milliliter" };

    if (foodServingsPerMeasurement.HasValue)
    {
      if (foodServingUnit.Category.Description == "Volume" && measurementUnit.Category.Description == "Mass")
      {
        var servingsInMl = unitConverter.Convert(foodServingsPerMeasurement.Value, foodServingUnit, milliliterUnit);
        var massInG = unitConverter.Convert(1, measurementUnit, gramUnit);
        density = massInG / servingsInMl;
      }
      else if (foodServingUnit.Category.Description == "Mass" && measurementUnit.Category.Description == "Volume")
      {
        var servingsInG = unitConverter.Convert(foodServingsPerMeasurement.Value, foodServingUnit, gramUnit);
        var volumeInMl = unitConverter.Convert(1, measurementUnit, milliliterUnit);
        density = servingsInG / volumeInMl;
      }
      else
      {
        throw new Exception("Invalid unit conversion");
      }
    }

    return density;
  }
}
