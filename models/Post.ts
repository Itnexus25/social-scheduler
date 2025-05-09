import mongoose, { Schema, Document } from "mongoose";

// ✅ Define and export an interface for type safety
export interface IPost extends Document {
  title: string;
  content: string;
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  scheduledAt?: Date;
  isPublished: boolean;
  user: mongoose.Types.ObjectId;
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
      enum: ["facebook", "twitter", "instagram", "linkedin"], // Restricted values
    },
    scheduledAt: {
      type: Date,
      default: Date.now, // Defaults to now if not provided
    },
    isPublished: {
      type: Boolean,
      default: false, // Defaults to unpublished state
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to the User model
      required: true,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt fields
);

// ✅ Prevent duplicate model registration during hot reloads in Next.js
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;