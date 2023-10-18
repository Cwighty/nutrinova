using Microsoft.AspNetCore.Mvc;

namespace NutrinovaApi.User.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class UserController : ControllerBase
{
   public UserController(NurishDbContext context)
   {

   }  
}