using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodPlanNutrient
{
  public Guid Id { get; set; }

  public Guid FoodplanId { get; set; }

  public int NutrientId { get; set; }

  public decimal Amount { get; set; }

  public int UnitId { get; set; }

  public virtual FoodPlan Foodplan { get; set; } = null!;

  public virtual Nutrient Nutrient { get; set; } = null!;

  public virtual Unit Unit { get; set; } = null!;
}
