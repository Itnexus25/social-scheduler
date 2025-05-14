// pages/api/disable-user.ts
import type { NextApiRequest, NextApiResponse } from "next";

async function disableUser(userId: string) {
  // (Insert the disableUser function implementation shown above here)
  // ...
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const data = await disableUser(userId);
    return res.status(200).json({ message: "User disabled successfully", data });
  } catch (error: any) {
    console.error("Error disabling user:", error);
    return res.status(500).json({ message: "Error disabling user", error: error.message });
  }
}