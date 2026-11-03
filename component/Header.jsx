'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Header = () => {
  const pathname = usePathname();
  const { t } = useSettings();

  const isSettingsPage = pathname === '/' || pathname.includes('settings');
  const isUsersPage = pathname.includes('users') || pathname.includes('user');

  const pageTitle = isSettingsPage
    ? t('settings')
    : isUsersPage
    ? t('users')
    : pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className='dark-header border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center shadow-2xl'>
      <p className='dark-title text-2xl font-bold text-blue-800'>{pageTitle}</p>
      <p className='dark-muted text-sm font-semibold text-green-700 ml-auto'>{t('syncedAcrossTabs')}</p>
    </div>
  );
};

export default Header;
