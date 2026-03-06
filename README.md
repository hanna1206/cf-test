# Configurable Form Builder

A single-page application that lets users visually construct a form schema, preview it live, and export/import the configuration as JSON.

**Live demo:** [cf-test-gamma.vercel.app](https://cf-test-gamma.vercel.app/)

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

### Context API

This project uses the React 19 context syntax. Contexts are rendered directly without a `.Provider` wrapper:

```tsx
// React 19 — valid, no .Provider needed
<MyContext value={value}>{children}</MyContext>

// Also valid (older style, still works)
<MyContext.Provider value={value}>{children}</MyContext.Provider>
```

Values are consumed with the new `use()` hook instead of `useContext`:

```tsx
const value = use(MyContext);
```

### No `useMemo` / `useCallback`

This project uses the **React Compiler** (via Babel), which automatically memoizes components and values as needed. Manually adding `useMemo` or `useCallback` is therefore unnecessary and intentionally omitted throughout the codebase.

## Further Improvements

- **Drag-and-drop reordering** — replacing the current up/down buttons with drag-and-drop (e.g. via `@dnd-kit/core`) would make reordering fields faster and more intuitive.
- **Clear button** — a toolbar-level "Clear" action that resets the entire form state back to an empty schema, useful when starting over without needing to delete fields one by one.
- **Keyboard navigation in the field tree** — full keyboard support (arrow keys to move between fields, `Enter` to select, `Delete` to remove) so the builder is fully operable without a mouse and accessible to keyboard-only users.
- **Split context into state and actions** — the current single context causes all consumers to re-render on every state update, including components that only use callbacks. Splitting into a state context and a stable actions context would prevent those unnecessary re-renders. This was intentionally deferred to keep the implementation simple.
