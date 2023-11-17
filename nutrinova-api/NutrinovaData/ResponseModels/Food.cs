using NutrinovaData.FlattenedResponseModels;

namespace NutrinovaData.ResponseModels;

public class Food
{
    public int fdcId { get; set; }

    public string? id { get; set; }

    public string description { get; set; }

    public string ingredients { get; set; }

    public string note { get; set; }

    public string dataType { get; set; }

    public string publishedDate { get; set; }

    public string brandOwner { get; set; }

    public string brandName { get; set; }

    public decimal servingSize { get; set; }

    public string servingSizeUnit { get; set; }

    public string servingSizeWithUnits { get; set; }

    public List<FoodNutrient> foodNutrients { get; set; }

    public FlattenedFood MakeFlattenedFood(bool onlyPrimaryNutrients = false) => new FlattenedFood(this, onlyPrimaryNutrients);
}
