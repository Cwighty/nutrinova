using Microsoft.AspNetCore.Authentication;

// https://mazeez.dev/posts/auth-in-integration-tests
public class TestAuthHandlerOptions : AuthenticationSchemeOptions
{
  public string DefaultUserId { get; set; } = TestCustomer.ObjectId;
}
