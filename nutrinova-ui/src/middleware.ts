import withAuth from "next-auth/middleware";

const publicRoutes = [
    '/', '/atomic-white.svg', '/atomic-black.svg', '/atomic-berries-white.svg', '/atomic-berries-black.svg']

export default withAuth(
    {
        callbacks: {
            authorized: ({ req, token }) => {
                if (publicRoutes.includes(req.nextUrl.pathname)) {
                    return true
                }
                if (
                    token === null
                ) {
                    return false
                }
                return true
            }
        },
        pages: {
            signIn: '/auth/signin',
        },
    }
)