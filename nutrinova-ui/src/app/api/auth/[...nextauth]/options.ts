import axios, { AxiosResponse } from "axios";
import { Account, NextAuthOptions, Profile, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt"
import { OAuthConfig } from "next-auth/providers/oauth";

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  expires_at: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}


async function refreshAccessToken(tokenObject: JWT): Promise<JWT> {
  const params = new URLSearchParams();
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID ?? '');
  params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET ?? '');
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', tokenObject.refresh_token ?? '');

  const tokenResponse: AxiosResponse<KeycloakTokenResponse> = await axios.post(
    `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return {
    ...tokenObject,
    accessToken: tokenResponse.data.access_token,
    expires_at: Math.floor(Date.now() / 1000 + tokenResponse.data.expires_in),
    refresh_token: tokenResponse.data.refresh_token ?? tokenObject.refresh_token,
  }
}

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
    async jwt({ token, account }: { token: JWT, account: Account | null, user: User }): Promise<JWT> {
      const newToken = token;
      if (account) {
        // This will only be executed at login. Each next invocation will skip this part.
        newToken.access_token = account.access_token;
        newToken.expires_at = Math.floor(Date.now() / 1000 + account.expires_in);
        newToken.refresh_token = account.refresh_token;
        newToken.id_token = account.id_token;
      }
      else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token
      }
      else {
        try {
          const refreshedToken = await refreshAccessToken(newToken);
          return refreshedToken;
        }
        catch (error) {
          console.error("Could not refresh token: ", error);
          return {
            ...newToken,
            error: "RefreshAccessTokenError" as const,
          }
        }
      }

      return newToken;
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
  events: {
    signOut: ({ token }) => doFinalSignoutHandshake(token)
  },
  pages: {}, // can route to custom signin/signout pages
};

function doFinalSignoutHandshake(jwt: JWT) {
  const params = new URLSearchParams();
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID ?? '');
  params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET ?? '');
  params.append('refresh_token', jwt.refresh_token ?? '');
  params.append("id_token_hint", jwt.id_token ?? '');

  axios.post(
    `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/logout`,
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  ).then(() => {
    console.log("Successfully signed out from Keycloak");
  }).catch((error) => {
    console.error("Could not sign out from Keycloak: ", error);
  });
}
