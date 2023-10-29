namespace NutrinovaData.ResponseModels;

public class FoodSearchCriteria
{
  public List<string> dataType { get; set; }

  public string query { get; set; }

  public string generalSearchInput { get; set; }

  public int pageNumber { get; set; }

  public int numberOfResultsPerPage { get; set; }

  public int pageSize { get; set; }

  public bool requireAllWords { get; set; }

  public List<string> foodTypes { get; set; }
}
