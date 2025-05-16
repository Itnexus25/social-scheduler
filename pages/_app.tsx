// pages/_app.tsx
import React from "react";
import { ClerkProvider, SignedOut, SignInButton } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

function MyApp(props: { Component: any; pageProps: any; }) {
  // Destructure Component and pageProps from props.
  // In Next.js, these are always provided, so no need for fallback values.
  const { Component, pageProps } = props;
  
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;