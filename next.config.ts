// file path: next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'raw-loader',
    });
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.csv': ['raw-loader'],
      },
    },
  },
};

export default nextConfig;
