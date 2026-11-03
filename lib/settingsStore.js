import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import os from 'os';
import { DEFAULT_SETTINGS, validateSettings } from './settingsRules';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const TMP_SETTINGS_FILE = path.join(os.tmpdir(), 'cross_sync_settings.json');

let memoryStore = null;

export async function getSettings() {
  if (memoryStore && memoryStore.settings) {
    return {
      settings: memoryStore.settings,
      updatedAt: memoryStore.updatedAt || null,
    };
  }

  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object' || !parsed.settings) {
      throw new Error('Invalid structure');
    }
    const errors = validateSettings(parsed.settings);
    if (errors.length > 0) throw new Error('Corrupted data');
    memoryStore = parsed;
    return {
      settings: parsed.settings,
      updatedAt: parsed.updatedAt || null,
    };
  } catch {}

  try {
    const data = await readFile(TMP_SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object' && parsed.settings) {
      const errors = validateSettings(parsed.settings);
      if (errors.length === 0) {
        memoryStore = parsed;
        return {
          settings: parsed.settings,
          updatedAt: parsed.updatedAt || null,
        };
      }
    }
  } catch {}

  return {
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: null,
  };
}

export async function saveSettings(newSettings) {
  const data = {
    settings: newSettings,
    updatedAt: new Date().toISOString(),
  };
  memoryStore = data;

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    try {
      await writeFile(TMP_SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {}
  }

  return data;
}
