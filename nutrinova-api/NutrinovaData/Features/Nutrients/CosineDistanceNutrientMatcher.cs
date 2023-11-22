using System.Text.RegularExpressions;
using NutrinovaData.Features.Nutrients;

public class CosineDistanceNutrientMatcher : INutrientMatcher
{
  public List<NutrientOption> ExistingNutrients { get; }

  private List<string> ignoreWords = new List<string> { "total", "vitamin" };

  public CosineDistanceNutrientMatcher(List<NutrientOption> existingOptions)
  {
    ExistingNutrients = existingOptions;
  }

  public NutrientOption FindClosestMatch(string newNutrient)
  {
    if (string.IsNullOrEmpty(newNutrient))
    {
      throw new ArgumentException("New nutrient cannot be null or empty.");
    }

    if (ExistingNutrients == null || ExistingNutrients.Count == 0)
    {
      throw new InvalidOperationException("Existing nutrients list is empty.");
    }

    NutrientOption? closestMatch = null;
    double maxSimilarity = 0;

    foreach (var nutrient in ExistingNutrients)
    {
      double similarity = CosineSimilarity(Tokenize(newNutrient.ToLower()), Tokenize(nutrient.Description.ToLower()));
      if (similarity > maxSimilarity)
      {
        maxSimilarity = similarity;
        closestMatch = nutrient;
      }
    }

    if (maxSimilarity < 0.3)
    {
      throw new Exception($"No match found for {newNutrient}");
    }

    if (closestMatch == null)
    {
      throw new Exception($"No match found for {newNutrient}");
    }

    return closestMatch;
  }

  private List<string> Tokenize(string text)
  {
    // Tokenize the text into words while ignoring parentheses
    var tokens = new List<string>();

    text = text.Replace("-", string.Empty).Replace("'", string.Empty);

    string[] words = Regex.Split(text, @"[^\w]+"); // Split by non-word characters

    foreach (var word in words)
    {
      if (!string.IsNullOrWhiteSpace(word) && !ignoreWords.Contains(word.ToLower()))
      {
        tokens.Add(word);
      }
    }

    return tokens;
  }

  private double CosineSimilarity(List<string> a, List<string> b)
  {
    var intersection = a.Intersect(b).ToList();
    double dotProduct = intersection.Count;
    double magnitudeA = Math.Sqrt(a.Count);
    double magnitudeB = Math.Sqrt(b.Count);
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
