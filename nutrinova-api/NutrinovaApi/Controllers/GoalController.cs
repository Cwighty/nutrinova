using NutrinovaData.Features.Chat;
using NutrinovaData.Features.Goals;
using NutrinovaData.Features.Nutrients;
using NutrinovaData.Features.Reports;

namespace NutrinovaApi.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class GoalController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<ChatController> logger;
  private readonly INutrientGoalReportCreator reportCreator;
  private readonly INutrientRecommendationService nutrientReccomendationService;

  public GoalController(
      NutrinovaDbContext context,
      ILogger<ChatController> logger,
      INutrientGoalReportCreator reportCreator,
      INutrientRecommendationService nutrientReccomendationService)
  {
    this.context = context;
    this.logger = logger;
    this.reportCreator = reportCreator;
    this.nutrientReccomendationService = nutrientReccomendationService;
  }

  [HttpGet("all")]
  public async Task<ActionResult<IEnumerable<NutrientGoalResponse>>> GetGoals()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients.Where(p => p.CustomerId == customer.Id).ToListAsync();

    var goals = await context
        .PatientNutrientDailyGoals.Where(g => g.Patient.CustomerId == customer.Id)
        .IncludeAllGoalDependencies()
        .ToListAsync();

    return Ok(goals.ToResponseModels());
  }

  [HttpPost]
  public async Task<ActionResult<NutrientGoalResponse>> CreateGoal(
      NutrientGoalRequestModel request)
  {
    if (request.NutrientId == 0)
    {
      return BadRequest("Nutrient Required");
    }

    if (request.PatientId == Guid.Empty)
    {
      return BadRequest("Patient Required");
    }

    if (
        request.UseRecommended == false
        && request.DailyUpperLimit == 0
        && request.DailyLowerLimit == 0)
    {
      return BadRequest("A goal is required");
    }

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patient = await context.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId);
    if (patient is null)
    {
      return NotFound("Patient Not Found");
    }

    var nutrient = await context.Nutrients.FirstOrDefaultAsync(n => n.Id == request.NutrientId);
    if (nutrient is null)
    {
      return NotFound("Nutrient Not Found");
    }

    var usdaNutrient = await context.UsdaNutrients.FirstOrDefaultAsync(n =>
        n.Name == nutrient.Description);
    if (usdaNutrient is null)
    {
      return NotFound("Nutrient Not Found");
    }

    var patientSex = patient.Sex == "F" ? Sex.Female : Sex.Male;
    var nutrientReccomendation =
        await nutrientReccomendationService.GetNutrientReccomendationAsync(
            usdaNutrient,
            patient.Age ?? 0,
            patientSex);

    var goal = new PatientNutrientDailyGoal
    {
      Id = Guid.NewGuid(),
      PatientId = request.PatientId,
      NutrientId = request.NutrientId,
      CustomLowerTarget = request.UseRecommended ? null : request.DailyLowerLimit,
      CustomUpperTarget = request.UseRecommended ? null : request.DailyUpperLimit,
      RecommendedUpperTarget =
            nutrientReccomendation.RecommendedValueType == "UL"
                ? nutrientReccomendation.RecommendedValue
                : null,
      RecommendedLowerTarget =
            (
                nutrientReccomendation.RecommendedValueType == "AI"
                | nutrientReccomendation.RecommendedValueType == "RDA")
                ? nutrientReccomendation.RecommendedValue
                : null,
    };

    context.PatientNutrientDailyGoals.Add(goal);
    await context.SaveChangesAsync();

    goal = await context
        .PatientNutrientDailyGoals.Where(g => g.Id == goal.Id)
        .IncludeAllGoalDependencies()
        .FirstOrDefaultAsync();

    return Ok(goal!.ToResponseModel());
  }

  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteGoal(Guid id)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients.Where(p => p.CustomerId == customer.Id).ToListAsync();

    var goal = await context
        .PatientNutrientDailyGoals.Where(g => g.Id == id)
        .FirstOrDefaultAsync();
    if (goal is null)
    {
      return NotFound();
    }

    if (!patients.Any(p => p.Id == goal.PatientId))
    {
      return Unauthorized();
    }

    context.PatientNutrientDailyGoals.Remove(goal);
    await context.SaveChangesAsync();

    return Ok();
  }

  [HttpGet("report")]
  public async Task<ActionResult<AggregatePatientNutrientReport>> GetGoalReport(DateTime beginDate, DateTime endDate, int nutrientId = 0, Guid patientId = default)
  public async Task<ActionResult<AggregatePatientNutrientReport>> GetGoalReport(
      DateTime beginDate,
      DateTime endDate,
      int nutrientId = 0,
      Guid patientId = default)
  {
    beginDate = DateTime.SpecifyKind(beginDate, DateTimeKind.Utc);
    endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patientsWithMealsAndGoalsForDateRange = await context
        .Patients.Include(p =>
            p.Meals.Where(m => m.Recordedat >= beginDate.Date && m.Recordedat <= endDate.Date))
        .ThenInclude(m => m.MealNutrients)
        .ThenInclude(m => m.Nutrient)
        .ThenInclude(n => n.PreferredUnitNavigation)
        .ThenInclude(u => u.Category)
        .Include(p => p.PatientNutrientDailyGoals)
        .ThenInclude(g => g.Nutrient)
        .ThenInclude(n => n.PreferredUnitNavigation)
        .ThenInclude(u => u.Category)
        .Where(p => p.CustomerId == customer.Id)
        .ToListAsync();

    var patientReports = new List<PatientNutrientReport>();
    foreach (var p in patientsWithMealsAndGoalsForDateRange)
    {
      if (patientId != Guid.Empty && p.Id != patientId)
      {
        continue;
      }

      try
      {
        var report = reportCreator.CreateNutrientGoalReportForPatient(
            p,
            beginDate,
            endDate,
            nutrientId);
        patientReports.Add(report);
      }
      catch (ArgumentException)
      {
        return NotFound(
            "No nutrient goals found matching patient, nutrient, or date range");
      }
    }

    var aggregateReport = new AggregatePatientNutrientReport
    {
      BeginDate = beginDate,
      EndDate = endDate,
      PatientReports = patientReports,
      DaysCount = patientReports.Count,
    };

    return Ok(aggregateReport);
  }

  [HttpGet("reccomendation")]
  public async Task<ActionResult<UsdaRecommendedNutrientValue>> GetNutrientReccomendation(
      [FromQuery] int nutrientId,
      [FromQuery] Guid patientId)
  {
    var nutrient = await context.Nutrients.FirstOrDefaultAsync(n => n.Id == nutrientId);
    if (nutrient is null)
    {
      return NotFound("Nutrient Not Found");
    }

    var usdaNutrient = await context.UsdaNutrients.FirstOrDefaultAsync(n =>
        n.Name == nutrient.Description);
    if (usdaNutrient is null)
    {
      return NotFound("Nutrient Not Found");
    }

    var patient = await context.Patients.FirstOrDefaultAsync(p => p.Id == patientId);
    if (patient is null)
    {
      return NotFound("Patient Not Found");
    }

    var sex = patient.Sex == "F" ? Sex.Female : Sex.Male;

    var reccomendation = await nutrientReccomendationService.GetNutrientReccomendationAsync(
        usdaNutrient,
        patient.Age ?? 0,
        sex);

    if (reccomendation is null)
    {
      return NotFound("Reccomendation Not Found");
    }

    return Ok(reccomendation);
  }
}
