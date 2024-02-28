using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class UsdaRecommendedNutrientValue
{
  public int? GroupId { get; set; }

  public string? Sex { get; set; }

  public int? MinAge { get; set; }

  public int? MaxAge { get; set; }

  public string? NutrientName { get; set; }

  public decimal? RecommendedValue { get; set; }

  public string? RecommendedValueType { get; set; }

  public string? Unit { get; set; }
}
