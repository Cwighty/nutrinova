using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using Testcontainers.PostgreSql;

namespace NutrinovaApi.IntegrationTests;

public class NutrinovaApiWebApplicationFactory : WebApplicationFactory<NutrinovaApi.Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer;

    public NutrinovaApiWebApplicationFactory()
    {
        var directory = FindProjectRootByMarker() + "/nutrinova-db/init-scripts";
        _dbContainer = new PostgreSqlBuilder()
           .WithImage("postgres")
           .WithPassword("Strong_password_123!")
           .WithBindMount(directory, "/docker-entrypoint-initdb.d")
           .Build();
    }


    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<NutrinovaDbContext>));
            services.AddDbContext<NutrinovaDbContext>(options => options.UseNpgsql(_dbContainer.GetConnectionString()));
        });
    }


    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }

    public static string FindProjectRootByMarker()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);

        while (directory != null && !directory.GetFiles("*.sln").Any())
        {
            directory = directory.Parent;
        }

        directory = directory?.Parent;
        return directory?.FullName ?? throw new Exception("Project root could not be located.");
    }

}
