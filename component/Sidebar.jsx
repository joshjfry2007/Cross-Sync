'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Sidebar = () => {
  const { t, sidebarOpen, setSidebarOpen } = useSettings();
  const pathname = usePathname();

  const isSettings = pathname === '/' || pathname.includes('settings');
  const isUsers = pathname.includes('users') || pathname.includes('user');

  const closeSidebar = () => {
    if (setSidebarOpen) setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 transform md:transform-none md:static md:h-screen transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className='dark-sidebar h-full w-62 flex flex-col bg-white shadow-2xl border-r border-gray-200 gap-2 relative'>
          <div className="flex items-center justify-between p-4">
            <p className='dark-app-title text-2xl font-bold flex-1 text-center'>Cross-Sync</p>
            <button
              onClick={closeSidebar}
              className="md:hidden p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-lg cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <Link
            href="/"
            onClick={closeSidebar}
            className={`dark-nav-link flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-300 ease-in-out rounded-4xl mt-6 md:mt-12 mx-4 border border-gray-200 ${
              isSettings ? 'bg-blue-50 font-bold dark-nav-link-active' : ''
            }`}
          >
            <img src="/settings.svg" alt="Settings" className='dark-icon w-6'/>
            <span>{t('settings')}</span>
          </Link>

          <Link
            href="/users"
            onClick={closeSidebar}
            className={`dark-nav-link flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-300 ease-in-out rounded-4xl mx-4 mt-4 border border-gray-200 ${
              isUsers ? 'bg-blue-50 font-bold dark-nav-link-active' : ''
            }`}
          >
            <img src="/user-icon.svg" alt="User" className='dark-icon w-6 gap-3' />
            <span className='ml-3'>{t('user')}</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
