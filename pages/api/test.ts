// pages/api/test.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Force the route to run in the Node.js runtime and always dynamically load on the server.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Lazily load the Clerk server module using require, so it's only pulled in at runtime.
    const { auth } = require("@clerk/nextjs/server");
    const { userId } = auth(req);
    console.log("auth() output in API route:", userId);

    res.status(200).json({
      message: "Middleware is working",
      userId: userId || "Not logged in",
    });
  } catch (error) {
    console.error("Error in Clerk auth:", error);
    res.status(500).json({ message: "Server error processing authentication" });
  }
}