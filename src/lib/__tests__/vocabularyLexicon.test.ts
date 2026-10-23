import { describe, expect, it } from 'vitest';
import { normalizeLexiconTerm, lexiconTermSchema, lexiconEntrySchema } from '../vocabularyLexicon';

export const entry = {
  headword: 'ground', kind: 'word', ipa: '/ɡraʊnd/',
  senses: [{ pos: 'verb', zh: '以事實為依據', en: 'To base something on evidence.', register: 'academic' }],
  collocations: ['ground a claim in evidence'], phrases: [{ phrase: 'ground in', zh: '以⋯⋯為依據' }],
  confusables: [{ word: 'grind', zh: '磨', note: 'Different vowel and meaning.' }], synonyms: ['base'], antonyms: [],
  examples: ['general', 'academic', 'technical'].map(context => ({ en: 'The decision was grounded in available evidence.', zh: '決策以現有證據為依據。', context })),
  usageNote: 'Often followed by in.',
};
describe('lexicon term normalization', () => {
  it('cleans surrounding punctuation and preserves hyphens and apostrophes', () => {
    expect(normalizeLexiconTerm(' “Execution–Grounded,” ')).toBe('Execution-Grounded');
    expect(lexiconTermSchema.parse('  take   into\n account. ')).toBe('take into account');
    expect(lexiconTermSchema.parse("don't")).toBe("don't");
  });
  it.each(['', '中文', 'hello<script>', 'a'.repeat(121), 'foo/bar', '123'])('rejects unsupported query %s', term => {
    expect(lexiconTermSchema.safeParse(term).success).toBe(false);
  });
});
describe('complete lexicon schema', () => {
  it('treats an empty optional IPA as absent', () => {
    expect(lexiconEntrySchema.parse({ ...entry, ipa: '  ' }).ipa).toBeUndefined();
  });
  it('accepts full bilingual entries', () => { expect(lexiconEntrySchema.parse(entry)).toEqual(entry); });
  it.each([{ senses: [] }, { examples: entry.examples.slice(0, 2) }, { phrases: undefined }, { senses: [{ pos: 'noun', zh: '', en: 'meaning' }] }, { synonyms: ['x'.repeat(121)] }])('rejects incomplete or oversized content', change => {
    expect(lexiconEntrySchema.safeParse({ ...entry, ...change }).success).toBe(false);
  });
});
