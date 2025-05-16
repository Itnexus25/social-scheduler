// pages/_app.tsx
import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

function MyApp(props) {
  // Destructure with default fallbacks in case props are missing.
  const { Component = () => null, pageProps = {} } = props;

  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      {/* Optionally render sign-in UI when signed out */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;