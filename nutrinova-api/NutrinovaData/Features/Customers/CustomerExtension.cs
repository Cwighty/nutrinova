using NutrinovaData.Entities;

namespace NutrinovaData.Features.Customers;

public static class CustomerExtension
{
  public static CustomerResponse ToCustomerResponse(this Customer customer)
  {
    return new CustomerResponse
    {
      Id = customer.Id,
      ObjectId = customer.ObjectId,
      Email = customer.Email,
      CreatedAt = customer.CreatedAt,
    };
  }
}
