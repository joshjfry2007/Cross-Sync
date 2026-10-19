import "./style.css";
import {
    DEFAULT_VERSIONED,
    LANG,
    MIN_FONT,
    MAX_FONT,
    makeEntry,
    plainValues,
    newerEntry,
    loadFromStorage,
    saveToStorage,
    TAB_ID,
} from "./settings";
import type { Settings, VersionedSettings } from "./settings";
import { t } from "./i18n";

function el<T extends HTMLElement>(id: string): T {
    const found = document.getElementById(id);
    if (!found) throw new Error(`Missing #${id}`);
    return found as T;
}

const title = el("title");
const labelTheme = el("label-theme");
const labelLanguage = el("label-language");
const labelFont = el("label-font");
const preview = el("preview");
const fontValue = el("font-value");
const themeToggle = el<HTMLInputElement>("theme-toggle");
const languageSelect = el<HTMLSelectElement>("language-select");
const fontSlider = el<HTMLInputElement>("font-slider");
const syncStatus = el("sync-status");

fontSlider.min = String(MIN_FONT);
fontSlider.max = String(MAX_FONT);

for (const lang of LANG) {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    languageSelect.append(opt);
}

let state: VersionedSettings = loadFromStorage() ?? { ...DEFAULT_VERSIONED };

function render(): void {
    const s: Settings = plainValues(state);

    document.documentElement.dataset.theme = s.theme;
    document.documentElement.style.setProperty("--font-size", `${s.fontSize}px`);

    title.textContent = t(s.language, "title");
    labelTheme.textContent = t(s.language, "darkMode");
    labelLanguage.textContent = t(s.language, "language");
    labelFont.textContent = t(s.language, "fontSize");
    preview.textContent = t(s.language, "preview");

    themeToggle.checked = s.theme === "dark";
    languageSelect.value = s.language;
    fontSlider.value = String(s.fontSize);
    fontValue.textContent = `${s.fontSize}px`;
}

const channel = new BroadcastChannel("tab-sync");

channel.onmessage = (e) => {
    if (!e.data || e.data.from === TAB_ID) return;

    state = {
        theme: newerEntry(state.theme, e.data.settings.theme),
        language: newerEntry(state.language, e.data.settings.language),
        fontSize: newerEntry(state.fontSize, e.data.settings.fontSize),
    };

    saveToStorage(state);
    render();

    const ms = Math.max(0, Date.now() - e.data.sentAt);
    syncStatus.textContent = `synced in ${ms} ms`;
};

function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    state = { ...state, [key]: makeEntry(value) };
    saveToStorage(state);
    render();
    channel.postMessage({ sentAt: Date.now(), from: TAB_ID, settings: state });
}

let sliderTimeout: number | undefined;

fontSlider.addEventListener("input", () => {
    const size = Number(fontSlider.value);
    state = { ...state, fontSize: makeEntry(size) };
    render();

    clearTimeout(sliderTimeout);
    sliderTimeout = window.setTimeout(() => {
        saveToStorage(state);
        channel.postMessage({ sentAt: Date.now(), from: TAB_ID, settings: state });
    }, 100);
});

themeToggle.addEventListener("change", () => {
    updateSetting("theme", themeToggle.checked ? "dark" : "light");
});

languageSelect.addEventListener("change", () => {
    updateSetting("language", languageSelect.value as Settings["language"]);
});

render();
