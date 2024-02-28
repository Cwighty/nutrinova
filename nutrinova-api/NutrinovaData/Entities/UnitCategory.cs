using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class UnitCategory
{
  public int Id { get; set; }

  public string Description { get; set; } = null!;

  public virtual ICollection<Unit> Units { get; set; } = new List<Unit>();
}
