using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class MealFoodHistory
{
    public Guid Id { get; set; }

    public Guid MealHistoryId { get; set; }

    public Guid FoodId { get; set; }

    public decimal? Amount { get; set; }

    public Guid? UnitId { get; set; }

    public virtual FoodHistory Food { get; set; } = null!;

    public virtual MealHistory MealHistory { get; set; } = null!;

    public virtual Unit? Unit { get; set; }
}
