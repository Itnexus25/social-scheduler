// ==================================================================
// ✅ Step 1: Import Required Modules
// ==================================================================
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect"; // ✅ Correct path
import User from "../../../models/User"; // ✅ Correct path

// Debugging MongoDB connection string
console.log("🛠️ DEBUG: process.env.MONGODB_URI =", process.env.MONGODB_URI);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Verify MongoDB URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error("❌ ERROR: MONGODB_URI is missing in .env.local");
      return res.status(500).json({ success: false, error: "MONGODB_URI is undefined" });
    }

    // ✅ Establish database connection
    console.log("🔄 Attempting database connection...");
    await dbConnect();
    console.log("✅ Database connected successfully!");

    if (req.method === "GET") {
      console.log("🔍 Fetching all users...");
      
      // ✅ Retrieve all users, optimized query with .lean()
      const users = await User.find({}, "_id name email").lean();

      if (!users.length) {
        console.warn("⚠️ WARNING: No users found in the database.");
      }

      console.log(`✅ SUCCESS: Retrieved ${users.length} users`);
      return res.status(200).json({ success: true, users });
    } else {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ success: false, error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error("❌ ERROR: Server issue while retrieving users:", error);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
}