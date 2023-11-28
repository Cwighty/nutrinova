using NutrinovaData.Entities;

public class UnitOption
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public string Abbreviation { get; set; } = null!;

  public string CategoryName { get; set; } = null!;

  public int CategoryId { get; set; }

  public UnitCategory? Category { get; set; }
}
