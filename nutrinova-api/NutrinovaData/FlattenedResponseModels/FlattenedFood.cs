using NutrinovaData.Entities;
using NutrinovaData.Extensions;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFood
{
  public int? FdcId { get; set; }

  public string? Id { get; set; }

  public string? Description { get; set; }

  public string? Ingredients { get; set; }

  public string? BrandName { get; set; }

  public double? ServingSize { get; set; }

  public string? ServingSizeUnit { get; set; }

  public string? ServingSizeWithUnits { get; set; }

  public List<FlattenedFoodNutrient>? FoodNutrients { get; set; }

  public FlattenedFood()
  {
  }

  public FlattenedFood(FoodPlan fp)
  {
    FdcId = fp.Fdcid;
    Id = fp.Id.ToString();
    Description = fp.Description;
    Ingredients = fp.Ingredients;
    BrandName = fp.BrandName;
    ServingSize = decimal.ToDouble(fp.ServingSize ?? 0);
    ServingSizeUnit = fp?.ServingSizeUnitNavigation?.Description;
    ServingSizeWithUnits = ServingSize + ServingSizeUnit;
    FoodNutrients = fp?.FoodPlanNutrients
        .Select(fpn => fpn.ToFlattenedFoodNutrient())
        .ToList() ?? new List<FlattenedFoodNutrient>();
  }

  public FlattenedFood(Food food, bool onlyPrimaryNutrients)
  {
    this.FdcId = food.fdcId;
    this.Id = food.fdcId.ToString();
    this.Description = food.description;
    this.Ingredients = food.ingredients;
    this.BrandName = food.brandName;
    this.ServingSize = food.servingSize;
    this.ServingSizeUnit = food.servingSizeUnit;
    this.ServingSizeWithUnits = $"{food.servingSize} {food.servingSizeUnit}";
    if (onlyPrimaryNutrients)
    {
      this.FoodNutrients = food.foodNutrients
          .Where(fn => fn.IsPrimaryFoodNutrient())
          .Select(pfn => pfn.MakeFlattenedFoodNutrient())
          .ToList();
    }
    else
    {
      this.FoodNutrients = food.foodNutrients
         .Select(pfn => pfn.MakeFlattenedFoodNutrient())
         .ToList();
    }
  }
}
