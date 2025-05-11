// middleware.ts (in project root)
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("Loading Clerk middleware from root");

export default clerkMiddleware((req: NextRequest) => {
  console.log("Clerk middleware invoked.");
  return NextResponse.next();
});

export const config = {
  matcher: ["/api/:path*", "/protected/:path*"],
};