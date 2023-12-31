using NutrinovaData.Entities;
using NutrinovaData.Extensions;

namespace NutrinovaData.Features.Foods;

public static class FoodHistoryExtension
{
  public static FoodHistoryResponse ToFoodHistoryResponse(this FoodHistory foodHistory)
  {
    return new FoodHistoryResponse
    {
      Id = foodHistory.Id,
      Fdcid = foodHistory.Fdcid,
      Description = foodHistory.Description,
      BrandName = foodHistory.BrandName,
      Ingredients = foodHistory.Ingredients,
      CreatedBy = foodHistory.CreatedBy,
      CreatedAt = foodHistory.CreatedAt,
      ServingSize = foodHistory.ServingSize,
      ServingSizeUnit = foodHistory.ServingSizeUnit,
      Note = foodHistory.Note,
      Unit = UnitExtension.ToUnitOption(foodHistory.ServingSizeUnitNavigation),
    };
  }
}
