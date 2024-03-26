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
  public async Task<ActionResult<List<PatientResponse>>> GetAllPatients()
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

    var patientResponses = patients.Select(p => p.ToPatientResponse()).ToList();
    return Ok(patientResponses);
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

    logger.LogInformation($"Default Patient Goals: {patient?.UseDefaultNutrientGoals}");

    if (patient?.UseDefaultNutrientGoals ?? false || patient?.UseDefaultNutrientGoals == true)
    {
      patient.Age = 19; // Default age
      patient.Sex = "M"; // Default sex
    }

    Guid? pictureName = null;
    if (!patient?.Base64Image.IsNullOrEmpty() ?? false)
    {
      pictureName = Guid.NewGuid();
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
      OptOutDetails = patient.UseDefaultNutrientGoals ?? false ? true : false,
      Sex = patient.Sex != "M" && patient.Sex != "F" ? "M" : patient.Sex, // This was Drew Gordons desicion
      ProfilePictureName = patient?.Base64Image != null ? pictureName?.ToString() : null,
      CustomerId = customer.Id,
    };

    await context.Patients.AddAsync(newPatient);
    await context.SaveChangesAsync();

    return Ok(new { message = "Patient created successfully", id = newPatient.Id });
  }

  // Update a patient
  [HttpPut("update-patient")]
  public async Task<ActionResult> UpdatePatient([FromBody] UpdatePatientRequest patient)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    if (patient?.OptOut ?? false)
    {
      patient.Age = 19; // Default age
      patient.Sex = "M"; // Default sex
    }

    if (patient == null)
    {
      return BadRequest(new { message = "Patient data is required" });
    }

    if (patient?.Firstname == null)
    {
      return BadRequest(new { message = "First name is required" });
    }

    if (patient?.Lastname == null)
    {
      return BadRequest(new { message = "Last name is required" });
    }

    if (patient?.Id == null)
    {
      return BadRequest(new { message = "Patient ID is required" });
    }

    if (patient?.CustomerId == null)
    {
      return BadRequest(new { message = "Customer ID is required" });
    }

    using var transaction = await context.Database.BeginTransactionAsync();

    var patientToUpdate = await context.Patients
        .FirstOrDefaultAsync(p => p.Id == patient.Id && p.CustomerId == customer.Id);

    if (patientToUpdate == null)
    {
      transaction.Rollback();
      return NotFound();
    }

    patientToUpdate.Firstname = patient.Firstname;
    patientToUpdate.Lastname = patient.Lastname;
    patientToUpdate.Age = patient.Age;
    patientToUpdate.OptOutDetails = (patient.OptOut ?? false) ? true : false;
    patientToUpdate.Sex = (patient.Sex != "M" && patient.Sex != "F") ? "M" : patient.Sex;

    // handle updating patient image
    if (!patient.Base64Image.IsNullOrEmpty() && patient.Base64Image != null)
    {
      if (patientToUpdate.ProfilePictureName != null)
      {
        System.IO.File.Delete($"{configuration["IMAGE_PATH"]}/{patientToUpdate.ProfilePictureName}.png");
      }

      var pictureName = Guid.NewGuid();
      var base64Image = patient.Base64Image.Split(',')[1];
      byte[] bytes = Convert.FromBase64String(base64Image);
      System.IO.File.WriteAllBytes($"{configuration["IMAGE_PATH"]}/{pictureName}.png", bytes);
      patientToUpdate.ProfilePictureName = pictureName.ToString();
    }

    await context.SaveChangesAsync();
    await transaction.CommitAsync();

    return Ok(new { message = "Patient updated successfully" });
  }

  // Get a single patient by ID
  [HttpGet("{id}")]
  public async Task<ActionResult<PatientResponse>> GetPatient(Guid id)
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

    return Ok(patient.ToPatientResponse());
  }

  [HttpDelete("Delete/{patientId}")]
  public async Task<ActionResult> DeletePatient(Guid patientId)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);

    if (customer == null)
    {
      return Unauthorized();
    }

    // Don't allow deletion of last patient
    var patientCount = await context.Patients.CountAsync(p => p.CustomerId == customer.Id);
    if (patientCount <= 1)
    {
      return BadRequest(new { message = "You cannot delete your last patient" });
    }

    using var transaction = await context.Database.BeginTransactionAsync();

    var patient = await context.Patients
        .FirstOrDefaultAsync(p => p.Id == patientId);

    if (patient?.CustomerId != customer.Id)
    {
      transaction.Rollback();
      return Unauthorized();
    }

    if (patient == null)
    {
      transaction.Rollback();
      return NotFound();
    }

    context.Patients.Remove(patient);
    await context.SaveChangesAsync();
    await transaction.CommitAsync();

    return Ok(new { message = "Patient deleted successfully" });
  }
}
