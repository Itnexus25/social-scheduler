// models/Post.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define and export an interface for type safety
export interface IPost extends Document {
  title: string;
  content: string;
  platform: "facebook" | "instagram" | "youtube" | "tiktok";
  scheduledAt?: Date;
  isPublished: boolean;
  user: string; // Clerk userId is a string.
  createdAt?: Date; // Added to match the timestamps option.
  updatedAt?: Date; // Added to match the timestamps option.
}

// Define the Post schema with the required validators and options.
const postSchema: Schema<IPost> = new Schema(
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
      maxlength: 2000, // Prevent oversized posts.
    },
    platform: {
      type: String,
      required: true,
      enum: ["facebook", "instagram", "youtube", "tiktok"], // Allowed platforms.
    },
    scheduledAt: {
      type: Date,
      default: Date.now, // Defaults to current time if not provided.
    },
    isPublished: {
      type: Boolean,
      default: false, // Defaults to an unpublished state.
    },
    user: {
      type: String, // Using string to match Clerk's user id type.
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields.
  }
);

// Prevent duplicate model registration during hot reloads (e.g., in Next.js)
const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;