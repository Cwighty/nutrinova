// Copyright (c) Nutrinova

namespace NutrinovaData.Entities;

public partial class CustomerLicenseContract
{
    public Guid CustomerId { get; set; }

    public Guid LicenseContractId { get; set; }

    public virtual Customer Customer { get; set; } = null!;
}
