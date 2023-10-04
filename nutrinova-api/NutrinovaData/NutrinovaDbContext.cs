using Microsoft.EntityFrameworkCore;

namespace NutrinovaData;

public class NutrinovaDbContext : DbContext
{
    public NutrinovaDbContext(DbContextOptions<NutrinovaDbContext> options)
        : base(options)
    {
    }

    // Define your entity DbSet properties here, e.g., public DbSet<User> Users { get; set; }
}
