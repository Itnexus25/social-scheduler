// pages/_app.tsx
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ClerkProvider {...pageProps}>
    <Head>
      <title>Social Scheduler</title>
      <meta name="description" content="Manage your social posts easily" />
    </Head>
    <Component {...pageProps} />
  </ClerkProvider>
);

export default MyApp;