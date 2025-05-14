// pages/create-post.tsx
import { useRouter } from "next/router";
import Head from "next/head";
import { useState, ChangeEvent, FormEvent } from "react";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reusable button style.
  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0.5rem 0",
  };

  // Handle file input changes.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  // Function to submit the post.
  // If overrideScheduledAt is given, it overrides scheduledAt.
  const submitPost = async (overrideScheduledAt?: string) => {
    setError(null);
    setUploading(true);
    const scheduledValue = overrideScheduledAt || scheduledAt;

    // If no media is attached, send JSON.
    if (!media) {
      const payload = {
        title,
        content,
        platform,
        scheduledAt: scheduledValue,
      };
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to create post.");
        }
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Submission failed, please try again later.");
      }
      setUploading(false);
    } else {
      // When media is attached, send data as multipart/form-data.
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("platform", platform);
      formData.append("scheduledAt", scheduledValue);
      formData.append("media", media);
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to create post.");
        }
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Submission failed, please try again later.");
      }
      setUploading(false);
    }
  };

  // Handler for scheduling a post.
  const handleSchedulePost = async (e: FormEvent) => {
    e.preventDefault();
    await submitPost();
  };

  // Handler for posting immediately (overrides scheduledAt with current timestamp).
  const handlePostNow = async (e: FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    await submitPost(now);
  };

  return (
    <>
      <Head>
        <title>Create Post - Social Scheduler</title>
        <meta name="description" content="Create a new post" />
      </Head>
      <div
        style={{
          backgroundColor: "#000",
          color: "#fff",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>Create Post</h1>
        <form>
          {/* Title Input */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="title">Title:</label>
            <br />
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
              }}
              required
            />
          </div>

          {/* Content Textarea */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="content">Content:</label>
            <br />
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
                minHeight: "120px",
              }}
            ></textarea>
          </div>

          {/* Platform Dropdown */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="platform">Platform:</label>
            <br />
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
              }}
              required
            >
              <option value="">Select Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          {/* Scheduled Time */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="scheduledAt">Scheduled Time:</label>
            <br />
            <input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
              }}
              required
            />
          </div>

          {/* Media (Image/Video) Upload */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="media">Upload Image/Video (optional):</label>
            <br />
            <input
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ color: "#fff" }}
            />
            {media && (
              <div style={{ marginTop: "0.5rem" }}>
                <span>Selected file: {media.name}</span>
                <button
                  type="button"
                  onClick={() => setMedia(null)}
                  style={{
                    ...buttonStyle,
                    background: "#e63946",
                    marginLeft: "1rem",
                  }}
                >
                  Remove File
                </button>
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "1rem", fontSize: "1rem" }}>
              {error}
            </p>
          )}

          {/* Two buttons: one for scheduling and one for posting now */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={handleSchedulePost}
              style={buttonStyle}
              disabled={uploading}
            >
              {uploading ? "Submitting..." : "Schedule Post"}
            </button>
            <button
              type="button"
              onClick={handlePostNow}
              style={buttonStyle}
              disabled={uploading}
            >
              {uploading ? "Submitting..." : "Post Now"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}