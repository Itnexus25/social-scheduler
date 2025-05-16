// src/pages/_app.tsx

import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

// Use a normal function to wrap all code inside a proper function body.
function MyApp(props) {
  // Destructure props (defaults ensure that if these were somehow missing, code won’t error out)
  const { Component = () => null, pageProps = {} } = props;
  
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      {/* Optionally, render a sign-in UI when the user is signed out */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;