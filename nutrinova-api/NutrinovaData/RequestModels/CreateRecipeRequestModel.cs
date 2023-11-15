public class CreateRecipeRequestModel
{
    public Guid Id { get; set; }

    public string? Description { get; set; }

    public List<string?>? Tags { get; set; }

    public string? Notes { get; set; }

    public List<CreateRecipeFoodRequestModel> RecipeFoods { get; set; } = new List<CreateRecipeFoodRequestModel>();
}
