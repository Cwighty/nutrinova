public partial class UnitCategoryRequestModel
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public virtual ICollection<UnitOption> Units { get; set; } = new List<UnitOption>();
}
