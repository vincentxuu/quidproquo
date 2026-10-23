import { defineConfig } from '@playwright/test';
import shared from './playwright.config';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Bounded interaction suite against an already-running server. It does not run
// or replace the full visual gate. The shared warmup requires unrelated article
// fixtures; these cases instead wait for each tested page's own mounted state.
export default defineConfig({
  ...shared,
  globalSetup: undefined,
  // Trace HTML inside .work triggers Vite reloads and invalidates the run.
  outputDir: process.env.PERSONAL_TEST_OUTPUT_DIR || join(tmpdir(), 'quidproquo-personal-browser'),
  testMatch: ['personal-progress.spec.ts', 'personal-chat.spec.ts', 'personal-vocabulary.spec.ts', 'mobile-chat.spec.ts'],
  webServer: undefined,
  use: { ...shared.use, baseURL: process.env.PERSONAL_TEST_BASE_URL || 'http://localhost:4321' },
});
