import { withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware((req, event) => {
  return new Response("Middleware working!", { status: 200 });
});

// Ensure Clerk processes authentication for requests
export const config = {
  matcher: ["/api/auth/meta/*"], // Apply middleware to auth endpoints
};