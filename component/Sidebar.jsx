'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';

const Sidebar = () => {
  const { t } = useSettings();

  return (
    <aside className='h-screen'>
      <nav className='h-full w-62 flex flex-col bg-white-500 shadow-2xl border-r-0 gap-2'>
        <p className='text-2xl font-bold p-4 text-center'>Cross-Sync</p>
        <a className="flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-400 ease-in-out rounded-4xl mt-12 mx-4 border border-gray-200">
          <img src="/settings.svg" alt="Settings" className='w-6'/>
          <span>{t('settings')}</span>
        </a>
        <a className='flex items-center gap-3 p-4 shadow-2xl hover:bg-blue-100 transition-all duration-400 ease-in-out rounded-4xl mx-4 mt-4 border border-gray-200'>
          <img src="/user-icon.svg" alt="Logo" className='w-6 gap-3' />
          <span className='ml-3'>{t('user')}</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
