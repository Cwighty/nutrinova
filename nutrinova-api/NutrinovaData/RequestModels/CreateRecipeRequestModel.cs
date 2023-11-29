public class CreateRecipeRequestModel
{
  public string? Description { get; set; }

  public List<string>? Tags { get; set; }

  public string? Notes { get; set; }

  public decimal ServingSize { get; set; }

  public double ServingSizeUnitId { get; set; }

  public UnitOption ServingSizeUnit { get; set; } = new UnitOption();

  public List<CreateRecipeFoodRequestModel> RecipeFoods { get; set; } = new List<CreateRecipeFoodRequestModel>();
}
