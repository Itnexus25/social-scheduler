// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

// Define an interface describing the expected User shape
interface IUser {
  email: string;
  password: string;
  role: string;
  _id: string;
  // Add any other User fields you need here.
}

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ensure JWT_SECRET is provided.
  if (!JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in environment variables");
    return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET missing." });
  }

  try {
    console.log("🔄 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected!");

    // Destructure email and password from the request body.
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    console.log(`🔍 Fetching user: ${email}`);
    // Use findOne to retrieve a single user object and explicitly type it using lean<IUser>()
    const user = await User.findOne({ email })
      .select("+password")
      .lean<IUser>();

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("🔍 Verifying password...");
    // With the IUser type in place, TypeScript knows that user.password exists.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("✅ Password verified! Generating token...");
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Build a secure cookie (with appropriate options for production).
    const isProduction = process.env.NODE_ENV === "production";
    const cookieParts = [
      `token=${token}`,
      "HttpOnly",
      "Path=/",
      "Max-Age=604800", // 7 days in seconds
      isProduction ? "Secure" : "",
      isProduction ? "SameSite=Strict" : "SameSite=Lax",
    ];
    const cookie = cookieParts.filter(Boolean).join("; ");

    // Set the token as an HttpOnly cookie.
    res.setHeader("Set-Cookie", cookie);

    // Return the token and basic user details in the response.
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("❌ Error in login API:", error);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}