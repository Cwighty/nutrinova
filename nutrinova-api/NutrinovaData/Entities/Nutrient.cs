using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Nutrient
{
    public Guid Id { get; set; }

    public string NutrientName { get; set; } = null!;

    public string? PreferredUnit { get; set; }

    public virtual ICollection<FoodHistoryNutrient> FoodHistoryNutrients { get; set; } = new List<FoodHistoryNutrient>();

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();
}
