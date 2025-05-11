// pages/api/test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";

// Enforce a full server‑side execution:
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Use the statically imported auth, which is only available on the server.
    const { userId } = auth(req);
    console.log("auth() output in API route:", userId);

    res.status(200).json({
      message: "Middleware is working",
      userId: userId || "Not logged in",
    });
  } catch (error) {
    console.error("Error in Clerk auth:", error);
    res
      .status(500)
      .json({ message: "Server error processing authentication" });
  }
}