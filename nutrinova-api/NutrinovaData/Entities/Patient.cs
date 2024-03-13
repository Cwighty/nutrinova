using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Patient
{
  public Guid Id { get; set; }

  public string Firstname { get; set; } = null!;

  public string? Lastname { get; set; }

  public short Age { get; set; }

  public string? ProfilePictureName { get; set; }

  public string? Sex { get; set; }

  public Guid? CustomerId { get; set; }

  public bool Optedoutpatientdetails { get; set; }

  public virtual Customer? Customer { get; set; }

  public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();

  public virtual ICollection<PatientNutrientDailyGoal> PatientNutrientDailyGoals { get; set; } = new List<PatientNutrientDailyGoal>();
}
