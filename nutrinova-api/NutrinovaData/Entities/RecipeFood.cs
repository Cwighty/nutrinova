using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class RecipeFood
{
    public Guid Id { get; set; }

    public Guid FoodId { get; set; }

    public Guid RecipeId { get; set; }

    public decimal Amount { get; set; }

    public int UnitId { get; set; }

    public virtual FoodPlan Food { get; set; } = null!;

    public virtual RecipePlan Recipe { get; set; } = null!;

    public virtual Unit Unit { get; set; } = null!;
}
