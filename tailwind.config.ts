// file path: tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nolk-green': '#344C45',
        'nolk-light': '#f8fafc',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      height: {
        'chart': '400px',
      },
      ringColor: {
        'nolk-green': '#344C45',
      },
      borderColor: {
        'nolk-green': '#344C45',
      },
      textColor: {
        'nolk-green': '#344C45',
      },
      backgroundColor: {
        'nolk-green': '#344C45',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-50',
    'bg-red-50',
    'bg-yellow-50',
    'text-green-600',
    'text-red-600',
    'text-yellow-800',
    'border-green-200',
    'border-red-200',
    'border-yellow-200',
    'hover:bg-green-200',
    'hover:bg-red-200',
    'hover:bg-yellow-200',
  ]
};

export default config;
