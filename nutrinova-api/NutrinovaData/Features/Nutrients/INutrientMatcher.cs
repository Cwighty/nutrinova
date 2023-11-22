namespace NutrinovaData.Features.Nutrients;

public interface INutrientMatcher
{
  public List<NutrientOption> ExistingNutrients { get; }

  public NutrientOption FindClosestMatch(string newNutrient);
}
