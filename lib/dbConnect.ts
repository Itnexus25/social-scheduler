import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// Load environment variables explicitly from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ==================================================================
// ✅ Load MongoDB URI from environment variables
// Ensure that your .env.local file contains MONGODB_URI
// ==================================================================
const MONGODB_URI = process.env.MONGODB_URI;

// Debug logging for the MongoDB URI (REMOVE in production)
console.log("🛠️ DEBUG: process.env.MONGODB_URI =", MONGODB_URI);

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env.local");
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// ==================================================================
// ✅ Maintain a global connection cache to prevent multiple connections
// ==================================================================
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// ==================================================================
// ✅ Establish Connection with MongoDB
// Prevent unnecessary reconnections during hot reloads
// ==================================================================
async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🚀 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {})
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully!");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;