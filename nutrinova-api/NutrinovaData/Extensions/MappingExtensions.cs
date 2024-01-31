using NutrinovaData.Entities;

public static class MappingExtensions
{
  public static UnitOption ToUnitOption(this Unit unit)
  {
    return new UnitOption
    {
      Id = unit.Id,
      Abbreviation = unit.Abbreviation,
      CategoryName = unit.Category!.Description,
      Category = unit.Category.ToUnitCategoryRequestModel(),
      Description = unit.Description,
    };
  }

  public static UnitCategoryRequestModel ToUnitCategoryRequestModel(this UnitCategory unitCategory)
  {
    return new UnitCategoryRequestModel
    {
      Id = unitCategory.Id,
      Description = unitCategory.Description,
    };
  }
}
