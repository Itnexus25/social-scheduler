import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { API_URL } from '@/utils/api'; // Ensure API_URL is defined and points to your backend

export default function Login() {
  // Define state for email, password, error messages, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // On component mount, check if the user is already authenticated.
  // If a token exists in localStorage, automatically redirect to the dashboard.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(''); // Clear any previous error messages

    // Trim the email and password to remove accidental whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic form validation to ensure both fields are filled
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in both fields');
      return;
    }

    try {
      setLoading(true); // Set loading state to true while sending the API request

      // Send a POST request to your login API endpoint
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the email and password in the request body as JSON
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      // Parse the JSON response
      const data = await res.json();

      // If login is successful and a token is returned:
      if (res.status === 200 && data.token) {
        // Save the token to localStorage on the client side
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        // Redirect the user to the dashboard page
        router.push('/dashboard');
      } else {
        // If login fails, set the error message based on the response
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Login error:", error);
      setError('Something went wrong, please try again later.');
    } finally {
      // Reset the loading state once the API call completes
      setLoading(false);
    }
  };

  return (
    <>
      {/* Head component for setting the page title and meta description */}
      <Head>
        <title>Login - Social Scheduler</title>
        <meta name="description" content="Login to Social Scheduler" />
      </Head>

      {/* Main content area for the login form */}
      <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Login</h1>
        {/* Display any error messages in red */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* The login form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            />
          </div>
          {/* The submit button is disabled while loading */}
          <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </main>
    </>
  );
}