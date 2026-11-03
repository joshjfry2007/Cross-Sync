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
    <div className="flex flex-col gap-4">
      <div className='dark-card bg-white dark:bg-[#141C33] p-4 md:p-6 rounded-2xl md:rounded-4xl border border-gray-200 dark:border-[#232C47] shadow-sm md:shadow-2xl flex flex-col gap-4'>
        <h2 className='text-lg md:text-xl font-bold'>{t('preferences')}</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs md:text-sm font-semibold text-gray-800 dark:text-[#E6EAF5]">
            {t('theme')}
          </label>
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className='dark-select w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#232C47] bg-white dark:bg-[#0F1629] text-sm text-gray-900 dark:text-[#E6EAF5] appearance-none outline-none cursor-pointer capitalize'
            >
              {THEMES.map((th) => (
                <option key={th} value={th}>{th}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              v
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs md:text-sm font-semibold text-gray-800 dark:text-[#E6EAF5]">
            {t('language')}
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className='dark-select w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#232C47] bg-white dark:bg-[#0F1629] text-sm text-gray-900 dark:text-[#E6EAF5] appearance-none outline-none cursor-pointer'
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              v
            </span>
          </div>
        </div>

        <div className="pt-1">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-xs md:text-sm text-gray-800 dark:text-[#E6EAF5]">
              {t('fontSize')}
            </label>
            <span className="dark-muted text-xs text-gray-500">
              {fontSize} px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={24}
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <p className="dark-muted text-xs text-gray-500 mt-1">
          {t('preview')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 order-1"
        >
          {saving ? t('saving') : saved ? t('saved') : t('saveChanges')}
        </button>

        <button
          onClick={handleReset}
          disabled={saving}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-gray-600 dark:text-[#8A94B2] border border-gray-200 dark:border-[#232C47] hover:bg-gray-100 dark:hover:bg-[#141C33] text-xs font-medium transition-colors order-2"
        >
          {t('resetToDefaults')}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
