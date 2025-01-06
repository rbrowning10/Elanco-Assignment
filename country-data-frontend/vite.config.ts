import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./myTests/tsconfig.test.json'] // Point to the test-specific tsconfig
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
