using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Nutrient
{
    public Guid Id { get; set; }

    public string NutrientName { get; set; } = null!;

    public string? PreferredUnit { get; set; }

    public virtual ICollection<FoodHistory> Foodhistories { get; set; } = new List<FoodHistory>();
}
