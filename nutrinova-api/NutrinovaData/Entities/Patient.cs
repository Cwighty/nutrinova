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

    public virtual ICollection<MealHistory> MealHistories { get; set; } = new List<MealHistory>();

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();
}
