namespace NutrinovaData.Entities;

public partial class RecipeFoodHistory
{
    public Guid FoodId { get; set; }

    public Guid RecipeId { get; set; }

    public decimal? Amount { get; set; }

    public Guid? UnitId { get; set; }

    public virtual FoodHistory Food { get; set; } = null!;

    public virtual RecipeHistory Recipe { get; set; } = null!;

    public virtual Unit? Unit { get; set; }
}
