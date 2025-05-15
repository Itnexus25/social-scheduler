// middleware/authMiddleware.ts

import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import User from "@models/User";

// Extend Next.js request type to carry the user property.
export interface AuthenticatedRequest extends NextApiRequest {
  user?: any; // Replace "any" with a proper user type if available.
}

/**
 * A higher-order function that wraps an API route handler with protection.
 * It verifies the JWT provided in the Authorization header and attaches
 * the user to the request.
 */
const protect = (handler: NextApiHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      try {
        // Verify token using JWT secret from env.
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // Attach the user data to the request.
        // Adjust the way you query the user as needed.
        req.user = await User.findById((decoded as any).id).select("-password");
      } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    return handler(req, res);
  };
};

export default protect;