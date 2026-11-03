# Cross-Sync Settings Dashboard

A responsive Next.js settings dashboard with external API integration, a dedicated settings validation API, and cross-tab synchronization.

Repository: [https://github.com/joshjfry2007/Cross-Sync](https://github.com/joshjfry2007/Cross-Sync)

---

## 1. Setup Instructions

### Prerequisites
- Node.js (v18.17+ or v20+)
- npm

### Installation & Run

```bash
git clone https://github.com/joshjfry2007/Cross-Sync.git
cd Cross-Sync
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify cross-tab synchronization:
1. Open [http://localhost:3000](http://localhost:3000) in two side-by-side browser tabs.
2. In Tab 1, adjust theme, language, or font size and click **Save changes** (or **Reset to defaults**).
3. Notice Tab 2 immediately updates without any page reload.

---

## 2. Component Structure & Data Flow

### Component Hierarchy

```
app/layout.js
└── SettingsProvider (context/SettingsContext.jsx)
    ├── app/page.js
    │   ├── Sidebar (component/Sidebar.jsx)
    │   ├── Header (component/Header.jsx)
    │   └── PeopleCard (component/peopleCard.jsx)
    │       └── Preferences (component/preferences.jsx)
    └── app/users/page.js
        ├── Sidebar
        └── Header
```

### Data Flow

```
1. Startup:
   SettingsProvider boots → reads localStorage → fetches GET /api/settings
   → initializes global theme, language, and font size.

2. User edits (Unsaved Local Preview):
   User changes theme/language/font size in Preferences:
   - Theme applies live to documentElement (data-theme + .dark).
   - Language reflects immediately in local state.
   - Font size adjusts CSS variable --font-size dynamically (without resizing containers).

3. Save / Reset:
   - Click "Save changes" (or "Reset to defaults"):
   - Button enters `saving` state to prevent duplicate submissions.
   - Dispatches PUT /api/settings.
   - Writes to localStorage.
   - Broadcasts payload over BroadcastChannel("tab-sync").
   - Other open tabs receive event via BroadcastChannel (or storage event) and update their state instantly.
```

### Storage Choice & Limitations

- **Storage:** Local JSON file (`data/settings.json`) managed through `lib/settingsStore.js` and exposed via `/api/settings`, mirrored with browser `localStorage`.
- **Why this choice:** Provides persistent settings across server restarts and offline/multi-tab browser sessions without needing external database credentials or infrastructure.
- **Limitations:** Server-side file persistence (`fs/promises`) works for local/single-server environments; in serverless or multi-replica production environments (e.g., Vercel edge/lambdas), read/write to local disk is ephemeral and would be replaced with Redis, PostgreSQL, or a cloud key-value store.

---

## 3. Settings Rules & Interactions

### Supported Values
- **Themes:** `light`, `dark`, `system`
- **Languages:** `English`, `Hindi`, `German`, `French`
- **Font-Size Range:** `12` to `24` integer (default: `14`)

### Interaction Rules
1. **API-Loaded Settings:** Loaded once on application mount (`GET /api/settings`) to establish the canonical server state.
2. **Unsaved Edits:** Provide instant local feedback in the active tab (e.g. preview text and immediate dark/light color changes) while allowing the user to explicitly persist with **Save changes**.
3. **Cross-Tab Updates:** When changes are saved or reset in any tab, they are broadcast across all active tabs via `BroadcastChannel` with `localStorage` fallback. Active tabs update their rendered state immediately.

---

## 4. API Specification & Examples

### `GET /api/settings`
Returns current persisted settings.

**Request:**
```bash
curl -X GET http://localhost:3000/api/settings
```

**Response (200 OK):**
```json
{
  "settings": {
    "theme": "dark",
    "language": "English",
    "fontSize": 14
  },
  "updatedAt": "2026-11-03T04:37:58.355Z"
}
```

---

### `PUT /api/settings`

#### Successful Request
**Request:**
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "language": "German", "fontSize": 16}'
```

**Response (200 OK):**
```json
{
  "settings": {
    "theme": "dark",
    "language": "German",
    "fontSize": 16
  },
  "updatedAt": "2026-11-03T06:15:20.123Z"
}
```

#### Invalid Request (Validation Errors)
**Request:**
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"theme": "neon", "language": "Spanish", "fontSize": 32}'
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "theme",
      "message": "Theme must be one of: light, dark, system"
    },
    {
      "field": "language",
      "message": "Language must be one of: English, Hindi, German, French"
    },
    {
      "field": "fontSize",
      "message": "Font size must be an integer between 12 and 24"
    }
  ]
}
```

---

## 5. JavaScript Behavior & Engineering Highlights

- **Debounced User Search:** Search input in `PeopleCard` implements a `300ms` debounce timer with automatic `clearTimeout` on unmount or input change.
- **External API & Error Resilience:** External users are fetched from `https://jsonplaceholder.typicode.com/users` with explicit `loading`, `error`, and `retry` action buttons.
- **Duplicate Submission Prevention:** Save and Reset buttons enter a disabled `saving` state while the async request is in flight.
- **Container-Safe Font Scaling:** Font scaling changes only typography (`p`, `span`, `label`, headings) via CSS variable `--font-size` without modifying root `rem`, keeping all sidebar, card, and layout container dimensions pixel-perfect.
- **Deterministic Sync:** Each tab uses a unique runtime `TAB_ID` to prevent echo loops and ensure predictable state updates.
