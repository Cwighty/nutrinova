using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class UsdaNutrient
{
  public int Nutrientid { get; set; }

  public string Name { get; set; } = null!;

  public string Unit { get; set; } = null!;

  public virtual ICollection<UsdaNutrientGoal> UsdaNutrientGoals { get; set; } = new List<UsdaNutrientGoal>();
}
