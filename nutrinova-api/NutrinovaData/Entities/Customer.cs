using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Customer
{
    public Guid Id { get; set; }

    public string Objectid { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public bool Issingleuser { get; set; }

    public virtual ICollection<CustomerLicenseContract> CustomerLicenseContracts { get; set; } = new List<CustomerLicenseContract>();

    public virtual ICollection<FoodHistory> FoodHistories { get; set; } = new List<FoodHistory>();

    public virtual ICollection<FoodPlan> FoodPlans { get; set; } = new List<FoodPlan>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<RecipeHistory> RecipeHistories { get; set; } = new List<RecipeHistory>();

    public virtual ICollection<RecipePlan> RecipePlans { get; set; } = new List<RecipePlan>();

    public virtual ICollection<ReportedIssue> ReportedIssues { get; set; } = new List<ReportedIssue>();
}
