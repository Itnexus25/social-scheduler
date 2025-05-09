import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query; // ✅ Get post ID from URL

  /* ===========================
     ✅ Fetch Post Details
     =========================== */
  useEffect(() => {
    if (!id) return; // ✅ Prevent fetching if ID is missing

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("🔍 Fetched post:", data);

        if (res.ok && data.post) {
          setTitle(data.post.title);
          setContent(data.post.content);
          setPlatform(data.post.platform);
        } else {
          setError(data.message || "Failed to fetch post.");
        }
      } catch (error) {
        console.error("❌ Error fetching post:", error);
        setError("Something went wrong.");
      }
    };

    fetchPost();
  }, [id]);

  /* ===========================
     ✅ Handle Post Update
     =========================== */
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!title || !content || !platform) {
      setError("Title, content, and platform are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const postData = { title, content, platform };
      console.log("🔍 Updating post with:", postData);

      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      console.log("🔍 API Response:", data);

      if (res.ok && data.post) {
        console.log("✅ Post updated successfully:", data.post);
        router.push("/dashboard"); // ✅ Redirect after successful update
      } else {
        setError(data.message || "Failed to update post.");
      }
    } catch (error) {
      console.error("❌ Error updating post:", error);
      setError("Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post - Social Scheduler</title>
        <meta name="description" content="Edit an existing post" />
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