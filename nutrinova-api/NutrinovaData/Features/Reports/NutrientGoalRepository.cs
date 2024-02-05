namespace NutrinovaData.Features.Reports;

public class NutrientGoalRepository
{
  private readonly NutrinovaDbContext _context;

  public NutrientGoalRepository(NutrinovaDbContext context)
  {
    _context = context;
  }
}
