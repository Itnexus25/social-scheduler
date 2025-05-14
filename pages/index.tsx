// pages/index.tsx
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Social Scheduler - Home</title>
        <meta name="description" content="Welcome to Social Scheduler" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          textAlign: "center",
          padding: "3rem",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          Welcome to Social Scheduler
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#555",
            marginBottom: "2rem",
          }}
        >
          Effortlessly plan, schedule, and manage your social media posts.
        </p>

        {/* Render links based on authentication status */}
        {!isSignedIn ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/sign-up"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#0070f3",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/create-post"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#0070f3",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Create a Post
            </Link>
            <Link
              href="/dashboard"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "#fff",
                borderRadius: "5px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              View Dashboard
            </Link>
          </div>
        )}

        <p style={{ fontSize: "1rem", color: "#777" }}>
          Let's start building your app 🚀
        </p>
      </main>
    </>
  );
}