# CLAUDE.md — calcola-stipendio

## Project Overview
React web app for tracking work hours and calculating earnings. Uses Firebase (Auth + Firestore) for persistence and authentication.

## Tech Stack
- **React 19** with functional components and hooks
- **Firebase 10** — Auth (`src/contexts/AuthContext.js`) + Firestore (`src/db/firestore.js`)
- **MUI icons** (`@mui/icons-material`)
- **date-fns** for date utilities
- **Jest + jsdom** for unit tests (not `react-scripts test`)

## Project Structure
```
src/
  components/       # UI components (CalcolatoreStipendio, dialogs, inputs, etc.)
  contexts/         # AuthContext
  db/               # Firestore data access (firestore.js)
  hooks/            # Custom hooks (useOreLavorate, usePagaOraria, useWorkHoursForm)
  utils/            # timeUtils, validationUtils
  config/           # firebase.js (Firebase init)
test/
  db/               # Firestore tests
  hooks/            # Hook tests
  utils/            # Utility tests
```

## Commands
```bash
npm start             # dev server
npm test              # Jest (runs test/ directory)
npm run test:watch    # Jest in watch mode
npm run test:coverage # Jest with coverage
npm run build         # production build
```

## Testing
- Tests live in `test/` (not co-located with src), mirroring the src structure
- Test runner: **Jest with babel-jest** (not react-scripts)
- CSS and image imports are mocked via `__mocks__/`
- Firebase is mocked in tests — do not hit real Firestore in unit tests

## Key Conventions
- Components use prop-types for type checking
- Firebase config is in `src/config/firebase.js`
- Firestore operations are centralized in `src/db/firestore.js`
- Custom hooks encapsulate all stateful logic; components stay presentational
