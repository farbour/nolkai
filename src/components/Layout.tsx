import Link from 'next/link';
// file path: src/components/Layout.tsx
import React from 'react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="w-24 transition-transform hover:scale-105">
                  <svg width="100%" height="100%" viewBox="0 0 77 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5882 7.93219V27.4787H12.4663V13.7609H6.15394V27.4861H0V7.93219H18.5882Z" fill="#344C45"/>
                    <path d="M36.8845 17.7673C36.9184 15.5843 35.7205 13.8468 33.8509 13.3753C31.3154 12.7349 29.0854 14.1197 28.578 16.6498C28.1271 18.9033 29.0798 21.0176 30.9173 21.8325C33.8622 23.1412 36.8316 21.116 36.8845 17.7673ZM32.5322 27.9935C26.4707 27.8431 22.1165 23.3212 22.2429 17.5538C22.3769 11.4226 27.08 7.1587 33.3528 7.45199C38.9729 7.71373 43.4176 12.2746 43.1289 18.365C42.8724 23.802 38.09 28.194 32.5322 27.9935Z" fill="#344C45"/>
                    <path d="M52.655 6.10352e-05H46.752V27.497H52.655V6.10352e-05Z" fill="#344C45"/>
                    <path d="M76.9993 7.83166H69.7096L63.0784 16.3742V6.10352e-05H57.1772V27.497H63.0784V18.8802L69.7096 27.4227H76.9993L69.3964 17.6272L76.9993 7.83166Z" fill="#344C45"/>
                  </svg>
                </Link>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {[
                  { href: '/overview', label: 'Overview' },
                  { href: '/report', label: 'Report' },
                  { href: '/ecommerce', label: 'Ecommerce' }
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`${
                      isActive(href)
                        ? 'border-nolk-green text-gray-900 bg-green-50'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
                    } inline-flex items-center px-4 py-2 border-b-2 text-sm font-semibold transition-colors duration-150 rounded-t-lg`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <div className="text-sm font-medium text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Nolk. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};