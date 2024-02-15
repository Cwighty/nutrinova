using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Nutrient
{
    public int Nutrientid { get; set; }

    public string Name { get; set; } = null!;

    public string Unit { get; set; } = null!;

    public virtual ICollection<Nutrientgoal> Nutrientgoals { get; set; } = new List<Nutrientgoal>();
}
