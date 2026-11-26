import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCloudVocabulary, mutateCloudVocabulary, VocabularyCloudError, vocabularyLoginUrl } from '../vocabularyCloudClient';
import { addVocabulary } from '../vocabulary';
const cards = addVocabulary([], { term: 'example', definition: '原筆記', context: 'An example.', sourcePath: '/posts/example', sourceTitle: 'Source', lang: 'en' }, 123);
afterEach(() => vi.unstubAllGlobals());
describe('cloud vocabulary client', () => {
  it('reads only the same-origin authenticated API without browser caching', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ cards })); vi.stubGlobal('fetch', fetcher);
    expect(await fetchCloudVocabulary()).toEqual({ cards });
    expect(fetcher).toHaveBeenCalledWith('/api/vocabulary', expect.objectContaining({ method: 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'manual' }));
  });
  it('imports the original notes and schedule without rewriting browser storage', async () => {
    const storage = { setItem: vi.fn(), getItem: vi.fn() }; vi.stubGlobal('localStorage', storage);
    const fetcher = vi.fn().mockResolvedValue(Response.json({ cards })); vi.stubGlobal('fetch', fetcher);
    await mutateCloudVocabulary({ action: 'import', cards });
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ action: 'import', cards });
    expect(storage.setItem).not.toHaveBeenCalled(); expect(storage.getItem).not.toHaveBeenCalled();
  });
  it('propagates authentication failure rather than falling back to local cards', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'denied' }, { status: 401 })));
    await expect(fetchCloudVocabulary()).rejects.toMatchObject({ status: 401, name: 'VocabularyCloudError' });
  });
  it('turns Access edge redirects and HTML denial into an explicit sign-in error', async () => {
    for (const response of [new Response(null, { status: 302, headers: { Location: 'https://access.example.test' } }), new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/html' } }), { type: 'opaqueredirect', status: 0 }]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
      await expect(fetchCloudVocabulary()).rejects.toMatchObject({ status: 401 });
    }
  });
  it('does not mask network failures or report mutation success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable')));
    await expect(mutateCloudVocabulary({ action: 'delete', id: cards[0].id })).rejects.toThrow('Network unavailable');
  });
  it('keeps service failures visible and makes no second request', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'Database unavailable' }, { status: 503 })); vi.stubGlobal('fetch', fetcher);
    await expect(mutateCloudVocabulary({ action: 'delete', id: cards[0].id })).rejects.toThrow('Database unavailable');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed successful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ cards: [{ ...cards[0], ease: 0 }] })));
    await expect(fetchCloudVocabulary()).rejects.toThrow('Vocabulary data is invalid');
  });
  it('sends only the affected card and forwards cancellation', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ cards })); vi.stubGlobal('fetch', fetcher);
    const signal = new AbortController().signal;
    await mutateCloudVocabulary({ action: 'review', id: cards[0].id, rating: 'good' }, signal);
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ action: 'review', id: cards[0].id, rating: 'good' });
    expect(fetcher.mock.calls[0][1].signal).toBe(signal);
  });
  it('only allows a local return path for sign in', () => {
    expect(vocabularyLoginUrl('/posts/example?q=one')).toBe('/auth/login?returnTo=%2Fposts%2Fexample%3Fq%3Done');
    for (const unsafe of ['https://evil.test', '//evil.test', '/\\evil.test', '/\nlocation']) expect(vocabularyLoginUrl(unsafe)).toBe('/auth/login?returnTo=%2Fvocabulary');
    expect(new VocabularyCloudError('error', 401)).toBeInstanceOf(Error);
  });
});
