using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using NutrinovaData.Entities;

namespace NutrinovaData;

public partial class NutrinovaDbContext : DbContext
{
    public NutrinovaDbContext(DbContextOptions<NutrinovaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AgeSexGroup> AgeSexGroups { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<ChatSession> ChatSessions { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerLicenseContract> CustomerLicenseContracts { get; set; }

    public virtual DbSet<FoodConversionSample> FoodConversionSamples { get; set; }

    public virtual DbSet<FoodPlan> FoodPlans { get; set; }

    public virtual DbSet<FoodPlanNutrient> FoodPlanNutrients { get; set; }

    public virtual DbSet<License> Licenses { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealNutrient> MealNutrients { get; set; }

    public virtual DbSet<Nutrient> Nutrients { get; set; }

    public virtual DbSet<NutrientCategory> NutrientCategories { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<PatientNutrientDailyGoal> PatientNutrientDailyGoals { get; set; }

    public virtual DbSet<RecipeFood> RecipeFoods { get; set; }

    public virtual DbSet<RecipePlan> RecipePlans { get; set; }

    public virtual DbSet<ReportedIssue> ReportedIssues { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<UnitCategory> UnitCategories { get; set; }

    public virtual DbSet<UsdaNutrient> UsdaNutrients { get; set; }

    public virtual DbSet<UsdaNutrientGoal> UsdaNutrientGoals { get; set; }

    public virtual DbSet<UsdaRecommendedNutrientValue> UsdaRecommendedNutrientValues { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AgeSexGroup>(entity =>
        {
            entity.HasKey(e => e.Groupid).HasName("age_sex_group_pkey");

            entity.ToTable("age_sex_group");

            entity.Property(e => e.Groupid).HasColumnName("groupid");
            entity.Property(e => e.MaxAge).HasColumnName("max_age");
            entity.Property(e => e.MinAge).HasColumnName("min_age");
            entity.Property(e => e.Sex)
                .HasMaxLength(50)
                .HasColumnName("sex");
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("chat_message_pkey");

            entity.ToTable("chat_message");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.MessageText).HasColumnName("message_text");
            entity.Property(e => e.Sentbycustomer).HasColumnName("sentbycustomer");
            entity.Property(e => e.SessionId).HasColumnName("session_id");

            entity.HasOne(d => d.Session).WithMany(p => p.ChatMessages)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chat_message_session_id_fkey");
        });

        modelBuilder.Entity<ChatSession>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("chat_session_pkey");

            entity.ToTable("chat_session");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.ChatSessions)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("chat_session_created_by_fkey");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("customer_pkey");

            entity.ToTable("customer");

            entity.HasIndex(e => e.Objectid, "customer_objectid_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Issingleuser).HasColumnName("issingleuser");
            entity.Property(e => e.Objectid).HasColumnName("objectid");
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

        modelBuilder.Entity<FoodConversionSample>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_conversion_sample_pkey");

            entity.ToTable("food_conversion_sample");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.FoodPlanId).HasColumnName("food_plan_id");
            entity.Property(e => e.FoodServingsPerMeasurement).HasColumnName("food_servings_per_measurement");
            entity.Property(e => e.MeasurementUnitId)
                .ValueGeneratedOnAdd()
                .HasColumnName("measurement_unit_id");

            entity.HasOne(d => d.FoodPlan).WithMany(p => p.FoodConversionSamples)
                .HasForeignKey(d => d.FoodPlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_conversion_sample_food_plan_id_fkey");

            entity.HasOne(d => d.MeasurementUnit).WithMany(p => p.FoodConversionSamples)
                .HasForeignKey(d => d.MeasurementUnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_conversion_sample_measurement_unit_id_fkey");
        });

        modelBuilder.Entity<FoodPlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_plan_pkey");

            entity.ToTable("food_plan");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.BrandName).HasColumnName("brand_name");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Fdcid).HasColumnName("fdcid");
            entity.Property(e => e.Imported).HasColumnName("imported");
            entity.Property(e => e.Ingredients).HasColumnName("ingredients");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.ServingSize).HasColumnName("serving_size");
            entity.Property(e => e.ServingSizeUnit)
                .ValueGeneratedOnAdd()
                .HasColumnName("serving_size_unit");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.FoodPlans)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("food_plan_created_by_fkey");

            entity.HasOne(d => d.ServingSizeUnitNavigation).WithMany(p => p.FoodPlans)
                .HasForeignKey(d => d.ServingSizeUnit)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_plan_serving_size_unit_fkey");
        });

        modelBuilder.Entity<FoodPlanNutrient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("food_plan_nutrient_pkey");

            entity.ToTable("food_plan_nutrient");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.FoodplanId).HasColumnName("foodplan_id");
            entity.Property(e => e.NutrientId)
                .ValueGeneratedOnAdd()
                .HasColumnName("nutrient_id");
            entity.Property(e => e.UnitId)
                .ValueGeneratedOnAdd()
                .HasColumnName("unit_id");

            entity.HasOne(d => d.Foodplan).WithMany(p => p.FoodPlanNutrients)
                .HasForeignKey(d => d.FoodplanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_plan_nutrient_foodplan_id_fkey");

            entity.HasOne(d => d.Nutrient).WithMany(p => p.FoodPlanNutrients)
                .HasForeignKey(d => d.NutrientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_plan_nutrient_nutrient_id_fkey");

            entity.HasOne(d => d.Unit).WithMany(p => p.FoodPlanNutrients)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("food_plan_nutrient_unit_id_fkey");
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

        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("meal_pkey");

            entity.ToTable("meal");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Ingredients).HasColumnName("ingredients");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Recordedat).HasColumnName("recordedat");
            entity.Property(e => e.Recordedby).HasColumnName("recordedby");
            entity.Property(e => e.Unit)
                .ValueGeneratedOnAdd()
                .HasColumnName("unit");

            entity.HasOne(d => d.Patient).WithMany(p => p.Meals)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_patient_id_fkey");

            entity.HasOne(d => d.UnitNavigation).WithMany(p => p.Meals)
                .HasForeignKey(d => d.Unit)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_unit_fkey");
        });

        modelBuilder.Entity<MealNutrient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("meal_nutrient_pkey");

            entity.ToTable("meal_nutrient");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.MealId).HasColumnName("meal_id");
            entity.Property(e => e.NutrientId)
                .ValueGeneratedOnAdd()
                .HasColumnName("nutrient_id");

            entity.HasOne(d => d.Meal).WithMany(p => p.MealNutrients)
                .HasForeignKey(d => d.MealId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_nutrient_meal_id_fkey");

            entity.HasOne(d => d.Nutrient).WithMany(p => p.MealNutrients)
                .HasForeignKey(d => d.NutrientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("meal_nutrient_nutrient_id_fkey");
        });

        modelBuilder.Entity<Nutrient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("nutrient_pkey");

            entity.ToTable("nutrient");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId)
                .HasDefaultValueSql("nextval('nutrient_category_id_seq1'::regclass)")
                .HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.PreferredUnit)
                .ValueGeneratedOnAdd()
                .HasColumnName("preferred_unit");

            entity.HasOne(d => d.Category).WithMany(p => p.Nutrients)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("nutrient_category_id_fkey");

            entity.HasOne(d => d.PreferredUnitNavigation).WithMany(p => p.Nutrients)
                .HasForeignKey(d => d.PreferredUnit)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("nutrient_preferred_unit_fkey");
        });

        modelBuilder.Entity<NutrientCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("nutrient_category_pkey");

            entity.ToTable("nutrient_category");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("patient_pkey");

            entity.ToTable("patient");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.Firstname).HasColumnName("firstname");
            entity.Property(e => e.Lastname).HasColumnName("lastname");
            entity.Property(e => e.OptOutDetails).HasColumnName("opt_out_details");
            entity.Property(e => e.ProfilePictureName).HasColumnName("profile_picture_name");
            entity.Property(e => e.Sex).HasColumnName("sex");

            entity.HasOne(d => d.Customer).WithMany(p => p.Patients)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("patient_customer_id_fkey");
        });

        modelBuilder.Entity<PatientNutrientDailyGoal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("patient_nutrient_daily_goal_pkey");

            entity.ToTable("patient_nutrient_daily_goal");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CustomLowerTarget).HasColumnName("custom_lower_target");
            entity.Property(e => e.CustomUpperTarget).HasColumnName("custom_upper_target");
            entity.Property(e => e.NutrientId)
                .ValueGeneratedOnAdd()
                .HasColumnName("nutrient_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.RecommendedGoalType).HasColumnName("recommended_goal_type");
            entity.Property(e => e.RecommendedLowerTarget).HasColumnName("recommended_lower_target");
            entity.Property(e => e.RecommendedMax).HasColumnName("recommended_max");
            entity.Property(e => e.RecommendedUpperTarget).HasColumnName("recommended_upper_target");

            entity.HasOne(d => d.Nutrient).WithMany(p => p.PatientNutrientDailyGoals)
                .HasForeignKey(d => d.NutrientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("patient_nutrient_daily_goal_nutrient_id_fkey");

            entity.HasOne(d => d.Patient).WithMany(p => p.PatientNutrientDailyGoals)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("patient_nutrient_daily_goal_patient_id_fkey");
        });

        modelBuilder.Entity<RecipeFood>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("recipe_food_pkey");

            entity.ToTable("recipe_food");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.FoodId).HasColumnName("food_id");
            entity.Property(e => e.RecipeId).HasColumnName("recipe_id");
            entity.Property(e => e.UnitId)
                .ValueGeneratedOnAdd()
                .HasColumnName("unit_id");

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
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_food_unit_id_fkey");
        });

        modelBuilder.Entity<RecipePlan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("recipe_plan_pkey");

            entity.ToTable("recipe_plan");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.ServingSizeUnit)
                .ValueGeneratedOnAdd()
                .HasColumnName("serving_size_unit");
            entity.Property(e => e.Tags).HasColumnName("tags");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RecipePlans)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("recipe_plan_created_by_fkey");

            entity.HasOne(d => d.ServingSizeUnitNavigation).WithMany(p => p.RecipePlans)
                .HasForeignKey(d => d.ServingSizeUnit)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recipe_plan_serving_size_unit_fkey");
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

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Abbreviation).HasColumnName("abbreviation");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");

            entity.HasOne(d => d.Category).WithMany(p => p.Units)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("unit_category_id_fkey");
        });

        modelBuilder.Entity<UnitCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("unit_category_pkey");

            entity.ToTable("unit_category");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
        });

        modelBuilder.Entity<UsdaNutrient>(entity =>
        {
            entity.HasKey(e => e.Nutrientid).HasName("usda_nutrient_pkey");

            entity.ToTable("usda_nutrient");

            entity.Property(e => e.Nutrientid)
                .ValueGeneratedNever()
                .HasColumnName("nutrientid");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
        });

        modelBuilder.Entity<UsdaNutrientGoal>(entity =>
        {
            entity.HasKey(e => e.Goalid).HasName("usda_nutrient_goal_pkey");

            entity.ToTable("usda_nutrient_goal");

            entity.Property(e => e.Goalid).HasColumnName("goalid");
            entity.Property(e => e.Ai).HasColumnName("ai");
            entity.Property(e => e.Amdr)
                .HasMaxLength(50)
                .HasColumnName("amdr");
            entity.Property(e => e.Groupid).HasColumnName("groupid");
            entity.Property(e => e.Nutrientid).HasColumnName("nutrientid");
            entity.Property(e => e.Rda).HasColumnName("rda");
            entity.Property(e => e.Ul).HasColumnName("ul");

            entity.HasOne(d => d.Group).WithMany(p => p.UsdaNutrientGoals)
                .HasForeignKey(d => d.Groupid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("usda_nutrient_goal_groupid_fkey");

            entity.HasOne(d => d.Nutrient).WithMany(p => p.UsdaNutrientGoals)
                .HasForeignKey(d => d.Nutrientid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("usda_nutrient_goal_nutrientid_fkey");
        });

        modelBuilder.Entity<UsdaRecommendedNutrientValue>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("usda_recommended_nutrient_value");

            entity.Property(e => e.Groupid).HasColumnName("groupid");
            entity.Property(e => e.MaxAge).HasColumnName("max_age");
            entity.Property(e => e.MinAge).HasColumnName("min_age");
            entity.Property(e => e.NutrientName)
                .HasMaxLength(255)
                .HasColumnName("nutrient_name");
            entity.Property(e => e.RecommendedValue).HasColumnName("recommended_value");
            entity.Property(e => e.RecommendedValueType).HasColumnName("recommended_value_type");
            entity.Property(e => e.Sex)
                .HasMaxLength(50)
                .HasColumnName("sex");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
