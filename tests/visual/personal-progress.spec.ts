import { test, expect, type Page, type Route } from '@playwright/test';

// Browser interaction fixtures only: these responses do not verify real Access,
// D1 persistence or authenticated ownership. Keep those on their API/auth tests.
const interviewKey = 'interview-prep-progress';
const speakingKey = 'quidproquo-speaking-v1';
const localInterview = { 'ai-0': true, 'pb-1': true };
const localSpeaking = { 'daily-health-cold': { due: 100, reviewed: 100, rating: 2, streak: 1 } };

async function seed(page: Page, key: string, items: object) {
  await page.addInitScript(({ key, items }) => {
    if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(items));
  }, { key, items });
}
async function reply(route: Route, status: number, items: object = {}) {
  await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ items }) });
}

test.describe('Personal progress UI with mocked cloud responses', () => {
  for (const path of ['/interview/', '/en/interview/']) {
    test(`${path} auto-loads cloud, imports local only on request`, async ({ page }) => {
      await seed(page, interviewKey, localInterview);
      const posts: Record<string, unknown>[] = [];
      await page.route('**/api/personal/progress**', async route => {
        if (route.request().method() === 'POST') posts.push(route.request().postDataJSON());
        await reply(route, 200, posts.length ? { 'ai-0': false, 'pb-1': true } : { 'ai-0': false });
      });
      await page.goto(path);
      const panel = page.locator('.personal-sync');
      await expect(panel).toHaveAttribute('data-state', 'cloud');
      await expect(panel.locator('a')).toBeHidden();
      await expect(page.locator('[data-check="ai-0"]')).not.toBeChecked();
      expect(posts).toEqual([]);
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), interviewKey)).toEqual(localInterview);
      await panel.locator('summary').click();
      await panel.getByRole('button', { name: /匯入這個瀏覽器的進度|Import progress from this browser/ }).click();
      await expect(panel.locator('details')).toBeHidden();
      expect(posts).toEqual([{ action: 'import', domain: 'interview', items: localInterview }]);
      await expect(page.locator('[data-check="pb-1"]')).toBeChecked();
    });

    test(`${path} guest changes persist locally without upload`, async ({ page }) => {
      let posts = 0;
      await page.route('**/api/personal/progress**', async route => {
        if (route.request().method() === 'POST') posts++;
        await reply(route, 401);
      });
      await page.goto(path);
      await expect(page.locator('.personal-sync')).toHaveAttribute('data-state', 'guest');
      await expect(page.locator('.personal-sync a')).toBeVisible();
      const check = page.locator('[data-check="ai-0"]');
      await check.check();
      await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}')['ai-0'], interviewKey)).toBe(true);
      await page.reload();
      await expect(page.locator('.personal-sync')).toHaveAttribute('data-state', 'guest');
      await expect(check).toBeChecked();
      expect(posts).toBe(0);
    });

    test(`${path} cloud failure preserves local data and offers retry`, async ({ page }) => {
      await seed(page, interviewKey, localInterview);
      let available = false;
      let posts = 0;
      await page.route('**/api/personal/progress**', async route => {
        if (route.request().method() === 'POST') posts++;
        await reply(route, available ? 200 : 503, { 'ai-0': false });
      });
      await page.goto(path);
      const panel = page.locator('.personal-sync');
      const check = page.locator('[data-check="ai-0"]');
      await expect(panel).toHaveAttribute('data-state', 'error');
      await expect(check).toBeChecked();
      await expect(check).toBeDisabled();
      await expect(panel.locator('a')).toBeHidden();
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), interviewKey)).toEqual(localInterview);
      available = true;
      await panel.getByRole('button', { name: /重新連線|Retry connection/ }).click();
      await expect(panel).toHaveAttribute('data-state', 'cloud');
      await expect(check).toBeEnabled();
      await expect(check).not.toBeChecked();
      expect(posts).toBe(0);
    });
  }

  test('speaking auto-loads cloud and keeps import explicit', async ({ page }) => {
    await seed(page, speakingKey, localSpeaking);
    const posts: Record<string, unknown>[] = [];
    await page.route('**/api/personal/progress**', async route => {
      if (route.request().method() === 'POST') posts.push(route.request().postDataJSON());
      await reply(route, 200, {});
    });
    await page.goto('/english/');
    const panel = page.locator('.personal-sync');
    await expect(panel).toHaveAttribute('data-state', 'cloud');
    await expect(panel.locator('a')).toHaveCount(0);
    expect(posts).toEqual([]);
    await panel.locator('summary').click();
    await panel.getByRole('button', { name: '匯入這個瀏覽器的進度' }).click();
    await expect(panel.locator('details')).toHaveCount(0);
    expect(posts).toEqual([{ action: 'import', domain: 'speaking', items: localSpeaking }]);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), speakingKey)).toEqual(localSpeaking);
  });

  test('speaking guest has a styled sign-in action and no import', async ({ page }) => {
    await page.route('**/api/personal/progress**', route => reply(route, 401));
    await page.goto('/english/');
    const panel = page.locator('.personal-sync');
    await expect(panel).toHaveAttribute('data-state', 'guest');
    await expect(panel.getByRole('link', { name: '登入同步進度' })).toBeVisible();
    await expect(panel.locator('details')).toHaveCount(0);
    const height = await panel.getByRole('link').evaluate(element => element.getBoundingClientRect().height);
    expect(height).toBeGreaterThanOrEqual(44);
  });

  test('speaking cloud failure preserves local progress and recovers on retry', async ({ page }) => {
    await seed(page, speakingKey, localSpeaking);
    let available = false;
    let posts = 0;
    await page.route('**/api/personal/progress**', async route => {
      if (route.request().method() === 'POST') posts++;
      await reply(route, available ? 200 : 503);
    });
    await page.goto('/english/');
    const panel = page.locator('.personal-sync');
    await expect(panel).toHaveAttribute('data-state', 'error');
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), speakingKey)).toEqual(localSpeaking);
    await expect(panel.locator('a')).toHaveCount(0);
    available = true;
    await panel.getByRole('button', { name: '重新連線' }).click();
    await expect(panel).toHaveAttribute('data-state', 'cloud');
    expect(posts).toBe(0);
  });
});
