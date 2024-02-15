using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Usdareccomendednutrientvalue
{
    public int? Groupid { get; set; }

    public string? Sex { get; set; }

    public int? Minage { get; set; }

    public int? Maxage { get; set; }

    public string? Nutrientname { get; set; }

    public decimal? Recommendedvalue { get; set; }

    public string? Unit { get; set; }
}
