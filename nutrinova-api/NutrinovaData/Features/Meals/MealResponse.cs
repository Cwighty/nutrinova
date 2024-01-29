using NutrinovaData.Features.Foods;
using NutrinovaData.Features.Patients;
using NutrinovaData.Features.Recipes;

namespace NutrinovaData.Features.Meals;

public class MealResponse
{
    public Guid Id { get; set; }

    public string Recordedby { get; set; } = null!;

    public Guid PatientId { get; set; }

    public DateTime? RecordedAt { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<FoodHistoryResponse> FoodHistoryResponses { get; set; } = new List<FoodHistoryResponse>();

    public virtual ICollection<RecipeHistoryResponse> RecipeHistoryResponses { get; set; } = new List<RecipeHistoryResponse>();

    public PatientResponse PatientResponse { get; set; } = null!;
}
