import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['vitestSetup.ts'],
  },
  resolve: {
    alias: [
      // Match the browser ESM entry; mixing CJS and ESM creates distinct DecorationSet classes.
      {
        find: '@sereneinserenade/tiptap-search-and-replace',
        replacement: path.resolve(__dirname, 'node_modules/@sereneinserenade/tiptap-search-and-replace/dist/index.js'),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: 'auth', replacement: path.resolve(__dirname, './src/auth') },
    ],
  },
})
