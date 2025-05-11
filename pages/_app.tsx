import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css"; // ✅ Ensure global styles are applied

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("🔄 App Mounted: Ensuring global styles are loaded.");
  }, []);

  return (
    <>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}

export default MyApp;