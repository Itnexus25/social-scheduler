import type { NextApiRequest, NextApiResponse } from "next";
import adminOnly from "@middleware/adminOnly"; // Uses the dedicated alias

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: "This route is accessible to admins." });
};

export default adminOnly(handler);