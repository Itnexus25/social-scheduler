// client/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state for better UX
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      // Decode the token (use a JWT decoding library or a custom function)
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));  // If user data exists, set it to state
        setLoading(false);
      } else {
        router.push('/login');  // If no user data, redirect to login page
      }
    } else {
      router.push('/login');  // If no token, redirect to login page
    }
  }, [router]);

  if (loading) {
    return { user: null, loading: true }; // Return loading state
  }

  return { user, loading };
};

export default useAuth;
