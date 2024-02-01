namespace NutrinovaData.Features.Goals;

public class NutrientGoalRequestModel
{
  public Guid PatientId { get; set; }

  public int NutrientId { get; set; }

  public decimal DailyGoalAmount { get; set; }
}
