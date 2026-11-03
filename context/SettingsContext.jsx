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
    saving: 'Saving...',
    resetToDefaults: 'Reset to defaults',
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
    saving: 'सहेज रहा है...',
    resetToDefaults: 'डिफ़ॉल्ट पर रीसेट करें',
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
    saving: 'Speichern...',
    resetToDefaults: 'Auf Standard zurücksetzen',
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
    saving: 'Enregistrement...',
    resetToDefaults: 'Rétablir les valeurs par défaut',
    syncedAcrossTabs: 'Synchronisé entre les onglets',
  },
};

function extractValue(val, fallback) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object' && 'value' in val) return val.value ?? fallback;
  return val;
}

const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2);

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState(14);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tab-sync:settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.theme) setTheme(extractValue(parsed.theme, 'light'));
        if (parsed.language) setLanguage(extractValue(parsed.language, 'English'));
        if (parsed.fontSize) setFontSize(Number(extractValue(parsed.fontSize, 14)));
      }
    } catch {}

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const s = data?.settings || data;
        if (s?.theme) setTheme(extractValue(s.theme, 'light'));
        if (s?.language) setLanguage(extractValue(s.language, 'English'));
        if (s?.fontSize) setFontSize(Number(extractValue(s.fontSize, 14)));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const activeTheme = extractValue(theme, 'light');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
      if (activeTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = '';
      document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    }
  }, [fontSize]);

  useEffect(() => {
    const ch = new BroadcastChannel('tab-sync');

    ch.onmessage = (e) => {
      if (!e.data || e.data.from === TAB_ID) return;
      const s = e.data.settings;
      if (!s) return;

      const newTheme = extractValue(s.theme, null);
      const newLang = extractValue(s.language, null);
      const newFont = extractValue(s.fontSize, null);

      if (newTheme) setTheme(newTheme);
      if (newLang) setLanguage(newLang);
      if (newFont) setFontSize(Number(newFont));
    };

    const onStorageChange = (e) => {
      if (e.key === 'tab-sync:settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.from === TAB_ID) return;
          if (parsed.theme) setTheme(extractValue(parsed.theme, 'light'));
          if (parsed.language) setLanguage(extractValue(parsed.language, 'English'));
          if (parsed.fontSize) setFontSize(Number(extractValue(parsed.fontSize, 14)));
        } catch {}
      }
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      ch.close();
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const broadcastSettings = (newSettings) => {
    const cleanTheme = extractValue(newSettings.theme, 'light');
    const cleanLang = extractValue(newSettings.language, 'English');
    const cleanFont = Number(extractValue(newSettings.fontSize, 14));

    const payload = {
      from: TAB_ID,
      sentAt: Date.now(),
      settings: {
        theme: { value: cleanTheme, ts: Date.now(), tabId: TAB_ID },
        language: { value: cleanLang, ts: Date.now(), tabId: TAB_ID },
        fontSize: { value: cleanFont, ts: Date.now(), tabId: TAB_ID },
      },
    };

    try {
      const ch = new BroadcastChannel('tab-sync');
      ch.postMessage(payload);
      setTimeout(() => ch.close(), 1000);
    } catch {}

    try {
      localStorage.setItem('tab-sync:settings', JSON.stringify({
        theme: cleanTheme,
        language: cleanLang,
        fontSize: cleanFont,
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
        theme: extractValue(theme, 'light'),
        setTheme,
        language: extractValue(language, 'English'),
        setLanguage,
        fontSize: Number(extractValue(fontSize, 14)),
        setFontSize,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
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
