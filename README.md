# Configurable Form Builder

A single-page application that lets users visually construct a form schema, preview it live, and export/import the configuration as JSON.

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | React 19 (with React Compiler via Babel)                |
| Language     | TypeScript 5 (strict mode)                              |
| Build tool   | Vite 7                                                  |
| Styling      | CSS Modules                                             |
| Linting      | ESLint 9 (flat config) + Stylelint                      |
| Formatting   | Prettier                                                |
| Commit hooks | Husky + lint-staged + Commitlint (Conventional Commits) |
| CI           | GitHub Actions                                          |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check, lint JS, lint CSS in parallel
npm run lint

# Production build
npm run build

# Preview production build locally
npm run preview

# Run unit tests (single pass)
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with browser UI
npm run test:ui

# Run unit tests with coverage report
npm run test:coverage
```
