import test from 'node:test';
import assert from 'node:assert/strict';
import { affectsUi } from './ui-change-scope.mjs';

test('shared and runtime-created controls require UI validation', () => {
  for (const path of ['src/components/Chat/CloudChatHistory.tsx', 'src/lib/personalProgress.ts', 'src/styles/chat.css', 'src/i18n/chat.ts', 'src/hooks/useVocabularyAudio.ts', 'src/lib/english-speaking.ts', 'src/lib/english-speaking-clips.ts', 'src/plugins/remarkDiagram.ts', 'playwright.personal.config.ts', 'src/pages/en/interview.astro', 'public/fonts/example.woff2', 'pnpm-lock.yaml', '.github/workflows/quality.yml', 'scripts/ui-change-scope.mjs']) assert.equal(affectsUi(path), true, path);
});
test('content and API-only changes keep their existing gates', () => {
  for (const path of ['src/content/posts/ai/example.md', 'src/pages/api/personal/progress.ts', 'docs/example.md']) assert.equal(affectsUi(path), false, path);
});
test('renamed UI sources remain covered as additions or deletions', () => {
  assert.equal(affectsUi('src/components/Old.tsx'), true);
  assert.equal(affectsUi('src/layouts/New.astro'), true);
});
