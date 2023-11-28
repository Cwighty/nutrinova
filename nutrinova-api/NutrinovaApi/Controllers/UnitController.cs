using Microsoft.EntityFrameworkCore;
using NutrinovaData;

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
  public async Task<ActionResult<IEnumerable<UnitOption>>> RetrieveAllUnits()
  {
    try
    {
      logger.LogInformation("Retrieving all units...");
      var res = await context.Units.Include(u => u.Category).ToListAsync();
      var options = res.Select(u => new UnitOption()
      {
        Id = u.Id,
        Description = u.Description,
        Abbreviation = u.Abbreviation,
        CategoryName = u.Category?.Description ?? string.Empty,
        Category = u.Category,
      });
      return Ok(options);
    }
    catch (Exception e)
    {
      logger.LogError(e, "Failed to retrieve units from database");
      return StatusCode(500, "Failed to retrieve units from database");
    }
  }
}
