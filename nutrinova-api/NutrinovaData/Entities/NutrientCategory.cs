using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class NutrientCategory
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Nutrient1> Nutrient1s { get; set; } = new List<Nutrient1>();
}
