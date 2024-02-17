using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class MealNutrient
{
    public Guid Id { get; set; }

    public Guid MealId { get; set; }

    public int NutrientId { get; set; }

    public decimal Amount { get; set; }

    public virtual Meal Meal { get; set; } = null!;

    public virtual Nutrient Nutrient { get; set; } = null!;
}
