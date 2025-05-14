// pages/api/posts/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Post from "../../../models/Post";

// Optional: Define a simple User interface if you want to type-check the user object.
// Adjust properties as needed for your project.
interface User {
  id: string;
  role: string;
}

// Helper to simulate authenticated user.
// This example assumes that either a middleware has attached a user object to the request
// or that you pass a serialized user via a header (e.g., "x-user").
const getUserFromRequest = (req: NextApiRequest): User | null => {
  // Try to extract the user from req.user (if middleware attached it)
  if ((req as any).user) {
    return (req as any).user as User;
  }
  // Otherwise, try to parse from the "x-user" header if provided.
  // Note: In production, you should use proper authentication middleware.
  try {
    const header = req.headers["x-user"];
    if (header) {
      return JSON.parse(header as string) as User;
    }
    return null;
  } catch (error) {
    console.error("Error parsing x-user header:", error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure that your database is connected. If you’re not using a global DB connection helper,
  // you might add: await mongoose.connect(process.env.MONGO_URI, options) or a similar call.
  
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Extract and validate the 'id' from the query parameters.
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
        return res.status(200).json({
          message: "Post fetched successfully.",
          post,
        });
      } catch (error: any) {
        return res.status(500).json({
          message: "Server error while fetching post.",
          error: error.message,
        });
      }
    }

    case "PUT": {
      const { title, content, platform } = req.body;
      if (!title || !content || !platform) {
        return res
          .status(400)
          .json({ message: "Title, content, and platform are required." });
      }
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        // Check if the logged-in user is the owner or is an admin.
        // Ensure that post.user exists and has a toString() method (mongoose ObjectId).
        if (post.user.toString() !== user.id && user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "You can only update your own posts." });
        }
        // Update fields.
        post.title = title;
        post.content = content;
        post.platform = platform;

        const updatedPost = await post.save();
        return res.status(200).json({
          message: "Post updated successfully.",
          post: updatedPost,
        });
      } catch (error: any) {
        return res.status(500).json({
          message: "Server error while updating post.",
          error: error.message,
        });
      }
    }

    case "DELETE": {
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        // Ensure only the owner or an admin can delete the post.
        if (post.user.toString() !== user.id && user.role !== "admin") {
          return res
            .status(403)
            .json({ message: "Not authorized to delete this post." });
        }
        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully." });
      } catch (error: any) {
        return res.status(500).json({
          message: "Server error while deleting post.",
          error: error.message,
        });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}