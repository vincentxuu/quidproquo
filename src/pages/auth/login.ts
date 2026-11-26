import type { APIRoute } from 'astro';
import { requireAccessIdentity, accessReturnTo } from '../../lib/auth/access';
export const prerender = false;
// This URL belongs to the protected Access application. The edge handles login;
// after successful authentication, resume the same-site article or collection.
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const returnTo = accessReturnTo(url.searchParams.get('returnTo'), url.origin);
  try {
    await requireAccessIdentity(request);
    return new Response(null, { status: 302, headers: { Location: returnTo, 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return error instanceof Response ? error : new Response('登入服務暫時無法使用。', { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
};
