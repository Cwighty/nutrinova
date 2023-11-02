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
    }
  }

  interface User {
    name: string,
  }

  interface Account extends account {
    access_token: string | undefined,
    id_token: string
  }

}

declare module "next-auth/jwt"
{
  interface JWT extends jwt {
    email?: string,
    name?: string,
    picture?: string,
    sub?: string,
    access_token: string | undefined
  }

}