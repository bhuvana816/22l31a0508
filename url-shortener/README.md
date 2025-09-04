# URL Shortener (Client-only, Vite + React + MUI)

This app satisfies the Campus Hiring Evaluation requirements:
- React SPA running strictly on `http://localhost:3000` (Vite dev & preview configured).
- Custom **Logging Middleware** (no `console.*`) that persists logs to `localStorage` and exposes an in-app viewer.
- Short link uniqueness and optional custom shortcodes with validation.
- Default validity of **30 minutes** when omitted.
- Handle up to **5 URLs** per submission with client-side validation using `zod`.
- Redirect route `/r/:code` that records click analytics:
  - timestamp
  - source (document.referrer)
  - coarse geo (time zone as a proxy; no external services)
- Stats page listing all links with creation/expiry and detailed clicks.
- Material UI for the interface.

## Run locally
```bash
npm i
npm run dev
```
Open `http://localhost:3000`.

## Build & preview
```bash
npm run build
npm run preview
```

## Notes
- Data is stored in `localStorage`, so it persists across sessions for the same browser.
- Coarse geo uses the browser time zone (e.g., "Asia/Kolkata") to avoid external calls.
- The Logging floating bug icon opens a drawer to inspect structured logs.
- No console logging is used.
- You can customize the logger to forward to any API in the future.
