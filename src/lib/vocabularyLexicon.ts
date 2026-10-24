import { z } from 'zod';

/** Normalize surrounding article punctuation without destroying phrasal punctuation. */
export function normalizeLexiconTerm(value: string): string {
  return value.normalize('NFKC').replace(/[‐‑‒–—]/g, '-').replace(/[‘’]/g, "'")
    .trim().replace(/^[\s"“”'([{.,;:!?]+|[\s"“”')\]}.,;:!?]+$/g, '').replace(/\s+/g, ' ');
}

export const lexiconTermSchema = z.string().transform(normalizeLexiconTerm).pipe(
  z.string().min(1).max(120).regex(/^[A-Za-z]+(?:['-][A-Za-z]+)*(?: [A-Za-z]+(?:['-][A-Za-z]+)*)*$/, '請選取英文單字或片語。'),
);
const text = (max: number) => z.string().trim().min(1).max(max);
export const lexiconEntrySchema = z.object({
  headword: text(120),
  kind: z.enum(['word', 'phrase']),
  ipa: z.preprocess(value => typeof value === 'string' && !value.trim() ? undefined : value, text(160).optional()),
  senses: z.array(z.object({
    pos: text(80), zh: text(600), en: text(600),
    register: z.enum(['formal', 'informal', 'technical', 'academic']).optional(),
  })).min(1).max(12),
  collocations: z.array(text(200)).max(12),
  phrases: z.array(z.object({ phrase: text(200), zh: text(400) })).max(12),
  confusables: z.array(z.object({ word: text(120), zh: text(400), note: text(600) })).max(8),
  synonyms: z.array(text(120)).max(12),
  antonyms: z.array(text(120)).max(12),
  examples: z.array(z.object({
    en: text(1000), zh: text(1000),
    context: z.enum(['general', 'academic', 'technical', 'exam']).optional(),
  })).min(3).max(8),
  usageNote: text(1200).optional(),
});
export type LexiconEntry = z.infer<typeof lexiconEntrySchema>;
