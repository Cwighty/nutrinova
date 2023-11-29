public class EditRecipeRequestModel
{
  public Guid? Id { get; set; }

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public List<string>? Tags { get; set; }

  public decimal Amount { get; set; }

  public int UnitId { get; set; }

  public UnitRequestModel ServingsUnit { get; set; } = null!;

  public List<EditFoodRequestModel> RecipeFoods { get; set; } = new List<EditFoodRequestModel>();
}
