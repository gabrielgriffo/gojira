# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Tauri desktop application with React + TypeScript frontend and Rust backend.

**Frontend Structure:**
- React 18 + TypeScript with Vite development server
- Main entry point: `src/main.tsx`
- Tailwind CSS v4 for styling
- Vite serves on port 1420 (fixed port for Tauri integration)
- TypeScript config with strict mode enabled

**Frontend Directory Structure:**
```
src/
├── components/          # Reusable React components
│   └── ui/             # Basic UI components (buttons, inputs, etc.)
├── pages/              # Application pages/screens
├── hooks/              # Custom React hooks
├── contexts/           # React contexts for global state management
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
├── constants/          # Application constants and configuration
├── lib/                # Utilities and helper functions
├── styles/             # CSS/Tailwind stylesheets
└── assets/             # Images, icons, and static files
```

**Naming Conventions:**
- **Components**: PascalCase (e.g., `UserCard.tsx`, `NavigationMenu.tsx`)
- **Pages**: PascalCase (e.g., `Home.tsx`, `Settings.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLocalStorage.ts`, `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (e.g., `User`, `ApiResponse`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRIES`)

**Backend Structure:**
- Rust library in `src-tauri/src/lib.rs` with main application logic
- Binary entry point in `src-tauri/src/main.rs` that calls `goji_lib::run()`
- Tauri commands for frontend-backend communication (see `greet` command in `src-tauri/src/lib.rs:3`)
- Uses `tauri-plugin-opener` for system integrations
- Library name: `goji_lib` (configured to avoid Windows naming conflicts)

**Key Configuration Files:**
- `src-tauri/tauri.conf.json`: Tauri app configuration (window settings, build commands)
- `src-tauri/Cargo.toml`: Rust dependencies and library configuration
- `package.json`: Frontend dependencies and npm scripts
- `vite.config.ts`: Vite configuration optimized for Tauri development
- `tsconfig.json`: TypeScript configuration with strict linting enabled

## Common Development Commands

**Development:**
```bash
npm run dev          # Start Vite dev server and Tauri in development mode
npm run tauri dev    # Alternative way to start Tauri development
```

**Build:**
```bash
npm run build        # Compile TypeScript and create production bundle
npm run tauri build  # Build complete Tauri application for distribution
```

**Frontend Only:**
```bash
npm run preview      # Preview compiled frontend
```

**Tauri CLI:**
```bash
npm run tauri        # Access Tauri CLI commands
```

Note: The Tauri config uses `npm` commands and this project uses npm as the package manager.

## Development Flow

The application uses the standard Tauri development model where:
1. Frontend runs on http://localhost:1420 via Vite
2. Backend compiles to a native library integrated with the frontend
3. Communication happens through Tauri commands (see `greet` command in `src-tauri/src/lib.rs:3`)

The build process requires both TypeScript compilation (`tsc`) and Vite bundling before Tauri can package the final application.

# External Resources
## MCP Context7
- **When to use**: Whenever you need information not available in the project
- **Syntax**: `@context7:your_query_here`
- **Use cases**:
  - Library documentation
  - Architecture patterns
  - Solutions for specific problems
  - Implementation validation

**Rule**: Before suggesting a complex solution, consult context7 to check if there's a better or more current approach.