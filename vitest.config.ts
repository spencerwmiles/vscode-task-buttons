import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.{test,spec}.ts'], // Updated to look in src/__tests__
    exclude: ['**/node_modules/**', '**/dist/**', '**/out/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'test{,s}/**', // Keep excluding old test dir patterns just in case
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        // No need to exclude __tests__ anymore as it's the include target
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.*',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    setupFiles: ['./src/__tests__/test.setup.ts'], // Correct path
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    sequence: {
      shuffle: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // Updated to point to the mock file in src/__tests__
      // Note: Use .js extension as that's what TypeScript compiles to
      vscode: resolve(__dirname, './src/__tests__/vscode.mock.js'),
    },
  },
});
