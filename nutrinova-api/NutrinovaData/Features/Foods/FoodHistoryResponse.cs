namespace NutrinovaData.Features.Foods;

public class FoodHistoryResponse
{
  public Guid Id { get; set; }

  public int? Fdcid { get; set; }

  public string Description { get; set; } = null!;

  public string? BrandName { get; set; }

  public string? Ingredients { get; set; }

  public Guid? CreatedBy { get; set; }

  public DateTime CreatedAt { get; set; }

  public decimal ServingSize { get; set; }

  public int ServingSizeUnit { get; set; }

  public string? Note { get; set; }

  public virtual UnitOption? Unit { get; set; }
}
