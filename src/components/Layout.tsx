import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';

import { BrandSelector } from './BrandSelector';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/overview', icon: ChartBarIcon },
  { name: 'Report', href: '/report', icon: DocumentChartBarIcon },
];

const userNavigation = [
  { name: 'Profile', href: '/', icon: UserCircleIcon },
  { name: 'Settings', href: '/', icon: Cog6ToothIcon },
  { name: 'Sign out', href: '/', icon: ArrowRightOnRectangleIcon },
];

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const isActive = (path: string) => router.pathname === path;

  const NavLink = ({ item }: { item: typeof navigation[0] }) => (
    <Link
      href={item.href}
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out ${
        isActive(item.href)
          ? 'bg-green-50 text-green-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon
        className={`mr-3 h-5 w-5 transition-colors duration-150 ease-in-out ${
          isActive(item.href)
            ? 'text-green-600'
            : 'text-gray-400 group-hover:text-gray-600'
        }`}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              <div className="flex flex-shrink-0 items-center px-6">
                <Link href="/" className="w-24">
                  <svg width="100%" height="100%" viewBox="0 0 77 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5882 7.93219V27.4787H12.4663V13.7609H6.15394V27.4861H0V7.93219H18.5882Z" fill="#344C45"/>
                    <path d="M36.8845 17.7673C36.9184 15.5843 35.7205 13.8468 33.8509 13.3753C31.3154 12.7349 29.0854 14.1197 28.578 16.6498C28.1271 18.9033 29.0798 21.0176 30.9173 21.8325C33.8622 23.1412 36.8316 21.116 36.8845 17.7673ZM32.5322 27.9935C26.4707 27.8431 22.1165 23.3212 22.2429 17.5538C22.3769 11.4226 27.08 7.1587 33.3528 7.45199C38.9729 7.71373 43.4176 12.2746 43.1289 18.365C42.8724 23.802 38.09 28.194 32.5322 27.9935Z" fill="#344C45"/>
                    <path d="M52.655 6.10352e-05H46.752V27.497H52.655V6.10352e-05Z" fill="#344C45"/>
                    <path d="M76.9993 7.83166H69.7096L63.0784 16.3742V6.10352e-05H57.1772V27.497H63.0784V18.8802L69.7096 27.4227H76.9993L69.3964 17.6272L76.9993 7.83166Z" fill="#344C45"/>
                  </svg>
                </Link>
              </div>

              <div className="mt-8 flex flex-1 flex-col px-4">
                <nav className="flex-1 space-y-2">
                  {navigation.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-sm">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-6">
            <Link href="/" className="w-24">
              <svg width="100%" height="100%" viewBox="0 0 77 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5882 7.93219V27.4787H12.4663V13.7609H6.15394V27.4861H0V7.93219H18.5882Z" fill="#344C45"/>
                <path d="M36.8845 17.7673C36.9184 15.5843 35.7205 13.8468 33.8509 13.3753C31.3154 12.7349 29.0854 14.1197 28.578 16.6498C28.1271 18.9033 29.0798 21.0176 30.9173 21.8325C33.8622 23.1412 36.8316 21.116 36.8845 17.7673ZM32.5322 27.9935C26.4707 27.8431 22.1165 23.3212 22.2429 17.5538C22.3769 11.4226 27.08 7.1587 33.3528 7.45199C38.9729 7.71373 43.4176 12.2746 43.1289 18.365C42.8724 23.802 38.09 28.194 32.5322 27.9935Z" fill="#344C45"/>
                <path d="M52.655 6.10352e-05H46.752V27.497H52.655V6.10352e-05Z" fill="#344C45"/>
                <path d="M76.9993 7.83166H69.7096L63.0784 16.3742V6.10352e-05H57.1772V27.497H63.0784V18.8802L69.7096 27.4227H76.9993L69.3964 17.6272L76.9993 7.83166Z" fill="#344C45"/>
              </svg>
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-nolk-green lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 justify-between items-center px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Brand Selector */}
              <BrandSelector />
              
              {/* Search Form */}
              <form className="flex w-full max-w-lg" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    id="search"
                    name="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="block w-full rounded-lg border-0 bg-gray-50 py-2.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-green-600 hover:bg-white focus:bg-white transition-colors duration-150 sm:text-sm sm:leading-6"
                    placeholder="Search anything..."
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
            
            <div className="ml-4 flex items-center space-x-4">
              {/* Last updated indicator */}
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <div className="text-sm font-medium text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-sm rounded-lg hover:bg-gray-100 p-2 transition-colors duration-150">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={`${
                              active ? 'bg-gray-50' : ''
                            } group flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150`}
                          >
                            <item.icon
                              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <footer className="mt-auto border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Nolk. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;