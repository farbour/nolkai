import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { BrandProvider } from '../context/BrandContext';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BrandProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </BrandProvider>
  );
}
