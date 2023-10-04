using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;

namespace NutrinovaApi.IntegrationTests;

public class WeatherControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient httpClient;
    public WeatherControllerTests(WebApplicationFactory<Program> factory)
    {
        httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task TestWeatherController()
    {
        var weather = await httpClient.GetFromJsonAsync<IEnumerable<WeatherForecast>>("WeatherForecast");
        weather.Should().NotBeEmpty();
    }
}