# Httx Editor

V1 HTML / CSS / JS online editor for [Project Httx](https://github.com/Tommy-likecode).

Edit HTML, CSS, and JavaScript in separate tabs, preview instantly in a sandboxed iframe, and export a single HTML file.

## Stack

- React + TypeScript + Vite
- CodeMirror 6 (`@uiw/react-codemirror`)
- localStorage draft persistence
- iframe `srcdoc` preview with `sandbox="allow-scripts"`

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run smoke` | Playwright smoke test (dev server must be running) |
| `npm run demo:record` | Record a short demo video via Playwright |

## V1 features

- Editor + preview split layout with resizable panes
- Language tabs (HTML / CSS / JS) with merged live preview
- Debounced preview refresh, console + runtime error capture
- Format, save-draft shortcuts, clear draft, export single HTML
- Templates, CDN resource inputs, theme + font size, fullscreen preview
- Mobile-friendly stacked layout under 900px

## Deferred (V2)

Visual builder, property panel, AI generation, version history, device frames.

## License

Private/project use for Httx unless otherwise noted.
