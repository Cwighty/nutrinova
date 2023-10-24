using NutrinovaData;
using NutrinovaData.Entities;

namespace NutrinovaApi.User.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class CustomerController : ControllerBase
{
   private readonly NutrinovaDbContext context;

   public CustomerController(NutrinovaDbContext dbContext)
   {
      this.context = dbContext;
   }

   [HttpGet("exists")]
   public ActionResult<bool> UserExists([FromQuery] string id)
   {
      return context.Customers.Any(c => c.Id.ToString() == id);
   }

   [HttpPost("create")]
   public async Task<IActionResult> CreateUser([FromBody] Customer customer)
   {
      if (context.Customers.Any(c => c.Id == customer.Id))
      {
         return BadRequest("User already exists");
      }

      await context.Customers.AddAsync(customer);
      await context.SaveChangesAsync();

      return Ok();
   }
}