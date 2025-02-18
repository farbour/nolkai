import "@/styles/globals.css";

import type { AppProps } from "next/app";

// file path: src/pages/_app.tsx

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
