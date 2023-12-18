namespace Nutrinova.Features.Recipes;

public class RecipeValidator
{
  public List<string> Validate(CreateRecipeRequestModel createRecipeRequestModel)
  {
    var errorMessages = new List<string>();

    if (createRecipeRequestModel == null)
    {
      errorMessages.Add("Invalid food plan data");
      return errorMessages;
    }

    if (string.IsNullOrWhiteSpace(createRecipeRequestModel.Description))
    {
      errorMessages.Add("Description is required");
    }

    if (createRecipeRequestModel.RecipeFoods == null || !createRecipeRequestModel.RecipeFoods.Any())
    {
      errorMessages.Add("At least one food ingredient is required");
    }
    else
    {
      if (createRecipeRequestModel.RecipeFoods.Any(f => f.Amount <= 0))
      {
        errorMessages.Add("Food/Ingredient amounts must be greater than 0");
      }

      if (createRecipeRequestModel.RecipeFoods.Any(f => f.UnitId <= 0))
      {
        errorMessages.Add("Food/Ingredient units are required with every food amount");
      }
    }

    return errorMessages;
  }
}
