using NutrinovaData.Features.Patients;

namespace NutrinovaData.Features.Meals;

public class MealResponse
{
  public Guid Id { get; set; }

  public string? Description { get; set; } = null!;

  public string? Ingredients { get; set; } = null!;

  public List<NutrientSummary> NutrientSummaries { get; set; } = null!;

  public string Recordedby { get; set; } = null!;

  public Guid PatientId { get; set; }

  public DateTime? RecordedAt { get; set; }

  public string? Notes { get; set; }

  public PatientResponse PatientResponse { get; set; } = null!;
}
