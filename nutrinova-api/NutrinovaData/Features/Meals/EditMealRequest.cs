﻿namespace NutrinovaData.Features.Meals;

public class EditMealRequest
{
  public Guid Id { get; set; }

  public decimal Amount { get; set; }

  public DateTime RecordedAt { get; set; }
}
