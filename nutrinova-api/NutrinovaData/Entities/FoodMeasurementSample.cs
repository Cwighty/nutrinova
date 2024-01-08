using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodMeasurementSample
{
    public Guid Id { get; set; }

    public Guid FoodPlanId { get; set; }

    public decimal FoodServingsPerMeasurement { get; set; }

    public int MeasurementUnitId { get; set; }

    public virtual FoodPlan FoodPlan { get; set; } = null!;

    public virtual Unit MeasurementUnit { get; set; } = null!;
}
