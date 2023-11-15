using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class MealRecipeHistory
{
    public Guid Id { get; set; }

    public Guid RecipeHistoryId { get; set; }

    public Guid MealHistoryId { get; set; }

    public decimal Amount { get; set; }

    public DateTime CreatedAt { get; set; }

    public int UnitId { get; set; }

    public virtual MealHistory MealHistory { get; set; } = null!;

    public virtual RecipeHistory RecipeHistory { get; set; } = null!;

    public virtual Unit Unit { get; set; } = null!;
}
