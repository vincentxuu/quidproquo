import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const golden = JSON.parse(await readFile('/tmp/quidproquo-glossary-golden.json', 'utf8'));
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const sample of golden) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/glossary/explain', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
    const pathname = '/' + sample.path.replace(/^.*dist\/client\//, '').replace(/^\//, '').replace(/\/index\.html$/, '/');
    const response = await page.goto(`http://127.0.0.1:8794${pathname}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => document.querySelectorAll('.content .glossary-term').length > 0);
    const url = await page.locator('#glossary-data').getAttribute('data-shared-src');
    assert.match(url, /^\/glossary\/(?:en|zh-TW)-[a-f0-9]{20}\.json$/);
    const button = page.locator('.content .glossary-term').first();
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    await page.waitForFunction(() => {
      const popover = document.querySelector('#glossary-popover');
      const definition = document.querySelector('#glossary-definition')?.textContent;
      return popover && !popover.hidden && definition && definition !== 'Loading...';
    });
    const definition = await page.locator('#glossary-definition').textContent();
    const term = await button.getAttribute('data-term');
    const seed = sample.entries.find(entry => entry.term.toLowerCase() === term.toLowerCase());
    assert.ok(seed, `Rendered term ${term} must exist in old rendered glossary`);
    assert.equal(definition, seed.definition);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `/tmp/quidproquo-glossary-built-${sample.lang}.png` });
    results.push({ lang: sample.lang, pathname, shared: url, term, clientMarks: await page.locator('.content .glossary-term').count(), result: 'PASS' });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile('/tmp/quidproquo-glossary-built-results.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results));
