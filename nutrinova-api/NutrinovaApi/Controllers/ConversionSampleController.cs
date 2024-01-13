using NutrinovaData;
using NutrinovaData.Entities;

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
  public async Task<IActionResult> CreateNewSample(FoodConversionSample foodConversionSample)
  {
    foodConversionSample.Id = Guid.NewGuid();
    this.context.FoodConversionSamples.Add(foodConversionSample);
    await this.context.SaveChangesAsync();
    return this.Ok();
  }
}
