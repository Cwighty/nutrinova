using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;

namespace NutrinovaData;

public partial class NutrinovaDbContext : DbContext
{
    public NutrinovaDbContext()
    {
    }

    public NutrinovaDbContext(DbContextOptions<NutrinovaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerLicenseContract> CustomerLicenseContracts { get; set; }

    public virtual DbSet<FoodHistory> FoodHistories { get; set; }

    public virtual DbSet<FoodPlan> FoodPlans { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<MealFoodHistory> MealFoodHistories { get; set; }

    public virtual DbSet<MealHistory> MealHistories { get; set; }

    public virtual DbSet<MealRecipeHistory> MealRecipeHistories { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Nutrient> Nutrients { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<RecipeFood> RecipeFoods { get; set; }

    public virtual DbSet<RecipeFoodHistory> RecipeFoodHistories { get; set; }

    public virtual DbSet<RecipeHistory> RecipeHistories { get; set; }

    public virtual DbSet<RecipePlan> RecipePlans { get; set; }

    public virtual DbSet<ReportedIssue> ReportedIssues { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=nutrinova-db;Port=5432;Database=nutrinovadb;Username=admin;Password=Pleasegivemecoke!");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("customer_pkey");

            entity.ToTable("customer");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Firstname).HasColumnName("firstname");
            entity.Property(e => e.Lastname).HasColumnName("lastname");
        });

        modelBuilder.Entity<CustomerLicenseContract>(entity =>
        {
            entity.HasKey(e => new { e.CustomerId, e.LicenseContractId }).HasName("customer_license_contract_pkey");

            entity.ToTable("customer_license_contract");

            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.LicenseContractId).HasColumnName("license_contract_id");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerLicenseContracts)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("customer_license_contract_customer_id_fkey");
        });

        modelBuilder.Entity<FoodHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_history_pkey");

