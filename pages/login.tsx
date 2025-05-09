import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Use the API URL from environment variables; fallback to localhost if not set.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in both fields");
      setLoading(false);
      return;
    }

    try {
      console.log("DEBUG: Sending login request to", `${API_URL}/auth/login`);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies in the request
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      console.log("DEBUG: Response status:", res.status);
      const data = await res.json();
      console.log("DEBUG: Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      if (data.token) {
        // Store the token in localStorage so that the dashboard can verify authentication.
        localStorage.setItem("token", data.token);
        // Optionally, store the user details if provided.
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        // Redirect to the dashboard upon successful login.
        router.push("/dashboard").then(() =>
          console.log("Redirected to /dashboard")
        );
      } else {
        setError("Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Social Scheduler</title>
        <meta name="description" content="Login to Social Scheduler" />
      </Head>
      <main
        style={{
          background: "#000",
          color: "#fff",
          padding: "2rem",
          maxWidth: "400px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h1>
        {error && <p style={{ color: "#f00", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: ".5rem" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem",
                background: "#333",
                border: "1px solid #555",
                color: "#fff",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: ".5rem" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                display: "block",
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
              width: "100%",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Navigation Buttons */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => router.push("/signup")}
            style={{
              background: "#222", // slightly different dark shade
              padding: "0.75rem 1.5rem",
              flex: 1,
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push("/passwordreset")}
            style={{
              background: "#555", // another dark shade for contrast
              padding: "0.75rem 1.5rem",
              flex: 1,
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
        </div>
      </main>
    </>
  );
}