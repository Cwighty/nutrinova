using System;
using System.Collections.Generic;

namespace NutrinovaData.Entities;

public partial class ReportedIssue
{
  public Guid Id { get; set; }

  public string? Subject { get; set; }

  public string? Description { get; set; }

  public Guid? CustomerId { get; set; }

  public virtual Customer? Customer { get; set; }
}
