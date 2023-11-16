using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class FoodPlan
{
    public Guid Id { get; set; }

    public int? Fdcid { get; set; }

    public string Description { get; set; } = null!;

    public string? BrandName { get; set; }

    public string? Ingredients { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal? ServingSize { get; set; }

    public int ServingSizeUnit { get; set; }

    public string? Note { get; set; }

    public virtual Customer? CreatedByNavigation { get; set; }

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();

    public virtual Unit ServingSizeUnitNavigation { get; set; } = null!;
}
