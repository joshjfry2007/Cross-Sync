'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Header = () => {
  const pathname = usePathname();
  const { t } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSettingsPage = pathname === '/' || pathname.includes('settings');
  const isUsersPage = pathname.includes('users') || pathname.includes('user');

  const pageTitle = isSettingsPage
    ? t('settings')
    : isUsersPage
    ? t('users')
    : pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <div className="md:hidden px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-[#232C47]">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-[#E6EAF5]">
          Cross-Sync
        </h1>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-sm font-medium text-gray-600 dark:text-[#8A94B2] hover:text-gray-900 dark:hover:text-[#E6EAF5] px-2 py-1 rounded"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-[#232C47] bg-white dark:bg-[#0F1629] px-4 py-3 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSettingsPage
                ? 'bg-blue-50 text-blue-600 dark:bg-[#19233D] dark:text-[#6C8CFF]'
                : 'text-gray-700 dark:text-[#8A94B2] hover:bg-gray-100 dark:hover:bg-[#141C33]'
            }`}
          >
            {t('settings')}
          </Link>
          <Link
            href="/users"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isUsersPage
                ? 'bg-blue-50 text-blue-600 dark:bg-[#19233D] dark:text-[#6C8CFF]'
                : 'text-gray-700 dark:text-[#8A94B2] hover:bg-gray-100 dark:hover:bg-[#141C33]'
            }`}
          >
            {t('users')}
          </Link>
        </div>
      )}

      <div className="hidden md:flex dark-header border-b border-gray-200 bg-white px-6 py-4 justify-between items-center shadow-2xl">
        <p className="dark-title text-2xl font-bold text-blue-800">{pageTitle}</p>
        <p className="dark-muted text-sm font-semibold text-green-700 ml-auto">{t('syncedAcrossTabs')}</p>
      </div>
    </>
  );
};

export default Header;
