public class CreateRecipeFoodRequestModel
{
  public Guid FoodId { get; set; }

  public decimal Measurement { get; set; }

  public int MeasurementUnitId { get; set; }

  // The amount of the food's serving size unit that is in 1 of the new unit
  public decimal? FoodServingsPerMeasurement { get; set; }
}
