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
      CustomerResponse = patient.Customer?.ToCustomerResponse(),
    };
  }
}
