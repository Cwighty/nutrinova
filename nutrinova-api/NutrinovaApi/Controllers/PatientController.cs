using NutrinovaData.Features.Patients;

namespace NutrinovaApi.Controllers;

[Authorize]
[ApiController]
[Route("/be/[controller]")]
public class PatientController : ControllerBase
{
  private readonly NutrinovaDbContext context;

  public PatientController(NutrinovaDbContext context)
  {
    this.context = context;
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
    var newPatient = new Patient
    {
      Id = Guid.NewGuid(),
      Firstname = patient.Firstname,
      Lastname = patient.Lastname,
      Age = patient.Age,
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
