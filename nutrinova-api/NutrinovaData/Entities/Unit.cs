using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Unit
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Abbreviation { get; set; } = null!;

    public int? CategoryId { get; set; }

    public virtual UnitCategory? Category { get; set; }

    public virtual ICollection<FoodConversionSample> FoodConversionSamples { get; set; } = new List<FoodConversionSample>();

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

    public virtual ICollection<FoodPlan> FoodPlans { get; set; } = new List<FoodPlan>();

    public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();

    public virtual ICollection<Nutrient> Nutrients { get; set; } = new List<Nutrient>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();

    public virtual ICollection<RecipePlan> RecipePlans { get; set; } = new List<RecipePlan>();
}
