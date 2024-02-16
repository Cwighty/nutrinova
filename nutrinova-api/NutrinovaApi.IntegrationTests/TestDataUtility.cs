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

  public async Task<Patient> EnsurePatientExistsAsync(Customer customer)
  {
    var patient = await context.Patients.Where(p => p.CustomerId == customer.Id).FirstOrDefaultAsync();
    if (patient == null)
    {
      patient = new Patient
      {
        Id = Guid.NewGuid(),
        CustomerId = customer!.Id,
        Firstname = "Test",
        Lastname = "Patient",
        Age = 30,
        Sex = "F",
      };
      context.Patients.Add(patient);
      await context.SaveChangesAsync();
    }

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
    var patient = await EnsurePatientExistsAsync(customer);
    var meal = new Meal
    {
      Id = Guid.NewGuid(),
      PatientId = patient.Id,
      Ingredients = "Test Ingredients",
      Amount = 5,
      Description = "Apple",
      Unit = 3,
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

  public async Task<FoodPlan> CreateFoodAsync()
  {
    var nutrient = context.Nutrients.FirstOrDefault();
    var customer = context.Customers.FirstOrDefault();
    var foodPlan = new FoodPlan
    {
      Id = Guid.NewGuid(),
      CreatedBy = customer!.Id,
      Description = "Test Food",
      Ingredients = "Test Ingredients",
      ServingSize = 1,
      FoodPlanNutrients = new List<FoodPlanNutrient>
      {
        new()
        {
          NutrientId = nutrient!.Id,
          Amount = 10,
        },
      },
    };

    context.FoodPlans.Add(foodPlan);
    await context.SaveChangesAsync();
    return foodPlan;
  }

  public async Task<RecipePlan> CreateRecipeAsync()
  {
    var nutrient = context.Nutrients.FirstOrDefault();
    var customer = context.Customers.FirstOrDefault();
    var food1 = new FoodPlan
    {
      Id = Guid.NewGuid(),
      CreatedBy = customer!.Id,
      Description = "Test Food 1",
      Ingredients = "Test Ingredients 1",
      ServingSize = 1,
      ServingSizeUnit = 1,
      FoodPlanNutrients = new List<FoodPlanNutrient>
      {
        new()
        {
          Id = Guid.NewGuid(),
          NutrientId = nutrient!.Id,
          Amount = 10,
        },
      },
    };
    var food2 = new FoodPlan
    {
      Id = Guid.NewGuid(),
      CreatedBy = customer!.Id,
      Description = "Test Food 2",
      Ingredients = "Test Ingredients 2",
      ServingSize = 1,
      ServingSizeUnit = 1,
      FoodPlanNutrients = new List<FoodPlanNutrient>
      {
        new()
        {
          Id = Guid.NewGuid(),
          NutrientId = nutrient!.Id,
          Amount = 10,
        },
      },
    };
    context.FoodPlans.Add(food1);
    context.FoodPlans.Add(food2);
    await context.SaveChangesAsync();

    var recipePlan = new RecipePlan
    {
      Id = Guid.NewGuid(),
      CreatedBy = customer!.Id,
      Description = "Test Recipe",
      CreatedAt = DateTime.UtcNow,
      Amount = 1,
      ServingSizeUnit = 1,
    };

    recipePlan.RecipeFoods = new List<RecipeFood>
    {
      new()
      {
        Id = Guid.NewGuid(),
        FoodId = food1.Id,
        Amount = 1,
        UnitId = 1,
      },
      new()
      {
        Id = Guid.NewGuid(),
        FoodId = food2.Id,
        Amount = 1,
        UnitId = 1,
      },
    };

    context.RecipePlans.Add(recipePlan);
    await context.SaveChangesAsync();
    return recipePlan;
  }

  public async Task<PatientNutrientGoal> CreatePatientGoalAsync()
  {
    var patient = await EnsurePatientExistsAsync(await EnsureCustomerExistsAsync(factory.DefaultCustomerId));
    var nutrient = await EnsureNutrientExistsAsync();

    var goal = new PatientNutrientGoal
    {
      Id = Guid.NewGuid(),
      PatientId = patient.Id,
      NutrientId = nutrient.Id,
      DailyGoalAmount = 100,
    };

    context.PatientNutrientGoals.Add(goal);
    await context.SaveChangesAsync();
    return goal;
  }
}
