using NutrinovaData.Features.Patients;

namespace NutrinovaApi.IntegrationTests;

public class PatientControllerTests : IClassFixture<NutrinovaApiWebApplicationFactory>
{
  internal HttpClient HttpClient { get; set; }

  internal NutrinovaApiWebApplicationFactory Factory { get; set; }

  internal NutrinovaDbContext DbContext { get; set; }

  internal TestDataUtility DataUtility { get; private set; }

  public PatientControllerTests(NutrinovaApiWebApplicationFactory factory)
  {
    HttpClient = factory.CreateClient();
    Factory = factory;
    var scope = factory.Services.GetService<IServiceScopeFactory>()?.CreateScope();
    if (scope == null)
    {
      throw new InvalidOperationException("Service scope could not be created.");
    }

    var dbContext = scope.ServiceProvider.GetRequiredService<NutrinovaDbContext>();
    if (dbContext == null)
    {
      throw new InvalidOperationException("Database context could not be obtained.");
    }

    DbContext = dbContext;
    DataUtility = new TestDataUtility(dbContext, factory);
  }

  public class CreatePatientTests : PatientControllerTests
  {
    public CreatePatientTests(NutrinovaApiWebApplicationFactory factory)
      : base(factory)
    {
    }

    public class CreateUniquePatientTests : PatientControllerTests
    {
      public CreateUniquePatientTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task Create_FemalePatient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "female31",
          Lastname = "Patient",
          Age = 31,
          Sex = "F",
          UseDefaultNutrientGoals = false,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        // Act
        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "female31");
        var response = await HttpClient.GetAsync("be/patient/" + patientGet?.Id ?? throw new InvalidOperationException("Patient not created"));

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        Assert.NotNull(patientResponse);
        Assert.True(patientGet?.Firstname == "female31");
        Assert.True(patientGet?.Age == 31);
        Assert.True(patientGet?.Sex == "F");
        Assert.True(patientResponse.Id == patientGet?.Id);
      }
    }

    public class CreateOtherPatientTests : PatientControllerTests
    {
      public CreateOtherPatientTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task Create_OtherPatient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "other31",
          Lastname = "Patient",
          Age = 31,
          Sex = "O",
          UseDefaultNutrientGoals = false,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        // Act
        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "other31");
        var response = await HttpClient.GetAsync("be/patient/" + patientGet?.Id ?? throw new InvalidOperationException("Patient not created"));

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        Assert.NotNull(patientResponse);
        Assert.True(patientGet?.Firstname == "other31");
        Assert.True(patientGet?.Age == 31);
        Assert.True(patientGet?.Sex == "M");
        Assert.True(patientResponse.Id == patientGet?.Id);
      }
    }

    public class CreatePatientOptOutTests : PatientControllerTests
    {
      public CreatePatientOptOutTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task Create_OptOutPatient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "default",
          Lastname = "Patient",
          Age = 31,
          Sex = "F",
          UseDefaultNutrientGoals = true,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");

        // Act
        var response = await HttpClient.GetAsync("be/patient/" + patientGet?.Id ?? throw new InvalidOperationException("Patient not created"));

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        Assert.NotNull(patientResponse);
        Assert.True(patientGet?.Firstname == "default");
        Assert.True(patientGet?.Age == 19);
        Assert.True(patientGet?.Sex == "M");
        Assert.True(patientResponse.Id == patientGet?.Id);
      }
    }

    public class DeletePatientTests : PatientControllerTests
    {
      public DeletePatientTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task Delete_Patient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "default",
          Lastname = "Patient",
          Age = 31,
          Sex = "F",
          UseDefaultNutrientGoals = true,
        };

        var male_patient = new CreatePatientRequest
        {
          Firstname = "default Male",
          Lastname = "Patient",
          Age = 31,
          Sex = "m",
          UseDefaultNutrientGoals = true,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);
        await HttpClient.PostAsJsonAsync("be/patient/create-patient", male_patient);

        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");

        // Act
        var response = await HttpClient.DeleteAsync($"be/patient/delete/{patientGet?.Id}");

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");
        Assert.Null(patientGet);
      }
    }

    public class DeletePatientLastTests : PatientControllerTests
    {
      public DeletePatientLastTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task DeleteLast_Patient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "default",
          Lastname = "Patient",
          Age = 31,
          Sex = "F",
          UseDefaultNutrientGoals = true,
        };

        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");

        // Act
        var response = await HttpClient.DeleteAsync($"be/patient/delete/{patientGet?.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
      }
    }

    // update patient tests
    // Need to be able to update name, age, sex, opt in and out.
    public class UpdatePatientTests : PatientControllerTests
    {
      public UpdatePatientTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task Update_Patient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "default",
          Lastname = "Patient",
          Age = 31,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");

        Assert.NotNull(patientGet);

        var updatePatient = new UpdatePatientRequest
        {
          Firstname = "updated",
          Lastname = "Patient",
          Age = 33,
          CustomerId = customer.Objectid,
          Id = patientGet.Id,
        };

        // Act
        var response = await HttpClient.PutAsJsonAsync("be/patient/update-patient", updatePatient);

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        Assert.NotNull(patientResponse);

        var patientUpdatedGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "updated");
        Assert.NotNull(patientUpdatedGet);
        DbContext.Entry(patientUpdatedGet).Reload();
        Assert.True(patientUpdatedGet.Firstname == "updated");
        Assert.True(patientUpdatedGet.Age == 33);
        Assert.True(patientUpdatedGet.Lastname == "Patient");
      }
    }

    public class UpdateOptOutPatientTests : PatientControllerTests
    {
      public UpdateOptOutPatientTests(NutrinovaApiWebApplicationFactory factory)
        : base(factory)
      {
      }

      [Fact]
      public async Task UpdateOptOut_Patient()
      {
        // Arrange
        var customer = await DataUtility.EnsureCustomerExistsAsync(Factory.DefaultCustomerId);
        var patient = new CreatePatientRequest
        {
          Firstname = "default",
          Lastname = "Patient",
          Age = 31,
        };
        var patientCreationRes = await HttpClient.PostAsJsonAsync("be/patient/create-patient", patient);

        var patientGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "default");

        Assert.NotNull(patientGet);

        var updatePatient = new UpdatePatientRequest
        {
          Firstname = "updated",
          Lastname = "Patient",
          Age = 33,
          CustomerId = customer.Objectid,
          Id = patientGet.Id,
          Sex = "F",
          OptOut = true,
        };

        // Act
        var response = await HttpClient.PutAsJsonAsync("be/patient/update-patient", updatePatient);

        // Assert
        response.EnsureSuccessStatusCode();
        var patientResponse = await response.Content.ReadFromJsonAsync<PatientResponse>();
        Assert.NotNull(patientResponse);

        var patientUpdatedGet = await DbContext.Patients.FirstOrDefaultAsync(p => p.Firstname == "updated");
        Assert.NotNull(patientUpdatedGet);
        DbContext.Entry(patientUpdatedGet).Reload();
        Assert.True(patientUpdatedGet.Firstname == "updated");
        Assert.True(patientUpdatedGet.Age == 19);
        Assert.True(patientUpdatedGet.Lastname == "Patient");
        Assert.True(patientUpdatedGet.OptOutDetails);
        Assert.True(patientUpdatedGet.Sex == "M");
      }
    }
  }
}
