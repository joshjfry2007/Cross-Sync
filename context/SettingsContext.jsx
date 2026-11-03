'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  English: {
    settings: 'Settings',
    user: 'User',
    users: 'USERS',
    searchUsers: 'Search users...',
    company: 'Company',
    city: 'City',
    phone: 'Phone',
    website: 'Website',
    preferences: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    fontSize: 'Font size',
    preview: 'Preview: Make yourself at home.',
    saveChanges: 'Save changes',
    saved: 'Saved ✓',
    syncedAcrossTabs: 'Synced across tabs',
  },
  Hindi: {
    settings: 'सेटिंग्स',
    user: 'उपयोगकर्ता',
    users: 'उपयोगकर्ता',
    searchUsers: 'उपयोगकर्ता खोजें...',
    company: 'कंपनी',
    city: 'शहर',
    phone: 'फ़ोन',
    website: 'वेबसाइट',
    preferences: 'प्राथमिकताएं',
    theme: 'थीम',
    language: 'भाषा',
    fontSize: 'फ़ॉन्ट आकार',
    preview: 'पूर्वावलोकन: यहाँ घर जैसा महसूस करें।',
    saveChanges: 'बदलाव सहेजें',
    saved: 'सहेजा गया ✓',
    syncedAcrossTabs: 'टैब में सिंक किया गया',
  },
  German: {
    settings: 'Einstellungen',
    user: 'Benutzer',
    users: 'BENUTZER',
    searchUsers: 'Benutzer suchen...',
    company: 'Firma',
    city: 'Stadt',
    phone: 'Telefon',
    website: 'Webseite',
    preferences: 'Einstellungen',
    theme: 'Design',
    language: 'Sprache',
    fontSize: 'Schriftgröße',
    preview: 'Vorschau: Fühlen Sie sich wie zu Hause.',
    saveChanges: 'Änderungen speichern',
    saved: 'Gespeichert ✓',
    syncedAcrossTabs: 'Tab-übergreifend synchronisiert',
  },
  French: {
    settings: 'Paramètres',
    user: 'Utilisateur',
    users: 'UTILISATEURS',
    searchUsers: 'Rechercher des utilisateurs...',
    company: 'Entreprise',
    city: 'Ville',
    phone: 'Téléphone',
    website: 'Site web',
    preferences: 'Préférences',
    theme: 'Thème',
    language: 'Langue',
    fontSize: 'Taille de police',
    preview: 'Aperçu : Faites comme chez vous.',
    saveChanges: 'Enregistrer les modifications',
    saved: 'Enregistré ✓',
    syncedAcrossTabs: 'Synchronisé entre les onglets',
  },
};

const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2);

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState(14);

  // Load initial settings from server API or localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tab-sync:settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.fontSize) setFontSize(Number(parsed.fontSize));
      }
    } catch {}

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const s = data?.settings || data;
        if (s?.theme) setTheme(s.theme);
        if (s?.language) setLanguage(s.language);
        if (s?.fontSize) setFontSize(Number(s.fontSize));
      })
      .catch(() => {});
  }, []);

  // Update only the CSS variable --font-size so layout containers (which use rem) stay fixed
  useEffect(() => {
    document.documentElement.style.fontSize = ''; // Never override rem root base
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }, [fontSize]);

  // Real-time synchronization across all browser tabs
  useEffect(() => {
    const ch = new BroadcastChannel('tab-sync');

    ch.onmessage = (e) => {
      if (!e.data || e.data.from === TAB_ID) return;
      const s = e.data.settings;
      if (!s) return;

      const newTheme = s.theme?.value ?? s.theme;
      const newLang = s.language?.value ?? s.language;
      const newFont = s.fontSize?.value ?? s.fontSize;

      if (newTheme) setTheme(newTheme);
      if (newLang) setLanguage(newLang);
      if (newFont) setFontSize(Number(newFont));
    };

    const onStorageChange = (e) => {
      if (e.key === 'tab-sync:settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.from === TAB_ID) return;
          if (parsed.theme) setTheme(parsed.theme);
          if (parsed.language) setLanguage(parsed.language);
          if (parsed.fontSize) setFontSize(Number(parsed.fontSize));
        } catch {}
      }
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      ch.close();
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  // Broadcast function called on save
  const broadcastSettings = (newSettings) => {
    const payload = {
      from: TAB_ID,
      sentAt: Date.now(),
      settings: {
        theme: { value: newSettings.theme, ts: Date.now(), tabId: TAB_ID },
        language: { value: newSettings.language, ts: Date.now(), tabId: TAB_ID },
        fontSize: { value: newSettings.fontSize, ts: Date.now(), tabId: TAB_ID },
      },
    };

    // 1. Send via BroadcastChannel (do NOT close immediately, allow IPC queue to flush)
    try {
      const ch = new BroadcastChannel('tab-sync');
      ch.postMessage(payload);
      setTimeout(() => ch.close(), 1000);
    } catch {}

    // 2. Persist to localStorage (triggers storage event in other tabs)
    try {
      localStorage.setItem('tab-sync:settings', JSON.stringify({
        ...newSettings,
        from: TAB_ID,
        ts: Date.now(),
      }));
    } catch {}
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['English']?.[key] || key;
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        broadcastSettings,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
