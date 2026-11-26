import { lexiconEntrySchema, lexiconTermSchema, type LexiconEntry } from './vocabularyLexicon';

/** Probe shared entries before asking the existing model service to generate one. */
export async function lookupVocabularyEntry(term: string, context = '', signal?: AbortSignal): Promise<LexiconEntry> {
  const normalized = lexiconTermSchema.safeParse(term);
  if (!normalized.success) throw new Error('請輸入英文單字或片語（最多 120 字元）。');
  let response: Response | undefined;
  try { response = await fetch(`/api/lexicon?q=${encodeURIComponent(normalized.data)}&depth=full`, { signal }); }
  catch (error) { if (signal?.aborted) throw error; }
  if (!response || response.status === 404) {
    response = await fetch('/api/lexicon', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: normalized.data, context: context.slice(0, 1000) }), signal,
    });
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error : '查詞服務目前無法使用，請再試一次。';
    throw new Error(message);
  }
  const parsed = lexiconEntrySchema.safeParse(data && typeof data === 'object' && 'entry' in data ? data.entry : undefined);
  if (!parsed.success) throw new Error('詞條內容不完整，請再試一次。');
  return parsed.data;
}
