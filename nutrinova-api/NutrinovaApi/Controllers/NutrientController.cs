using Microsoft.EntityFrameworkCore;
using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class NutrientController : ControllerBase
{
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
            logger.LogError(e, "Failed to retrieve nutrients from database");
            return StatusCode(500, "Failed to retrieve nutrients from database");
        }
    }
}
