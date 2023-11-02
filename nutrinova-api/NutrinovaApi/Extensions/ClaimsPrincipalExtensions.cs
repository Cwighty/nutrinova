using System.Security.Claims;

namespace NutrinovaApi.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string? GetIdFromClaims(this ClaimsPrincipal claimsPrincipal)
    {
        Console.WriteLine(claimsPrincipal.Claims);
        var id = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (id == null || id == string.Empty)
        {
            return null;
        }

        return id;
    }
}
