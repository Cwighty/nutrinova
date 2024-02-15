using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Nutrientgoal
{
    public int Goalid { get; set; }

    public int Groupid { get; set; }

    public int Nutrientid { get; set; }

    public decimal? Rda { get; set; }

    public string? Amdr { get; set; }

    public decimal? Ai { get; set; }

    public decimal? Ul { get; set; }

    public virtual Agesexgroup Group { get; set; } = null!;

    public virtual Nutrient Nutrient { get; set; } = null!;
}
