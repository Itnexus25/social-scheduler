const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // ✅ Ensures every post has a title
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // ✅ Limits content length to prevent oversized posts
    },
    platform: {
      type: String,
      required: true,
      enum: ["facebook", "twitter", "instagram", "linkedin"], // ✅ Restricts platform values
    },
    scheduledAt: {
      type: Date,
      required: false,
      default: Date.now, // ✅ Defaults to current time if not provided
    },
    isPublished: {
      type: Boolean,
      default: false, // ✅ Marks if the post has been published
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to User model
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;