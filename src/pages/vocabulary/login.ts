import type { APIRoute } from 'astro';
import { requireVocabularyIdentity, vocabularyReturnTo } from '../../lib/vocabularyAccess';
export const prerender = false;
// This URL belongs to the protected Access application. The edge handles login;
// after successful authentication, resume the same-site article or collection.
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const returnTo = vocabularyReturnTo(url.searchParams.get('returnTo'), url.origin);
  try {
    await requireVocabularyIdentity(request);
    return new Response(null, { status: 302, headers: { Location: returnTo, 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return error instanceof Response ? error : new Response('登入服務暫時無法使用。', { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
};
