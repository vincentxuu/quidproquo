import { z } from 'zod';
import { addVocabulary, readVocabulary, reviewVocabularyCard, vocabularyId, type VocabularyCard, type VocabularySource, type ReviewRating } from './vocabulary';
import { lexiconEntrySchema, type LexiconEntry } from './vocabularyLexicon';

export const vocabularySourceSchema = z.object({
  context: z.string().max(10000), sourcePath: z.string().max(2000),
  sourceTitle: z.string().max(1000), lang: z.enum(['zh-TW', 'en']), originalTerm: z.string().max(120).optional(),
});
export function validateImportedCards(value: unknown): VocabularyCard[] {
  if (!Array.isArray(value) || value.length > 1000) throw new Error('Invalid vocabulary import.');
  const cards = readVocabulary({ getItem: () => JSON.stringify(value), setItem: () => {} });
  for (const card of cards) {
    if (card.term.length > 120 || card.definition.length > 10000 || card.context.length > 10000 || card.sourcePath.length > 2000 || card.sourceTitle.length > 1000 || !['en', 'zh-TW'].includes(card.lang)) throw new Error('Invalid vocabulary import.');
  }
  return cards;
}

/** Every query uses the verified Access subject, never an identity from request JSON. */
export class VocabularyRepository {
  constructor(private db: D1Database, private owner: string) {}
  async list(): Promise<VocabularyCard[]> {
    const rows = await this.db.prepare('SELECT card_json FROM vocabulary_cards WHERE owner_sub = ? ORDER BY created_at, card_id').bind(this.owner).all<{ card_json: string }>();
    return readVocabulary({ getItem: () => JSON.stringify(rows.results.map(row => JSON.parse(row.card_json))), setItem: () => {} });
  }
  async import(cards: VocabularyCard[]): Promise<void> {
    const valid = validateImportedCards(cards);
    if (!valid.length) return;
    await this.db.batch(valid.map(card => this.db.prepare('INSERT INTO vocabulary_cards (owner_sub, card_id, card_json, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(owner_sub, card_id) DO NOTHING').bind(this.owner, card.id, JSON.stringify(card), card.createdAt)));
  }
  private async change(id: string, update: (card: VocabularyCard) => VocabularyCard): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = await this.db.prepare('SELECT card_json FROM vocabulary_cards WHERE owner_sub = ? AND card_id = ?').bind(this.owner, id).first<{card_json:string}>();
      if (!row) throw new Response('Vocabulary card not found.', { status: 404 });
      const current = readVocabulary({ getItem: () => `[${row.card_json}]`, setItem: () => {} })[0];
      const next = update(current);
      const result = await this.db.prepare('UPDATE vocabulary_cards SET card_json = ? WHERE owner_sub = ? AND card_id = ? AND card_json = ?').bind(JSON.stringify(next), this.owner, id, row.card_json).run();
      if (result.meta.changes) return;
    }
    throw new Response('Vocabulary changed concurrently. Please retry.', { status: 409 });
  }
  async save(entryValue: LexiconEntry, source: VocabularySource, now = Date.now()): Promise<boolean> {
    const entry = lexiconEntrySchema.parse(entryValue);
    const cards = await this.list();
    const id = vocabularyId(entry.headword, source.lang);
    const originalId = vocabularyId(source.originalTerm ?? entry.headword, source.lang);
    const existing = cards.find(card => card.id === id || card.id === originalId);
    if (existing) { await this.attachEntry(existing.id, entry); return true; }
    const card = addVocabulary([], { term: entry.headword, definition: entry.senses[0].zh, context: source.context, sourcePath: source.sourcePath, sourceTitle: source.sourceTitle, lang: source.lang, entry }, now)[0];
    const result = await this.db.prepare('INSERT INTO vocabulary_cards (owner_sub, card_id, card_json, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(owner_sub, card_id) DO NOTHING').bind(this.owner, card.id, JSON.stringify(card), card.createdAt).run();
    return result.meta.changes === 0;
  }
  async attachEntry(id: string, entryValue: LexiconEntry): Promise<void> {
    const entry = lexiconEntrySchema.parse(entryValue);
    await this.change(id, card => ({ ...card, entry }));
  }
  async review(id: string, rating: ReviewRating, now = Date.now()): Promise<void> {
    await this.change(id, card => reviewVocabularyCard(card, rating, now));
  }
  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM vocabulary_cards WHERE owner_sub = ? AND card_id = ?').bind(this.owner, id).run();
  }
}
