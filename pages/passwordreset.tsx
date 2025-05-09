import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function PasswordReset() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      console.log("DEBUG: Sending password reset request to", `${API_URL}/auth/password-reset`);
      
      const res = await fetch(`${API_URL}/auth/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email.");
      }

      setSuccessMessage(
        data.message || "Password reset instructions have been sent to your email."
      );
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Password Reset - Social Scheduler</title>
        <meta name="description" content="Reset your password for Social Scheduler" />
      </Head>
      <main
        style={{
          background: "#000",
          color: "#fff",
          padding: "2rem",
          maxWidth: "400px",
          margin: "2rem auto",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Password Reset</h1>
        {error && <p style={{ color: "#f00", marginBottom: "1rem" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "#0f0", marginBottom: "1rem" }}>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: ".5rem" }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#333",
                border: "1px solid #555",
                color: "#fff",
                borderRadius: "4px",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#444",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")}
          style={{
            background: "#222",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Back to Login
        </button>
      </main>
    </>
  );
}