// Applies auth to all routes in the app
export { default } from "next-auth/middleware";

// Put auth on specific routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = { matcher: ["/sample-route"] };
