# Httx Editor

V1 HTML / CSS / JS online editor for Project Httx.

## Stack

- React + TypeScript + Vite
- CodeMirror 6 (`@uiw/react-codemirror`)
- localStorage draft persistence
- iframe `srcdoc` preview with `sandbox="allow-scripts"`

## Run

```bash
cd httx-editor
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build

## V1 features

- Editor + preview split layout with resizable panes
- Language tabs (HTML / CSS / JS) with merged live preview
- Debounced preview refresh, console + runtime error capture
- Format, save draft shortcuts, clear draft, export single HTML
- Templates, CDN resource inputs, theme + font size, fullscreen preview
- Mobile-friendly stacked layout under 900px

## Deferred (V2)

Visual builder, property panel, AI generation, version history, device frames.
