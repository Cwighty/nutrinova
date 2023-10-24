namespace NutrinovaData.Entities;

public partial class Customer
{
    public Guid Id { get; set; }

    public string Firstname { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public virtual ICollection<CustomerLicenseContract> CustomerLicenseContracts { get; set; } = new List<CustomerLicenseContract>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<ReportedIssue> ReportedIssues { get; set; } = new List<ReportedIssue>();
}
