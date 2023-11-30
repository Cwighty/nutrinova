namespace NutrinovaData.ResponseModels;

public class FoodSearchResponseModel
{
  public int totalHits { get; set; }

  public int currentPage { get; set; }

  public int totalPages { get; set; }

  public FoodSearchCriteria foodSearchCriteria { get; set; }

  public List<Food> foods { get; set; }
}
