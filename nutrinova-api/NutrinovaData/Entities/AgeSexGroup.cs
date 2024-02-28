using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class AgeSexGroup
{
  public int Groupid { get; set; }

  public string Sex { get; set; } = null!;

  public int MinAge { get; set; }

  public int MaxAge { get; set; }

  public virtual ICollection<UsdaNutrientGoal> UsdaNutrientGoals { get; set; } = new List<UsdaNutrientGoal>();
}
