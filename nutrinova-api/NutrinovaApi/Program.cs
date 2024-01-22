using System.Net.WebSockets;
using System.Text.Json.Serialization;
using DotNetEnv;
using Microsoft.OpenApi.Models;
using NutrinovaData.Features.Chat;
using NutrinovaData.Features.Nutrients;
using NutrinovaData.Features.Recipes;
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
    builder.Services.AddSingleton<WebSocketManager>();
    builder.Services.AddOpenAIService();
    builder.Services.AddScoped<INovaChatService, NovaChatService>();

    var app = builder.Build();

    app.UseAuthentication();
    app.UseAuthorization();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.UseWebSockets();

    app.Map("/ws/repeater", async (context) =>
      {
        if (context.WebSockets.IsWebSocketRequest)
        {
          var webSocketManager = app.Services.GetRequiredService<WebSocketManager>();
          WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
          string connId = webSocketManager.AddSocket(webSocket);
          await webSocketManager.EchoMessagesAsync(webSocket, CancellationToken.None);
        }
        else
        {
          context.Response.StatusCode = StatusCodes.Status400BadRequest;
          await context.Response.WriteAsync("Not a websocket request");
        }
      });

    app.MapControllers();

    app.Run();
  }

  private static async Task Echo(HttpContext context, WebSocket webSocket)
  {
    var buffer = new byte[1024 * 4];
    WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    while (!result.CloseStatus.HasValue)
    {
      await webSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);

      result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    }

    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
  }
}
