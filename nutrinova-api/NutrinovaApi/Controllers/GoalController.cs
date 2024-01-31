﻿using NutrinovaData.Features.Chat;
using NutrinovaData.Features.Goals;

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
}