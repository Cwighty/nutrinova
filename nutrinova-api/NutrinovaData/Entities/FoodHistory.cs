using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodHistory
{
    public Guid Id { get; set; }

    public string? FoodName { get; set; }

    public Guid? MealId { get; set; }

    public decimal? Amount { get; set; }

    public Guid? Unit { get; set; }

    public virtual MealHistory? Meal { get; set; }

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();

    public virtual Unit? UnitNavigation { get; set; }

    public virtual ICollection<Nutrient> Nutrients { get; set; } = new List<Nutrient>();
}
