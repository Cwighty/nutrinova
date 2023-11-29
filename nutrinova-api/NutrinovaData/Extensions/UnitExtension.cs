using NutrinovaData.Entities;

namespace NutrinovaData.Extensions;

public static class UnitExtension
{
  public static UnitOption ToUnitOption(this Unit unit)
  {
    if (unit == null)
    {
      throw new ArgumentNullException(nameof(unit));
    }

    return new UnitOption
    {
      Id = unit.Id,
      Description = unit.Description,
      Abbreviation = unit.Abbreviation,
      CategoryName = unit?.Category?.Description ?? string.Empty,
      CategoryId = unit?.CategoryId ?? 0,
      Category = unit?.Category,
    };
  }
}
