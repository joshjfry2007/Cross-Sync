'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar';
import Header from '@/component/Header';
import { useSettings } from '@/context/SettingsContext';

const UsersPage = () => {
  const { t } = useSettings();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const initials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <main className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <section className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="mb-4 pb-2 border-b border-gray-200 dark:border-[#232C47]">
            <h1 className="text-2xl font-bold dark-title">{t('users')}</h1>
          </div>

          {loading && (
            <div className="py-8 text-center dark-muted text-gray-500">
              Loading users...
            </div>
          )}

          {!loading && (
            <div className="divide-y divide-gray-200 dark:divide-[#232C47]">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-[#141C33]/50 px-2 rounded-lg"
                >
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-[#141C33] border border-transparent dark:border-[#232C47] flex items-center justify-center text-blue-900 dark:text-[#6C8CFF] font-bold text-sm shrink-0">
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-base">{user.name}</p>
                      <p className="dark-email text-sm text-green-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 text-sm dark-muted text-gray-600">
                    <div>
                      <span className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 mr-2">
                        {t('company')}:
                      </span>
                      <span>{user.company?.name}</span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 mr-2">
                        {t('city')}:
                      </span>
                      <span>{user.address?.city}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm dark-muted text-gray-600">
                    <div>
                      <span className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 mr-2">
                        {t('phone')}:
                      </span>
                      <span>{user.phone}</span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 mr-2">
                        {t('website')}:
                      </span>
                      <span className="text-blue-600 dark:text-[#6C8CFF]">{user.website}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default UsersPage;
