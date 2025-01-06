// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // This ensures `expect` is globally available
    environment: 'jsdom',  // This makes sure you have the DOM environment (important for React tests)
  },
  esbuild: {
    jsx: 'automatic', // Optional: Depending on how you want Vitest to handle JSX
  }
});
