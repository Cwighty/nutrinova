using NutrinovaData.Entities;

public partial class UnitCategoryRequestModel
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public static implicit operator UnitCategoryRequestModel(UnitCategory v)
  {
    throw new NotImplementedException();
  }
}
