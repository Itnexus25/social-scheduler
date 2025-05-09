// src/components/Header.tsx
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Navigate back to the login page
    router.push('/login');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#f5f5f5', marginBottom: '2rem' }}>
      <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Logout
      </button>
    </header>
  );
}