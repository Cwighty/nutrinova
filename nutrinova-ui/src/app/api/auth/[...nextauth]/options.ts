import { NextAuthOptions, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { OAuthConfig } from "next-auth/providers/oauth";

export const options: NextAuthOptions = {
  providers: [
    {
      id: "oidc",
      name: "Keycloak",
      type: "oauth",
      version: "2.0",
      wellKnown:
        process.env.KEYCLOAK_BASE_URL + "/.well-known/openid-configuration",
      params: { grant_type: "authorization_code" },
      scope: "openid profile email",
      accessTokenUrl:
        process.env.KEYCLOAK_BASE_URL + "/protocol/openid-connect/token",
      authorizationUrl:
        process.env.KEYCLOAK_BASE_URL + "/protocol/openid-connect/auth",
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      profileUrl:
        process.env.KEYCLOAK_BASE_URL + "/protocol/openid-connect/userinfo",
      profile: (profile: Profile) => {
        return {
          ...profile,
          id: profile.sub, // Adjust accordingly if Keycloak provides image URL
        };
      },

      session: {
        strategy: "jwt",
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as OAuthConfig<any>,
  ],
  callbacks: {
    session({ session, token }: { session: Session, token: JWT }): Session {
      session.user;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        }
      };
    },
  },
  pages: {}, // can route to custom signin/signout pages
};
