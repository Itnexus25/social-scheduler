import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ✅ SEO Metadata */}
      <Head>
        <title>Social Scheduler - Home</title>
        <meta name="description" content="Welcome to Social Scheduler" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ✅ Main Landing Page */}
      <main style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Welcome to Social Scheduler</h1>
        <p>Let's start building your app 🚀</p>

        {/* ✅ Improved Navigation Buttons */}
        <div style={{ marginTop: "1rem" }}>
          <Link href="/signup">
            <button style={{ marginRight: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
              Sign Up
            </button>
          </Link>
          <Link href="/login">
            <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Login</button>
          </Link>
        </div>
      </main>
    </>
  );
}