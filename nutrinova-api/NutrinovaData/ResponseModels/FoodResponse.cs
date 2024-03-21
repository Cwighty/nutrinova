using NutrinovaData.FlattenedResponseModels;

namespace NutrinovaData.ResponseModels;

public class FoodResponse
{
  public int FdcId { get; set; }

  public Guid? Id { get; set; }

  public string Description { get; set; }

  public string Ingredients { get; set; }

  public string Note { get; set; }

  public string DataType { get; set; }

  public string PublishedDate { get; set; }

  public double UnitId { get; set; }

  public double UnitCategoryId { get; set; }

  public string BrandOwner { get; set; }

  public string BrandName { get; set; }

  public decimal ServingSize { get; set; }

  public string ServingSizeUnit { get; set; }

  public string? ServingSizeUnitCategory { get; set; }

  public string ServingSizeWithUnits { get; set; }

  public bool Imported { get; set; }

  public UnitOption? Unit { get; set; }

  public List<FoodNutrient> FoodNutrients { get; set; }

  public FlattenedFood MakeFlattenedFood() => new FlattenedFood(this);
}
