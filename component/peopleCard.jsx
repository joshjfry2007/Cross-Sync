"use client";
import React, { useState, useEffect } from 'react';
import Preferences from '@/component/preferences';
import { useSettings } from '@/context/SettingsContext';

const peopleCard = () => {
    const { t } = useSettings();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setSelectedUser(data[0]);
            });
    }, []);

    const onlyUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="flex gap-6 h-full overflow-hidden">
            <div className="dark-card bg-gray-50 p-4 rounded-4xl w-70 border border-blue-950 shadow-2xl flex flex-col m-10">
                <p className="font-bold">{t('users')}</p>
                <input
                    className='dark-input bg-gray-300 w-full rounded-4xl p-2 mt-4 mr-4 mb-4 text-center'
                    type="text"
                    placeholder={t('searchUsers')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex flex-col gap-2 overflow-y-auto">
                    {onlyUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`dark-user-row text-left p-3 border-b border-gray-300 hover:bg-gray-200 transition-all duration-200 ease-in-out rounded-t-lg
                            ${selectedUser?.id === user.id ? "text-blue-400 font-bold" : ""}
                            `}
                        >
                            <p>{user.name}</p>
                            <p className='dark-email text-sm text-green-900'>{user.email}</p>
                        </button>
                    ))}
                </div>
            </div>

            {selectedUser && (
                <div className="flex flex-col flex-1 gap-4 my-10 mr-10 overflow-y-auto">
                    <div className="dark-card bg-gray-50 p-6 rounded-4xl border border-blue-950 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold text-lg">
                                {initials(selectedUser.name)}
                            </div>
                            <div>
                                <p className="text-xl font-bold">{selectedUser.name}</p>
                                <p className="dark-email text-sm text-green-900">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-12">
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('company')}</p>
                                <p className="font-medium">{selectedUser.company?.name}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('city')}</p>
                                <p className="font-medium">{selectedUser.address?.city}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('phone')}</p>
                                <p className="font-medium">{selectedUser.phone}</p>
                            </div>
                            <div>
                                <p className="dark-muted text-xs text-gray-500 uppercase font-semibold mb-1">{t('website')}</p>
                                <p className="font-medium">{selectedUser.website}</p>
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
