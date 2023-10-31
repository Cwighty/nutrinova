using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodHistory
{
    public Guid Id { get; set; }

    public int? Fdcid { get; set; }

    public string? Description { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public decimal? ServingSize { get; set; }

    public Guid? Unit { get; set; }

    public string? Note { get; set; }

    public virtual Customer? CreatedByNavigation { get; set; }

    public virtual ICollection<FoodHistoryNutrient> FoodHistoryNutrients { get; set; } = new List<FoodHistoryNutrient>();

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();

    public virtual Unit? UnitNavigation { get; set; }
}
