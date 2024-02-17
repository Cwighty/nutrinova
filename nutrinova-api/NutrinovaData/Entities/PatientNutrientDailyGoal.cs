using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class PatientNutrientDailyGoal
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    public int NutrientId { get; set; }

    public decimal? CustomUpperTarget { get; set; }

    public decimal? CustomLowerTarget { get; set; }

    public decimal? RecommendedUpperTarget { get; set; }

    public decimal? RecommendedLowerTarget { get; set; }

    public decimal? RecommendedMax { get; set; }

    public string? RecommendedGoalType { get; set; }

    public virtual Nutrient Nutrient { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;
}
