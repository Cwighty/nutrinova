namespace NutrinovaData.ResponseModels;

public class RecipeResponseModel
{
  public Guid Id { get; set; }

  public string? Description { get; set; }

  public string? Tags { get; set; }

  public string? Notes { get; set; }

  public decimal Amount { get; set; }

  public DateTime CreatedAt { get; set; }

  public int ServingSizeUnit { get; set; }

  public IEnumerable<NutrientSummary>? NutrientSummaries { get; set; }

  public virtual ICollection<FoodResponse> RecipeFoods { get; set; } = new List<FoodResponse>();

  public virtual UnitOption? Unit { get; set; } = null!;
}
