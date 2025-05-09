import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use a relative API path for Next.js API routes.
  const API_URL = "/api/auth/signup";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Trim name and email, leave password as-is.
    setFormData({
      ...formData,
      [name]: name === "password" ? value : value.trim(),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      console.log("🛠️ DEBUG: Sending request to", API_URL);
      const response = await axios.post(API_URL, formData);
      
      setSuccessMessage(response.data.message || "Signup successful!");
      setFormData({ name: "", email: "", password: "" }); // Clear the form

      // Optionally, redirect to login after successful signup:
      // router.push("/login");
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      setError(error.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Social Scheduler</title>
        <meta name="description" content="Create an account for Social Scheduler" />
      </Head>
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "2rem",
          maxWidth: "400px",
          margin: "2rem auto",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Sign Up</h2>

        {error && (
          <p style={{ color: "#f00", textAlign: "center", marginBottom: "1rem" }}>
            {error}
          </p>
        )}
        {successMessage && (
          <p style={{ color: "#0f0", textAlign: "center", marginBottom: "1rem" }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: ".5rem" }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
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
            <label htmlFor="email" style={{ display: "block", marginBottom: ".5rem" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
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
            <label htmlFor="password" style={{ display: "block", marginBottom: ".5rem" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
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
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;