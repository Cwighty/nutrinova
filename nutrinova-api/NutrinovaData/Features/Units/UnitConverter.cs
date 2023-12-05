using NutrinovaData.Entities;

namespace NutrinovaData.Features.Units;

public class UnitConverter : IUnitConverter
{
  private static Dictionary<string, decimal> weightConversions = new Dictionary<string, decimal>
    {
        { "gram", 1 }, // base unit for weight is grams
        { "kilogram", 1000 },
        { "milligram", 0.001M },
        { "microgram", 0.000001M },
        { "ounce", 28.3495M },
        { "pound", 453.592M },
    };

  private static Dictionary<string, decimal> volumeConversions = new Dictionary<string, decimal>
    {
        { "milliliter", 1 }, // base unit for volume is milliliters
        { "liter", 1000 },
        { "cup", 236.588M },
        { "tablespoon", 14.7868M },
        { "fluid ounce", 29.57353M },
        { "tsp", 4.92892M },
        { "gallon", 3785.41M },
        { "pint", 473.176M },
        { "quart", 946.353M },
    };

  private static Dictionary<string, decimal> energyConversions = new Dictionary<string, decimal>
    {
        { "kcal", 1 }, // base unit for energy is kilocalories
        { "cal", 0.001M },
        { "kJ", 0.239006M },
    };

  public decimal Convert(decimal value, Unit fromUnit, Unit toUnit)
  {
    if (fromUnit == null || toUnit == null)
    {
      throw new ArgumentException("Invalid unit");
    }

    if (fromUnit.Category == null || toUnit.Category == null)
    {
      throw new ArgumentException("Please include the unit category");
    }

    if (fromUnit.Category.Id != toUnit.Category.Id)
    {
      throw new ArgumentException($"Units must be of the same type {fromUnit?.Category?.Description} != {toUnit?.Category?.Description}");
    }

    if (fromUnit.Category!.Description == "Solid")
    {
      return Convert(value, fromUnit.Description, toUnit.Description);
    }

    if (fromUnit.Category.Description == "Liquid")
    {
      return Convert(value, fromUnit.Description, toUnit.Description);
    }

    if (fromUnit.Category.Description == "Energy")
    {
      return value;
    }

    if (fromUnit.Category.Description == "Quantity")
    {
      return value;
    }
    else
    {
      throw new ArgumentException("Invalid unit category");
    }
  }

  public decimal Convert(decimal value, string fromUnit, string toUnit)
  {
    fromUnit = fromUnit.ToLower();
    toUnit = toUnit.ToLower();

    // Determine the type of unit and use the appropriate conversion dictionary
    var conversionDict = weightConversions.ContainsKey(fromUnit) ? weightConversions : volumeConversions;

    if (!conversionDict.ContainsKey(fromUnit))
    {
      throw new ArgumentException($"Invalid unit from unit {fromUnit}");
    }

    if (!conversionDict.ContainsKey(toUnit))
    {
      throw new ArgumentException($"Invalid unit to unit {toUnit}");
    }

    decimal valueInBaseUnit = value * conversionDict[fromUnit];
    return valueInBaseUnit / conversionDict[toUnit];
  }
}
