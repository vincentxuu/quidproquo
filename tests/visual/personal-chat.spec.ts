import { test, expect, type Page } from '@playwright/test';

// These browser fixtures exercise presentation/state transitions only. They do
// not verify Cloudflare Access, ownership checks, D1, or real AI responses.
const localTranscript = {
  threadId: 'ui-local-thread',
  messages: [
    { id: 'ui-user', role: 'user', content: '這是一段要儲存的既有對話。' },
    { id: 'ui-answer', role: 'assistant', content: '這是本機已保存的回答。' },
  ],
};
async function seedConversation(page: Page) {
  await page.addInitScript(transcript => {
    localStorage.setItem('chat_thread_id', transcript.threadId);
    localStorage.setItem('chat_transcript_v1', JSON.stringify(transcript));
  }, localTranscript);
}
async function forbidAi(page: Page) {
  const calls: string[] = [];
  await page.route('**/api/chat', async route => {
    calls.push(route.request().url());
    await route.abort();
  });
  return calls;
}

test.describe('Personal chat UI with mocked private history', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [390, 1280]) {
      test(`empty chat controls and suggestions, ${theme}, ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(value => localStorage.setItem('theme', value), theme);
        const aiCalls = await forbidAi(page);
        await page.route('**/api/personal/chat**', route => route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: '請先登入。' }) }));
        await page.goto('/chat');
    await expect(page.locator('astro-island[component-export="ChatWidget"]:not([ssr])')).toHaveCount(1);
        const history = page.getByRole('button', { name: '對話紀錄', exact: true });
        const cloud = page.getByRole('region', { name: '私人對話' });
        await expect(history).toBeVisible();
        await expect(cloud).toHaveCount(0);
        await expect(page.getByRole('button', { name: /儲存這段對話|對話後可儲存/ })).toHaveCount(0);
        await expect(page.locator('.chat-suggestion')).toHaveCount(4);
        const before = await page.locator('.chat-suggestion').allTextContents();
        await page.getByRole('button', { name: '換一組預設問題' }).click();
        await expect.poll(() => page.locator('.chat-suggestion').allTextContents()).not.toEqual(before);
        await expect(page.locator('.lucide-sparkles')).toHaveCount(0);
        const suggestions = await page.locator('.chat-suggestion').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
        expect(suggestions.every(rect => rect.height >= 44 && rect.width <= width)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await history.click();
        await expect(cloud.getByRole('link', { name: '登入查看對話紀錄' })).toBeVisible();
        await expect(cloud.locator('details')).toHaveCount(0);
        await page.keyboard.press('Escape');
        await expect(cloud).toHaveCount(0);
        await expect(history).toBeFocused();
        expect(aiCalls).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath(`chat-${theme}-${width}.png`), fullPage: true });
      });
    }
  }

  test('floating history menu remains above its panel and Escape closes only history', async ({ page }) => {
    await page.setViewportSize({width: 390, height: 844});
    const aiCalls = await forbidAi(page);
    await page.route('**/api/personal/chat**', route => route.fulfill({json: {ownerId: 'ui-owner', threads: []}}));
    await page.goto('/about/');
    await page.getByRole('button', {name: /開啟 AI 對話/}).click();
    const floating = page.locator('.chat-floating-panel');
    await expect(floating).toBeVisible();
    await floating.getByRole('button', {name: '對話紀錄', exact: true}).click();
    const menu = page.getByRole('region', {name: '私人對話'});
    await expect(menu.getByText('還沒有已存對話。', {exact: true})).toBeVisible();
    expect(await menu.evaluate(el => {
      const box = el.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + 24);
      return box.left >= 0 && box.right <= innerWidth && !!hit && el.contains(hit);
    })).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(floating).toBeVisible();
    await expect(floating.getByRole('button', {name: '對話紀錄', exact: true})).toBeFocused();
    expect(aiCalls).toEqual([]);
  });

  test('saving a local conversation replaces obsolete save action and preserves the transcript', async ({ page }) => {
    await seedConversation(page);
    const aiCalls = await forbidAi(page);
    const posts: Record<string, unknown>[] = [];
    await page.route('**/api/personal/chat**', async route => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        posts.push(body);
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ownerId: 'ui-owner', transcript: { ...body, revision: 1 } }) });
      } else {
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ownerId: 'ui-owner', threads: [] }) });
      }
    });
    await page.goto('/chat');
    await expect(page.locator('astro-island[component-export="ChatWidget"]:not([ssr])')).toHaveCount(1);
    const cloud = page.getByRole('region', { name: '私人對話' });
    await expect(page.getByText(localTranscript.messages[0].content, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '對話紀錄', exact: true }).click();
    const menuBox = await cloud.boundingBox();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
    await cloud.getByRole('button', { name: '儲存這段對話', exact: true }).click();
    await expect(cloud).toHaveCount(0);
    await expect(page.getByRole('status').filter({ hasText: '對話已儲存' })).toBeVisible();
    await page.getByRole('button', { name: '對話紀錄', exact: true }).click();
    await expect(cloud.getByRole('button', { name: '已儲存', exact: true })).toBeDisabled();
    await expect(cloud.getByText('已開啟同步', { exact: true })).toBeVisible();
    await expect(cloud.getByRole('button', { name: '儲存這段對話', exact: true })).toHaveCount(0);
    expect(posts).toHaveLength(1);
    expect(posts[0].messages).toEqual(localTranscript.messages);
    expect(posts[0].revision).toBe(0);
    expect(aiCalls).toEqual([]);
  });

  test('saved history can open without AI calls and enables explicit save only', async ({ page }) => {
    const aiCalls = await forbidAi(page);
    await page.route('**/api/personal/chat**', async route => {
      expect(route.request().method()).toBe('GET');
      const data = new URL(route.request().url()).searchParams.has('thread')
        ? { ownerId: 'ui-owner', transcript: { ...localTranscript, revision: 1 } }
        : { ownerId: 'ui-owner', threads: [{ threadId: localTranscript.threadId, title: '測試已存對話', revision: 1, updatedAt: 1 }] };
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
    });
    await page.goto('/chat');
    await expect(page.locator('astro-island[component-export="ChatWidget"]:not([ssr])')).toHaveCount(1);
    const cloud = page.getByRole('region', { name: '私人對話' });
    await page.getByRole('button', { name: '對話紀錄', exact: true }).click();
    await cloud.getByRole('button', { name: '測試已存對話', exact: true }).click();
    await expect(page.getByText(localTranscript.messages[0].content, { exact: true })).toBeVisible();
    await expect(cloud).toHaveCount(0);
    await page.getByRole('button', { name: '對話紀錄', exact: true }).click();
    await expect(cloud.getByRole('button', { name: '儲存這段對話', exact: true })).toBeEnabled();
    await expect(cloud.getByText('已開啟同步', { exact: true })).toHaveCount(0);
    expect(aiCalls).toEqual([]);
  });
});

// Real layout geometry, with no cloud fixture needed for opening the article UI.
for (const width of [1140, 1519, 1520, 1920]) {
  test(`article companion stays outside content with a 24px gutter at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/posts/ai/2026-08-30-ask-ai-pipeline-overview/');
    await page.getByRole('button', { name: '✦ Ask AI', exact: true }).click();
    await expect(page.getByRole('region', { name: /目前文章/ })).toBeVisible();
    await expect.poll(async () => page.evaluate(() => {
      const panel = document.querySelector('.chat-sidebar-panel')!.getBoundingClientRect();
      const main = document.querySelector('.post-main')!.getBoundingClientRect();
      const toc = document.querySelector('.post-sidebar')!;
      const right = Math.max(main.right, getComputedStyle(toc).display === 'none' ? 0 : toc.getBoundingClientRect().right);
      return Math.round(panel.left - right);
    })).toBe(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
