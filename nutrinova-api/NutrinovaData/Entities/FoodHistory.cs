using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodHistory
{
    public Guid Id { get; set; }

    public int? Fdcid { get; set; }

    public string Description { get; set; } = null!;

    public string? BrandName { get; set; }

    public string? Ingredients { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal ServingSize { get; set; }

    public int ServingSizeUnit { get; set; }

    public string? Note { get; set; }

    public virtual Customer? CreatedByNavigation { get; set; }

    public virtual ICollection<FoodHistoryNutrient> FoodHistoryNutrients { get; set; } = new List<FoodHistoryNutrient>();

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual Unit ServingSizeUnitNavigation { get; set; } = null!;
}
