public class TestCustomer : ITestDbInitializer
{
    public static Guid Id { get; } = Guid.NewGuid();

    public static string ObjectId { get; } = Guid.NewGuid().ToString();

    public static Customer CreateTestCustomer()
    {
        return new Customer
        {
            Id = Id,
            Objectid = ObjectId,
            Email = "test@email.com",
        };
    }

    public async Task InitializeDbTestData(NutrinovaDbContext context)
    {
        await context.Customers.AddAsync(CreateTestCustomer());
        await context.SaveChangesAsync();
    }
}
