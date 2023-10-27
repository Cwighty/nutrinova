namespace NutrinovaData.ResponseModels;

public class Food
{
    public int fdcId { get; set; }

    public string description { get; set; }

    public string ingredients { get; set; }

    public string dataType { get; set; }

    public string gtinUpc { get; set; }

    public string publishedDate { get; set; }

    public string brandOwner { get; set; }

    public List<FoodNutrient> foodNutrients { get; set; }
}
