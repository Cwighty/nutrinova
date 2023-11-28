using NutrinovaData.Entities;

public partial class UnitRequestModel
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public string Abbreviation { get; set; } = null!;

  public int CategoryId { get; set; }

  public UnitCategory? Category { get; set; }
}
