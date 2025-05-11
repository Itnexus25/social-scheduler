// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("Loading Clerk middleware from src");

// Use the default Clerk middleware without a custom callback for simplicity.
export default clerkMiddleware();

export const config = {
  // This matcher runs on all routes except those starting with /_next, /api, /static,
  // or any paths containing a dot (e.g. requests for files like .css, .js, etc.)
  matcher: "/((?!_next/|api/|static/|.*\\..*).*)",
};