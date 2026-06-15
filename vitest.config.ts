import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'vitest.setup.ts',
        'tailwind.config.ts',
        'postcss.config.mjs',
        'eslint.config.mjs',
        '**/*.d.ts',
        'src/components/ui/ExportButton.tsx', // Requires complex browser APIs like canvas
      ]
    },
    exclude: ['node_modules', '.next'],
  },
})
