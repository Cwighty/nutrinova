using NutrinovaData.Entities;

namespace NutrinovaData.Calculators;

public static class UnitConverter
{
  private static Dictionary<string, decimal> weightConversions = new Dictionary<string, decimal>
    {
        { "g", 1 }, // base unit for weight is grams
        { "kg", 1000 },
        { "mg", 0.001M },
        { "mcg", 0.000001M },
        { "oz", 28.3495M },
        { "lb", 453.592M },
    };

  private static Dictionary<string, decimal> volumeConversions = new Dictionary<string, decimal>
    {
        { "ml", 1 }, // base unit for volume is milliliters
        { "l", 1000 },
        { "cup", 236.588M },
        { "tbsp", 14.7868M },
        { "fl oz", 29.57353M },
        { "tsp", 4.92892M },
        { "gal", 3785.41M },
        { "pt", 473.176M },
        { "qt", 946.353M },
    };

  private static Dictionary<string, decimal> energyConversions = new Dictionary<string, decimal>
    {
        { "kcal", 1 }, // base unit for energy is kilocalories
        { "cal", 0.001M },
        { "kJ", 0.239006M },
    };

  public static decimal Convert(decimal value, Unit fromUnit, Unit toUnit)
  {
    if (fromUnit.CategoryId != toUnit.CategoryId)
    {
      throw new ArgumentException("Units must be of the same type");
    }

    if (fromUnit.Category!.Description == "Solid")
    {
      return Convert(value, fromUnit.Abbreviation, toUnit.Abbreviation);
    }

    if (fromUnit.Category.Description == "Liquid")
    {
      return Convert(value, fromUnit.Abbreviation, toUnit.Abbreviation);
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

  public static decimal Convert(decimal value, string fromUnit, string toUnit)
  {
    // Determine the type of unit and use the appropriate conversion dictionary
    var conversionDict = weightConversions.ContainsKey(fromUnit) ? weightConversions : volumeConversions;

    if (!conversionDict.ContainsKey(fromUnit) || !conversionDict.ContainsKey(toUnit))
    {
      throw new ArgumentException("Invalid unit");
    }

    decimal valueInBaseUnit = value * conversionDict[fromUnit];
    return valueInBaseUnit / conversionDict[toUnit];
  }
}
