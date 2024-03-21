using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Meal
{
    public Guid Id { get; set; }

    public string? Description { get; set; }

    public string Recordedby { get; set; } = null!;

    public Guid PatientId { get; set; }

    public decimal Amount { get; set; }

    public int Unit { get; set; }

    public DateTime Recordedat { get; set; }

    public string? Notes { get; set; }

    public string? Ingredients { get; set; }

    public virtual ICollection<MealNutrient> MealNutrients { get; set; } = new List<MealNutrient>();

    public virtual Patient Patient { get; set; } = null!;

    public virtual Unit UnitNavigation { get; set; } = null!;
}
