import { Request, Response, NextFunction } from "express";

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
  };
}

const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role === "admin") {
    next(); // User is admin, allow access
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

export default adminOnly;