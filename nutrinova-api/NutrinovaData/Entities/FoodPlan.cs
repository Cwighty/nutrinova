namespace NutrinovaData.Entities;

public partial class FoodPlan
{
    public Guid Id { get; set; }

    public string? FoodName { get; set; }

    public Guid? MealId { get; set; }
}
