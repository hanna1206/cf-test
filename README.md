# Configurable Form Builder

A single-page application that lets users visually construct a form schema, preview it live, and export/import the configuration as JSON.

**Live demo:** [cf-test-gamma.vercel.app](https://cf-test-gamma.vercel.app/)

## Features

- Add and configure form fields (text, number)
- Create nested groups recursively
- Reorder fields (move up/down), promote to parent, and demote into a sibling group
- Live preview of the resulting form schema
- JSON export and import
- Field validation (required, min/max for numbers)

## Architecture Overview

The form schema is represented as a recursive tree structure where:

- Fields are leaf nodes
- Groups are container nodes that can hold other fields or groups

State is managed centrally and propagated through React context. This allows nested structures to be rendered recursively while keeping the UI logic simple.

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

```

## React 19 Notes

This project uses React 19 features:

- Contexts can be rendered directly without `.Provider`
- Values are consumed via the `use()` hook
- React Compiler (via Babel) automatically handles memoization, so `useMemo` / `useCallback` are intentionally omitted

## Further Improvements

Given more time, the following improvements would be implemented:

- **Drag-and-drop reordering** — replacing the current up/down buttons with drag-and-drop (e.g. via `@dnd-kit/core`) would make reordering fields faster and more intuitive.
- **Clear button** — a toolbar-level "Clear" action that resets the entire form state back to an empty schema, useful when starting over without needing to delete fields one by one.
- **Keyboard navigation in the field tree** — full keyboard support (arrow keys to move between fields, `Enter` to select, `Delete` to remove) so the builder is fully operable without a mouse and accessible to keyboard-only users.
- **Split context into state and actions** — the current single context causes all consumers to re-render on every state update, including components that only use callbacks. Splitting into a state context and a stable actions context would prevent those unnecessary re-renders. This was intentionally deferred to keep the implementation simple.
