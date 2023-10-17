import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { OAuthConfig } from "next-auth/providers/oauth";

export const options: NextAuthOptions = {
  providers: [
    {
      id: "oidc",
      name: "Keycloak",
      type: 'oauth',
      version: "2.0",
      params: { grant_type: "authorization_code" },
      scope: "openid profile email",
      accessTokenUrl:
        "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/token",
      authorizationUrl:
        "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/auth",
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
        profileUrl:
          "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/userinfo",
      profile: (profile) => {
        return {
          ...profile,
          id: profile.sub  // Adjust accordingly if Keycloak provides image URL
        };
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
  pages: {}, // can route to custom signin/signout pages
};
