using NutrinovaData.Entities;

public class EditFoodRequestModel
{
  public Guid? Id { get; set; }

  public string? Description { get; set; }

  public decimal? ServingSize { get; set; }

  public string? BrandName { get; set; }

  public string? Ingredients { get; set; }

  public Unit Unit { get; set; } = null!;

  public string? Note { get; set; }

  public List<EditFoodNutrientRequestModel> FoodNutrients { get; set; } = new List<EditFoodNutrientRequestModel>();
}
