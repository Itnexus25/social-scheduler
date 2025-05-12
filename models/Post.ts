import mongoose, { Schema, Document } from "mongoose";

// ✅ Define and export an interface for type safety
export interface IPost extends Document {
  title: string;
  content: string;
  platform: "facebook" | "instagram" | "youtube" | "tiktok";
  scheduledAt?: Date;
  isPublished: boolean;
  user: string; // Clerk userId is a string.
}

// ✅ Define the Post schema
const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // Prevent oversized posts
    },
    platform: {
      type: String,
      required: true,
      enum: ["facebook", "instagram", "youtube", "tiktok"], // Allowed platforms
    },
    scheduledAt: {
      type: Date,
      default: Date.now, // Defaults to now if not provided
    },
    isPublished: {
      type: Boolean,
      default: false, // Defaults to an unpublished state
    },
    user: {
      type: String, // Changed from ObjectId to string to match Clerk's user id type.
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

// ✅ Prevent duplicate model registration during hot reloads in Next.js.
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;