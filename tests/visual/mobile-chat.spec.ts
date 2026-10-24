import { test, expect, type Page, type Locator } from '@playwright/test';

// Real Chromium layout/input tests with a mocked /api/chat SSE response. A
// viewport resize models lost keyboard space; it is NOT an iOS keyboard test.
test.use({ isMobile: true, hasTouch: true });

async function mockChat(page: Page) {
  const requests: { message: string }[] = [];
  await page.route('**/api/chat', async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ contentType: 'text/event-stream', body: 'event: token\ndata: {"text":"手機輸入測試回答。"}\n\nevent: done\ndata: {"remaining":4}\n\n' });
  });
  return requests;
}
async function ready(page: Page, floating = false) {
  const response = await page.goto(floating ? '/about/' : '/chat');
  expect(response?.status()).toBe(200);
  expect((await response!.body()).byteLength, 'Document must not be an empty dev-server response').toBeGreaterThan(1000);
  const component = floating ? 'ChatFloating' : 'ChatWidget';
  await expect(page.locator(`astro-island[component-export="${component}"]:not([ssr])`)).toHaveCount(1);
  if (floating) await page.getByRole('button', { name: '開啟 AI 對話', exact: true }).click();
  await expect(page.getByRole('textbox')).toBeVisible();
}
async function inViewport(control: Locator, page: Page) {
  await expect.poll(async () => control.evaluate(node => {
    const r = node.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1;
  }), { message: 'Composer control must remain inside the visible viewport' }).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const width of [320, 390, 430]) {
  test(`standalone composer stays reachable at ${width}px and keyboard-sized height`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await mockChat(page);
    await ready(page);
    const input = page.getByRole('textbox');
    await inViewport(input, page);
    await input.focus();
    await page.setViewportSize({ width, height: 430 });
    await inViewport(input, page);
    await inViewport(page.getByRole('button', { name: '送出', exact: true }), page);
    await expect.poll(async () => {
      const box = await page.getByRole('button', { name: '送出', exact: true }).boundingBox();
      return Boolean(box && box.width >= 44 && box.height >= 44);
    }, { message: 'Send target must be at least 44px after opening animation settles' }).toBe(true);
    await page.screenshot({ path: info.outputPath(`standalone-${width}-keyboard-space.png`) });
  });
}

test('multiline and IME composition keep draft until explicit send', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests = await mockChat(page);
  await ready(page);
  const input = page.getByRole('textbox');
  await input.fill('第一行');
  await input.press('Shift+Enter');
  await input.pressSequentially('第二行');
  await expect(input).toHaveValue('第一行\n第二行');
  expect(requests).toEqual([]);
  await input.dispatchEvent('compositionstart');
  await input.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', isComposing: true, keyCode: 229, bubbles: true });
  await expect(input).toHaveValue('第一行\n第二行');
  expect(requests).toEqual([]);
  await input.dispatchEvent('compositionend');
  await page.getByRole('button', { name: '送出', exact: true }).click();
  await expect(page.getByText('手機輸入測試回答。', { exact: true })).toBeVisible();
  await expect(input).toHaveValue('');
  expect(requests).toHaveLength(1);
  expect(requests[0].message).toBe('第一行\n第二行');
});

test('long history scrolls without pushing composer out of keyboard-sized viewport', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 430 });
  await page.addInitScript(() => {
    const threadId = 'mobile-history';
    localStorage.setItem('chat_thread_id', threadId);
    localStorage.setItem('chat_transcript_v1', JSON.stringify({ threadId, messages: Array.from({ length: 36 }, (_, i) => ({ id: `history-${i}`, role: i % 2 ? 'assistant' : 'user', content: `第${i + 1}則：${'這是一段用來驗證手機捲動的長對話。'.repeat(5)}` })) }));
  });
  const requests = await mockChat(page);
  await ready(page);
  await expect(page.getByText(/第36則：/)).toBeVisible();
  const input = page.getByRole('textbox');
  await inViewport(input, page);
  const log = page.getByRole('log', { name: '對話內容' });
  // Find the real vertical scroller, rather than assuming an implementation class.
  const moved = await log.evaluate(root => {
    const all = [root, ...root.querySelectorAll('*')];
    const node = all.find(el => el.scrollHeight > el.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(el).overflowY));
    if (!node) return false;
    node.scrollTop = 0;
    return node.scrollHeight > node.clientHeight;
  });
  expect(moved, 'Conversation should own a vertical scroller').toBe(true);
  await inViewport(input, page);
  expect(requests).toEqual([]);
  await page.screenshot({ path: info.outputPath('long-history-keyboard-space.png') });
});

for (const width of [320, 390, 430]) {
  test(`floating composer fits ${width}px before and after keyboard-space resize`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await mockChat(page);
    await ready(page, true);
    const input = page.getByRole('textbox');
    await inViewport(input, page);
    await input.focus();
    await page.setViewportSize({ width, height: 430 });
    await inViewport(input, page);
    await inViewport(page.getByRole('button', { name: '送出', exact: true }), page);
    await expect.poll(async () => {
      const box = await page.getByRole('button', { name: '送出', exact: true }).boundingBox();
      return Boolean(box && box.width >= 44 && box.height >= 44);
    }, { message: 'Send target must be at least 44px after opening animation settles' }).toBe(true);
    await page.screenshot({ path: info.outputPath(`floating-${width}-keyboard-space.png`) });
  });
}

test('Enter while a reply is pending preserves the next draft without another request', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  const requests: { message: string }[] = [];
  await page.route('**/api/chat', async route => {
    requests.push(route.request().postDataJSON());
    await pending;
    await route.fulfill({ contentType: 'text/event-stream', body: 'event: token\ndata: {"text":"延遲回覆測試。"}\n\nevent: done\ndata: {"remaining":4}\n\n' });
  });
  try {
    await ready(page);
    const input = page.getByRole('textbox');
    await input.fill('第一個問題');
    await page.getByRole('button', { name: '送出', exact: true }).click();
    await expect(page.getByRole('button', { name: '停止生成', exact: true })).toBeVisible();
    await input.fill('下一個問題草稿');
    await input.press('Enter');
    await expect(input).toHaveValue('下一個問題草稿');
    expect(requests).toHaveLength(1);
    release();
    await expect(page.getByText('延遲回覆測試。', { exact: true })).toBeVisible();
    await expect(input).toHaveValue('下一個問題草稿');
    expect(requests).toHaveLength(1);
  } finally { release(); }
});
