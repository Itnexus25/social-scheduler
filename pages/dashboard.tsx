import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

interface Post {
  _id: string;
  title: string;
  content: string;
  scheduledAt: string;
  createdAt: string;
}

interface User {
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Use API_URL from environment variables or fallback to localhost.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  // On mount, check if token and user details exist; if not, redirect to login.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      console.warn("❌ No token found, redirecting to login...");
      setError("No token found, please log in.");
      router.push("/login");
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }

    // Fetch posts for the authenticated user.
    fetchPosts(token);
  }, [router]);

  // Function to fetch posts.
  const fetchPosts = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch posts.");
      }

      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      console.error("❌ Error fetching posts:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a post.
  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete post.");

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err: any) {
      console.error("❌ Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  // Redirect to the edit-post page.
  const handleEdit = (post: Post) => {
    router.push(`/edit-post?id=${post._id}`);
  };

  return (
    <>
      <Head>
        <title>Dashboard - Social Scheduler</title>
      </Head>
      <Navbar />

      <main style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        {user ? <p>Welcome, {user.email}!</p> : <p>Welcome to your dashboard!</p>}

        {/* Top action buttons: Only the "Create Post" button is rendered here,
            assuming the Navbar already provides a Logout button. */}
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => router.push("/create-post")}>Create Post</button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading posts...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : posts.length > 0 ? (
          <section>
            <h2>Your Scheduled Posts</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {posts.map((post) => (
                <li key={post._id} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      background: "#f9f9f9",
                      padding: "1rem",
                      borderRadius: "8px",
                    }}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <span>
                      Scheduled for: {new Date(post.scheduledAt).toLocaleString()}
                    </span>
                    <div style={{ marginTop: "1rem" }}>
                      <button
                        onClick={() => handleEdit(post)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          !error && <p>No posts scheduled yet. Start creating posts!</p>
        )}
      </main>
    </>
  );
}