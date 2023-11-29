using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Extensions;

public static class RecipePlanExtension
{
  public static RecipeResponseModel ToRecipeResponseModel(this RecipePlan recipePlan)
  {
    return new RecipeResponseModel
    {
      Id = recipePlan.Id,
      Description = recipePlan.Description,
      Tags = recipePlan.Tags,
      Notes = recipePlan.Notes,
      Amount = recipePlan.Amount,
      ServingSizeUnit = recipePlan.ServingSizeUnit,
      RecipeFoods = recipePlan.RecipeFoods.Select(rf => rf.Food.ToFood()).ToList(),
      Unit = recipePlan.ServingSizeUnitNavigation.ToUnitOption(),
    };
  }
}
