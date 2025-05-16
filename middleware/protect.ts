import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import User from "@models/User"; // Adjust the import path if necessary

// Extend the NextApiRequest type to include a user property.
export interface AuthenticatedRequest extends NextApiRequest {
  user?: any; // Replace `any` with your user type if available.
}

/**
 * A higher-order function that wraps an API handler with JWT-based protection.
 *
 * It validates the JWT token from the Authorization header, attaches the user
 * to the request object, and only then calls the wrapped API handler.
 *
 * @param handler - The API route handler to wrap.
 * @returns A new handler that enforces authentication.
 */
const protect = (handler: NextApiHandler) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];

      try {
        // Verify the token using the JWT_SECRET environment variable.
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // Attach user to the request object (excluding sensitive fields).
        req.user = await User.findById((decoded as any).id).select("-password");
      } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // If the token is valid and the user is attached, execute the original handler.
    return handler(req, res);
  };
};

export default protect;