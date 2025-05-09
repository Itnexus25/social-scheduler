const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const protect = require("../middleware/protect"); // ✅ Auth middleware
const roleProtect = require("../middleware/roleProtect"); // ✅ Role-based access
const router = express.Router();

/* ===========================
   ✅ Create a New Post (Authenticated Users)
   =========================== */
router.post("/", protect, async (req, res) => {
  console.log("🔍 Incoming request body:", req.body); // ✅ Debugging log

  const { title, content, platform, scheduledAt } = req.body;

  if (!title || !content || !platform) {
    console.error("❌ Validation failed: Missing required fields.");
    return res.status(400).json({ message: "Title, content, and platform are required." });
  }

  try {
    const newPost = new Post({
      title,
      content,
      platform,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : Date.now(),
      user: req.user.id,
    });

    const savedPost = await newPost.save();
    console.log("✅ Post successfully saved:", savedPost); // ✅ Log saved post

    res.status(201).json({ message: "Post created successfully.", post: savedPost });
  } catch (error) {
    console.error("❌ Error saving post to database:", error);
    res.status(500).json({ message: "Server error while creating post.", error: error.message });
  }
});
/* ===========================
   🔚 End of Create Post
   =========================== */
   
/* ===========================
   ✅ Get a Single Post by ID
   =========================== */
   router.get("/:id", protect, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }
      res.status(200).json({ message: "Post fetched successfully.", post });
    } catch (error) {
      console.error("❌ Error fetching post:", error);
      res.status(500).json({ message: "Server error while fetching post.", error: error.message });
    }
  });
  /* ===========================
     🔚 End of Get Single Post
     =========================== */

/* ===========================
   ✅ Fetch All Posts for Logged-in User
   =========================== */
router.get("/", protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }); // ✅ Sort posts by latest

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    console.log("✅ Retrieved posts:", posts.length); // ✅ Log number of posts retrieved

    res.status(200).json({ message: "Posts retrieved successfully.", posts });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts.", error: error.message });
  }
});
/* ===========================
   🔚 End of Fetch Posts
   =========================== */

/* ===========================
   ✅ Update a Post (Only Owner or Admin)
   =========================== */
router.put("/:id", protect, roleProtect("admin", "user"), async (req, res) => {
  const { title, content, platform } = req.body;
  const postId = req.params.id;

  if (!title || !content || !platform) {
    return res.status(400).json({ message: "Title, content, and platform are required." });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own posts." });
    }

    post.title = title;
    post.content = content;
    post.platform = platform;

    const updatedPost = await post.save();
    console.log("✅ Updated post:", updatedPost); // ✅ Log updated post

    res.status(200).json({ message: "Post updated successfully.", post: updatedPost });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    res.status(500).json({ message: "Server error while updating post.", error: error.message });
  }
});
/* ===========================
   🔚 End of Update Post
   =========================== */

/* ===========================
   ✅ Delete a Post (Only Owner or Admin)
   =========================== */
router.delete("/:id", protect, roleProtect("admin", "user"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await post.deleteOne();
    console.log("✅ Post deleted:", req.params.id); // ✅ Log deleted post ID

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ message: "Server error while deleting post.", error: error.message });
  }
});
/* ===========================
   🔚 End of Delete Post
   =========================== */

module.exports = router;