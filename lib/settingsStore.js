import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { DEFAULT_SETTINGS, validateSettings } from './settingsRules';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export async function getSettings() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);

    if (!parsed || typeof parsed !== 'object' || !parsed.settings) {
      throw new Error('Invalid structure');
    }

    const errors = validateSettings(parsed.settings);
    if (errors.length > 0) {
      throw new Error('Corrupted settings data');
    }

    return {
      settings: parsed.settings,
      updatedAt: parsed.updatedAt || null,
    };
  } catch (error) {
    return {
      settings: { ...DEFAULT_SETTINGS },
      updatedAt: null,
    };
  }
}

export async function saveSettings(newSettings) {
  await mkdir(DATA_DIR, { recursive: true });
  const data = {
    settings: newSettings,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}