public class EditFoodRequestModel
{
    public string? Id { get; set; }

    public string? Description { get; set; }

    public decimal? ServingSize { get; set; }

    public string? BrandName { get; set; }

    public string? Ingredients { get; set; }

    public int Unit { get; set; }

    public string? Note { get; set; }

    public List<EditFoodNutrientRequestModel> FoodNutrients { get; set; } = new List<EditFoodNutrientRequestModel>();
}
