// pages/dashboard.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser, useAuth } from "@clerk/nextjs";
import Navbar from "../src/components/Navbar";

interface Post {
  _id: string;
  title: string;
  content: string;
  scheduledAt: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Use API_URL from environment variables or fallback to localhost.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  
  // Get Clerk's current user and helper method to retrieve an access token.
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  // Reusable button style.
  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "#0070f3",
    color: "#fff",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    margin: "0.5rem",
  };

  // On mount: If not signed in, redirect to sign in; otherwise, fetch posts.
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    async function fetchData() {
      try {
        // Removed the custom JWT template option.
        const token = await getToken();
        if (!token) {
          setError("Failed to get access token.");
          return;
        }
        fetchPosts(token);
      } catch (err) {
        console.error("Error obtaining token:", err);
        setError("Error validating session. Please try again.");
      }
    }
    fetchData();
  }, [isSignedIn, getToken, router]);

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
      console.error("Error fetching posts:", err);
      setError(err.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a post.
  const handleDelete = async (postId: string) => {
    try {
      const token = await getToken(); // Removed custom JWT template option.
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
      console.error("Error deleting post:", err);
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
        <h2 style={{ marginBottom: "1rem" }}>Dashboard</h2>
        {user ? (
          <p>Welcome, {user.primaryEmailAddress?.emailAddress || "User"}!</p>
        ) : (
          <p>Welcome to your dashboard!</p>
        )}

        {/* Create Post Button */}
        <div style={{ margin: "1rem 0" }}>
          <button style={buttonStyle} onClick={() => router.push("/create-post")}>
            Create Post
          </button>
        </div>

        {/* Render posts list */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading posts...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : posts.length > 0 ? (
          <section>
            <h3>Your Scheduled Posts</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {posts.map((post) => (
                <li key={post._id} style={{ marginBottom: "1rem" }}>
                  <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    <p>Scheduled for: {new Date(post.scheduledAt).toLocaleString()}</p>
                    <div style={{ marginTop: "1rem" }}>
                      <button style={buttonStyle} onClick={() => handleEdit(post)}>
                        Edit Post
                      </button>
                      <button style={buttonStyle} onClick={() => handleDelete(post._id)}>
                        Delete Post
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