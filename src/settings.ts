export const THEME = ["light", "dark"] as const;
export type Theme = typeof THEME[number];

export const LANG = ["English", "Hindi", "German", "French"] as const;
export type Lang = typeof LANG[number];

export const MIN_FONT = 10;
export const MAX_FONT = 20;

export interface Settings {
    theme: Theme;
    language: Lang;
    fontSize: number;
}

export type Versioned<T> = { value: T; ts: number; tabId: string };

export type VersionedSettings = {
    [K in keyof Settings]: Versioned<Settings[K]>;
};

export const DEFAULTS: Settings = {
    theme: "light",
    language: "English",
    fontSize: 14,
};

export const TAB_ID: string = crypto.randomUUID();

export const DEFAULT_VERSIONED: VersionedSettings = {
    theme:    { value: DEFAULTS.theme,    ts: 0, tabId: "default" },
    language: { value: DEFAULTS.language, ts: 0, tabId: "default" },
    fontSize: { value: DEFAULTS.fontSize, ts: 0, tabId: "default" },
};

export function makeEntry<T>(value: T): Versioned<T> {
    return { value, ts: Date.now(), tabId: TAB_ID };
}

export function plainValues(v: VersionedSettings): Settings {
    return {
        theme:    v.theme.value,
        language: v.language.value,
        fontSize: v.fontSize.value,
    };
}

export function newerEntry<T>(a: Versioned<T>, b: Versioned<T>): Versioned<T> {
    return b.ts > a.ts || (b.ts === a.ts && b.tabId > a.tabId) ? b : a;
}

const STORAGE_KEY = "tab-sync:settings";

export function loadFromStorage(): VersionedSettings | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || typeof data !== "object") return null;

        const theme = data.theme?.value === "dark" ? "dark" : "light";
        const language = LANG.includes(data.language?.value) ? data.language.value : DEFAULTS.language;
        const fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, Number(data.fontSize?.value) || DEFAULTS.fontSize));

        return {
            theme:    { value: theme,    ts: Number(data.theme?.ts) || 0,    tabId: String(data.theme?.tabId || "default") },
            language: { value: language, ts: Number(data.language?.ts) || 0, tabId: String(data.language?.tabId || "default") },
            fontSize: { value: fontSize, ts: Number(data.fontSize?.ts) || 0, tabId: String(data.fontSize?.tabId || "default") },
        };
    } catch {
        return null;
    }
}

export function saveToStorage(s: VersionedSettings): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
}
