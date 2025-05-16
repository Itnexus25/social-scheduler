import type { NextApiRequest, NextApiResponse } from "next";
import adminOnly, { AuthenticatedRequest } from "@middleware/adminOnly";

// For testing purposes, simulate an admin user if none is already provided.
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // This is only for testing—simulate that req.user exists with role "admin".
  (req as AuthenticatedRequest).user = { role: "admin" };

  res.status(200).json({ message: "This route is accessible to admins." });
};

export default adminOnly(handler);