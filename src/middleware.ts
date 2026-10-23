import { defineMiddleware } from 'astro:middleware';
import { accessRoutePolicy } from './lib/auth/access-routes';

export const onRequest = defineMiddleware(async (context, next) => {
  const policy = accessRoutePolicy(context.url.pathname);
  if (policy === 'public' || policy === 'machine') return next();
  // Public pages prerender in Node; load Workers bindings only for protected routes.
  const { accessConfigured, accessReturnTo, requireAccessIdentity } = await import('./lib/auth/access');
  if (!accessConfigured()) return next();
  try {
    await requireAccessIdentity(context.request);
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(context.request.method)
      && (context.request.headers.get('Origin') !== context.url.origin || context.request.headers.get('Sec-Fetch-Site') === 'cross-site')) {
      return new Response(JSON.stringify({ error: '不允許跨網站修改私人資料。' }), { status: 403, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' } });
    }
    const response = await next();
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.append('Vary', 'Cookie');
    return response;
  } catch (error) {
    if (error instanceof Response) {
      if (policy === 'page' && error.status === 401 && !/^\/auth\/login\/?$/.test(context.url.pathname)) {
        const target = accessReturnTo(context.url.pathname + context.url.search, context.url.origin);
        return new Response(null, { status: 302, headers: { Location: `/auth/login?returnTo=${encodeURIComponent(target)}`, 'Cache-Control': 'private, no-store' } });
      }
      return error;
    }
    return new Response('登入服務暫時無法使用。', { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
});
