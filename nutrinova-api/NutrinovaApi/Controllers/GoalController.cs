using NutrinovaData.Features.Chat;
using NutrinovaData.Features.Goals;
using NutrinovaData.Features.Patients;

namespace NutrinovaApi.Controllers;

[ApiController]
[Route("/be/[controller]")]
public class GoalController : ControllerBase
{
  private readonly NutrinovaDbContext context;
  private readonly ILogger<ChatController> logger;

  public GoalController(NutrinovaDbContext context, ILogger<ChatController> logger)
  {
    this.context = context;
    this.logger = logger;
  }

  [HttpGet("all")]
  public async Task<ActionResult<IEnumerable<PatientNutrientGoalResponse>>> GetGoals()
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients
      .Where(p => p.CustomerId == customer.Id)
      .ToListAsync();

    var goals = await context.PatientNutrientGoals
      .Where(g => g.Patient.CustomerId == customer.Id)
      .IncludeAllGoalDependencies()
      .ToListAsync();

    return Ok(goals.ToResponseModels());
  }

  [HttpPost]
  public async Task<ActionResult<PatientNutrientGoalResponse>> CreateGoal(PatientNutrientGoalRequestModel request)
  {
    if (request.NutrientId == 0 || !(request.DailyGoalAmount > 0))
    {
      return BadRequest("All request parameters are required.");
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
      return NotFound();
    }

    var nutrient = await context.Nutrients.FirstOrDefaultAsync(n => n.Id == request.NutrientId);
    if (nutrient is null)
    {
      return NotFound();
    }

    var goal = new PatientNutrientGoal
    {
      Id = Guid.NewGuid(),
      PatientId = request.PatientId,
      NutrientId = request.NutrientId,
      DailyGoalAmount = request.DailyGoalAmount,
    };

    context.PatientNutrientGoals.Add(goal);
    await context.SaveChangesAsync();

    goal = await context.PatientNutrientGoals.Where(g => g.Id == goal.Id)
      .IncludeAllGoalDependencies()
      .FirstOrDefaultAsync();

    return Ok(goal!.ToResponseModel());
  }

  [HttpPut("{id}")]
  public async Task<ActionResult<PatientNutrientGoalResponse>> UpdateGoal(Guid id, PatientNutrientGoalRequestModel request)
  {
    if (request.PatientId == Guid.Empty || request.NutrientId == 0 || !(request.DailyGoalAmount > 0))
    {
      return BadRequest("All request parameters are required.");
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
      return NotFound();
    }

    var nutrient = await context.Nutrients.FirstOrDefaultAsync(n => n.Id == request.NutrientId);
    if (nutrient is null)
    {
      return NotFound();
    }

    var goal = await context.PatientNutrientGoals.Where(g => g.Id == id)
      .IncludeAllGoalDependencies()
      .AsTracking()
      .FirstOrDefaultAsync();

    if (goal is null)
    {
      return NotFound();
    }

    goal.PatientId = request.PatientId;
    goal.NutrientId = request.NutrientId;
    goal.DailyGoalAmount = request.DailyGoalAmount;

    await context.SaveChangesAsync();

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

    var patients = await context.Patients
      .Where(p => p.CustomerId == customer.Id)
      .ToListAsync();

    var goal = await context.PatientNutrientGoals.Where(g => g.Id == id).FirstOrDefaultAsync();
    if (goal is null)
    {
      return NotFound();
    }

    if (!patients.Any(p => p.Id == goal.PatientId))
    {
      return Unauthorized();
    }

    context.PatientNutrientGoals.Remove(goal);
    await context.SaveChangesAsync();

    return Ok();
  }

  [HttpGet("goal-report")]
  public async Task<ActionResult<IEnumerable<PatientNutrientGoalReport>>> GetGoalReport(DateTime beginDate, DateTime endDate)
  {
    beginDate = DateTime.SpecifyKind(beginDate, DateTimeKind.Utc);
    endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients
      .Where(p => p.CustomerId == customer.Id)
      .ToListAsync();

    var patientReports = new List<PatientNutrientGoalReport>();

    foreach (var patient in patients)
    {
      var report = new PatientNutrientGoalReport();
      report.ReportBegin = beginDate;
      report.ReportEnd = endDate;
      report.PatientName = patient.GetFullName();

      var mealsInDateRange = await context.Meals
      .Where(
        m => (
        m.PatientId == patient.Id &&
        m.Recordedat >= beginDate.Date &&
        m.Recordedat <= endDate.Date))
      .Include(m => m.MealNutrients)
        .ThenInclude(m => m.Nutrient)
          .ThenInclude(n => n.PreferredUnit)
      .ToListAsync();

      var goals = await context.PatientNutrientGoals
        .Where(g => g.PatientId == patient.Id)
        .ToListAsync();

      var nutrientSummaries = new Dictionary<int, NutrientSummary>();
      foreach (var meal in mealsInDateRange)
      {
        foreach (var mealNutrient in meal.MealNutrients)
        {
          AggregateMealNutrient(nutrientSummaries, mealNutrient);
        }
      }

      report.NutrientGoalReportItems = nutrientSummaries
        .Where(n => goals.Any(g => g.NutrientId == n.Key))
        .Zip(goals, (n, g) => new NutrientGoalReportItem
        {
          NutrientId = n.Key,
          NutrientName = n.Value.Name!,
          PrefferedUnit = n.Value.Unit!,
          DailyGoalAmount = g.DailyGoalAmount,
          ConsumedAmount = n.Value.Amount,
          RemainingAmount = g.DailyGoalAmount - n.Value.Amount,
        });

      patientReports.Add(report);
    }

    return Ok(patientReports);
  }

  private static void AggregateMealNutrient(Dictionary<int, NutrientSummary> nutrientSummaries, MealNutrient mealNutrient)
  {
    if (nutrientSummaries.TryGetValue(mealNutrient.NutrientId, out NutrientSummary? value))
    {
      value.Amount += mealNutrient.Amount;
    }
    else
    {
      nutrientSummaries.Add(mealNutrient.NutrientId, new NutrientSummary
      {
        NutrientId = mealNutrient.NutrientId,
        Name = mealNutrient.Nutrient.Description,
        Amount = mealNutrient.Amount,
        Unit = mealNutrient.Nutrient.PreferredUnitNavigation.ToUnitOption(),
      });
    }
  }
}
