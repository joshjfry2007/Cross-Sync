'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Header = () => {
  const pathname = usePathname();
  const { t, toggleSidebar } = useSettings();

  const isSettingsPage = pathname === '/' || pathname.includes('settings');
  const isUsersPage = pathname.includes('users') || pathname.includes('user');

  const pageTitle = isSettingsPage
    ? t('settings')
    : isUsersPage
    ? t('users')
    : pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className='dark-header border-b border-gray-200 bg-white px-4 sm:px-6 py-4 flex justify-between items-center shadow-2xl gap-3'>
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 -ml-1 text-gray-700 dark:text-[#E6EAF5] hover:bg-gray-100 dark:hover:bg-[#141C33] rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p className='dark-title text-xl sm:text-2xl font-bold text-blue-800 truncate'>{pageTitle}</p>
      </div>
      <p className='dark-muted text-xs sm:text-sm font-semibold text-green-700 shrink-0 text-right'>{t('syncedAcrossTabs')}</p>
    </div>
  );
};

export default Header;
