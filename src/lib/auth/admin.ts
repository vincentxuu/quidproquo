import { verifySession } from './session'
import { accessConfigured, requireAccessIdentity } from './access'
import { unauthorized } from '../api/response'

export interface CookieReader {
  get(name: string): { value?: string } | undefined
}

export type RequireAdminResult = { ok: true } | { ok: false; response: Response }

export async function requireAdmin(cookies: CookieReader, request?: Request): Promise<RequireAdminResult> {
  if (accessConfigured()) {
    try {
      const verifiedRequest = request ?? new Request('https://quidproquo.cc/admin', { headers: { Cookie: `CF_Authorization=${cookies.get('CF_Authorization')?.value ?? ''}` } });
      await requireAccessIdentity(verifiedRequest);
      return { ok: true };
    } catch (error) {
      return { ok: false, response: error instanceof Response ? error : new Response('Authentication unavailable', { status: 503 }) };
    }
  }
  const token = cookies.get('session')?.value
  if (token && await verifySession(token)) {
    return { ok: true }
  }
  return { ok: false, response: unauthorized() }
}

/** Reject external targets, encoded authority separators, and login loops. */
export function adminReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]|%2f|%5c/i.test(value)) return '/admin';
  const url = new URL(value, 'https://quidproquo.cc');
  if (url.origin !== 'https://quidproquo.cc' || /^\/(?:login|auth\/login|api\/auth\/(?:login|logout))\/?$/.test(url.pathname)) return '/admin';
  return url.pathname + url.search;
}
