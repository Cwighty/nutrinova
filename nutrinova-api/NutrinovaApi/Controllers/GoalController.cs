﻿using NutrinovaData.Features.Chat;
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
  private readonly INutrientRecommendationService nutrientRecommendationService;

  public GoalController(NutrinovaDbContext context, ILogger<ChatController> logger, INutrientGoalReportCreator reportCreator, INutrientRecommendationService nutrientRecommendationService)
  {
    this.context = context;
    this.logger = logger;
    this.reportCreator = reportCreator;
    this.nutrientRecommendationService = nutrientRecommendationService;
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
    if (usdaNutrient is null && request.UseRecommended)
    {
      return NotFound("USDA Nutrient Not Found");
    }

    var patientSex = patient.Sex == "F" ? Sex.Female : Sex.Male;
    UsdaRecommendedNutrientValue? nutrientRecommendation = null;
    if (usdaNutrient != null)
    {
      nutrientRecommendation = await nutrientRecommendationService.GetNutrientRecommendationAsync(usdaNutrient, patient.Age, patientSex);
    }

    var goal = new PatientNutrientDailyGoal
    {
      Id = Guid.NewGuid(),
      PatientId = request.PatientId,
      NutrientId = request.NutrientId,
      CustomLowerTarget = request.UseRecommended ? null : request.DailyLowerLimit,
      CustomUpperTarget = request.UseRecommended ? null : request.DailyUpperLimit,
      RecommendedUpperTarget = nutrientRecommendation?.RecommendedValueType == "UL" ? nutrientRecommendation.RecommendedValue : null,
      RecommendedLowerTarget = (nutrientRecommendation?.RecommendedValueType == "AI" | nutrientRecommendation?.RecommendedValueType == "RDA") ? nutrientRecommendation?.RecommendedValue : null,
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
  public async Task<ActionResult> DeleteGoal(int id)
  {
    var userObjectId = User.GetObjectIdFromClaims();
    var customer = await context.Customers.FirstOrDefaultAsync(c => c.Objectid == userObjectId);
    if (customer is null || customer?.Id is null)
    {
      return Unauthorized();
    }

    var patients = await context.Patients.Where(p => p.CustomerId == customer.Id).ToListAsync();

    var goal = await context
        .PatientNutrientDailyGoals.Where(g => g.NutrientId == id)
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
  public async Task<ActionResult<AggregatePatientNutrientReport>> GetGoalReport(
      DateTime beginDate,
      DateTime endDate,
      int nutrientId = 0,
      Guid patientId = default)
  {
    beginDate = DateTime.SpecifyKind(beginDate, DateTimeKind.Utc);
    endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

    if (beginDate == endDate)
    {
      endDate = endDate.AddDays(1);
    }

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
        continue;
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

  [HttpGet("recommendation")]
  public async Task<ActionResult<UsdaRecommendedNutrientValue>> GetNutrientRecommendation(
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

    var recommendation = await nutrientRecommendationService.GetNutrientRecommendationAsync(usdaNutrient, patient.Age, sex);

    if (recommendation is null)
    {
      return NotFound("Recommendation Not Found");
    }

    return Ok(recommendation);
  }
}
