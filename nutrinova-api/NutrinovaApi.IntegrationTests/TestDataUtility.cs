namespace NutrinovaApi.IntegrationTests;

internal class TestDataUtility
{
  private readonly NutrinovaDbContext context;

  public TestDataUtility(NutrinovaDbContext dbContext)
  {
    context = dbContext;
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
}
