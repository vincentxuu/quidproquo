import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, checkVideos } from './check-youtube-embeds.mjs';

test('only real youtube fences are inventoried and malformed URLs are visible', () => {
  const text = '````md\n```youtube\nurl: https://youtu.be/qQTDF0CBoxE\n```\n````\n~~~youtube\nurl: https://youtu.be/qQTDF0CBoxE\n~~~\n```youtube\nurl: invalid\n```';
  assert.deepEqual(discover(text, 'post.md').map(item => item.id), ['qQTDF0CBoxE', null]);
});

test('no key produces unknown inventory without making requests', async () => {
  const results = await checkVideos(['qQTDF0CBoxE', 'qQTDF0CBoxE'], { fetchImpl: () => { throw new Error('must not call'); } });
  assert.equal(results.length, 1);
  assert.equal(results[0].checkedAt, null);
  assert.equal(results[0].reason, 'missing_api_key');
});

test('deduplicates and batches 50; preserves restrictions and does not infer private', async () => {
  const ids = Array.from({ length: 51 }, (_, index) => String(index).padStart(11, '0'));
  const sizes = [];
  const results = await checkVideos([...ids, ids[0]], {
    apiKey: 'test-key', now: () => 'test-time',
    fetchImpl: async (url, options) => {
      assert.equal(url.searchParams.has('key'), false);
      assert.equal(options.headers['X-Goog-Api-Key'], 'test-key');
      const batch = url.searchParams.get('id').split(','); sizes.push(batch.length);
      return { ok: true, json: async () => ({ items: batch.slice(1).map(id => ({ id, status: { embeddable: false }, contentDetails: { regionRestriction: { blocked: ['TW'] } } })) }) };
    },
  });
  assert.deepEqual(sizes, [50, 1]);
  assert.equal(results[0].reason, 'not_returned');
  assert.equal(results[0].embeddable, null);
  assert.deepEqual(results[1].regionRestriction, { blocked: ['TW'] });
  assert.equal(results[1].embeddable, false);
});

test('failure reports unknown without leaking thrown request secrets', async () => {
  const results = await checkVideos(['qQTDF0CBoxE'], { apiKey: 'secret', fetchImpl: async () => { throw new Error('https://example.com?key=secret'); } });
  assert.equal(results[0].reason, 'request_failed');
  assert.equal(JSON.stringify(results).includes('secret'), false);
});

test('HTTP errors, timeouts, and missing status remain unknown', async () => {
  for (const [fetchImpl, reason] of [
    [async () => ({ ok: false, status: 403 }), 'http_403'],
    [async () => { throw new DOMException('request secret', 'TimeoutError'); }, 'timeout'],
    [async () => ({ ok: true, json: async () => ({ items: [{ id: 'qQTDF0CBoxE' }] }) }), 'missing_embeddable_status'],
  ]) {
    const [result] = await checkVideos(['qQTDF0CBoxE'], { apiKey: 'test', fetchImpl });
    assert.equal(result.status, 'unknown');
    assert.equal(result.reason, reason);
    assert.equal(result.embeddable, null);
  }
});
