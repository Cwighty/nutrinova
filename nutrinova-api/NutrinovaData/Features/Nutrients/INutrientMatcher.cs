namespace NutrinovaData.Features.Nutrients;

public interface INutrientMatcher
{
  public List<NutrientOption> ExistingNutrients { get; }

  public void SetExistingNutrients(List<NutrientOption> existingNutrients);

  public NutrientOption FindClosestMatch(string newNutrient);
}
