using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class RecipePlan
{
    public Guid Id { get; set; }

    public string? RecipeName { get; set; }

    public string? Tags { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<RecipeFood> RecipeFoods { get; set; } = new List<RecipeFood>();
}
