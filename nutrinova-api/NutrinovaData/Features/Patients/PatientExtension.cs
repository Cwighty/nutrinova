using NutrinovaData.Entities;
using NutrinovaData.Features.Customers;

namespace NutrinovaData.Features.Patients;

public static class PatientExtension
{
  public static PatientResponse ToPatientResponse(this Patient patient)
  {
    return new PatientResponse
    {
      Id = patient.Id,
      Firstname = patient.Firstname,
      Lastname = patient.Lastname,
      CustomerId = patient.CustomerId,
      Age = patient.Age,
      OptOut = patient.OptOutDetails,
      HasPicture = !string.IsNullOrEmpty(patient.ProfilePictureName),
      CustomerResponse = patient.Customer?.ToCustomerResponse(),
    };
  }

  public static string GetFullName(this Patient patient)
  {
    return $"{patient.Firstname} {patient.Lastname}";
  }
}
