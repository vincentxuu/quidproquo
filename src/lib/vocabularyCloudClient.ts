import { readVocabulary, type ReviewRating, type VocabularyCard, type VocabularySource } from './vocabulary';
import type { LexiconEntry } from './vocabularyLexicon';

export class VocabularyCloudError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = 'VocabularyCloudError'; }
}
export function vocabularyLoginUrl(returnTo = typeof location === 'undefined' ? '/vocabulary' : location.pathname + location.search): string {
  const safe = returnTo.startsWith('/') && !returnTo.startsWith('//') && !/[\\\r\n]/.test(returnTo) ? returnTo : '/vocabulary';
  return `/auth/login?returnTo=${encodeURIComponent(safe)}`;
}
type Mutation = { action: 'save'; entry: LexiconEntry; source: VocabularySource } | { action: 'import'; cards: VocabularyCard[] } | { action: 'entry'; id: string; entry: LexiconEntry } | { action: 'review'; id: string; rating: ReviewRating } | { action: 'delete'; id: string };
type Result = { cards: VocabularyCard[]; alreadySaved?: boolean };
async function request(body?: Mutation, signal?: AbortSignal): Promise<Result> {
  const response = await fetch('/api/vocabulary', { method: body ? 'POST' : 'GET', credentials: 'same-origin', redirect: 'manual', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, signal });
  if (response.type === 'opaqueredirect' || response.status === 0 || (response.status >= 300 && response.status < 400) || (response.status === 403 && !response.headers.get('content-type')?.includes('application/json'))) {
    throw new VocabularyCloudError('請先登入，才能使用雲端單字庫。', 401);
  }
  if (!response.ok) {
    const raw: unknown = await response.json().catch(() => ({}));
    const payload = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    throw new VocabularyCloudError(response.status === 401 ? '請先登入，才能使用雲端單字庫。' : typeof payload.error === 'string' ? payload.error : '雲端單字庫暫時無法使用，請稍後再試。', response.status);
  }
  const raw: unknown = await response.json();
  if (!raw || typeof raw !== 'object') throw new Error('Vocabulary data is invalid.');
  const value = raw as Record<string, unknown>;
  // Reuse strict legacy validation without reading or writing the real browser store.
  const cards = readVocabulary({ getItem: () => JSON.stringify(value.cards), setItem: () => { throw new Error('Read only'); } });
  return { cards, ...(typeof value.alreadySaved === 'boolean' ? { alreadySaved: value.alreadySaved } : {}) };
}
export const fetchCloudVocabulary = (signal?: AbortSignal) => request(undefined, signal);
export const mutateCloudVocabulary = (body: Mutation, signal?: AbortSignal) => request(body, signal);
