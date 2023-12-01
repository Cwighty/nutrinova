// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TokenSet, Account as account } from 'next-auth';
import { JWT as jwt } from 'next-auth/jwt';

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's name. */
      name: string,
      id: string | undefined,
      email: string,
      access_token: string | undefined,
      error?: "RefreshAccessTokenError",
    }
  }

  interface User {
    name: string,
  }

  interface Account extends account {
    access_token: string | undefined,
    id_token: string,
    expires_at: number,
    expires_in: number,
  }

}

declare module "next-auth/jwt"
{
  interface JWT extends jwt {
    email?: string,
    name?: string,
    picture?: string,
    sub?: string,
    id_token?: string,
    access_token: string | undefined,
    refresh_token?: string,
    expires_at: number,
    error?: "RefreshAccessTokenError",
  }

}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_SECRET?: string
      KEYCLOAK_CLIENT_ID?: string
      KEYCLOAK_CLIENT_SECRET?: string
      KEYCLOAK_BASE_URL?: string
      NUTRINOVA_API_URL?: string
      WEBSOCKET_URL?: string
    }
  }
}