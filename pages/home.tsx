import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Set head info for SEO and browser tab */}
      <Head>
        <title>Social Scheduler - Home</title>
        <meta name="description" content="Welcome to Social Scheduler" />
      </Head>
      {/* Main landing content */}
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Welcome to Social Scheduler</h1>
        <p>Let's start building your app 🚀</p>
        {/* Navigation links: Using legacyBehavior so that nested <a> tags work properly */}
        <div style={{ marginTop: '1rem' }}>
          <Link legacyBehavior href="/signup">
            <a>
              <button style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>Sign Up</button>
            </a>
          </Link>
          <Link legacyBehavior href="/login">
            <a>
              <button style={{ padding: '0.5rem 1rem' }}>Login</button>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}