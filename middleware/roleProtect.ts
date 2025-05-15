import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
// If needed, apply your protect middleware separately.
// import protect from "./protect"; // Ensure that protect is applied before this if you want to enforce authentication first

// Extend NextApiRequest to include a user property.
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    role?: string;
    // You can add additional properties here if needed.
  };
}

/**
 * Higher-order function that wraps an API route handler,
 * restricting access based on the allowed roles.
 *
 * Usage:
 *   export default roleProtect("admin", "super-admin")(handler);
 *
 * @param allowedRoles - Array of acceptable roles.
 * @returns A function that accepts an API route handler and returns a new handler with role protection.
 */
const roleProtect = (...allowedRoles: string[]) => {
  return (handler: NextApiHandler) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
      // Check if the user role is attached to the request.
      if (!req.user?.role) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Check if the user role is among the allowed ones.
      if (!allowedRoles.includes(req.user.role)) {
        const allowedRolesList = allowedRoles.join(" or ");
        return res.status(403).json({
          message: `Access denied. This action requires role: ${allowedRolesList}. Your role: ${req.user.role}`,
        });
      }

      // If all checks pass, execute the original handler.
      return handler(req, res);
    };
  };
};

export default roleProtect;