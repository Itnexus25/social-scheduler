// pages/create-post.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "@components/Navbar";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/nextjs";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // Default platform is now Facebook.
  const [platform, setPlatform] = useState("facebook");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  // Build the full API URL using window.location.origin.
  // This ensures we’re using the correct domain in your workspace.
  const [apiUrl, setApiUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiUrl(`${window.location.origin}/api/posts`);
    }
  }, []);

  // Generic function to send a POST request.
  const sendPostRequest = async (postData: any) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError("User authentication failed. Please log in again.");
        router.push("/login");
        return;
      }

      // Use the dynamically built URL; if not set, fall back to the relative URL.
      const endpoint = apiUrl || "/api/posts";

      console.log("Sending POST request to", endpoint);
      console.log("Post Data:", postData);

      const res = await fetch(endpoint, {
        method: "POST",
        // Ensure credentials (cookies) are sent. This is critical for Clerk's middleware.
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        console.error("Response status:", res.status, res.statusText);
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create post.");
      }

      const data = await res.json();
      console.log("API Response:", data);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error creating post:", err);
      setError(err.message || "Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle scheduled post submission.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim() || !platform || !scheduledAt) {
      setError("Title, content, platform, and scheduled date/time are required.");
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      platform,
      scheduledAt: new Date(scheduledAt).toISOString(),
    };

    await sendPostRequest(postData);
  };

  // Handle immediate (post now) submission.
  const handleImmediatePost = async () => {
    setError(null);

    if (!title.trim() || !content.trim() || !platform) {
      setError("Title, content, and platform are required.");
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      platform,
      // Setting the scheduled time to now.
      scheduledAt: new Date().toISOString(),
    };

    await sendPostRequest(postData);
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
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
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
              marginBottom: "0.5rem",
            }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={handleImmediatePost}
            style={{
              width: "100%",
              padding: ".75rem",
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "4px",
            }}
            disabled={loading}
          >
            {loading ? "Posting Now..." : "Post Now"}
          </button>
        </form>
      </main>
    </>
  );
}