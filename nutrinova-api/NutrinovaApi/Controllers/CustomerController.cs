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
      return context.Customers.Any(c => c.Id.ToString() == id);
   }

   [HttpPost("create")]
   public async Task<IActionResult> CreateUser(Customer customer)
   {
      logger.LogInformation("Creating user...");
      if (context.Customers.Any(c => c.Id == customer.Id))
      {
         logger.LogInformation("User already exists");
         return BadRequest("User already exists");
      }

      await context.Customers.AddAsync(customer);
      await context.SaveChangesAsync();

      logger.LogInformation("User created");
      return Ok();
   }
}
