# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Getting Started

For a fresh project, run the following commands:

**1. Install dependencies:**
```bash
yarn install
```

**2. Check if Rust is installed:**
```bash
rustc --version
```
If not installed, install via https://rustup.rs/

**3. Start the project:**
```bash
yarn dev
```

**Note:** The first run may take several minutes as Rust needs to download and compile all Tauri dependencies.

## Development Commands

**Development:**
```bash
yarn dev             # Start Vite dev server and Tauri in development mode
yarn tauri dev       # Alternative way to start Tauri development
```

**Build:**
```bash
yarn build           # Compile TypeScript and create production bundle
yarn tauri build     # Build complete Tauri application for distribution
```

**Frontend Only:**
```bash
yarn preview         # Preview compiled frontend
```

**Tauri CLI:**
```bash
yarn tauri           # Access Tauri CLI commands
```