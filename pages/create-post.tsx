import { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  /* ✅ Handle Form Submission */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // ✅ Validate fields before submission
    if (!title.trim() || !content.trim() || !platform || !scheduledAt) {
      setError("Title, content, platform, and scheduled date/time are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User authentication failed. Please log in again.");
        router.push("/login");
        return;
      }

      // ✅ Prepare post data
      const postData = {
        title: title.trim(),
        content: content.trim(),
        platform,
        scheduledAt: new Date(scheduledAt).toISOString(),
      };

      console.log("🛠️ DEBUG: Sending POST request with:", postData);

      // ✅ Send API request
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      console.log("🛠️ DEBUG: HTTP Status Code:", res.status);
      const data = await res.json();
      console.log("🛠️ DEBUG: API Response:", data);

      if (!res.ok) throw new Error(data.message || "Failed to create post.");

      console.log("✅ Post successfully created:", data.post);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Error creating post:", error);
      setError(error.message || "Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Post - Social Scheduler</title>
        <meta name="description" content="Schedule a new post" />
      </Head>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Create a New Post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* ✅ Post Creation Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: ".5rem", borderRadius: "4px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", padding: ".5rem", borderRadius: "4px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="platform">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{ width: "100%", padding: ".5rem", borderRadius: "4px" }}
              required
            >
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="scheduledAt">Schedule for:</label>
            <input
              type="datetime-local"
              id="scheduledAt"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              style={{ width: "100%", padding: ".5rem", borderRadius: "4px" }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: ".75rem",
              backgroundColor: "#0070f3",
              color: "white",
              borderRadius: "4px",
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </main>
    </>
  );
}