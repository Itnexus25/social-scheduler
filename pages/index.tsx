import Head from "next/head";
import Link from "next/link";
import Layout from "@components/Layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Social Scheduler</title>
        <meta
          name="description"
          content="Plan and schedule your social media posts easily"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Welcome to Social Scheduler</h1>
          <p>Let's start building your app 🚀</p>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link href="/login">
              <span
                style={{
                  padding: "0.5rem 1rem",
                  background: "#0070f3",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                Login
              </span>
            </Link>
            <Link href="/signup">
              <span
                style={{
                  padding: "0.5rem 1rem",
                  background: "#0070f3",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}