using NutrinovaData.Entities;

public static class MappingExtensions
{
  public static FoodHistory ToFoodHistory(this FoodPlan foodPlan, Guid customerId)
  {
    return new FoodHistory
    {
      Id = Guid.NewGuid(),
      Fdcid = foodPlan.Fdcid,
      Description = foodPlan.Description,
      BrandName = foodPlan.BrandName,
      Ingredients = foodPlan.Ingredients,
      CreatedBy = customerId,
      CreatedAt = DateTime.UtcNow,
      ServingSize = foodPlan.ServingSize,
      ServingSizeUnit = foodPlan.ServingSizeUnit,
      Note = foodPlan.Note,
    };
  }

  public static RecipeHistory ToRecipeHistory(this RecipePlan recipePlan, Guid customerId)
  {
    return new RecipeHistory
    {
      Id = Guid.NewGuid(),
      Description = recipePlan.Description,
      CreatedBy = customerId,
      CreatedAt = DateTime.UtcNow,
      Amount = recipePlan.Amount,
      ServingSizeUnit = recipePlan.ServingSizeUnit,
      Notes = recipePlan.Notes,
    };
  }

  public static UnitOption ToUnitOption(this Unit servingSizeUnit)
  {
    return new UnitOption
    {
      Id = servingSizeUnit.Id,
      Abbreviation = servingSizeUnit.Abbreviation,
      CategoryName = servingSizeUnit.Category!.Description,
      Category = servingSizeUnit.Category.ToUnitCategoryRequestModel(),
      Description = servingSizeUnit.Description,
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
