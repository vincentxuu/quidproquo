import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { env } from 'cloudflare:workers';
import { requireVocabularyIdentity, verifyVocabularyAccessToken, vocabularyReturnTo } from '../vocabularyAccess';

import { GET as login } from '../../pages/vocabulary/login';
afterEach(() => vi.unstubAllGlobals());

const issuer = 'https://example.cloudflareaccess.com';
const config = { teamDomain: issuer, audience: 'vocab-audience' };
import { accessConfigured, requireAccessIdentity } from '../auth/access';
const seconds = Math.floor(Date.now() / 1000);
let pair: CryptoKeyPair;
let jwk: JsonWebKey;
const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
async function token(change: Record<string, unknown> = {}, header = { alg: 'RS256', kid: 'key1' }, signPair?: CryptoKeyPair) {
  const data = `${encode(header)}.${encode({ iss: issuer, aud: ['vocab-audience'], sub: 'user1', email: 'reader@example.com', exp: seconds + 3600, iat: seconds - 1, ...change })}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', (signPair ?? pair).privateKey, new TextEncoder().encode(data));
  return `${data}.${Buffer.from(signature).toString('base64url')}`;
}
const fetchKeys = () => vi.fn(async () => new Response(JSON.stringify({ keys: [{ ...jwk, kid: 'key1', alg: 'RS256', use: 'sig' }] })));
beforeAll(async () => {
  pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
});
describe('Cloudflare Access identity', () => {
  it('verifies a real RSA signature with pinned issuer and audience', async () => {
    expect(await verifyVocabularyAccessToken(await token(), config, { fetch: fetchKeys() })).toEqual({ sub: 'user1', email: 'reader@example.com' });
  });
  it.each([{ iss: 'https://evil.example' }, { aud: ['other-app'] }, { exp: seconds - 1 }, { nbf: seconds + 300 }, { sub: '' }, { email: '' }, { exp: undefined }])('rejects invalid claims %j', async change => {
    await expect(verifyVocabularyAccessToken(await token(change), config, { fetch: fetchKeys() })).rejects.toMatchObject({ status: 401 });
  });
  it('rejects a forged payload even if it names the correct account', async () => {
    const valid = await token(); const parts = valid.split('.');
    parts[1] = encode({ iss: issuer, aud: ['vocab-audience'], sub: 'victim', email: 'reader@example.com', exp: seconds + 3600 });
    await expect(verifyVocabularyAccessToken(parts.join('.'), config, { fetch: fetchKeys() })).rejects.toMatchObject({ status: 401 });
  });
  it('rejects unexpected algorithms and unknown key IDs', async () => {
    for (const header of [{ alg: 'none', kid: 'key1' }, { alg: 'HS256', kid: 'key1' }, { alg: 'RS256', kid: 'unknown' }]) {
      await expect(verifyVocabularyAccessToken(await token({}, header), config, { fetch: fetchKeys() })).rejects.toMatchObject({ status: 401 });
    }
  });
  it('fails closed when signing keys cannot be fetched', async () => {
    await expect(verifyVocabularyAccessToken(await token(), config, { fetch: vi.fn().mockRejectedValue(new Error('network')) })).rejects.toMatchObject({ status: 503 });
  });
  it('does not trust a caller-controlled issuer URL or oversized token', async () => {
    const fetcher = fetchKeys();
    await expect(verifyVocabularyAccessToken(await token(), { ...config, teamDomain: 'https://evil.example' }, { fetch: fetcher })).rejects.toMatchObject({ status: 503 });
    await expect(verifyVocabularyAccessToken('x'.repeat(17000), config, { fetch: fetcher })).rejects.toMatchObject({ status: 401 });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('never accepts an email header as identity', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'reader@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: issuer, VOCABULARY_ACCESS_AUD: config.audience });
    await expect(requireVocabularyIdentity(new Request('https://quidproquo.cc/api/vocabulary', { headers: { 'Cf-Access-Authenticated-User-Email': 'reader@example.com' } }))).rejects.toMatchObject({ status: 401 });
  });
});
describe('login return destination', () => {
  it.each(['https://evil.example', '//evil.example', '/\\evil.example', '/vocabulary/login', '/%2f%2fevil.example'])('rejects unsafe or looping destination %s', path => {
    expect(vocabularyReturnTo(path, 'https://quidproquo.cc')).toBe('/vocabulary');
  });
  it('preserves a same-site article path and strips fragments', () => {
    expect(vocabularyReturnTo('/posts/ai/example/?view=reader#word', 'https://quidproquo.cc')).toBe('/posts/ai/example/?view=reader');
  });
});

describe('login completion route', () => {
  it('resumes a same-site article only after verifying Access identity', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'reader@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: issuer, VOCABULARY_ACCESS_AUD: config.audience });
    vi.stubGlobal('fetch', fetchKeys());
    const request = new Request('https://quidproquo.cc/vocabulary/login?returnTo=%2Fposts%2Fai%2Fexample%2F', { headers: { 'Cf-Access-Jwt-Assertion': await token() } });
    const response = await login({ request } as never);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/posts/ai/example/');
    expect(response.headers.get('Cache-Control')).toContain('no-store');
  });
  it('rejects a direct origin request without a signed Access header', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'reader@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: issuer, VOCABULARY_ACCESS_AUD: config.audience });
    const response = await login({ request: new Request('https://quidproquo.cc/vocabulary/login') } as never);
    expect(response.status).toBe(401);
    expect(response.headers.get('Location')).toBeNull();
  });
  it('fails closed while Access is not configured', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'reader@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: '', VOCABULARY_ACCESS_AUD: '' });
    const response = await login({ request: new Request('https://quidproquo.cc/vocabulary/login') } as never);
    expect(response.status).toBe(503);
  });
});

describe('unified Access allowlist', () => {
  it('rejects a correctly signed identity outside the explicit owner allowlist', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'owner@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: issuer, VOCABULARY_ACCESS_AUD: config.audience });
    vi.stubGlobal('fetch', fetchKeys());
    await expect(requireAccessIdentity(new Request('https://quidproquo.cc/admin', { headers: { 'Cf-Access-Jwt-Assertion': await token() } }))).rejects.toMatchObject({ status: 403 });
  });
  it('accepts a verified Access cookie on a public article action', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: 'reader@example.com', VOCABULARY_ACCESS_TEAM_DOMAIN: issuer, VOCABULARY_ACCESS_AUD: config.audience });
    vi.stubGlobal('fetch', fetchKeys());
    const identity = await requireAccessIdentity(new Request('https://quidproquo.cc/posts/article', { headers: { Cookie: `CF_Authorization=${await token()}` } }));
    expect(identity.sub).toBe('user1');
  });
  it('fails closed when an Access rollout is only partially configured', async () => {
    Object.assign(env, { ACCESS_ALLOWED_EMAILS: '', ACCESS_TEAM_DOMAIN: issuer, ACCESS_AUD: '', VOCABULARY_ACCESS_AUD: '' });
    expect(accessConfigured()).toBe(true);
    await expect(requireAccessIdentity(new Request('https://quidproquo.cc/admin'))).rejects.toMatchObject({ status: 503 });
    delete (env as Record<string, unknown>).ACCESS_TEAM_DOMAIN; delete (env as Record<string, unknown>).ACCESS_AUD;
  });
});

describe('Workers-compatible signing-key fetch', () => {
  it('verifies identity using manual redirect mode supported by workerd', async () => {
    const fetcher = vi.fn(async (_input: unknown, init?: RequestInit) => {
      if (init?.redirect !== 'manual') throw new TypeError('Invalid redirect value, must be one of follow or manual');
      return new Response(JSON.stringify({ keys: [{ ...jwk, kid: 'key1', alg: 'RS256', use: 'sig' }] }));
    });
    expect((await verifyVocabularyAccessToken(await token(), config, { fetch: fetcher as typeof fetch })).sub).toBe('user1');
  });
  it('rejects a signing-key redirect rather than following an untrusted host', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 302, headers: { Location: 'https://evil.example/keys' } }));
    await expect(verifyVocabularyAccessToken(await token(), config, { fetch: fetcher })).rejects.toMatchObject({ status: 503 });
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
