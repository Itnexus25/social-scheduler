// pages/_app.tsx
import "@styles/globals.css"; // This now resolves to src/styles/globals.css
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log("🔄 App Mounted: Global styles are loaded.");
  }, []);

  return (
    <>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
}

export default MyApp;