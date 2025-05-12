// pages/api/users/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Ensure MongoDB connection exists before proceeding
    if (!process.env.MONGODB_URI) {
      console.error("❌ ERROR: Missing MONGODB_URI in environment variables");
      return res.status(500).json({ success: false, error: "Server misconfiguration: MONGODB_URI missing." });
    }

    console.log("🔄 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected successfully!");

    if (req.method === "GET") {
      console.log("🔍 Fetching users...");
      
      // ✅ Retrieve users with improved select criteria; lean() for performance
      const users = await User.find({}, "name email createdAt").lean();
      
      if (!users.length) {
        console.warn("⚠️ No users found.");
        return res.status(404).json({ success: false, message: "No users found in the database." });
      }

      console.log(`✅ Retrieved ${users.length} users`);
      return res.status(200).json({ success: true, users });
    }

    // ✅ Standardize error response for unsupported methods
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed.` });
    
  } catch (error: any) {
    console.error("❌ Server error in /api/users:", error);
    return res.status(500).json({ success: false, error: "Internal server error. Please try again later." });
  }
}