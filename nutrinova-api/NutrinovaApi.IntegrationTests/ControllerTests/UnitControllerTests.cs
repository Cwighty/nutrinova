using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NutrinovaApi.IntegrationTests;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class UnitControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
    private readonly HttpClient httpClient;

    public UnitControllerTests(NutrinovaApiWebApplicationFactory factory)
    {
        httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task CanRequestNutrients()
    {
        var response = await httpClient.GetFromJsonAsync<IEnumerable<UnitOption>>("be/unit/all-units");
        Assert.NotNull(response);
        Assert.NotEmpty(response);
    }
}
