using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodPlan
{
    public Guid Id { get; set; }

    public int? Fdcid { get; set; }

    public string? Description { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public decimal? ServingSize { get; set; }

    public Guid? Unit { get; set; }

    public string? Note { get; set; }

    public virtual Customer? CreatedByNavigation { get; set; }

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

    public virtual Unit? UnitNavigation { get; set; }
}
