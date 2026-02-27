import '@testing-library/jest-dom'

// Node.js 22.7+ / 25 exposes a built-in `localStorage` global (SQLite-backed)
// that is missing `clear()` and other standard Web Storage methods. This leaks
// into Vitest's jsdom environment and shadows jsdom's proper implementation.
// Override with a complete in-memory mock so tests work on any Node version.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
