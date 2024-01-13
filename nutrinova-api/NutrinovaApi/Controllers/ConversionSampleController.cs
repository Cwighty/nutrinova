using NutrinovaData;
using NutrinovaData.Entities;
using NutrinovaData.RequestModels;

namespace NutrinovaApi.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class ConversionSampleController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<ConversionSampleController> logger;

  public ConversionSampleController(NutrinovaDbContext dbContext, ILogger<ConversionSampleController> logger)
  {
    this.context = dbContext;
    this.logger = logger;
  }

  [HttpPost]
  public async Task<IActionResult> CreateNewSample(CreateFoodConversionSampleRequestModel foodConversionSample)
  {
    var food = await context.FoodPlans.FindAsync(foodConversionSample.FoodPlanId);

    if (food == null)
    {
      return BadRequest("Food plan not found");
    }

    var sample = new FoodConversionSample
    {
      Id = Guid.NewGuid(),
      FoodPlanId = food.Id,
      FoodPlan = food,
      FoodServingsPerMeasurement = foodConversionSample.FoodServingsPerMeasurement,
      MeasurementUnitId = foodConversionSample.MeasurementUnitId,
      CreatedAt = DateTime.UtcNow,
    };

    context.FoodConversionSamples.Add(sample);
    await context.SaveChangesAsync();
    return Ok();
  }
}
