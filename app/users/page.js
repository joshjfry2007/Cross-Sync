'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar';
import Header from '@/component/Header';
import { useSettings } from '@/context/SettingsContext';

const UsersPage = () => {
  const { t } = useSettings();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load users');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const initials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <main className="flex flex-col md:flex-row min-h-screen md:h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-x-hidden md:overflow-hidden">
        <Header />

        <section className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{t('users')}</h1>

            {loading && (
              <div className="p-8 text-center text-gray-500 dark:text-[#8A94B2]">
                Loading users...
              </div>
            )}

            {error && (
              <div className="p-8 text-center flex flex-col items-center gap-3">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="divide-y divide-gray-200 dark:divide-[#232C47]">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-[#141C33]/40 px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 border border-transparent dark:border-[#232C47] flex items-center justify-center text-gray-900 font-bold text-sm shrink-0">
                        {initials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-[#E6EAF5]">
                          {user.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-[#22C55E]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-[#8A94B2] flex flex-wrap gap-x-4 gap-y-1 sm:text-right">
                      <span>{user.company?.name}</span>
                      <span>{user.address?.city}</span>
                      <span>{user.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default UsersPage;
