using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

// https://mazeez.dev/posts/auth-in-integration-tests
public class TestAuthHandler : AuthenticationHandler<TestAuthHandlerOptions>
{
  public const string UserId = "User Id";

  public const string AuthenticationScheme = "Test";
  private readonly string _defaultUserId;

  public TestAuthHandler(
        IOptionsMonitor<TestAuthHandlerOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
  {
    _defaultUserId = options.CurrentValue.DefaultUserId;
  }

  protected override Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    var claims = new List<Claim> { new Claim(ClaimTypes.Name, "Test user") };

    // Extract User ID from the request headers if it exists,
    // otherwise use the default User ID from the options.
    if (Context.Request.Headers.TryGetValue(UserId, out var userId))
    {
      claims.Add(new Claim(ClaimTypes.NameIdentifier, userId[0] ?? "0"));
    }
    else
    {
      claims.Add(new Claim(ClaimTypes.NameIdentifier, _defaultUserId));
    }

    // TODO: Add as many claims as you need here
    var identity = new ClaimsIdentity(claims, AuthenticationScheme);
    var principal = new ClaimsPrincipal(identity);
    var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

    var result = AuthenticateResult.Success(ticket);

    return Task.FromResult(result);
  }
}
