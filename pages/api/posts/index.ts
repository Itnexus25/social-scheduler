import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Post from "../../../models/Post";

const JWT_SECRET = process.env.JWT_SECRET;

const getUserFromRequest = (req: NextApiRequest) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    // Expect your token payload to include at least an "id" property
    const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only GET and POST requests
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Retrieve the authenticated user from the request
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Handle GET requests: return posts that belong to the authenticated user
    if (req.method === "GET") {
      const posts = await Post.find({
        user: new mongoose.Types.ObjectId(user.id),
      }).sort({ createdAt: -1 });
      
      // Return the posts (even if empty) with a success message.
      return res.status(200).json({ message: "Posts retrieved successfully.", posts });
    }

    // Handle POST requests: create a new post for the authenticated user.
    if (req.method === "POST") {
      const { title, content, platform, scheduledAt } = req.body;

      if (!title || !content || !platform) {
        return res.status(400).json({ message: "Title, content, and platform are required." });
      }

      const newPost = new Post({
        title,
        content,
        platform,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : Date.now(),
        user: new mongoose.Types.ObjectId(user.id),
      });

      const savedPost = await newPost.save();
      return res.status(201).json({ message: "Post created successfully.", post: savedPost });
    }
  } catch (error: any) {
    console.error("❌ Error in /api/posts:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}