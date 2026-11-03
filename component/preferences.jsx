'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

const THEMES = ['light', 'dark'];
const LANGUAGES = ['English', 'Hindi', 'German', 'French'];

const Preferences = () => {
  const {
    theme: globalTheme,
    setTheme: setGlobalTheme,
    language: globalLanguage,
    setLanguage: setGlobalLanguage,
    fontSize: globalFontSize,
    setFontSize: setGlobalFontSize,
    broadcastSettings,
    t,
  } = useSettings();

  const [theme, setTheme] = useState(globalTheme);
  const [language, setLanguage] = useState(globalLanguage);
  const [fontSize, setFontSize] = useState(globalFontSize);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setTheme(globalTheme); }, [globalTheme]);
  useEffect(() => { setLanguage(globalLanguage); }, [globalLanguage]);
  useEffect(() => { setFontSize(globalFontSize); }, [globalFontSize]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setGlobalLanguage(newLang);
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    setGlobalFontSize(newSize);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, language, fontSize }),
      });
      if (res.ok) {
        broadcastSettings({ theme, language, fontSize });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save to /api/settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (saving) return;
    setSaving(true);
    const defaults = { theme: 'light', language: 'English', fontSize: 14 };
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaults),
      });
      if (res.ok) {
        setTheme(defaults.theme);
        setLanguage(defaults.language);
        setFontSize(defaults.fontSize);
        setGlobalTheme(defaults.theme);
        setGlobalLanguage(defaults.language);
        setGlobalFontSize(defaults.fontSize);
        broadcastSettings(defaults);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to reset settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className='dark-card bg-gray-50 p-6 rounded-4xl border border-blue-950 shadow-2xl flex flex-col gap-4'>
        <h2 className='text-xl font-bold mb-4'>{t('preferences')}</h2>

        <div className='dark-pref-row px-10 bg-gray-100 rounded-4xl min-h-15 flex items-center text-xl'>
          <label>{t('theme')}</label>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className='dark-select ml-4 p-2 rounded-4xl border border-gray-300 h-10 w-50 text-center text-lg bg-white outline-none'
          >
            {THEMES.map((th) => (
              <option key={th} value={th}>{th}</option>
            ))}
          </select>
        </div>

        <div className='dark-pref-row px-10 bg-gray-100 rounded-4xl min-h-15 flex items-center text-xl'>
          <label>{t('language')}</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className='dark-select ml-4 p-2 rounded-4xl border border-gray-300 h-10 w-50 text-center text-lg bg-white outline-none'
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 px-6">
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-sm">{t('fontSize')}</label>
            <span className="dark-muted text-sm text-gray-500 transition-all duration-200 ease-in-out">
              {fontSize} px
            </span>
          </div>
          <input
            type="range" min={12} max={18}
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full accent-blue-600 transition-all duration-200 ease-in-out cursor-pointer"
          />
        </div>

        <p className="dark-muted text-sm text-gray-500 italic mb-6">
          {t('preview')}
        </p>
      </div>

      <div className='dark-save-bar border border-blue-950 rounded-4xl p-2 mt-6 flex flex-wrap gap-3 justify-end items-center'>
        <button
          onClick={handleReset}
          disabled={saving}
          className="text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-[#232C47] px-4 py-2 rounded-4xl hover:bg-gray-100 dark:hover:bg-[#141C33] transition-colors font-medium text-sm disabled:opacity-50"
        >
          {t('resetToDefaults')}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="dark-save-btn text-black border border-blue-950 px-6 py-2 rounded-4xl bg-green-500 hover:bg-green-400 transition-colors font-semibold disabled:opacity-50"
        >
          {saving ? t('saving') : saved ? t('saved') : t('saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
