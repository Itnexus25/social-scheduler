// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: Missing MONGODB_URI in environment variables.");
  throw new Error("❌ Please define MONGODB_URI inside .env.local");
}

// Maintain a global cache to prevent re-opening connections in hot reloads.
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Use globalThis for modern Node.js environments.
let cached: MongooseCache = (globalThis as any).mongoose || { conn: null, promise: null };
(globalThis as any).mongoose = cached;

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🚀 Connecting to MongoDB...");
    // Use non-null assertion operator (!) to tell TypeScript that MONGODB_URI is defined.
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully!");
        cached.conn = mongooseInstance.connection;
        // Log the active database name.
        console.log("Active Database:", mongooseInstance.connection.name);
        return cached.conn;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        cached.conn = null;
        throw error;
      });
  }

  return cached.promise;
}

export default dbConnect;