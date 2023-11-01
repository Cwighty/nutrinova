using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Unit
{
    public Guid Id { get; set; }

    public string? UnitName { get; set; }

    public string? Type { get; set; }

    public virtual ICollection<FoodHistory> FoodHistories { get; set; } = new List<FoodHistory>();

    public virtual ICollection<FoodHistoryNutrient> FoodHistoryNutrients { get; set; } = new List<FoodHistoryNutrient>();

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

    public virtual ICollection<FoodPlan> FoodPlans { get; set; } = new List<FoodPlan>();

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();
}
