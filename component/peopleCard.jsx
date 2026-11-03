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
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full lg:overflow-hidden">
            <div className="dark-card bg-gray-50 p-4 rounded-4xl w-full lg:w-70 border border-blue-950 shadow-2xl flex flex-col my-2 lg:m-10 shrink-0">
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
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-56 sm:max-h-72 lg:max-h-none">
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

            {selectedUser && (
                <div className="flex flex-col flex-1 gap-4 my-2 lg:my-10 lg:mr-10 overflow-y-visible lg:overflow-y-auto min-w-0">
                    <div className="dark-card bg-gray-50 p-4 sm:p-6 rounded-4xl border border-blue-950 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-500 border border-transparent dark:border-[#232C47] flex items-center justify-center text-gray-900 font-bold text-lg shrink-0">
                                {initials(selectedUser.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold truncate">{selectedUser.name}</p>
                                <p className="dark-email text-sm text-green-900 truncate">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-12">
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('company')}</p>
                                <p className="font-medium truncate">{selectedUser.company?.name}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('city')}</p>
                                <p className="font-medium truncate">{selectedUser.address?.city}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('phone')}</p>
                                <p className="font-medium truncate">{selectedUser.phone}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('website')}</p>
                                <p className="font-medium truncate">{selectedUser.website}</p>
                            </div>
                        </div>
                    </div>

                    <Preferences />
                </div>
            )}
        </div>
    );
};

export default peopleCard;
