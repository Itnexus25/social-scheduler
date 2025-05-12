// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, content, platform, scheduledAt } = req.body;

    // Validate required fields
    if (!title || !content || !platform || !scheduledAt) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Simulate saving the post (you can replace this with real logic)
    return res.status(201).json({ message: "Post created successfully!" });
  }
  return res.status(405).json({ message: "Method not allowed." });
}