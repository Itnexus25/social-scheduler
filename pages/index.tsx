// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Social Scheduler - Home</title>
        <meta name="description" content="Welcome to Social Scheduler" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Main Landing Page */}
      <main style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Welcome to Social Scheduler</h1>
        <p>Let's start building your app 🚀</p>

        {/* Navigation Buttons */}
        <div style={{ marginTop: "1rem" }}>
          <Link href="/sign-up" legacyBehavior>
            <a
              style={{
                marginRight: "1rem",
                padding: "0.5rem 1rem",
                background: "#0070f3",
                color: "#fff",
                borderRadius: "4px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Sign Up
            </a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a
              style={{
                padding: "0.5rem 1rem",
                background: "#0070f3",
                color: "#fff",
                borderRadius: "4px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Login
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}