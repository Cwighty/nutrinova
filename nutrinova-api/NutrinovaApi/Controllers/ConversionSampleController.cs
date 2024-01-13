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
    var sample = new FoodConversionSample
    {
      Id = Guid.NewGuid(),
      FoodPlanId = foodConversionSample.FoodPlanId,
      FoodServingsPerMeasurement = foodConversionSample.FoodServingsPerMeasurement,
      MeasurementUnitId = foodConversionSample.MeasurementUnitId,
      CreatedAt = DateTime.Now,
    };

    context.FoodConversionSamples.Add(sample);
    await context.SaveChangesAsync();
    return Ok();
  }
}
