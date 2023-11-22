namespace NutrinovaData.Features.Nutrients;

public class EditDistanceNutrientMatcher : INutrientMatcher
{
  public List<NutrientOption> ExistingNutrients { get; }

  public EditDistanceNutrientMatcher(List<NutrientOption> existingNutrients)
  {
    this.ExistingNutrients = existingNutrients;
  }

  public NutrientOption FindClosestMatch(string newNutrient)
  {
    int minDistance = int.MaxValue;
    NutrientOption? closestMatch = null;

    foreach (var nutrient in ExistingNutrients)
    {
      int distance = EditDistance(newNutrient.ToLower(), nutrient.Description.ToLower());
      if (distance < minDistance)
      {
        minDistance = distance;
        closestMatch = nutrient;
      }
    }

    if (minDistance > 18)
    {
      throw new Exception($"No match found for {newNutrient}");
    }

    if (closestMatch == null)
    {
      throw new Exception($"No match found for {newNutrient}");
    }

    return closestMatch;
  }

  private int EditDistance(string a, string b)
  {
    if (string.IsNullOrEmpty(a))
    {
      return (b ?? string.Empty).Length;
    }

    if (string.IsNullOrEmpty(b))
    {
      return (a ?? string.Empty).Length;
    }

    int lengthA = a.Length;
    int lengthB = b.Length;
    var distances = new int[lengthA + 1, lengthB + 1];

    for (int i = 0; i <= lengthA; distances[i, 0] = i++)
    {
    }

    for (int j = 0; j <= lengthB; distances[0, j] = j++)
    {
    }

    for (int i = 1; i <= lengthA; i++)
    {
      for (int j = 1; j <= lengthB; j++)
      {
        int cost = (b[j - 1] == a[i - 1]) ? 0 : 1;
        distances[i, j] = Math.Min(
            Math.Min(distances[i - 1, j] + 1, distances[i, j - 1] + 1),
            distances[i - 1, j - 1] + cost);
      }
    }

    return distances[lengthA, lengthB];
  }
}