            entity.ToTable("food_history");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.FoodName).HasColumnName("food_name");
            entity.Property(e => e.MealId).HasColumnName("meal_id");
            entity.Property(e => e.Unit).HasColumnName("unit");

            entity.HasOne(d => d.Meal).WithMany(p => p.FoodHistories)
                .HasForeignKey(d => d.MealId)
                .HasConstraintName("food_history_meal_id_fkey");

            entity.HasOne(d => d.UnitNavigation).WithMany(p => p.FoodHistories)
                .HasForeignKey(d => d.Unit)
                .HasConstraintName("food_history_unit_fkey");

            entity.HasMany(d => d.Nutrients).WithMany(p => p.Foodhistories)
                .UsingEntity<Dictionary<string, object>>(
                    "FoodHistoryNutrient",
                    r => r.HasOne<Nutrient>().WithMany()
                        .HasForeignKey("NutrientId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("food_history_nutrient_nutrient_id_fkey"),
                    l => l.HasOne<FoodHistory>().WithMany()
                        .HasForeignKey("FoodhistoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("food_history_nutrient_foodhistory_id_fkey"),
                    j =>
                    {
                        j.HasKey("FoodhistoryId", "NutrientId").HasName("food_history_nutrient_pkey");
                        j.ToTable("food_history_nutrient");
                        j.IndexerProperty<Guid>("FoodhistoryId").HasColumnName("foodhistory_id");
                        j.IndexerProperty<Guid>("NutrientId").HasColumnName("nutrient_id");
                    });
        });

        modelBuilder.Entity<FoodPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_plan_pkey");

            entity.ToTable("food_plan");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.FoodName).HasColumnName("food_name");
            entity.Property(e => e.MealId).HasColumnName("meal_id");
        });

        modelBuilder.Entity<License>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("license_pkey");

            entity.ToTable("license");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.LicenseName).HasColumnName("license_name");
            entity.Property(e => e.Price)
                .HasColumnType("money")
                .HasColumnName("price");
        });

        modelBuilder.Entity<MealFoodHistory>(entity =>
        {
            entity.HasKey(e => new { e.MealHistoryId, e.FoodId }).HasName("meal_food_history_pkey");

            entity.ToTable("meal_food_history");

            entity.Property(e => e.MealHistoryId).HasColumnName("meal_history_id");
            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.UnitId).HasColumnName("unit_id");

            entity.HasOne(d => d.Food).WithMany(p => p.MealFoodHistories)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_food_history_food_id_fkey");

            entity.HasOne(d => d.MealHistory).WithMany(p => p.MealFoodHistories)
                .HasForeignKey(d => d.MealHistoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_food_history_meal_history_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.MealFoodHistories)
                .HasForeignKey(d => d.UnitId)
                .HasConstraintName("meal_food_history_unit_id_fkey");
        });

        modelBuilder.Entity<MealHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("meal_history_pkey");

            entity.ToTable("meal_history");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Recordedby).HasColumnName("recordedby");
            entity.Property(e => e.Recordeddate).HasColumnName("recordeddate");

            entity.HasOne(d => d.Patient).WithMany(p => p.MealHistories)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_history_patient_id_fkey");
        });

        modelBuilder.Entity<MealRecipeHistory>(entity =>
        {
            entity.HasKey(e => new { e.RecipeHistoryId, e.MealHistoryId }).HasName("meal_recipe_history_pkey");

            entity.ToTable("meal_recipe_history");

            entity.Property(e => e.RecipeHistoryId).HasColumnName("recipe_history_id");
            entity.Property(e => e.MealHistoryId).HasColumnName("meal_history_id");
            entity.Property(e => e.UnitId).HasColumnName("unit_id");

            entity.HasOne(d => d.MealHistory).WithMany(p => p.MealRecipeHistories)
                .HasForeignKey(d => d.MealHistoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_recipe_history_meal_history_id_fkey");

            entity.HasOne(d => d.RecipeHistory).WithMany(p => p.MealRecipeHistories)
                .HasForeignKey(d => d.RecipeHistoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_recipe_history_recipe_history_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.MealRecipeHistories)
                .HasForeignKey(d => d.UnitId)
                .HasConstraintName("meal_recipe_history_unit_id_fkey");
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("module_pkey");

            entity.ToTable("module");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ModuleName).HasColumnName("module_name");
        });

        modelBuilder.Entity<Nutrient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("nutrient_pkey");

            entity.ToTable("nutrient");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.NutrientName).HasColumnName("nutrient_name");
            entity.Property(e => e.PreferredUnit).HasColumnName("preferred_unit");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("patient_pkey");

            entity.ToTable("patient");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.Firstname).HasColumnName("firstname");
            entity.Property(e => e.Lastname).HasColumnName("lastname");

            entity.HasOne(d => d.Customer).WithMany(p => p.Patients)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("patient_customer_id_fkey");

            entity.HasMany(d => d.Modules).WithMany(p => p.Patients)
                .UsingEntity<Dictionary<string, object>>(
                    "PatientModule",
                    r => r.HasOne<Module>().WithMany()
                        .HasForeignKey("ModuleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("patient_module_module_id_fkey"),
                    l => l.HasOne<Patient>().WithMany()
                        .HasForeignKey("PatientId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("patient_module_patient_id_fkey"),
                    j =>
                    {
                        j.HasKey("PatientId", "ModuleId").HasName("patient_module_pkey");
                        j.ToTable("patient_module");
                        j.IndexerProperty<Guid>("PatientId").HasColumnName("patient_id");
                        j.IndexerProperty<Guid>("ModuleId").HasColumnName("module_id");
                    });
        });

        modelBuilder.Entity<RecipeFood>(entity =>
        {
            entity.HasKey(e => new { e.FoodId, e.RecipeId }).HasName("recipe_food_pkey");

            entity.ToTable("recipe_food");

            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.UnitId).HasColumnName("unit_id");

            entity.HasOne(d => d.Food).WithMany(p => p.RecipeFoods)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_food_food_id_fkey");

            entity.HasOne(d => d.Recipe).WithMany(p => p.RecipeFoods)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_food_recipe_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.RecipeFoods)
                .HasForeignKey(d => d.UnitId)
                .HasConstraintName("recipe_food_unit_id_fkey");
        });

        modelBuilder.Entity<RecipeFoodHistory>(entity =>
        {
            entity.HasKey(e => new { e.FoodId, e.RecipeId }).HasName("recipe_food_history_pkey");

            entity.ToTable("recipe_food_history");

            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.UnitId).HasColumnName("unit_id");

            entity.HasOne(d => d.Food).WithMany(p => p.RecipeFoodHistories)
                .HasForeignKey(d => d.FoodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_food_history_food_id_fkey");

            entity.HasOne(d => d.Recipe).WithMany(p => p.RecipeFoodHistories)
                .HasForeignKey(d => d.RecipeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_food_history_recipe_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.RecipeFoodHistories)
                .HasForeignKey(d => d.UnitId)
                .HasConstraintName("recipe_food_history_unit_id_fkey");
        });

        modelBuilder.Entity<RecipeHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("recipe_history_pkey");

            entity.ToTable("recipe_history");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.RecipeName).HasColumnName("recipe_name");
            entity.Property(e => e.Tags).HasColumnName("tags");
        });

        modelBuilder.Entity<RecipePlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("recipe_plan_pkey");

            entity.ToTable("recipe_plan");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.RecipeName).HasColumnName("recipe_name");
            entity.Property(e => e.Tags).HasColumnName("tags");
        });

        modelBuilder.Entity<ReportedIssue>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("reported_issues_pkey");

            entity.ToTable("reported_issues");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Subject).HasColumnName("subject");

            entity.HasOne(d => d.Customer).WithMany(p => p.ReportedIssues)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("reported_issues_customer_id_fkey");
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("unit_pkey");

            entity.ToTable("unit");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.UnitName).HasColumnName("unit_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
