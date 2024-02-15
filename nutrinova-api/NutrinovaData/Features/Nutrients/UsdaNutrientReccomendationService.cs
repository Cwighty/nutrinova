using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;

namespace NutrinovaData.Features.Nutrients;

public enum Sex
{
  Male,
  Female,
}

public class UsdaNutrientReccomendationService : INutrientReccomendationService
{
  private NutrinovaDbContext _dbContext;

  public UsdaNutrientReccomendationService(NutrinovaDbContext dbContext)
  {
    _dbContext = dbContext;
  }

  public async Task<UsdaReccomendedNutrientValue> GetNutrientReccomendationAsync(UsdaNutrient nutrient, int age, Sex sex)
  {
    if (nutrient == null)
    {
      throw new ArgumentNullException(nameof(nutrient));
    }

    if (age < 0)
    {
      throw new ArgumentOutOfRangeException(nameof(age));
    }

    var sexString = sex == Sex.Male ? "Male" : "Female";

    var reccomendation = await _dbContext.UsdaReccomendedNutrientValues
      .Where(rnv => rnv.NutrientName == nutrient.Name && age >= rnv.MinAge && age <= rnv.MaxAge && sexString == rnv.Sex)
      .FirstOrDefaultAsync();

    if (reccomendation == null)
    {
      throw new Exception($"No reccomendation found for nutrient {nutrient.Name} for age {age}, sex {sexString}");
    }

    return reccomendation;
  }
}
