using NutrinovaData.Entities;
using NutrinovaData.Extensions;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFood
{
  public int? FdcId { get; set; }

  public Guid? Id { get; set; }

  public string? Description { get; set; }

  public string? Ingredients { get; set; }

  public double? UnitCategoryId { get; set; }

  public string? BrandName { get; set; }

  public decimal? ServingSize { get; set; }

  public string? ServingSizeUnit { get; set; }

  public UnitOption? ServingSizeUnitOption { get; set; }

  public string? ServingSizeWithUnits { get; set; }

  public bool Imported { get; set; }

  public List<FlattenedFoodNutrient>? FoodNutrients { get; set; }

  public FlattenedFood()
  {
  }

  public FlattenedFood(FoodPlan fp)
  {
    FdcId = fp.Fdcid;
    Id = fp.Id;
    Description = fp.Description;
    Ingredients = fp.Ingredients;
    BrandName = fp.BrandName;
    ServingSize = fp.ServingSize;
    this.UnitCategoryId = fp.ServingSizeUnitNavigation.CategoryId;
    Imported = fp.Imported;
    ServingSizeUnit = fp.ServingSizeUnitNavigation?.Description;
    ServingSizeUnitOption = fp.ServingSizeUnitNavigation?.ToUnitOption();
    ServingSizeWithUnits = ServingSize + ServingSizeUnit;
    FoodNutrients = fp.FoodPlanNutrients
        .Select(fpn => fpn.ToFlattenedFoodNutrient())
        .ToList() ?? new List<FlattenedFoodNutrient>();
  }

  public FlattenedFood(FoodResponse foodResponse)
  {
    this.FdcId = foodResponse.FdcId;
    this.Id = foodResponse?.Id;
    this.Description = foodResponse?.Description;
    this.Ingredients = foodResponse?.Ingredients;
    this.BrandName = foodResponse?.BrandName;
    this.ServingSize = foodResponse?.ServingSize;
    this.Imported = foodResponse?.Imported ?? false;
    this.ServingSizeUnit = foodResponse?.ServingSizeUnit;
    this.ServingSizeUnitOption = foodResponse?.Unit;
    this.UnitCategoryId = foodResponse?.UnitCategoryId;
    this.ServingSizeWithUnits = $"{foodResponse?.ServingSize} {foodResponse?.ServingSizeUnit}";
    this.FoodNutrients = foodResponse?.FoodNutrients
       .Select(pfn => pfn.MakeFlattenedFoodNutrient())
       .ToList();
  }
}
