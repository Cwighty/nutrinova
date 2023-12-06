using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.User.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class CustomerController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<CustomerController> logger;

  public CustomerController(NutrinovaDbContext dbContext, ILogger<CustomerController> logger)
  {
    this.context = dbContext;
    this.logger = logger;
  }

  [HttpGet("exists")]
  public ActionResult<bool> UserExists([FromQuery] string id)
  {
    logger.LogInformation("Checking if user exists...");
    var exists = context.Customers.Any(c => c.ObjectId == id);
    logger.LogInformation($"User exists: {exists}");
    return exists;
  }

  [HttpPost("create")]
  public async Task<IActionResult> CreateUser(Customer customer)
  {
    logger.LogInformation("Creating user...");
    if (context.Customers.Any(c => c.ObjectId == customer.ObjectId))
    {
      logger.LogInformation("User already exists");
      return BadRequest("User already exists");
    }

    customer.Id = Guid.NewGuid();
    customer.CreatedAt = DateTime.UtcNow;

    await context.Customers.AddAsync(customer);
    await context.SaveChangesAsync();

    logger.LogInformation("User created");
    return Ok();
  }
}
