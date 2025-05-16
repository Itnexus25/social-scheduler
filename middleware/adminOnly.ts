import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

// Extend NextApiRequest to include a user property.
export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    role: string;
  };
}

/**
 * A higher-order function that wraps a Next.js API handler.
 * It checks whether the request's user has an admin role.
 *
 * @param handler - The API route handler to wrap.
 * @returns A new handler that performs the admin check first.
 */
const adminOnly = (handler: NextApiHandler) => {
  return function (req: AuthenticatedRequest, res: NextApiResponse) {
    // Check for admin privileges.
    if (req.user?.role === "admin") {
      // If the user is an admin, call the wrapped handler.
      return handler(req, res);
    }
    // Otherwise, return a 403 Access Denied error.
    return res.status(403).json({ message: "Access denied: Admins only" });
  };
};

export default adminOnly;