using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Patient
{
    public Guid Id { get; set; }

    public string Firstname { get; set; } = null!;

    public string? Lastname { get; set; }

    public Guid? CustomerId { get; set; }

    public virtual Customer? Customer { get; set; }


    public virtual ICollection<PatientNutrientGoal> PatientNutrientGoals { get; set; } = new List<PatientNutrientGoal>();

    public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();
}
