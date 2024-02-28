namespace NutrinovaData.Features.Goals;

public class NutrientGoalRequestModel
{
  public Guid PatientId { get; set; }

  public int NutrientId { get; set; }

  public decimal DailyUpperLimit { get; set; }

  public decimal DailyLowerLimit { get; set; }

  public bool UseRecommended { get; set; }
}
