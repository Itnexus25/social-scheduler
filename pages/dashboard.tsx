// pages/dashboard.tsx
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Navbar from '../src/components/Navbar';

interface Post {
  _id: string;
  title: string;
  content?: string; // content is optional
  scheduledAt: string;
  createdAt: string;
  media?: string; // expects a full Cloudinary URL if available
}

interface DashboardProps {
  posts: Post[];
}

const Dashboard: NextPage<DashboardProps> = ({ posts }) => {
  const router = useRouter();
  const { user } = useUser();

  // Use your public API URL or fallback to localhost.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    background: '#0070f3',
    color: '#fff',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '0.5rem',
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user) {
        headers["x-user"] = JSON.stringify({
          id: user.id,
          role: user.publicMetadata?.role || 'user',
        });
      }
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete post.");
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Error deleting post:", err);
      alert(err.message || "Failed to delete post.");
    }
  };

  const handleEdit = (post: Post) => {
    router.push(`/edit-post?id=${post._id}`);
  };

  return (
    <>
      <Head>
        <title>Dashboard - Social Scheduler</title>
        <meta name="description" content="View your scheduled posts" />
      </Head>
      <Navbar />
      <main
        style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#000',
          color: '#fff',
          minHeight: '100vh',
        }}
      >
        <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Dashboard</h2>
        {user ? (
          <p style={{ fontSize: '1.1rem' }}>
            Welcome, {user.primaryEmailAddress?.emailAddress || 'User'}!
          </p>
        ) : (
          <p style={{ fontSize: '1.1rem' }}>Welcome to your dashboard!</p>
        )}
        <div style={{ margin: '1rem 0' }}>
          <button style={buttonStyle} onClick={() => router.push('/create-post')}>
            Create Post
          </button>
        </div>
        {posts && posts.length > 0 ? (
          <section>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              Your Scheduled Posts
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {posts.map((post) => {
                const scheduledDate = new Date(post.scheduledAt);
                const now = new Date();
                const isFuture = scheduledDate.getTime() > now.getTime();

                // Force the time zone to Africa/Johannesburg (SAST).
                const formattedDate = scheduledDate.toLocaleString('en-US', {
                  timeZone: 'Africa/Johannesburg',
                });
                const trimmedContent = (post.content || "").trim();
                const trimmedTitle = (post.title || "").trim();

                // Debug log (check the console to see the media URL):
                console.log(`Post "${post.title}" media URL:`, post.media);

                return (
                  <li key={post._id} style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        backgroundColor: '#000',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: '0.5rem',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#fff',
                        }}
                      >
                        {post.title}
                      </h4>
                      {(trimmedContent && trimmedContent !== trimmedTitle) && (
                        <p style={{ marginBottom: '0.5rem', fontSize: '1rem', color: '#ddd' }}>
                          {post.content}
                        </p>
                      )}
                      {/* Thumbnail Preview */}
                      {post.media && post.media.trim() !== '' ? (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img
                            src={`${post.media}?w=150,h=150,c_fill`}
                            alt="Uploaded media preview"
                            style={{ borderRadius: '4px' }}
                            onError={(e) => console.error(`Failed to load image at ${post.media}`)}
                          />
                        </div>
                      ) : (
                        <p style={{ color: '#aaa', fontStyle: 'italic', marginTop: '0.5rem' }}>
                          No image available
                        </p>
                      )}
                      <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem', color: '#ccc' }}>
                        {isFuture
                          ? `Scheduled for: ${formattedDate}`
                          : `Posted: ${formattedDate}`}
                      </p>
                      <div style={{ marginTop: '1rem' }}>
                        <button style={buttonStyle} onClick={() => handleEdit(post)}>
                          Edit Post
                        </button>
                        <button
                          style={{ ...buttonStyle, background: '#e63946' }}
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
            No posts scheduled yet. Start creating posts!
          </p>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { req } = context;
    const protocol =
      (req.headers['x-forwarded-proto'] as string) ||
      ((req.connection as any)?.encrypted ? 'https' : 'http');
    const host = req.headers.host;
    const cookie = req.headers.cookie || '';
    // Append a cache-busting query parameter.
    const apiUrl = `${protocol}://${host}/api/posts?cacheBust=${Date.now()}`;
    console.log('Fetching posts from:', apiUrl);
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', cookie },
    });
    if (res.status !== 200) {
      const text = await res.text();
      console.error(`Error fetching posts (status ${res.status}):`, text);
      return { props: { posts: [] } };
    }
    const data = await res.json();
    return { props: { posts: data.posts || [] } };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { props: { posts: [] } };
  }
};

export default Dashboard;