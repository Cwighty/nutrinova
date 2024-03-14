namespace NutrinovaData.Features.Patients;

public class CreatePatientRequest
{
  public string Firstname { get; set; } = null!;

  public string? Lastname { get; set; }

  public short Age { get; set; }

  public string? Base64Image { get; set; }

  public string? Sex { get; set; }

  public bool? UseDefaultNutrientGoals { get; set; }
}
