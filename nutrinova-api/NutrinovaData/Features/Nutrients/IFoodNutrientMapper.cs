using NutrinovaData.Entities;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Features.Nutrients;

public interface IFoodNutrientMapper
{
  List<FoodPlanNutrient> MapNutrients(IEnumerable<FoodNutrient> foodNutrients);
}
