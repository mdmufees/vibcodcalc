# VibCodCalc

## Overview
VibCodCalc — An all-in-one desktop calculator built with Electron + React + TypeScript featuring glassmorphism + neon UI.

## Commands
- `npm run dev` — Start development with hot reload
- `npm run build` — Build for production
- `npm run package` — Build + package with electron-builder
- `npm run typecheck` — TypeScript type checking

## Architecture
- **Electron main process**: `src/main/index.ts` — Frameless window, IPC for window controls + clipboard
- **Preload**: `src/preload/index.ts` — contextBridge API
- **Renderer**: `src/renderer/src/` — React 19 app
  - `engine/` — Pure TypeScript math engine (parser, arithmetic, scientific, graphing, programmer, units, financial, matrix, statistics)
  - `stores/` — Zustand stores (calculator, history, theme, memory, graph, matrix, stats)
  - `modes/` — One directory per calculator mode (8 modes)
  - `components/` — Shared UI (Layout, Display, Buttons, History, common)
  - `styles/` — CSS files (global, themes, glassmorphism, animations)

## 8 Calculator Modes
1. Standard (Ctrl+1) — Arithmetic, %, √, memory
2. Scientific (Ctrl+2) — Trig, log, pow, factorial, constants, deg/rad
3. Graphing (Ctrl+3) — Plot y=f(x), zoom/pan, trace
4. Programmer (Ctrl+4) — Hex/Dec/Oct/Bin, bitwise ops, bit grid
5. Unit Converter (Ctrl+5) — 10 categories
6. Financial (Ctrl+6) — Compound interest, loan, tip
7. Matrix (Ctrl+7) — Add/sub/mul/det/inverse/transpose up to 5×5
8. Statistics (Ctrl+8) — Descriptive stats, histogram

## Key Shortcuts
- `Ctrl+1-8` — Switch modes
- `Ctrl+H` — Toggle history panel
- Numpad/operators work in standard/scientific modes

## Conventions
- No external math libraries — all computation in `engine/`
- Zustand stores with `persist` middleware for history/theme/memory
- CSS custom properties for theming (`data-theme`, `data-accent` on `<html>`)
- Inline styles via `Record<string, React.CSSProperties>` pattern
- 5 neon accent colors: cyan, magenta, green, orange, purple
