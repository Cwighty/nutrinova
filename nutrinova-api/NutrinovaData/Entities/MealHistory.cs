using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class MealHistory
{
  public Guid Id { get; set; }

  public string Recordedby { get; set; } = null!;

  public Guid PatientId { get; set; }

  public DateOnly? Recordeddate { get; set; }

  public string? Notes { get; set; }

  public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

  public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

  public virtual Patient Patient { get; set; } = null!;
}
