namespace NutrinovaData;

public class UpdatePatientRequest
{
  public Guid Id { get; set; }

  public string? Firstname { get; set; }

  public string? Lastname { get; set; }

  public string? CustomerId { get; set; }

  public string? Sex { get; set; }

  public short Age { get; set; }

  public bool? OptOut { get; set; }

  public string? Base64Image { get; set; }
}
