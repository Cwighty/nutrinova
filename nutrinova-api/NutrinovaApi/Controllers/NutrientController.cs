using Microsoft.EntityFrameworkCore;
using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class NutrientController : ControllerBase
{
    // USDA API Documentation: https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/getFood
    private readonly ILogger<NutrientController> logger;
    private readonly NutrinovaDbContext context;

    public NutrientController(ILogger<NutrientController> logger, NutrinovaDbContext context)
    {
        this.logger = logger;
        this.context = context;
    }

    [HttpGet("all-nutrients")]
    public async Task<ActionResult<IEnumerable<Nutrient>>> RetrieveAllNutrients()
    {
        try
        {
            logger.LogInformation("Retrieving all nutrients...");
            var res = await context.Nutrients.ToListAsync();
            return Ok(res);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to retrieve data");
            return StatusCode(500, "Failed to retrieve data from database");
        }
    }
}
