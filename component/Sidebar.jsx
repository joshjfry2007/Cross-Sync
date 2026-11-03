'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Sidebar = () => {
  const { t } = useSettings();
  const pathname = usePathname();

  const isSettings = pathname === '/' || pathname.includes('settings');
  const isUsers = pathname.includes('users') || pathname.includes('user');

  return (
    <aside className='hidden md:block h-screen'>
      <nav className='dark-sidebar h-full w-62 flex flex-col bg-white shadow-2xl border-r border-gray-200 gap-2'>
        <p className='dark-app-title text-2xl font-bold p-4 text-center'>Cross-Sync</p>
        
        <Link
          href="/"
          className={`dark-nav-link flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-300 ease-in-out rounded-4xl mt-12 mx-4 border border-gray-200 ${
            isSettings ? 'bg-blue-50 font-bold dark-nav-link-active' : ''
          }`}
        >
          <img src="/settings.svg" alt="Settings" className='dark-icon w-6'/>
          <span>{t('settings')}</span>
        </Link>

        <Link
          href="/users"
          className={`dark-nav-link flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-300 ease-in-out rounded-4xl mx-4 mt-4 border border-gray-200 ${
            isUsers ? 'bg-blue-50 font-bold dark-nav-link-active' : ''
          }`}
        >
          <img src="/user-icon.svg" alt="User" className='dark-icon w-6 gap-3' />
          <span className='ml-3'>{t('user')}</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
