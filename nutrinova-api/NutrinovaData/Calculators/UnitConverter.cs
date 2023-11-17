namespace NutrinovaData.Calculators;

public class UnitConverter
{
  private Dictionary<string, double> weightConversions = new Dictionary<string, double>
    {
        {"g", 1}, // base unit for weight is grams
        {"kg", 1000},
        {"mg", 0.001},
        {"mcg", 0.000001},
        {"oz", 28.3495},
        {"lb", 453.592},
    };

  private Dictionary<string, double> volumeConversions = new Dictionary<string, double>
    {
        {"ml", 1}, // base unit for volume is milliliters
        {"l", 1000},
        {"cup", 236.588},
        {"tbsp", 14.7868},
        {"fl oz", 29.57353},
        {"tsp", 4.92892},
        {"gal", 3785.41},
        {"pt", 473.176},
        {"qt", 946.353}
        // Add more volume units here
    };

  private Dictionary<string, double> energyConversions = new Dictionary<string, double>
    {
        {"kcal", 1}, // base unit for energy is kilocalories
        {"cal", 0.001},
        {"kJ", 0.239006}
    };

  public double Convert(double value, string fromUnit, string toUnit)
  {
    // Determine the type of unit and use the appropriate conversion dictionary
    var conversionDict = weightConversions.ContainsKey(fromUnit) ? weightConversions : volumeConversions;

    if (!conversionDict.ContainsKey(fromUnit) || !conversionDict.ContainsKey(toUnit))
    {
      throw new ArgumentException("Invalid unit");
    }

    double valueInBaseUnit = value * conversionDict[fromUnit];
    return valueInBaseUnit / conversionDict[toUnit];
  }
}
