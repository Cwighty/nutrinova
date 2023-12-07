namespace NutrinovaData.Features.Customers;

public class CustomerResponse
{
  public Guid Id { get; set; }

  public string ObjectId { get; set; } = null!;

  public string Email { get; set; } = null!;

  public DateTime? CreatedAt { get; set; }
}
