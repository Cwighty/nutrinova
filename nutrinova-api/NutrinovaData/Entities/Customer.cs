using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Customer
{
    public Guid Id { get; set; }

    public string Objectid { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Firstname { get; set; }

    public string? Lastname { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<CustomerLicenseContract> CustomerLicenseContracts { get; set; } = new List<CustomerLicenseContract>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<ReportedIssue> ReportedIssues { get; set; } = new List<ReportedIssue>();
}
