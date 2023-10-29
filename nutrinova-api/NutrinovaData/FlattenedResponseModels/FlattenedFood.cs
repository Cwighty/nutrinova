using NutrinovaData.ResponseModels;

namespace NutrinovaData.FlattenedResponseModels;

public class FlattenedFood
{
    public int FdcId { get; set; }

    public string Description { get; set; }

    public string Ingredients { get; set; }

    public string BrandName { get; set; }

    public double ServingSize { get; set; }

    public string ServingSizeUnit { get; set; }

    public string ServingSizeWithUnits { get; set; }

    public List<FlattenedFoodNutrient> FoodNutrients { get; set; }

    public FlattenedFood(Food food)
    {
        this.FdcId = food.fdcId;
        this.Description = food.description;
        this.Ingredients = food.ingredients;
        this.BrandName = food.brandName;
        this.ServingSize = food.servingSize;
        this.ServingSizeUnit = food.servingSizeUnit;
        this.ServingSizeWithUnits = $"{food.servingSize} {food.servingSizeUnit}";
        this.FoodNutrients = food.foodNutrients
            .Where(fn => fn.IsPrimaryFoodNutrient())
            .Select(pfn => pfn.MakeFlattenedFoodNutrient())
            .ToList();
    }
}
