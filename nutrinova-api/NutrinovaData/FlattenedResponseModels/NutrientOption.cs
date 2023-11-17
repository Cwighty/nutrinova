public class NutrientOption
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Category { get; set; } = null!;

    public int PreferredUnitId { get; set; }
}
