namespace NutrinovaApi.IntegrationTests;

public class WeatherControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
    private readonly HttpClient httpClient;

    public WeatherControllerTests(NutrinovaApiWebApplicationFactory factory)
    {
        httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task TestWeatherController()
    {
        var weather = await httpClient.GetFromJsonAsync<IEnumerable<WeatherForecast>>("api/WeatherForecast");
        weather.Should().NotBeEmpty();
    }
}
