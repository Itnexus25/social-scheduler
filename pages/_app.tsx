// pages/_app.tsx
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import "@/styles/globals.css";

type MyAppProps = {
  Component: any;
  pageProps: any;
};

export default function MyApp({
  Component = () => null,
  pageProps = {},
}: MyAppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Social Scheduler</title>
        <meta name="description" content="Manage your social posts easily" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}