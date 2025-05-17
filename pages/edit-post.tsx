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
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('scheduledAt', scheduledAt);
    formData.append('platform', post.platform || 'facebook');
    if (selectedFile) {
      formData.append('media', selectedFile);
    }
    
    try {
      const xUserHeader = JSON.stringify({
        id: user?.id,
        role: user?.publicMetadata?.role || 'user',
      });
      
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        body: formData,
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
              value={new Date(scheduledAt).toISOString().slice(0, 16)}
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
  // Ensure that the MONGODB_URI environment variable is set
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment variables.");
    return { notFound: true };
  }

  // Establish a connection to the database.
  await dbConnect();

  // Get the post ID from the query parameter.
  const { id } = context.query;

  // Fetch the post from the database.
  const postFromDb = await Post.findById(id).lean();

  if (!postFromDb) {
    return { notFound: true };
  }

  // Serialize the post data (convert MongoDB ObjectIDs and Dates to strings).
  const serializedPost = {
    ...postFromDb,
    _id: postFromDb._id.toString(),
    createdAt: postFromDb.createdAt ? postFromDb.createdAt.toISOString() : "",
    scheduledAt: postFromDb.scheduledAt ? postFromDb.scheduledAt.toISOString() : "",
    updatedAt: postFromDb.updatedAt ? postFromDb.updatedAt.toISOString() : "",
  };

  return { props: { post: serializedPost } };
};

export default EditPost;