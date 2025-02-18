import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';

// file path: src/components/Layout.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = {
  main: [
    { name: 'Home', href: '/', icon: HomeIcon },
  ],
  analytics: [
    { name: 'Overview', href: '/overview', icon: ChartBarIcon },
    { name: 'Reports', href: '/report', icon: DocumentTextIcon },
    { name: 'Presentations', href: '/presentations', icon: PresentationChartBarIcon },
  ],
  ecommerce: [
    { name: 'Dashboard', href: '/ecommerce', icon: BuildingStorefrontIcon },
    { name: 'Analysis', href: '/analysis', icon: DocumentChartBarIcon },
    { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  ],
};

const userNavigation = [
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Sign out', href: '/signout', icon: ArrowRightOnRectangleIcon },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Here you can implement search functionality
    // For example, filtering navigation items or making API calls
  };
  
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
              
              {/* Desktop Navigation */}
              <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
                {/* Home Link */}
                {navigation.main.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'text-nolk-green'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}

                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Analytics
                    <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
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
                    <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {navigation.analytics.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } ${
                                  isActive(item.href) ? 'bg-green-50' : ''
                                } group flex items-center px-4 py-2 text-sm`}
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
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Ecommerce
                    <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
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
                    <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {navigation.ecommerce.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } ${
                                  isActive(item.href) ? 'bg-green-50' : ''
                                } group flex items-center px-4 py-2 text-sm`}
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
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            {/* Right side navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-nolk-green sm:text-sm sm:leading-6"
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>

              {/* Last updated indicator */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <div className="text-sm font-medium text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center text-sm rounded-full hover:bg-gray-100 p-2">
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } group flex items-center px-4 py-2 text-sm text-gray-700`}
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

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="lg:hidden">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-nolk-green sm:text-sm sm:leading-6"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Home Section */}
              <div className="px-3 py-2">
                <div className="space-y-1">
                  {navigation.main.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-green-50 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Analytics Section */}
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium text-gray-500">Analytics</h3>
                <div className="mt-2 space-y-1">
                  {navigation.analytics.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-green-50 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ecommerce Section */}
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium text-gray-500">Ecommerce</h3>
                <div className="mt-2 space-y-1">
                  {navigation.ecommerce.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-green-50 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Navigation */}
              <div className="px-3 py-2 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Account</h3>
                <div className="mt-2 space-y-1">
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    >
                      <item.icon
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Transition>
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