"use client";
import React, { useState, useEffect } from 'react';
import Preferences from '@/component/preferences';
import { useSettings } from '@/context/SettingsContext';

const peopleCard = () => {
    const { t } = useSettings();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = () => {
        setLoading(true);
        setError(null);
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load users");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setSelectedUser(data[0]);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Failed to load users");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const onlyUsers = users.filter((user) =>
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full max-w-5xl mx-auto">
            <div className="hidden lg:flex dark-card bg-gray-50 p-4 rounded-4xl w-70 border border-blue-950 shadow-2xl flex-col shrink-0">
                <p className="font-bold">{t('users')}</p>
                <input
                    className='dark-input bg-gray-300 w-full rounded-4xl p-2 mt-4 mr-4 mb-4 text-center outline-none'
                    type="text"
                    placeholder={t('searchUsers')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading && (
                    <div className="p-4 text-center dark-muted text-gray-500 text-sm">
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="p-4 text-center flex flex-col items-center gap-2">
                        <p className="text-red-500 text-xs">{error}</p>
                        <button
                            onClick={fetchUsers}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)]">
                        {onlyUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={`dark-user-row text-left p-3 border-b border-gray-300 hover:bg-gray-200 transition-all duration-200 ease-in-out rounded-t-lg
                                ${selectedUser?.id === user.id ? "text-blue-600 dark:text-[#6C8CFF] font-bold" : ""}
                                `}
                            >
                                <p>{user.name}</p>
                                <p className='dark-email text-sm text-green-900'>{user.email}</p>
                            </button>
                        ))}
                        {onlyUsers.length === 0 && (
                            <p className="text-xs dark-muted text-gray-500 text-center py-4">No users found</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-4 w-full">
                <div className="md:hidden">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#E6EAF5]">
                        {t('settings')}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-[#8A94B2] mt-0.5 mb-3">
                        Manage your preferences.
                    </p>

                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder={t('searchUsers')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white dark:bg-[#141C33] border border-gray-200 dark:border-[#232C47] rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-[#E6EAF5] placeholder-gray-400 dark:placeholder-[#8A94B2] outline-none shadow-sm focus:border-blue-500"
                        />
                        {search && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#141C33] border border-gray-200 dark:border-[#232C47] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                {onlyUsers.map((u) => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setSearch("");
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs border-b border-gray-100 dark:border-[#232C47] hover:bg-gray-50 dark:hover:bg-[#19233D]"
                                    >
                                        <p className="font-semibold text-gray-900 dark:text-[#E6EAF5]">{u.name}</p>
                                        <p className="text-gray-500 dark:text-[#8A94B2]">{u.email}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {selectedUser && (
                    <div className="dark-card bg-white dark:bg-[#141C33] p-4 md:p-6 rounded-2xl md:rounded-4xl border border-gray-200 dark:border-[#232C47] shadow-sm md:shadow-2xl">
                        <div className="flex items-center gap-3.5 mb-4">
                            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white font-semibold text-sm flex items-center justify-center shrink-0">
                                {initials(selectedUser.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-base md:text-xl font-bold truncate text-gray-900 dark:text-[#E6EAF5]">
                                    {selectedUser.name}
                                </p>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-[#8A94B2] truncate">
                                    {selectedUser.email}
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-[#232C47] flex justify-between items-center text-xs text-gray-600 dark:text-[#8A94B2]">
                            <span className="font-medium truncate pr-2">
                                {selectedUser.company?.name || selectedUser.company}
                            </span>
                            <span className="font-medium truncate text-right">
                                {selectedUser.address?.city || selectedUser.city}
                            </span>
                        </div>
                    </div>
                )}

                <Preferences />
            </div>
        </div>
    );
};

export default peopleCard;
