# tab-sync

A Vite + TypeScript settings panel that syncs across browser tabs in real time with deterministic conflict resolution.

---

## Features

| # | Feature | Key files |
|---|---------|-----------|
| 3 | **Persistence** – localStorage, validated on load | `src/settings.ts`, `src/main.ts` |
| 4 | **Flash-free init** – inline `<script>` before first paint | `index.html` |
| 5 | **Cross-tab sync** – BroadcastChannel + latency display | `src/main.ts` |
| 6 | **Conflict resolution** – deterministic `(ts, tabId)` ordering | `src/settings.ts` |

---

## 3 · Persistence

Every time a setting changes, `saveToStorage()` serialises the full `VersionedSettings` object to `localStorage` under the key `tab-sync:settings`.

On startup, `loadFromStorage()` is called inside a `try/catch` because `JSON.parse` will throw on corrupted data. The return value is also structurally validated:

- each key must be a `Versioned<T>` object with `value`, `ts`, and `tabId`
- `theme` must be one of the allowed string literals
- `language` must be one of the allowed string literals
- `fontSize` is clamped to `[MIN_FONT, MAX_FONT]` and rounded to an integer

If the data is absent, malformed, or fails validation, the function returns `null` and the caller falls back to `DEFAULT_VERSIONED`. **Corrupted data never crashes the app.**

---

## 4 · Flash-free initialization

Module scripts (`<script type="module">`) are always deferred by the browser — they run *after* the first paint. Without a fix, a dark-mode user would see a white flash on every hard reload.

The fix is a small classic inline `<script>` placed in `<head>`, before any stylesheets that depend on the theme attribute. Because it is not a module and not `defer`/`async`, the parser runs it synchronously before the `<body>` is rendered. It:

1. reads the `tab-sync:settings` key from `localStorage`
2. parses the JSON
3. sets `document.documentElement.dataset.theme` and `--font-size` before the first paint

The inline script is intentionally minimal (no imports, no TypeScript) because it must be a plain script. The full settings logic in `main.ts` will overwrite these attributes once it loads, so any future additions to the data model only need to be added in one place.

**How to test:** Open DevTools → Network → Throttle to "Slow 3G". Switch to dark mode. Hard-reload (`Ctrl+Shift+R`). The page background should be dark from the very first frame.

---

## 5 · Cross-tab sync

### Why BroadcastChannel instead of the `storage` event alone

| | `storage` event | `BroadcastChannel` |
|---|---|---|
| Same-tab suppression | ✅ not fired in the writing tab | ✅ not received by the sender |
| Latency | ~5–30 ms (I/O bound) | < 5 ms (IPC, no I/O) |
| Payload | Serialised string diff only | Any structured-cloneable value |
| API clarity | Side effect of localStorage write | Explicit messaging primitive |

`BroadcastChannel` delivers messages directly between browsing contexts in the same origin via the browser's IPC layer — no disk I/O involved, which makes it faster than relying on the `storage` event. We still use localStorage as the **source of truth** (for persistence across sessions and for tabs that open later), but the *real-time* notification goes over the channel.

### Protocol

1. **Local change** → update state → `saveToStorage` → `channel.postMessage({ sentAt, fromTab, settings })`
2. **Receiving tab** → merge remote state per-key → `saveToStorage` merged state → `render()` → show latency toast
3. The sender's own tab does not receive its own message (BroadcastChannel guarantees this).
4. The receiver never re-broadcasts a received message, preventing echo loops.

### Latency measurement

Each message includes a `sentAt: Date.now()` timestamp. The receiving tab computes `Date.now() - sentAt` and displays it as **"synced in X ms"** on screen. In practice this is consistently **< 10 ms** on a local machine, well within the < 100 ms target.

### Slider throttle

The font-size slider fires `input` on every pixel of movement. Applying every event to localStorage and broadcasting it would produce dozens of writes per second and flood other tabs.

**Decision:** Apply the change to the DOM immediately in the current tab (for smooth feel), but **throttle the `saveToStorage` + `broadcast` calls to at most once every 100 ms** using `setTimeout`. This keeps the UX snappy while keeping the sync traffic reasonable. The 100 ms window is imperceptible to users but dramatically reduces write volume.

---

## 6 · Conflict resolution

### The problem

Two tabs can change the same setting at nearly the same time. Each tab must independently arrive at the **same winner** without any coordination round-trip ("deterministic").

### Solution: `(ts, tabId)` version vector per setting

Each setting value is wrapped in a `Versioned<T>` entry:

```ts
type Versioned<T> = { value: T; ts: number; tabId: string };
```

The `newerEntry` function imposes a **total order** on any two entries:

```ts
function newerEntry<T>(a: Versioned<T>, b: Versioned<T>): Versioned<T> {
    if (b.ts > a.ts) return b;           // higher timestamp wins
    if (b.ts === a.ts && b.tabId > a.tabId) return b;  // tabId tiebreaker
    return a;
}
```

- **Timestamp first**: the more recent write wins.
- **Tab ID as tiebreaker**: `tabId` is a `crypto.randomUUID()` string. If two writes happen at the exact same millisecond, lexicographic comparison of UUID strings gives a consistent winner that every tab will compute identically.

Conflict resolution is applied **per key**, not per whole settings object. This means tab A winning on `theme` and tab B winning on `fontSize` is a valid outcome — settings are independent.

### Why this is "deterministic"

Every tab that receives the same two `Versioned` entries will call `newerEntry` and get the same result, because:

1. Both inputs are identical (timestamps and tab IDs are facts, not local state).
2. The comparison is a pure function with no randomness.

This means all tabs converge to the same state without any leader election or consensus protocol.

---

## Getting started

```bash
npm install
npm run dev
```

Open the URL in two or more tabs and change a setting — watch the other tab update in under 100 ms.

