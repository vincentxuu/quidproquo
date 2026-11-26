import { test, expect } from '@playwright/test';

// Real article/dialog with controlled API data. This verifies UI, not Access/D1.
const article = '/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems/';
const entry = {
  headword: 'execution-grounded', kind: 'phrase',
  senses: [{ pos: 'adjective', zh: '以實際執行結果為依據的', en: 'Based on feedback from execution.' }],
  collocations: ['execution-grounded research'], phrases: [], confusables: [], synonyms: [], antonyms: [],
  examples: [
    { en: 'The system uses execution-grounded feedback.', zh: '系統使用實際執行的回饋。' },
    { en: 'Research should be grounded in execution.', zh: '研究應以實際執行為依據。' },
    { en: 'We evaluate results after execution.', zh: '我們在執行後評估結果。' },
  ],
};
for (const theme of ['light', 'dark']) {
  test(`article lookup saves once and closes, ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: theme === 'dark' ? 390 : 1280, height: 900 });
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.route('**/api/lexicon**', route => route.fulfill({ json: { entry } }));
    const saves: unknown[] = [];
    await page.route('**/api/vocabulary', async route => {
      saves.push(route.request().postDataJSON());
      await route.fulfill({ json: { cards: [], alreadySaved: false } });
    });
    await page.goto(article);
    await page.locator('#vocabulary-add').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('textbox', { name: '單字或片語', exact: true })).toBeVisible();
    await dialog.getByRole('textbox', { name: '單字或片語', exact: true }).fill('execution-grounded');
    await dialog.getByRole('button', { name: '查詞', exact: true }).click();
    await expect(dialog.getByRole('button', { name: '加入單字庫', exact: true })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: '發音聲音' }).locator('option')).toHaveCount(4);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await dialog.screenshot({ path: testInfo.outputPath(`lookup-${theme}.png`) });
    await dialog.getByRole('button', { name: '加入單字庫', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('#vocabulary-save-feedback')).toContainText('已加入單字庫');
    expect(saves).toHaveLength(1);
    await expect(page.locator('#vocabulary-add')).toBeFocused();
  });
}

test('selection action stays beside selected text and Escape dismisses it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(article);
  const anchor = page.locator('.content a[href="https://arxiv.org/html/2601.14525"]').first();
  await anchor.scrollIntoViewIfNeeded();
  await anchor.evaluate(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const node = walker.nextNode();
    if (!node) throw new Error('Missing article text');
    const range = document.createRange();
    range.selectNodeContents(node);
    window.getSelection()!.removeAllRanges(); window.getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  const action = page.locator('#vocabulary-selection-save');
  await expect(action).toBeVisible();
  const position = await action.evaluate(el => {
    const button = el.getBoundingClientRect(); const range = window.getSelection()!.getRangeAt(0);
    const selected = [...range.getClientRects()].at(-1)!;
    return { inside: button.left >= 0 && button.right <= innerWidth && button.top >= 0 && button.bottom <= innerHeight, outsideText: button.top >= selected.bottom || button.bottom <= selected.top, height: button.height };
  });
  expect(position.inside).toBe(true); expect(position.outsideText).toBe(true); expect(position.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Escape'); await expect(action).toBeHidden();
});

test('all four voices use the audio service and playable media, not browser synthesis', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { uiAudioPlayed: number };
    state.uiAudioPlayed = 0;
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return original.call(this).then(() => { state.uiAudioPlayed++; });
    };
    if ('speechSynthesis' in window) window.speechSynthesis.speak = () => { throw new Error('Unexpected browser synthesis'); };
  });
  await page.route('**/api/lexicon**', route => route.fulfill({ json: { entry } }));
  const wav = Buffer.alloc(44 + 32_000);
  wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8_000, 24); wav.writeUInt32LE(16_000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write('data', 36); wav.writeUInt32LE(32_000, 40);
  const requests: { voice: string; text: string }[] = [];
  await page.route('**/api/tts', async route => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ contentType: 'audio/wav', body: wav });
  });
  await page.goto(article); await page.locator('#vocabulary-add').click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: '單字或片語', exact: true }).fill('execution-grounded');
  await dialog.getByRole('button', { name: '查詞', exact: true }).click();
  await expect(dialog.getByRole('heading', { name: 'execution-grounded', exact: true })).toBeVisible();
  const select = dialog.getByRole('combobox', { name: '發音聲音' });
  const voices = await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
  expect(voices).toHaveLength(4);
  for (let index = 0; index < voices.length; index++) {
    await select.selectOption(voices[index]);
    await dialog.getByRole('button', { name: '播放 execution-grounded', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as typeof window & { uiAudioPlayed: number }).uiAudioPlayed)).toBe(index + 1);
    await dialog.getByRole('button', { name: '停止發音', exact: true }).click();
  }
  expect(requests.map(request => request.voice)).toEqual(voices);
  expect(requests.every(request => request.text === 'execution-grounded')).toBe(true);
});
