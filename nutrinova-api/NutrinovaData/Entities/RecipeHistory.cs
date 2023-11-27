using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class RecipeHistory
{
    public Guid Id { get; set; }

    public string? Description { get; set; }

    public string? Tags { get; set; }

    public string? Notes { get; set; }

    public decimal Amount { get; set; }

    public int ServingSizeUnit { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public virtual Customer? CreatedByNavigation { get; set; }

    public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual Unit ServingSizeUnitNavigation { get; set; } = null!;
}
