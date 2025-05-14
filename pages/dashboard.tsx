// pages/dashboard.tsx
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Navbar from '../src/components/Navbar';

interface Post {
  _id: string;
  title: string;
  content: string;
  scheduledAt: string;
  createdAt: string;
}

interface DashboardProps {
  posts: Post[];
}

const Dashboard: NextPage<DashboardProps> = ({ posts }) => {
  const router = useRouter();
  const { user } = useUser();

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
    console.log('Delete post', postId);
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
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>
                        {post.title}
                      </h4>
                      {post.content && post.content.trim() !== post.title.trim() && (
                        <p style={{ marginBottom: '0.5rem', fontSize: '1rem', color: '#ddd' }}>
                          {post.content}
                        </p>
                      )}
                      <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem', color: '#ccc' }}>
                        {isFuture
                          ? `Scheduled for: ${scheduledDate.toLocaleString()}`
                          : `Posted: ${scheduledDate.toLocaleString()}`}
                      </p>
                      <div style={{ marginTop: '1rem' }}>
                        <button style={buttonStyle} onClick={() => handleEdit(post)}>
                          Edit Post
                        </button>
                        <button style={{ ...buttonStyle, background: '#e63946' }} onClick={() => handleDelete(post._id)}>
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
    const cookie = req.headers.cookie || "";
    const apiUrl = `${protocol}://${host}/api/posts`;
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