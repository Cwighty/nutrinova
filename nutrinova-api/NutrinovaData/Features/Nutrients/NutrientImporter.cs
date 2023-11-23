using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NutrinovaData.Entities;
using NutrinovaData.Features.Units;
using NutrinovaData.ResponseModels;

namespace NutrinovaData.Features.Nutrients;

public class NutrientImporter : IFoodNutrientMapper
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<NutrientImporter> logger;
  private readonly INutrientMatcher nutrientMatcher;
  private readonly IUnitConverter unitConverter;

  public NutrientImporter(NutrinovaDbContext context, ILogger<NutrientImporter> logger, INutrientMatcher nutrientMatcher, IUnitConverter unitConverter)
  {
    this.context = context;
    this.logger = logger;
    this.nutrientMatcher = nutrientMatcher;
    this.unitConverter = unitConverter;
  }

  public List<FoodPlanNutrient> MapNutrients(IEnumerable<FoodNutrient> foodNutrients)
  {
    var foodPlanNutrients = new List<FoodPlanNutrient>();
    foreach (var nutrient in foodNutrients)
    {
      var nutrientOption = MatchAndConvertNutrient(nutrient);
      if (nutrientOption != null)
      {
        foodPlanNutrients.Add(nutrientOption);
      }
    }

    return foodPlanNutrients;
  }

  private FoodPlanNutrient? MatchAndConvertNutrient(FoodNutrient nutrient)
  {
    try
    {
      var nutrientOption = nutrientMatcher.FindClosestMatch(nutrient.nutrientName ?? string.Empty);
      var unit = GetUnit(nutrient.unitName ?? string.Empty);

      if (nutrientOption == null || unit == null)
      {
        logger.LogInformation($"Skipping nutrient {nutrient.nutrientName} {nutrient.unitName}");
        return null;
      }

      var preferredUnit = context.Units.Include(u => u.Category).FirstOrDefault(u => u.Id == nutrientOption.PreferredUnitId);
      var fromUnit = context.Units.Include(u => u.Category).FirstOrDefault(u => u.Id == unit.Id);
      var newAmount = unitConverter.Convert((decimal)nutrient.value, fromUnit!, preferredUnit!);

      if (newAmount <= 0)
      {
        logger.LogInformation($"Invalid converted amount for nutrient {nutrient.nutrientName}.");
        return null;
      }

      return new FoodPlanNutrient
      {
        Id = Guid.NewGuid(),
        NutrientId = nutrientOption.Id,
        Amount = newAmount,
        UnitId = nutrientOption.PreferredUnitId,
      };
    }
    catch (Exception ex)
    {
      logger.LogError($"Error processing nutrient {nutrient.nutrientName}: {ex.Message}");
      return null;
    }
  }

  private UnitOption? GetUnit(string unitAbbreviation)
  {
    var unit = context.Units.FirstOrDefault(u => EF.Functions.ILike(u.Abbreviation, unitAbbreviation) || EF.Functions.ILike(u.Description, unitAbbreviation));
    if (unit == null)
    {
      logger.LogError($"Failed to find unit with abbreviation {unitAbbreviation}, skipping");
      return null;
    }

    return new UnitOption
    {
      Id = unit.Id,
      Abbreviation = unit.Abbreviation,
      Description = unit.Description,
    };
  }
}
