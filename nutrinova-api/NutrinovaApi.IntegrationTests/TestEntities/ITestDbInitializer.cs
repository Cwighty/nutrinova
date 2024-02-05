public interface ITestDbInitializer
{
  Task InitializeDbTestData(NutrinovaDbContext context);
}
