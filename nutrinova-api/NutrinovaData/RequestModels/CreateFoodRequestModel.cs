public class CreateFoodRequestModel
{
  public string? Description { get; set; }

  public decimal? ServingSize { get; set; }

  public int? Unit { get; set; }

  public string? Note { get; set; }

  public List<CreateFoodNutrientRequestModel> FoodNutrients { get; set; } = new List<CreateFoodNutrientRequestModel>();
}
