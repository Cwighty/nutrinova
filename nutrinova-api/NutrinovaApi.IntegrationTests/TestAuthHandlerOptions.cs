using Microsoft.AspNetCore.Authentication;

// https://mazeez.dev/posts/auth-in-integration-tests
public class TestAuthHandlerOptions : AuthenticationSchemeOptions
{
  public string DefaultUserId { get; set; } = "94fa3168-d0a5-4107-a28e-52f89e6af3a9";
}
