// src/app/api/test/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { userId } = auth(request);
  console.log("auth() output in route:", userId);
  return NextResponse.json({ message: "Middleware is working", userId });
}