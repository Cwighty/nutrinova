namespace NutrinovaData.Entities;

public partial class Module
{
    public Guid Id { get; set; }

    public string ModuleName { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
