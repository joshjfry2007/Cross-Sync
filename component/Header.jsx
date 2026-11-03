'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

const Header = () => {
  const pathname = usePathname();
  const { t } = useSettings();

  const isSettingsPage = pathname === '/' || pathname.includes('settings');
  const pageTitle = isSettingsPage
    ? t('settings')
    : pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className='border-b px-6 py-4 flex justify-between items-center shadow-2xl'>
      <p className='text-2xl font-bold text-blue-800'>{pageTitle}</p>
      <p className='text-sm text-gray-600 ml-auto'>{t('syncedAcrossTabs')}</p>
    </div>
  );
};

export default Header;
