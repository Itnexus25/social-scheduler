import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: Missing MONGODB_URI in environment variables.");
  throw new Error("❌ Please define MONGODB_URI inside .env.local");
}

// ✅ Maintain a global cache for MongoDB connections
let cached = (global as any).mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🚀 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }).then((mongooseInstance) => {
      console.log("✅ MongoDB connected successfully!");
      cached.conn = mongooseInstance.connection;
      return cached.conn;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      cached.conn = null;
      throw error;
    });
  }

  return cached.promise;
}

export default dbConnect;