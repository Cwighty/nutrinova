namespace NutrinovaApi.IntegrationTests;

internal class TestDataUtility
{
  private readonly NutrinovaDbContext context;
  private readonly NutrinovaApiWebApplicationFactory factory;

  public TestDataUtility(NutrinovaDbContext dbContext, NutrinovaApiWebApplicationFactory factory)
  {
    context = dbContext;
    this.factory = factory;
  }

  public async Task<Customer> EnsureCustomerExistsAsync(string customerId)
  {
    var customer = await context.Customers.Where(c => c.Objectid == customerId).FirstOrDefaultAsync();
    if (customer == null)
    {
      throw new InvalidOperationException("No Customer in Test Database");
    }

    return customer;
  }

  public async Task<Patient> CreatePatientAsync(Customer customer)
  {
    var patient = new Patient
    {
      Id = Guid.NewGuid(),
      CustomerId = customer!.Id,
      Firstname = "Test",
      Lastname = "Patient",
    };
    context.Patients.Add(patient);
    await context.SaveChangesAsync();
    return patient;
  }

  public async Task<Nutrient> EnsureNutrientExistsAsync()
  {
    var nutrient = await context.Nutrients.FirstOrDefaultAsync();
    if (nutrient == null)
    {
      throw new InvalidOperationException("No Nutrients in Test Database");
    }

    return nutrient;
  }

  public async Task<Meal> CreateMealAsync(DateTime date = default)
  {
    if (date == default)
    {
      date = DateTime.UtcNow;
    }

    var nutrient = await EnsureNutrientExistsAsync();
    var customer = await EnsureCustomerExistsAsync(factory.DefaultCustomerId);
    var patient = await CreatePatientAsync(customer);
    var meal = new Meal
    {
      Id = Guid.NewGuid(),
      PatientId = patient.Id,
      Ingredients = "Test Ingredients",
      Description = "Apple",
      MealNutrients = new List<MealNutrient>
      {
        new()
        {
          NutrientId = nutrient.Id,
          Amount = 10,
        },
      },
      Notes = "Test Notes",
      Recordedat = date,
      Recordedby = "Test User",
    };

    context.Meals.Add(meal);
    await context.SaveChangesAsync();
    return meal;
  }
}
