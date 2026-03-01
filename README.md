# VibCodCalc

An all-in-one desktop calculator with glassmorphism + neon UI, built with Electron, React 19, and TypeScript.

## Features

### 8 Calculator Modes

| Mode | Shortcut | Description |
|------|----------|-------------|
| Standard | `Ctrl+1` | Arithmetic, %, √, memory |
| Scientific | `Ctrl+2` | Trig, log, pow, factorial, constants, deg/rad |
| Graphing | `Ctrl+3` | Plot y=f(x), zoom/pan, trace |
| Programmer | `Ctrl+4` | Hex/Dec/Oct/Bin, bitwise ops, bit grid |
| Unit Converter | `Ctrl+5` | 10 categories |
| Financial | `Ctrl+6` | Compound interest, loan, tip |
| Matrix | `Ctrl+7` | Add/sub/mul/det/inverse/transpose up to 5×5 |
| Statistics | `Ctrl+8` | Descriptive stats, histogram |

### UI

- Glassmorphism design with neon accents
- 5 accent colors: cyan, magenta, green, orange, purple
- Dark/light themes
- Frameless window with custom title bar
- Persistent history, theme, and memory

### Other

- Pure TypeScript math engine — no external math libraries
- Locally bundled fonts — works fully offline
- Keyboard shortcuts for all modes and numpad support

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/mdmufees/vibcodcalc.git
cd vibcodcalc
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Package (AppImage + .deb)

```bash
npm run package
```

Output files will be in the `dist/` directory.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+1-8` | Switch calculator mode |
| `Ctrl+H` | Toggle history panel |
| `0-9`, `.`, `+-*/` | Input (standard/scientific) |

## Tech Stack

- **Electron** — Desktop shell
- **React 19** — UI framework
- **TypeScript** — Type safety
- **Zustand** — State management
- **Vite** — Build tooling

## License

MIT
