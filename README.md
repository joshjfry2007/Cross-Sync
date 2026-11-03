# Cross-Sync

A Next.js settings dashboard that syncs across browser tabs in real time with deterministic conflict resolution, dark mode theming, dynamic font scaling, multi-language localization, and user management.

## Features

- **Persistence** – localStorage and JSON storage, validated on load
- **Cross-tab sync** – BroadcastChannel + storage event fallback
- **Conflict resolution** – deterministic `(ts, tabId)` ordering
- **Theming** – Polished Midnight Blue dark mode and light mode
- **Internationalization (i18n)** – English, Hindi, German, and French translations
- **Users Directory** – Clean, simple user directory synced across tabs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with two or more tabs side-by-side and change any setting — watch other tabs update instantly in real time.
