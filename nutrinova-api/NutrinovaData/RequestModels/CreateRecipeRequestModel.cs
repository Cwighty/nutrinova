public class CreateRecipeRequestModel
{
    public string? Description { get; set; }

    public List<string?>? Tags { get; set; }

    public string? Notes { get; set; }

    public List<CreateRecipeFoodRequestModel> RecipeFoods { get; set; } = new List<CreateRecipeFoodRequestModel>();
}
