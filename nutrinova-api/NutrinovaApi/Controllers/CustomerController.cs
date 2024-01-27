namespace NutrinovaApi.User.Controllers;

[Authorize]
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
    var exists = context.Customers.Any(c => c.Objectid == id);
    logger.LogInformation($"User exists: {exists}");
    return exists;
  }

  [HttpGet("get")]
  public ActionResult<Customer> GetUser([FromQuery] string id)
  {
    logger.LogInformation("Getting user...");
    var user = context.Customers.FirstOrDefault(c => c.Objectid == id);
    if (user == null)
    {
      logger.LogInformation("User not found");
      return NotFound();
    }

    logger.LogInformation("User found");
    return user;
  }

  [HttpPost("create")]
  public async Task<IActionResult> CreateUser(Customer customer)
  {
    logger.LogInformation("Creating user...");
    if (context.Customers.Any(c => c.Objectid == customer.Objectid))
    {
      logger.LogInformation("User already exists");
      return BadRequest("User already exists");
    }

    customer.Id = Guid.NewGuid();
    customer.CreatedAt = DateTime.UtcNow;

    Patient patient = new()
    {
      Id = Guid.NewGuid(),
      Firstname = "You",
      Lastname = "You",
      CustomerId = customer.Id,
      Customer = customer,
    };

    await context.Patients.AddAsync(patient);
    await context.Customers.AddAsync(customer);
    await context.SaveChangesAsync();

    logger.LogInformation("User created");
    return Ok();
  }
}
