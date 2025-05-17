// pages/dashboard.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication and retrieve user details from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user data is found, log out just in case.
      router.push("/login");
    }
  }, [router]);

  // Once the user is set, fetch posts specific to that user
  useEffect(() => {
    if (!user) return;

    setLoadingPosts(true);
    // Adjust the endpoint according to your API design.
    // Here, we assume passing user id as query param filters posts.
    fetch(`${API_URL}/posts?userId=${user.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts.");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data); // Assuming data is an array of posts
        setLoadingPosts(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingPosts(false);
      });
  }, [user]);

  // Logout function to clear stored user data and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Dashboard - Social Scheduler</title>
        <meta name="description" content="User-specific dashboard" />
      </Head>
      <main
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              background: "#f00",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>

        {user && (
          <p style={{ marginBottom: "1rem" }}>
            Welcome, <strong>{user.email}</strong>
          </p>
        )}

        <section>
          <h2>Your Posts</h2>
          {loadingPosts && <p>Loading posts...</p>}
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}
          {!loadingPosts && posts.length === 0 && (
            <p>You have no posts yet. Start by creating one!</p>
          )}
          {posts.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {posts.map((post) => (
                <li
                  key={post.id}
                  style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "#f9f9f9",
                  }}
                >
                  <h3 style={{ marginBottom: "0.5rem" }}>{post.title}</h3>
                  <p>{post.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}