// client/src/components/Navbar.tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    router.push('/login');
  };

  // Determine if the current page is the homepage.
  const isHomePage = router.pathname === '/';

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        marginBottom: '2rem'
      }}
    >
      <h2 style={{ margin: 0 }}>Social Scheduler</h2>
      {/* Only show the logout button if the user is logged in and not on the homepage */}
      {isLoggedIn && !isHomePage && (
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e63946',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;