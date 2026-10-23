import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { env } from 'cloudflare:workers';
import { POST } from '../tts';

const workerEnv = env as Record<string, unknown>;
const bytes = new Uint8Array([73, 68, 51, 1, 2, 3]);
const run = vi.fn();
function call(body: unknown) {
  return POST({ request: new Request('https://quidproquo.cc/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) } as never);
}
function audio() { return new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }); }

beforeEach(() => {
  vi.unstubAllGlobals();
  for (const key of Object.keys(workerEnv)) delete workerEnv[key];
  workerEnv.AI = { run };
  run.mockReset().mockImplementation(async () => audio());
});
afterEach(() => vi.unstubAllGlobals());

describe('POST /api/tts', () => {
  it('rejects malformed JSON without generating audio', async () => {
    const response = await POST({ request: new Request('https://quidproquo.cc/api/tts', { method: 'POST', body: '{' }) } as never);
    expect(response.status).toBe(400);
    expect(run).not.toHaveBeenCalled();
  });
  it.each([null, [], {}, { text: 1, voice: 'thalia' }, { text: '  ', voice: 'thalia' }, { text: 'a'.repeat(501), voice: 'thalia' }, { text: 'word' }, { text: 'word', voice: 'invalid' }])('rejects invalid input %j', async body => {
    expect((await call(body)).status).toBe(400);
    expect(run).not.toHaveBeenCalled();
  });
  it.each(['thalia', 'arcas', 'pandora', 'draco'])('generates MP3 stream using existing voice %s', async voice => {
    const response = await call({ text: '  execution grounded  ', voice });
    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalledWith('@cf/deepgram/aura-2-en', { text: 'execution grounded', speaker: voice, encoding: 'mp3' });
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
  });
  it('returns explicit upstream failure instead of fake or browser audio', async () => {
    run.mockRejectedValue(new Error('provider secret detail'));
    const response = await call({ text: 'word', voice: 'thalia' });
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('provider secret detail');
  });
  it('rejects a non-stream model result', async () => {
    run.mockResolvedValue('invalid audio');
    expect((await call({ text: 'word', voice: 'thalia' })).status).toBe(502);
  });
  it('reports unavailable binding', async () => {
    delete workerEnv.AI;
    expect((await call({ text: 'word', voice: 'thalia' })).status).toBe(503);
  });
  it('returns cached audio keyed by voice and exact normalized text', async () => {
    const match = vi.fn(async (_request: Request) => new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg' } }));
    vi.stubGlobal('caches', { open: vi.fn(async () => ({ match })) });
    const response = await call({ text: 'word', voice: 'thalia' });
    expect(response.status).toBe(200);
    expect(run).not.toHaveBeenCalled();
    const key = match.mock.calls[0][0] as Request;
    expect(key.url).toMatch(/\/api\/tts\/cache\/[a-f0-9]{64}$/);
    expect(key.url).not.toContain('word');
  });
  it('continues when cache fails', async () => {
    vi.stubGlobal('caches', { open: vi.fn().mockRejectedValue(new Error('cache down')) });
    expect((await call({ text: 'word', voice: 'thalia' })).status).toBe(200);
  });
});
