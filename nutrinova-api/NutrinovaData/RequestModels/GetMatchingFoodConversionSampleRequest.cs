namespace NutrinovaData.RequestModels;

public class GetMatchingFoodConversionSampleRequest
{
  public Guid FoodPlanId { get; set; }

  public int MeasurementUnitId { get; set; }
}
