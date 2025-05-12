// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("✅ Loading Clerk middleware from src");

// Apply Clerk's middleware to every route.
export default clerkMiddleware();

// Use a broad matcher to guarantee that every request (including API routes) is processed.
// Once confirmed, you can restrict this matcher if needed.
export const config = {
  matcher: "/(.*)",
};