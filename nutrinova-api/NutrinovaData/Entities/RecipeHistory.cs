using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class RecipeHistory
{
    public Guid Id { get; set; }

    public string? RecipeName { get; set; }

    public string? Tags { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();
}
