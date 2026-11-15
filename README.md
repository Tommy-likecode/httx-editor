# Httx Editor

HTML / CSS / JS editor for Project Httx — with **V1 code mode** and **V2 visual builder**.

## Stack

- React + TypeScript + Vite
- CodeMirror 6
- Visual canvas with component palette + property panel
- iframe `srcdoc` preview (`sandbox="allow-scripts"`)
- localStorage drafts + version history

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Modes

- **可视化**：三栏（组件 / 画布 / 属性），拖拽搭建，属性实时生效，与 HTML 双向同步
- **代码**：V1 工作流（HTML/CSS/JS 标签、格式化、快捷键）保持可用

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run smoke` | Playwright smoke test (dev server required) |
| `npm run demo:record` | Record a short demo video |

## Features

### V1

- Split editor / preview, language tabs, debounced live preview
- Console + runtime error capture, format / save / export
- Templates, CDN inputs, theme, font size, fullscreen, mobile layout

### V2

- Visual / Code mode toggle + three-column visual workbench
- Palette drag-drop, select / delete / copy / reorder
- Property panel (text, colors, size, spacing, align, radius, link, image URL/upload)
- Code ↔ canvas sync, device preview (desktop / tablet / mobile)
- Snippets, nav template, NL rule generation（如「登录表单」）
- Chinese error hints, version history, import / export HTML

### V2b usability

- Drag to reorder / nest into containers; free-move & resize handles
- Structure tree for nested selection; wrap/unwrap (成组/解组)
- Variables panel (`{{name}}`) bound into text/styles; resolved in preview/export

## Deferred / optional

- Full AI generation backend (rule engine ships; AI is a stub tip)
- Full Figma-level freeform artboard / constraints
- Pixel-perfect WYSIWYG for arbitrary hand-written HTML edge cases
- IndexedDB (history currently uses localStorage)

## License

Private/project use for Httx unless otherwise noted.
