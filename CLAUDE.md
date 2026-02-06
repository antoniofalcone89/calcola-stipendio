# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Italian salary calculator ("Calcolatore Stipendio") — a React 19 single-page app using Create React App. Users log in via Google, set an hourly rate, log daily work hours, and see monthly totals. All data is persisted per-user in Firebase Firestore.

## Commands

- `npm start` — dev server
- `npm run build` — production build (deployed to `/stipendio` base path)
- `npm test` — run Jest tests (uses custom `jest.config.js`, tests live in `test/` directory)
- `npm run test:watch` — Jest in watch mode
- `npm run test:coverage` — Jest with coverage
- `npx jest --config=jest.config.js test/utils/timeUtils.test.js` — run a single test file

## Architecture

### Data Flow

`AuthContext` (Google sign-in) → `CalcolatoreStipendio` (orchestrator) → custom hooks → Firestore

The app has no routing. `App.js` renders either `Login` or `CalcolatoreStipendio` based on auth state from `AuthContext`.

### Key Layers

- **`src/contexts/AuthContext.js`** — provides `currentUser`, `signInWithGoogle`, `logout` via React Context. All hooks depend on `useAuth()`.
- **`src/db/firestore.js`** — all Firestore CRUD operations. Data model: `users/{uid}` doc stores `pagaOraria` and totals; `users/{uid}/oreLavorate/{date}` subcollection stores daily hours.
- **`src/hooks/`** — business logic extracted into custom hooks:
  - `usePagaOraria` — hourly rate load/save with dirty tracking (`hasChanged`)
  - `useOreLavorate` — worked hours CRUD (save, delete single, delete all)
  - `useWorkHoursForm` / `useEditDialog` — form state and validation for adding/editing hours
- **`src/utils/`** — pure functions for time format validation (`HH.mm` or `H`) and conversion between time strings and decimal hours.

### UI Components

- **`src/components/ui/`** — custom lightweight UI primitives (Box, Grid, Paper, Typography, Button, TextField, Dialog, Table, Skeleton) that replace MUI components. Organized by category (layout, surfaces, data-display, forms, buttons, skeleton) with barrel exports via `index.js`.
- **`src/components/`** — feature components: `HourlyRateInput`, `WorkHoursInput`, `SummaryTable`, `TotalSummary`, dialog components, `UserMenu`, and skeleton loading states.

### Styling

Pure CSS with no preprocessor. CSS custom properties defined in `src/css/base/variables.css`. Styles organized in `src/css/` by category (base, components, layout, utilities) and imported through `src/css/index.css`. Utility classes follow a Tailwind-like naming convention (e.g., `flex`, `flex-center`, `mb-4`, `text-primary`).

### Firebase Config

Environment variables prefixed with `REACT_APP_FIREBASE_*` in a `.env` file (not committed). The app uses Firebase Auth (Google provider) and Firestore.

## Testing

Tests are in `test/` (not `src/`), mirroring the source structure. Jest is configured with `jsdom` environment, `babel-jest` transform, and `date-fns` is not excluded from transforms. CSS and image imports are mocked via `__mocks__/styleMock.js` and `__mocks__/fileMock.js`.

## Conventions

- Italian naming for domain concepts: `pagaOraria` (hourly rate), `oreLavorate` (worked hours), `totaleOre` (total hours), `totaleStipendio` (total salary), `meseCorrente` (current month)
- Time input format: `HH.mm` (dot separator, not colon) or whole hours `H`
- Components use `prop-types` for prop validation
- `date-fns` with Italian locale for date formatting
