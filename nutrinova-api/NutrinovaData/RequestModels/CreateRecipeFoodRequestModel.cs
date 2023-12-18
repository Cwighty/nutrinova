public class CreateRecipeFoodRequestModel
{
  public Guid FoodId { get; set; }

  public decimal Amount { get; set; }

  public int UnitId { get; set; }

  // The amount of the food's serving size unit that is in 1 of the new unit
  public decimal? ConversionFactor { get; set; }
}
