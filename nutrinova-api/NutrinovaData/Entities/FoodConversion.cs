using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodConversion
{
  public Guid Id { get; set; }

  public Guid FoodPlanId { get; set; }

  public decimal AmountOfFood { get; set; }

  public int ToUnitId { get; set; }

  public virtual FoodPlan FoodPlan { get; set; } = null!;

  public virtual Unit ToUnit { get; set; } = null!;
}
