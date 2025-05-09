import { AppProps } from 'next/app';
import Login from '@/pages/login'; // ✅ Updated to lowercase
import Signup from '@/pages/signup';
import Home from '@/pages/home';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;