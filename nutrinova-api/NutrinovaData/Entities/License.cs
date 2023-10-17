// Copyright (c) Nutrinova
namespace NutrinovaData.Entities;

public partial class License
{
    public Guid Id { get; set; }

    public string? LicenseName { get; set; }

    public TimeOnly? Duration { get; set; }

    public decimal? Price { get; set; }

    public bool? Active { get; set; }
}
