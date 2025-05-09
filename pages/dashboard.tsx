import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

interface Post {
  _id: string;
  title: string;
  content: string;
  scheduledAt: string;
  createdAt: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  /* ===========================
     ✅ Token Validation
     =========================== */
  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== "undefined") {
        // Retrieve the token from localStorage
        let token = localStorage.getItem("token");
        console.log("🔍 Dashboard token check (raw):", token);

        // If no token, redirect to login
        if (!token) {
          console.warn("❌ No token found, redirecting to login...");
          setError("No token found, please log in.");
          router.push("/login");
          return;
        }

        // Clean the token: Remove extra quotes if they exist
        token = token.replace(/^"|"$/g, '');
        console.log("🔍 Cleaned token:", token);

        try {
          // Dynamically require "jwt-decode" and obtain the decode function.
          const jwtDecodeModule = require("jwt-decode");
          // Use the default export if available; otherwise, use the module itself.
          const jwtDecodeFn =
            jwtDecodeModule && jwtDecodeModule.default
              ? jwtDecodeModule.default
              : jwtDecodeModule;

          console.log("🔍 typeof jwtDecodeFn:", typeof jwtDecodeFn);
          if (typeof jwtDecodeFn !== "function") {
            throw new Error("jwtDecodeFn is not a function!");
          }

          // Decode the token
          const decoded: any = jwtDecodeFn(token);
          console.log("🔍 Decoded token:", decoded);

          // Debugging expiry check
          const currentTime = Date.now() / 1000;
          console.log("🔍 Token expiry:", decoded.exp, "| Current time:", currentTime);

          if (decoded.exp < currentTime) {
            console.warn("❌ Token expired, redirecting to login...");
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
        } catch (err) {
          console.error("❌ Error decoding token:", err);
          setError("Invalid token. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        // If token is valid, fetch the posts
        fetchPosts(token);
      }
    };

    checkToken();
  }, [router]);
  /* ===========================
     🔚 End of Token Validation
     =========================== */

  /* ===========================
     ✅ Fetch Posts from API
     =========================== */
  const fetchPosts = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("🔍 API Response for posts:", data);

      if (Array.isArray(data.posts)) {
        // Sort posts by newest first (descending order)
        const sortedPosts = data.posts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } else {
        console.error("❌ Unexpected API response format:", data);
        setPosts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      setError("Something went wrong, please try again later.");
    }
    setLoading(false);
  };
  /* ===========================
     🔚 End of Fetch Posts
     =========================== */

  /* ===========================
     ✅ Handle Delete Post
     =========================== */
  const handleDelete = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("✅ Post deleted:", data);

      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        console.error("❌ Failed to delete post:", data.message);
      }
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };
  /* ===========================
     🔚 End of Delete Post
     =========================== */

  /* ===========================
     ✅ Handle Edit Post (Redirect)
     =========================== */
  const handleEdit = (post: Post) => {
    router.push(`/edit-post?id=${post._id}`);
  };
  /* ===========================
     🔚 End of Edit Post
     =========================== */

  /* ===========================
     ✅ Render Loading Screen
     =========================== */
  if (loading) {
    return (
      <>
        <Head>
          <title>Dashboard - Social Scheduler</title>
          <meta name="description" content="Your scheduled posts and analytics" />
        </Head>
        <Navbar />
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Loading...</h1>
          <p>We are fetching your posts data. Please wait a moment.</p>
        </main>
      </>
    );
  }
  /* ===========================
     🔚 End of Loading Screen
     =========================== */

  /* ===========================
     ✅ Render Error Screen
     =========================== */
  if (error) {
    return (
      <>
        <Head>
          <title>Dashboard - Social Scheduler</title>
          <meta name="description" content="Your scheduled posts and analytics" />
        </Head>
        <Navbar />
        <main style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Error</h1>
          <p style={{ color: "red" }}>{error}</p>
        </main>
      </>
    );
  }
  /* ===========================
     🔚 End of Error Screen
     =========================== */

  return (
    <>
      <Head>
        <title>Dashboard - Social Scheduler</title>
        <meta name="description" content="Your scheduled posts and analytics" />
      </Head>
      <Navbar />

      <main style={{ padding: "2rem" }}>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard! 📊</p>

        {/* Create Post & Logout Buttons */}
        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <button onClick={() => router.push("/create-post")}>Create Post</button>
          <button
            onClick={() => { 
              localStorage.removeItem("token"); 
              router.push("/login"); 
            }}
          >
            Logout
          </button>
        </div>

        {/* Display Sorted Posts */}
        <section>
          <h2>Your Scheduled Posts</h2>
          {posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li key={post._id} style={{ marginBottom: "1rem" }}>
                  <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <span>Scheduled for: {new Date(post.scheduledAt).toLocaleString()}</span>
                    <div style={{ marginTop: "1rem" }}>
                      <button onClick={() => handleEdit(post)}>Edit</button>
                      <button onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts scheduled yet. Start creating posts!</p>
          )}
        </section>
      </main>
    </>
  );
}