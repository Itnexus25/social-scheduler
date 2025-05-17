// pages/_app.tsx
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

function MyApp(props: { Component: any; pageProps: any; }) {
  const { Component, pageProps } = props;
  
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      {/* Remove the global sign-in button so it won't display on every page */}
      {/* <SignedOut>
        <SignInButton />
      </SignedOut> */}
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;