import type { Account,  NextAuthOptions, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
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
      profile: (profile) => {
        return {
          ...profile,
          id: profile.sub, // Adjust accordingly if Keycloak provides image URL
        };
      },
      session: {
        strategy: 'jwt',
      },
      
    } as OAuthConfig<any>,
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "smith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const user = { id: "1", name: "J Smith", email: "" };
        return Promise.resolve(user);
      },
    }),
  ],
  callbacks: {
        async jwt({token, user}: { token: JWT; user: User }) : Promise<JWT> {
             console.log(user) 
             return token 
        },
      },
  pages: {}, // can route to custom signin/signout pages
};
