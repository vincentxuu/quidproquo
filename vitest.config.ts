import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // tsconfig 為了 Astro 設 jsx: preserve，vitest 要自己把 TSX 轉成 React 呼叫，否則 .tsx 元件測試載不進來
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      'cloudflare:workers': fileURLToPath(new URL('./src/test/cloudflare-workers-mock.ts', import.meta.url)),
      'astro:content': fileURLToPath(new URL('./src/test/astro-content-mock.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
