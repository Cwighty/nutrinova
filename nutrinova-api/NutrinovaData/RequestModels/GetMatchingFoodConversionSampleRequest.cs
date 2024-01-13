namespace NutrinovaData.RequestModels;

public class GetMatchingFoodConversionSampleRequest
{
  public Guid FoodPlanId { get; set; }

  public int MeasurementUnitCategoryId { get; set; }
}
