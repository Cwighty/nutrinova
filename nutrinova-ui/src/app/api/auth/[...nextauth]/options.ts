import { Account, NextAuthOptions, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt"
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
    jwt({ token, account }: { token: JWT, account: Account | null }): JWT {
      // Add the access token to the token object
      console.log("here is the token", token, "here is the account", account);
      token.access_token = account?.access_token != undefined ? account.access_token : token.access_token;
      return token
    },
    session({ session, token }: { session: Session, token: JWT }): Session {
      session.user;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          access_token: token.access_token
        }
      };
    },
  },
  pages: {}, // can route to custom signin/signout pages
};
