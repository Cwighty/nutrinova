using NutrinovaData.Features.Customers;

namespace NutrinovaData.Features.Patients;

public class PatientResponse
{
  public Guid Id { get; set; }

  public string Firstname { get; set; } = null!;

  public string? Lastname { get; set; }

  public Guid? CustomerId { get; set; }

  public bool HasPicture { get; set; }

  public CustomerResponse? CustomerResponse { get; set; }
}
