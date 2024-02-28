using System.Text.Json.Serialization;
using DotNetEnv;
using Microsoft.OpenApi.Models;
using NutrinovaData.Features.Chat;
using NutrinovaData.Features.Nutrients;
using NutrinovaData.Features.Recipes;
using NutrinovaData.Features.Reports;
using NutrinovaData.Features.Units;
using OpenAI.Extensions;

namespace NutrinovaApi;

public class Program
{
  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    if (builder.Environment.IsDevelopment())
    {
      Env.Load(".env.local");
    }

    // Add services to the container.
    builder.Services.AddKeycloakAuthentication(builder.Configuration);

    builder.Services.AddControllers().AddJsonOptions(x =>
            x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

    builder.Configuration
        .AddJsonFile("appsettings.json")
        .AddEnvironmentVariables()
        .AddCommandLine(args)
        .Build();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    _ = builder.Services.AddSwaggerGen(option =>
        {
          option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
          option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
          {
            In = ParameterLocation.Header,
            Description = "Please enter a valid token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "Bearer",
          });
          option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer",
                        },
                    },
                    new string[] { }
                },
        });
        });

    builder.Services.AddDbContext<NutrinovaDbContext>(options =>
    {
      options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
      options.EnableDetailedErrors();
      options.EnableSensitiveDataLogging();
    });

    builder.Services.AddScoped<INutrientMatcher, CosineDistanceNutrientMatcher>();
    builder.Services.AddScoped<IUnitConverter, UnitConverter>();
    builder.Services.AddScoped<IRecipeFoodTotaler, RecipeFoodTotaler>();
    builder.Services.AddScoped<IFoodNutrientMapper, NutrientImporter>();
    builder.Services.AddScoped<IDensityCalculator, DensityCalculator>();
    builder.Services.AddScoped<INutrientGoalReportCreator, NutrientGoalReportCreator>();
    builder.Services.AddOpenAIService();
    builder.Services.AddScoped<INovaChatService, NovaChatService>();
    builder.Services.AddScoped<INutrientRecommendationService, UsdaNutrientRecommendationService>();

    var app = builder.Build();

    app.UseAuthentication();
    app.UseAuthorization();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.MapControllers();

    app.Run();
  }
}
