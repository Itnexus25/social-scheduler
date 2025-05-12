// pages/api/posts/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Received ${req.method} request on ${req.url}`);

  // Handle CORS preflight requests.
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // Allow requests from any origin—adjust in production if needed.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end();
  }

  try {
    // Connect to the database.
    await dbConnect();
    console.log("✅ Database connected.");

    // Allow only GET and POST methods.
    if (!["GET", "POST"].includes(req.method || "")) {
      res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
      console.warn(`⚠️ Method ${req.method} not allowed.`);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }

    // Retrieve the authenticated user via Clerk.
    const { userId } = getAuth(req);
    console.log("🔐 Clerk Authentication Debug:");
    console.log("✅ Request headers:", req.headers);
    console.log("✅ Extracted userId from Clerk:", userId);

    if (!userId) {
      console.warn("⛔ Clerk authentication failed. Not authorized.");
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.method === "GET") {
      console.log(`📡 Fetching posts for user: ${userId}`);
      const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
      console.log(`✅ Retrieved ${posts.length} posts for user.`);
      return res
        .status(200)
        .json({ message: "Posts retrieved successfully", posts });
    }

    if (req.method === "POST") {
      console.log(`📩 Creating new post for user: ${userId}`);
      const { title, content, platform, scheduledAt } = req.body;
      console.log("Request body:", req.body);

      // Validate required fields.
      if (!title || !content || !platform) {
        console.warn("⚠️ Validation failed: Missing required fields.");
        return res.status(400).json({
          message: "Title, content, and platform are required.",
        });
      }

      // Validate and parse the scheduled date/time.
      const scheduleDate = scheduledAt ? new Date(scheduledAt) : new Date();
      if (isNaN(scheduleDate.getTime())) {
        console.warn(`⚠️ Invalid scheduled date/time: ${scheduledAt}`);
        return res
          .status(400)
          .json({ message: "Invalid scheduled date/time." });
      }

      const newPost = new Post({
        title: title.trim(),
        content: content.trim(),
        platform,
        scheduledAt: scheduleDate,
        user: userId,
      });
      console.log("New post document:", newPost);

      const savedPost = await newPost.save();
      console.log("✅ Post created successfully:", savedPost);
      return res
        .status(201)
        .json({ message: "Post created successfully", post: savedPost });
    }

    // Fallback response; should not be reached.
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error: any) {
    console.error("❌ Server error in /api/posts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}