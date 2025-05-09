import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log("🔄 Connecting to database...");
    await dbConnect();
    console.log("✅ Database connected!");

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required: name, email, password." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please use a different email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "Signup successful! You can now log in." });
  } catch (err: any) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ error: "Internal server error. Please try again later." });
  }
}