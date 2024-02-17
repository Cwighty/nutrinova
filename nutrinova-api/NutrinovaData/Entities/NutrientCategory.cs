using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class NutrientCategory
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Nutrient> Nutrients { get; set; } = new List<Nutrient>();
}
