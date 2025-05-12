// pages/api/posts/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Post from "../../../models/Post";

// Helper to simulate authenticated user
const getUserFromRequest = (req: NextApiRequest) => {
  // Replace with your actual auth logic
  try {
    return (req as any).user || JSON.parse(req.headers["x-user"] as string) || null;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid post id." });
  }

  switch (req.method) {
    case "GET": {
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        return res.status(200).json({ message: "Post fetched successfully.", post });
      } catch (error: any) {
        return res.status(500).json({ message: "Server error while fetching post.", error: error.message });
      }
    }
    case "PUT": {
      const { title, content, platform } = req.body;
      if (!title || !content || !platform) {
        return res.status(400).json({ message: "Title, content, and platform are required." });
      }
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        // Check if the logged-in user is the owner or an admin
        if (post.user.toString() !== user.id && user.role !== "admin") {
          return res.status(403).json({ message: "You can only update your own posts." });
        }
        post.title = title;
        post.content = content;
        post.platform = platform;
        const updatedPost = await post.save();
        return res.status(200).json({ message: "Post updated successfully.", post: updatedPost });
      } catch (error: any) {
        return res.status(500).json({ message: "Server error while updating post.", error: error.message });
      }
    }
    case "DELETE": {
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        if (post.user.toString() !== user.id && user.role !== "admin") {
          return res.status(403).json({ message: "Not authorized to delete this post." });
        }
        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully." });
      } catch (error: any) {
        return res.status(500).json({ message: "Server error while deleting post.", error: error.message });
      }
    }
    default: {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}