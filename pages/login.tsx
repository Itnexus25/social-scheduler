// pages/login.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Pick up the public API URL from environment variables.
// Defaults to the Codeanywhere URL if not provided.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://3000-itnexus25-social-schedul-djserltivw.app.codeanywhere.com/api";

export default function Login() {
  const router = useRouter();

  // Toggle between "login" and "signup" modes
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Only used in signup mode for confirmation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect to dashboard if a token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validate required fields
    if (!trimmedEmail || !trimmedPassword) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (mode === "signup" && trimmedPassword !== confirmPassword.trim()) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Choose endpoint based on mode
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      console.log(`DEBUG: Sending ${mode} request to ${API_URL}${endpoint}`);
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      console.log("DEBUG: Response status:", res.status);
      const data = await res.json();
      console.log("DEBUG: Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! Status: ${res.status}`);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/dashboard").then(() => console.log("Redirected to /dashboard"));
      } else {
        setError(mode === "login" ? "Login failed" : "Sign up failed");
      }
    } catch (err: any) {
      console.error(`Error during ${mode}:`, err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{mode === "login" ? "Login" : "Sign Up"} - Social Scheduler</title>
        <meta
          name="description"
          content={`${mode === "login" ? "Login" : "Sign Up"} to Social Scheduler`}
        />
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
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        {error && <p style={{ color: "#f00", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
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

          {/* Password Field with Toggle */}
          <div style={{ marginBottom: "1rem", position: "relative" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: ".5rem" }}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password Field (Shown in Signup Mode) */}
          {mode === "signup" && (
            <div style={{ marginBottom: "1rem", position: "relative" }}>
              <label
                htmlFor="confirmPassword"
                style={{ display: "block", marginBottom: ".5rem" }}
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}

          {/* Submit Button */}
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
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* Mode Toggle and Reset Password */}
        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              background: "#222",
              padding: "0.75rem 1.5rem",
              flex: 1,
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {mode === "login" ? "Switch to Sign Up" : "Switch to Login"}
          </button>
          <button
            onClick={() => router.push("/password-reset")}
            style={{
              background: "#555",
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