using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Agesexgroup
{
    public int Groupid { get; set; }

    public string Sex { get; set; } = null!;

    public int Minage { get; set; }

    public int Maxage { get; set; }

    public virtual ICollection<Nutrientgoal> Nutrientgoals { get; set; } = new List<Nutrientgoal>();
}
