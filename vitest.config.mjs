"use strict";
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
            // Explicitly include only src files, excluding __tests__ within src
            include: ['src/**'],
            exclude: [
                'src/__tests__/**', // Exclude the tests directory itself
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
                // --- Add specific files/patterns to exclude ---
                'eslint.config.mjs', // ESLint config
                '**/__tests__/test.setup.ts', // Test setup file (using glob)
                '**/__tests__/vscode.ts', // VS Code mock implementation (using glob)
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
            // Point to the actual mock TypeScript file
            vscode: resolve(__dirname, './src/__tests__/vscode.ts'),
        },
    },
});
//# sourceMappingURL=vitest.config.mjs.map