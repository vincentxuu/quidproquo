import { env } from 'cloudflare:workers';

export type AccessConfig = { teamDomain: string; audience: string };
export type AccessIdentity = { sub: string; email: string };
type SigningKey = JsonWebKey & { kid?: string };
const cachedKeys = new Map<string, { keys: SigningKey[]; expires: number }>();
const failure = (status: number, error: string) => new Response(JSON.stringify({ error }), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
});
function settings(): AccessConfig {
  const values = env as unknown as Record<string, unknown>;
  return { teamDomain: String(values.ACCESS_TEAM_DOMAIN ?? values.VOCABULARY_ACCESS_TEAM_DOMAIN ?? ''), audience: String(values.ACCESS_AUD ?? values.VOCABULARY_ACCESS_AUD ?? '') };
}
export function accessConfig(): AccessConfig {
  const config = settings();
  if (!/^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/.test(config.teamDomain) || !config.audience.trim()) {
    throw failure(503, '登入服務尚未設定完成。');
  }
  return config;
}
function decode(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('encoding');
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), char => char.charCodeAt(0));
}

/** Verify the actual RSA signature. Caller-supplied email or decoded claims alone are never identity. */
export async function verifyAccessToken(token: string, config: AccessConfig, options: { fetch?: typeof fetch; now?: number } = {}): Promise<AccessIdentity> {
  if (!/^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/.test(config.teamDomain) || !config.audience.trim()) throw failure(503, '登入服務尚未設定完成。');
  let header: { alg?: string; kid?: string };
  let claims: Record<string, unknown>;
  let signature: Uint8Array;
  let parts: string[];
  const now = options.now ?? Date.now();
  try {
    if (token.length > 16_384) throw new Error('size');
    parts = token.split('.');
    if (parts.length !== 3) throw new Error('format');
    header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    claims = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    signature = decode(parts[2]);
    if (!header || header.alg !== 'RS256' || typeof header.kid !== 'string' || header.kid.length > 256 || !claims) throw new Error('algorithm');
    const seconds = now / 1000;
    if (claims.iss !== config.teamDomain || !(Array.isArray(claims.aud) ? claims.aud : [claims.aud]).includes(config.audience)
      || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) || claims.exp <= seconds
      || (claims.nbf !== undefined && (typeof claims.nbf !== 'number' || !Number.isFinite(claims.nbf) || claims.nbf > seconds))
      || (claims.iat !== undefined && (typeof claims.iat !== 'number' || !Number.isFinite(claims.iat) || claims.iat > seconds + 30))
      || typeof claims.sub !== 'string' || !claims.sub.trim() || claims.sub.length > 256
      || typeof claims.email !== 'string' || !claims.email.includes('@') || claims.email.length > 320) throw new Error('claims');
  } catch { throw failure(401, '請先登入私人功能。'); }
  // A fixed, configured origin prevents token-controlled JWKS/SSRF. Short cache refreshes rotated keys.
  let keys: SigningKey[];
  try {
    const cached = options.fetch ? undefined : cachedKeys.get(config.teamDomain);
    if (cached && cached.expires > now && (cached.keys.some(key => key.kid === header.kid) || cached.expires - 4 * 60_000 > now)) keys = cached.keys;
    else {
      const response = await (options.fetch ?? fetch)(`${config.teamDomain}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(5000), redirect: 'manual' });
      if (!response.ok) throw new Error('keys');
      const body = await response.text();
      if (body.length > 100_000) throw new Error('size');
      const value = JSON.parse(body) as { keys?: SigningKey[] };
      if (!Array.isArray(value.keys) || value.keys.length > 20) throw new Error('keys');
      keys = value.keys;
      if (!options.fetch) cachedKeys.set(config.teamDomain, { keys, expires: now + 5 * 60_000 });
    }
  } catch { throw failure(503, '登入驗證暫時無法連線，請稍後再試。'); }
  try {
    const jwk = keys.find(key => key.kid === header.kid && key.kty === 'RSA' && (!key.alg || key.alg === 'RS256') && (!key.use || key.use === 'sig'));
    if (!jwk) throw new Error('key');
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature as Uint8Array<ArrayBuffer>, new TextEncoder().encode(`${parts[0]}.${parts[1]}`))) throw new Error('signature');
    return { sub: claims.sub as string, email: claims.email as string };
  } catch { throw failure(401, '登入已失效，請重新登入。'); }
}
export function accessConfigured(): boolean {
  const values = env as unknown as Record<string, unknown>;
  return ['ACCESS_TEAM_DOMAIN', 'ACCESS_AUD', 'ACCESS_ALLOWED_EMAILS', 'VOCABULARY_ACCESS_TEAM_DOMAIN', 'VOCABULARY_ACCESS_AUD'].some(key => Boolean(values[key]));
}
export async function requireAccessIdentity(request: Request): Promise<AccessIdentity> {
  const config = accessConfig();
  const values = env as unknown as Record<string, unknown>;
  const allowed = String(values.ACCESS_ALLOWED_EMAILS ?? '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!allowed.length) throw failure(503, '私人功能登入尚未設定允許的帳號。');
  // Access supplies the assertion on protected routes. Public article actions may
  // carry only its cookie; both paths verify the same signed application JWT.
  let token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) {
    const cookie = request.headers.get('Cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith('CF_Authorization='));
    if (cookie) token = cookie.slice('CF_Authorization='.length);
  }
  if (!token) throw failure(401, '請先登入私人功能。');
  const identity = await verifyAccessToken(token, config);
  if (!allowed.includes(identity.email.toLowerCase())) throw failure(403, '此帳號未獲授權。');
  return identity;
}
/** Only relative, same-site return paths; no login loops or encoded authority separators. */
export function accessReturnTo(value: string | null, origin: string): string {
  try {
    if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]|%2f|%5c/i.test(value)) return '/vocabulary';
    const url = new URL(value, origin);
    if (url.origin !== origin || /^\/(?:(?:en\/)?vocabulary\/login|auth\/login|login)\/?$/.test(url.pathname)) return '/vocabulary';
    return `${url.pathname}${url.search}`;
  } catch { return '/vocabulary'; }
}
