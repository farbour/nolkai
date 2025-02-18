import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";

// file path: src/pages/_app.tsx

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
