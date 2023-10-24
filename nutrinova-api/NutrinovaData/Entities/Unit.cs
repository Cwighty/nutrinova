namespace NutrinovaData.Entities;

public partial class Unit
{
    public Guid Id { get; set; }

    public string? UnitName { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<FoodHistory> FoodHistories { get; set; } = new List<FoodHistory>();

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();
}
