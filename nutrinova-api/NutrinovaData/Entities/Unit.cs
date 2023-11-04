using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class Unit
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Abreviation { get; set; } = null!;

    public virtual ICollection<FoodHistory> FoodHistories { get; set; } = new List<FoodHistory>();

    public virtual ICollection<FoodHistoryNutrient> FoodHistoryNutrients { get; set; } = new List<FoodHistoryNutrient>();

    public virtual ICollection<FoodPlanNutrient> FoodPlanNutrients { get; set; } = new List<FoodPlanNutrient>();

    public virtual ICollection<FoodPlan> FoodPlans { get; set; } = new List<FoodPlan>();

    public virtual ICollection<MealFoodHistory> MealFoodHistories { get; set; } = new List<MealFoodHistory>();

    public virtual ICollection<MealRecipeHistory> MealRecipeHistories { get; set; } = new List<MealRecipeHistory>();

    public virtual ICollection<Nutrient> Nutrients { get; set; } = new List<Nutrient>();

    public virtual ICollection<RecipeFoodHistory> RecipeFoodHistories { get; set; } = new List<RecipeFoodHistory>();

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();
}
