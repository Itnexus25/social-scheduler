import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <>
      {/* Set head information */}
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Plan and schedule your social media posts easily" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Wrap main content in a Layout */}
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>Welcome to Social Scheduler</h1>
          <p>Let's start building your app 🚀</p>
          {/* Navigation links with legacyBehavior for proper anchor usage */}
          <div style={{ marginTop: '1rem' }}>
            <Link legacyBehavior href="/login">
              <a
                style={{
                  marginRight: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#0070f3',
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                Login
              </a>
            </Link>
            <Link legacyBehavior href="/signup">
              <a
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0070f3',
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}