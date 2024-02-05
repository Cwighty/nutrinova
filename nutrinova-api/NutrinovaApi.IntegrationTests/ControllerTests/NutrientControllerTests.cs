using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NutrinovaApi.IntegrationTests;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class NutrientControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  private readonly HttpClient httpClient;

  public NutrientControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    httpClient = factory.CreateClient();
  }

  [Fact]
  public async Task CanRequestNutrients()
  {
    var response = await httpClient.GetFromJsonAsync<IEnumerable<NutrientOption>>("be/nutrient/all-nutrients");
    Assert.NotNull(response);
    Assert.NotEmpty(response);
  }
}
