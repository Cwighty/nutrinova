namespace NutrinovaApi.IntegrationTests;

public class NutrinovaApiWebApplicationFactory : WebApplicationFactory<NutrinovaApi.Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer;

    public NutrinovaApiWebApplicationFactory()
    {
        var whereAmI = Environment.CurrentDirectory;
        var backupFile = Directory.GetFiles("../../../../TestDBScripts", "*.sql", SearchOption.AllDirectories)
           .Select(f => new FileInfo(f))
           .OrderByDescending(fi => fi.LastWriteTime)
           .First();
        _dbContainer = new PostgreSqlBuilder()
           .WithImage("postgres")
           .WithPassword("Strong_password_123!")
           .WithBindMount(backupFile.Directory?.FullName, "/docker-entrypoint-initdb.d")
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
}
