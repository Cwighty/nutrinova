using System.Net.Http.Headers;
using NutrinovaData.Entities;

namespace NutrinovaApi.IntegrationTests;

public class NutrinovaApiWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
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

    private readonly PostgreSqlContainer _dbContainer;

    public NutrinovaApiWebApplicationFactory()
    {
        var directory = FindProjectRootByMarker() + "/nutrinova-db/init-scripts";
        _dbContainer = new PostgreSqlBuilder()
           .WithImage("postgres")
           .WithPassword("Strong_password_123!")
           .WithResourceMapping(new DirectoryInfo(directory), "/docker-entrypoint-initdb.d")
           .WithBindMount(directory, "/docker-entrypoint-initdb.d")
           .Build();
    }

    public string DefaultUserId { get; set; } = Guid.Empty.ToString();

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();

        // Add test user here if not using SQL script
        var optionsBuilder = new DbContextOptionsBuilder<NutrinovaDbContext>();
        optionsBuilder.UseNpgsql(_dbContainer.GetConnectionString());

        using var context = new NutrinovaDbContext(optionsBuilder.Options);
        var testCustomer = new Customer
        {
            Id = Guid.Parse(DefaultUserId),
            Objectid = DefaultUserId,
            Firstname = "Test",
            Lastname = "User",
            Email = "testuser@example.com",
        };

        context.Customers.Add(testCustomer);
        await context.SaveChangesAsync();
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<NutrinovaDbContext>));
            services.AddDbContext<NutrinovaDbContext>(options => options.UseNpgsql(_dbContainer.GetConnectionString()));

            services.Configure<TestAuthHandlerOptions>(options => options.DefaultUserId = DefaultUserId);

            services.AddAuthentication(TestAuthHandler.AuthenticationScheme)
                .AddScheme<TestAuthHandlerOptions, TestAuthHandler>(TestAuthHandler.AuthenticationScheme, options => { });
        });
    }

    protected override void ConfigureClient(HttpClient client)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(TestAuthHandler.AuthenticationScheme);
    }
}
