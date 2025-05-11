import { Request, Response, NextFunction } from "express";
import protect from "./protect"; // Ensure 'protect' is applied before this

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    role?: string;
  };
}

const roleProtect = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const allowedRolesList = allowedRoles.join(" or ");
      res.status(403).json({
        message: `Access denied. This action requires role: ${allowedRolesList}. Your role: ${req.user.role}`,
      });
      return;
    }

    next(); // Authorized ✅
  };
};

export default roleProtect;
