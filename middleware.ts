// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect here if not authenticated
  },
});

export const config = {
  // Add all routes you want to protect here
  matcher: [
    "/account/:path*", 
    "/checkout/:path*",
    "/cart/:path*",
    "/payment-success/:path*",
  ],
};