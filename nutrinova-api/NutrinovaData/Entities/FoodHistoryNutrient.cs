using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodHistoryNutrient
{
    public Guid Id { get; set; }

    public Guid FoodhistoryId { get; set; }

    public Guid NutrientId { get; set; }

    public decimal? Amount { get; set; }

    public Guid? UnitId { get; set; }

    public virtual FoodHistory Foodhistory { get; set; } = null!;

    public virtual Nutrient Nutrient { get; set; } = null!;

    public virtual Unit? Unit { get; set; }
}
