import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../lexicon';
import { createModel } from '../../../lib/retrieval/model';
vi.mock('../../../lib/retrieval/model', () => ({ createModel: vi.fn() }));
const entry = { headword: 'ground', kind: 'word', senses: [{ pos: 'verb', zh: '以事實為依據', en: 'Base on evidence.' }], collocations: [], phrases: [], confusables: [], synonyms: [], antonyms: [], examples: [1, 2, 3].map(() => ({ en: 'The decision was grounded in evidence.', zh: '決策以證據為依據。' })) };
const invoke = vi.fn();
function post(body: unknown) { return POST({ request: new Request('https://example.com/api/lexicon', { method: 'POST', body: JSON.stringify(body) }) } as never); }
function get(q = 'ground') { return GET({ request: new Request(`https://example.com/api/lexicon?q=${encodeURIComponent(q)}`) } as never); }
beforeEach(() => { vi.mocked(createModel).mockReset().mockReturnValue({ invoke }); invoke.mockReset().mockResolvedValue({ content: JSON.stringify(entry) }); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
describe('/api/lexicon', () => {
  it('GET only reads cache and never invokes generation', async () => { expect((await get()).status).toBe(404); expect(createModel).not.toHaveBeenCalled(); });
  it('returns validated cached entry with the same normalized term key', async () => {
    const match = vi.fn(async () => new Response(JSON.stringify(entry)));
    vi.stubGlobal('caches', { open: vi.fn(async () => ({ match })) });
    expect(await (await get(' “Ground.” ')).json()).toEqual({ entry, cached: true });
    expect(await (await post({ term: 'ground' })).json()).toEqual({ entry, cached: true });
    expect(match.mock.calls[0]).toEqual(match.mock.calls[1]);
    expect(createModel).not.toHaveBeenCalled();
  });
  it.each([{}, null, { term: '中文' }, { term: 'a'.repeat(121) }, { term: 'ground', context: 'x'.repeat(1001) }])('rejects invalid request %j', async body => { expect((await post(body)).status).toBe(400); expect(createModel).not.toHaveBeenCalled(); });
  it('rejects malformed JSON and invalid GET', async () => {
    expect((await POST({ request: new Request('https://example.com/api/lexicon', { method: 'POST', body: '{' }) } as never)).status).toBe(400);
    expect((await get('中文')).status).toBe(400);
  });
  it('generates a full entry, forwards abort signal, and separates source context as data', async () => {
    expect(await (await post({ term: ' Ground ', context: 'A public article sentence.' })).json()).toEqual({ entry, cached: false });
    expect(createModel).toHaveBeenCalledWith(4000);
    expect(invoke.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(invoke.mock.calls[0][0][1].content)).toEqual({ term: 'Ground', context: 'A public article sentence.' });
  });
  it.each(['invalid json', JSON.stringify({ ...entry, examples: [] }), JSON.stringify({ ...entry, senses: [] })])('rejects malformed or partial generated entries', async content => { invoke.mockResolvedValue({ content }); expect((await post({ term: 'ground' })).status).toBe(502); });
  it('reports missing provider explicitly', async () => { vi.mocked(createModel).mockImplementation(() => { throw new Error('secret'); }); const response = await post({ term: 'ground' }); expect(response.status).toBe(503); expect(await response.text()).not.toContain('secret'); });
  it('reports upstream failure without leaking secrets', async () => { invoke.mockRejectedValue(new Error('secret')); const response = await post({ term: 'ground' }); expect(response.status).toBe(502); expect(await response.text()).not.toContain('secret'); });
  it('aborts at 45 seconds even when a provider ignores cancellation', async () => {
    vi.useFakeTimers(); invoke.mockImplementation(() => new Promise(() => {}));
    const result = post({ term: 'ground' }); await vi.advanceTimersByTimeAsync(45_000);
    expect((await result).status).toBe(502); expect(invoke.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it('ignores malformed cached data and still generates a complete entry', async () => {
    const put = vi.fn(); vi.stubGlobal('caches', { open: vi.fn(async () => ({ match: vi.fn(async () => new Response('{}')), put })) });
    expect((await post({ term: 'ground' })).status).toBe(200); expect(put).toHaveBeenCalledOnce();
  });
});
