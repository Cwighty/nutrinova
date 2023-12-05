using NutrinovaData.Entities;

namespace NutrinovaData.Features.Meals;

public class MealHistoryResponse
{
    public Guid Id { get; set; }

    public string RecordedBy { get; set; } = null!;

    public Guid PatientId { get; set; }

    public DateTime? RecordedAt { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<MealFoodHistoryResponse> MealFoodHistoryResponses { get; set; } = new List<MealFoodHistoryResponse>();

    public virtual ICollection<MealRecipeHistoryResponse> MealRecipeHistoryResponses { get; set; } = new List<MealRecipeHistoryResponse>();

    public virtual Patient Patient { get; set; } = null!;
}
