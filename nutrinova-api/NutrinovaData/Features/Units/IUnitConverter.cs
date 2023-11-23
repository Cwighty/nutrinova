using NutrinovaData.Entities;

namespace NutrinovaData.Features.Units;

public interface IUnitConverter
{
  decimal Convert(decimal value, Unit fromUnit, Unit toUnit);
}
