import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query; // ✅ Get post ID from URL

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  /* ✅ Fetch Post Details */
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication failed. Please log in again.");
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch post.");

        setTitle(data.post.title);
        setContent(data.post.content);
        setPlatform(data.post.platform);
      } catch (error: any) {
        console.error("❌ Error fetching post:", error);
        setError(error.message || "Something went wrong.");
      }
    };

    fetchPost();
  }, [id]);

  /* ✅ Handle Post Update */
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim() || !platform) {
      setError("Title, content, and platform are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication failed. Please log in again.");
        return;
      }

      const postData = { title: title.trim(), content: content.trim(), platform };
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update post.");

      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Error updating post:", error);
      setError(error.message || "Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post - Social Scheduler</title>
      </Head>
      <Navbar />
      <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
        <h1>Edit Post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleUpdate}>
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
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </main>
    </>
  );
}