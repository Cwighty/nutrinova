using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class PatientNutrientGoal
{
  public Guid Id { get; set; }

  public Guid PatientId { get; set; }

  public int NutrientId { get; set; }

  public decimal DailyGoalAmount { get; set; }

  public virtual Nutrient Nutrient { get; set; } = null!;

  public virtual Patient Patient { get; set; } = null!;
}
