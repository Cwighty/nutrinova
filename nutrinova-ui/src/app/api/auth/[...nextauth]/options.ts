import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    {
      id: "oidc",
      name: "Keycloak",
      version: "2.0",
      scope: "openid profile email",
      params: { grant_type: "authorization_code" },
      accessTokenUrl:
        "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/token",
      authorizationUrl:
        "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/auth?response_type=code",
      profileUrl:
        "https://nutrinova-auth.duckdns.org:9000/auth/realms/master/protocol/openid-connect/userinfo",
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      profile: (profile) => {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          email: profile.email,
          image: null, // Adjust accordingly if Keycloak provides image URL
        };
      },
    },
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
