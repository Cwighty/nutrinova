﻿using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Nutrient
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public int PreferredUnit { get; set; }

  public int CategoryId { get; set; }

  public virtual NutrientCategory Category { get; set; } = null!;

  public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

  public virtual ICollection<MealNutrient> MealNutrients { get; set; } = new List<MealNutrient>();

  public virtual ICollection<PatientNutrientDailyGoal> PatientNutrientDailyGoals { get; set; } = new List<PatientNutrientDailyGoal>();

  public virtual Unit PreferredUnitNavigation { get; set; } = null!;
}
