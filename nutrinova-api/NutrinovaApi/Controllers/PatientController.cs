using Microsoft.IdentityModel.Tokens;
using NutrinovaData.Features.Patients;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class PatientController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<PatientController> logger;
  private readonly IConfiguration configuration;

  public PatientController(NutrinovaDbContext context, ILogger<PatientController> logger, IConfiguration configuration)
  {
    this.context = context;
    this.logger = logger;
    this.configuration = configuration;
  }

  // Get all patients for the logged-in customer
  [HttpGet("all-patients")]
  public async Task<ActionResult> GetAllPatients()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients
        .Where(p => p.CustomerId == customer.Id)
        .ToListAsync();

    return Ok(patients);
  }

  [HttpGet("image/{paitentId}")]
  public async Task<ActionResult> GetImage(Guid paitentId)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    logger.LogInformation($"User object id: {userObjectId}");
    logger.LogInformation($"Here is the patient Id: {paitentId}");

    if (customer == null)
    {
      return Unauthorized();
    }

    var patient = await context.Patients
        .FirstOrDefaultAsync(p => p.Id == paitentId && p.CustomerId == customer.Id);

    if (patient == null)
    {
      return NotFound();
    }

    if (patient.ProfilePictureName.IsNullOrEmpty())
    {
      return NotFound();
    }

    var filePath = configuration["IMAGE_PATH"] + patient.ProfilePictureName + ".png";

    if (!System.IO.File.Exists(filePath))
    {
      return NotFound();
    }

    var bytes = System.IO.File.ReadAllBytes(filePath);
    return File(bytes, "image/png");
  }

  // Create a new patient
  [HttpPost("create-patient")]
  public async Task<ActionResult> CreatePatient([FromBody] CreatePatientRequest patient)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var pictureName = Guid.NewGuid();
    if (!patient.Base64Image.IsNullOrEmpty())
    {
      var base64Image = patient?.Base64Image?.Split(',')[1];
      byte[] bytes = Convert.FromBase64String(base64Image ?? throw new Exception("image stream is null your empty"));
      System.IO.File.WriteAllBytes($"{configuration["IMAGE_PATH"]}/{pictureName}.png", bytes);
    }

    var newPatient = new Patient
    {
      Id = Guid.NewGuid(),
      Firstname = patient?.Firstname ?? throw new InvalidOperationException("First name it required"),
      Lastname = patient.Lastname,
      Age = patient.Age,
      Sex = patient.Sex,
      ProfilePictureName = patient?.Base64Image != null ? pictureName.ToString() : null,
      CustomerId = customer.Id,
    };

    await context.Patients.AddAsync(newPatient);
    await context.SaveChangesAsync();

    return Ok(new { message = "Patient created successfully", id = newPatient.Id });
  }

  // Get a single patient by ID
  [HttpGet("{id}")]
  public async Task<ActionResult<Patient>> GetPatient(Guid id)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    var patient = await context.Patients
        .FirstOrDefaultAsync(p => p.Id == id && p.CustomerId == customer.Id);

    if (patient == null)
    {
      return NotFound();
    }

    return Ok(patient);
  }
}
