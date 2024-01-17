namespace NutrinovaData.RequestModels;

public class CreateFoodConversionSampleRequestModel
{
  public Guid FoodPlanId { get; set; }

  public decimal FoodServingsPerMeasurement { get; set; }

  public int MeasurementUnitId { get; set; }
}
