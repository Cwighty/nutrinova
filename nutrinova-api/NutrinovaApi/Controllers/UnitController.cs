using Microsoft.EntityFrameworkCore;
using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class UnitController : ControllerBase
{
    private readonly ILogger<NutrientController> logger;
    private readonly NutrinovaDbContext context;

    public UnitController(ILogger<NutrientController> logger, NutrinovaDbContext context)
    {
        this.logger = logger;
        this.context = context;
    }

    [HttpGet("all-units")]
    public async Task<ActionResult<IEnumerable<Unit>>> RetrieveAllUnits()
    {
        try
        {
            logger.LogInformation("Retrieving all units...");
            var res = await context.Units.ToListAsync();
            return Ok(res);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to retrieve units from database");
            return StatusCode(500, "Failed to retrieve units from database");
        }
    }
}
