// pages/edit-post.tsx
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import dbConnect from '../lib/dbConnect';
import Post from '../models/Post';
import Navbar from '../src/components/Navbar';

interface EditPostProps {
  post: {
    _id: string;
    title: string;
    content?: string;
    scheduledAt: string;
    createdAt: string;
    updatedAt: string;
    media?: string;
    platform: string;
  };
}

const EditPost: NextPage<EditPostProps> = ({ post }) => {
  const { user } = useUser();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content || '');
  const [scheduledAt, setScheduledAt] = useState(post.scheduledAt);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(post.media || '');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    // For immediate preview (optional)
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare FormData for the updated post.
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('scheduledAt', scheduledAt);
    // Ensure platform is always provided
    formData.append('platform', post.platform || 'facebook');
    if (selectedFile) {
      formData.append('media', selectedFile);
    }
    
    try {
      // Create the x-user header using Clerk's user info.
      const xUserHeader = JSON.stringify({
        id: user?.id,
        role: user?.publicMetadata?.role || 'user',
      });
      
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        body: formData,
        // When using FormData, don't manually set Content-Type.
        headers: {
          'x-user': xUserHeader,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update post.');
      }
      alert('Post updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post</title>
        <meta name="description" content="Edit your post" />
      </Head>
      <Navbar />
      <main
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#000",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Hidden input to ensure platform is included */}
          <input type="hidden" name="platform" value={post.platform || 'facebook'} />
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Scheduled At:</label>
            <input
              type="datetime-local"
              value={new Date(scheduledAt).toISOString().slice(0,16)}
              onChange={(e) =>
                setScheduledAt(new Date(e.target.value).toISOString())
              }
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Media Preview:
            </label>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Media preview"
                style={{
                  maxWidth: "300px",
                  display: "block",
                  marginBottom: "1rem",
                }}
              />
            ) : (
              <p style={{ fontStyle: "italic", color: "#aaa" }}>
                No image available
              </p>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Upload New Image (optional):
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Update Post
          </button>
        </form>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  await dbConnect();
  const post = await Post.findById(id).lean();
  if (!post) {
    return { notFound: true };
  }
  // Convert dates and _id to strings for JSON serialization.
  post._id = post._id.toString();
  post.createdAt = post.createdAt?.toISOString() || "";
  post.scheduledAt = post.scheduledAt?.toISOString() || "";
  post.updatedAt = post.updatedAt?.toISOString() || "";
  return { props: { post } };
};

export default EditPost;