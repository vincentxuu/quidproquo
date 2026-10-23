import { lexiconEntrySchema, type LexiconEntry } from './vocabularyLexicon';

/** Vocabulary stays in this browser; no account or server upload is involved. */
export const STORAGE_KEY = 'qp-vocabulary-v1';
export type VocabularyStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
export interface VocabularyCard {
  id: string;
  term: string;
  definition: string;
  context: string;
  sourcePath: string;
  sourceTitle: string;
  lang: string;
  createdAt: number;
  dueAt: number;
  /** Review interval in days. */
  interval: number;
  repetitions: number;
  ease: number;
  entry?: LexiconEntry;
}
export type VocabularyInput = Pick<VocabularyCard,
  'term' | 'definition' | 'context' | 'sourcePath' | 'sourceTitle' | 'lang' | 'entry'>;
const DAY = 86_400_000;
const cleanTerm = (term: string) => term.trim().replace(/\s+/g, ' ');
export const vocabularyId = (term: string, lang: string): string =>
  `${lang.trim().toLowerCase()}:${cleanTerm(term).toLowerCase()}`;

function getStorage(storage?: VocabularyStorage): VocabularyStorage {
  if (storage) return storage;
  if (typeof localStorage === 'undefined') throw new Error('Vocabulary storage is unavailable.');
  return localStorage;
}
function isCard(value: unknown): value is VocabularyCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Record<string, unknown>;
  const strings = ['id', 'term', 'definition', 'context', 'sourcePath', 'sourceTitle', 'lang'];
  if (!strings.every((key) => typeof card[key] === 'string')) return false;
  if (!cleanTerm(card.term as string) || !(card.lang as string).trim()) return false;
  if (card.id !== vocabularyId(card.term as string, card.lang as string)) return false;
  if (!['createdAt', 'dueAt', 'interval', 'repetitions', 'ease'].every(
    (key) => typeof card[key] === 'number' && Number.isFinite(card[key]) && (card[key] as number) >= 0,
  )) return false;
  if (card.entry !== undefined && !lexiconEntrySchema.safeParse(card.entry).success) return false;
  return Number.isInteger(card.repetitions) && (card.ease as number) >= 1.3;
}
function validateCards(value: unknown): asserts value is VocabularyCard[] {
  if (!Array.isArray(value) || !value.every(isCard) || new Set(value.map((card) => card.id)).size !== value.length) {
    throw new Error('Vocabulary data is invalid. Your saved data has not been changed.');
  }
}
export function readVocabulary(storage?: VocabularyStorage): VocabularyCard[] {
  const raw = getStorage(storage).getItem(STORAGE_KEY);
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  validateCards(parsed);
  return parsed;
}
export function writeVocabulary(cards: VocabularyCard[], storage?: VocabularyStorage): void {
  validateCards(cards);
  getStorage(storage).setItem(STORAGE_KEY, JSON.stringify(cards));
}
export function addVocabulary(cards: VocabularyCard[], input: VocabularyInput, now = Date.now()): VocabularyCard[] {
  validateCards(cards);
  const term = cleanTerm(input.term);
  const lang = input.lang.trim();
  if (!term || !lang) throw new Error('A word and language are required.');
  const id = vocabularyId(term, lang);
  if (cards.some((card) => card.id === id)) return [...cards];
  const card: VocabularyCard = {
    ...input, term, lang, id, createdAt: now, dueAt: now, interval: 0, repetitions: 0, ease: 2.5,
  };
  validateCards([card]);
  return [...cards, card];
}
export function reviewVocabularyCard(card: VocabularyCard, rating: ReviewRating, now = Date.now()): VocabularyCard {
  validateCards([card]);
  if (!Number.isFinite(now) || now < 0) throw new Error('Invalid review time.');
  let interval: number;
  let repetitions = card.repetitions + 1;
  let ease = card.ease;
  switch (rating) {
    case 'again': interval = 1 / 1440; repetitions = 0; ease = Math.max(1.3, ease - 0.2); break;
    case 'hard': interval = Math.max(1, card.interval * 1.2); ease = Math.max(1.3, ease - 0.15); break;
    case 'good': interval = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 6 : Math.max(1, Math.round(card.interval * ease)); break;
    case 'easy': interval = Math.max(4, Math.round(card.interval * ease * 1.3)); ease += 0.15; break;
    default: throw new Error('Invalid review rating.');
  }
  return { ...card, interval, repetitions, ease, dueAt: now + interval * DAY };
}
export function dueVocabulary(cards: VocabularyCard[], now = Date.now()): VocabularyCard[] {
  return cards.filter((card) => card.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt || a.createdAt - b.createdAt);
}

/** Attach a full entry without changing the original note, source, or review state. */
export function withVocabularyEntry(cards: VocabularyCard[], id: string, value: LexiconEntry): VocabularyCard[] {
  validateCards(cards);
  const entry = lexiconEntrySchema.parse(value);
  return cards.map(card => card.id === id ? { ...card, entry } : card);
}
export type VocabularySource = Pick<VocabularyCard, 'context' | 'sourcePath' | 'sourceTitle' | 'lang'> & { originalTerm?: string };
export function saveVocabularyEntry(value: LexiconEntry, source: VocabularySource, storage?: VocabularyStorage, now = Date.now()): { alreadySaved: boolean } {
  const entry = lexiconEntrySchema.parse(value);
  const cards = readVocabulary(storage);
  const id = vocabularyId(entry.headword, source.lang);
  const originalId = vocabularyId(source.originalTerm ?? entry.headword, source.lang);
  const existing = cards.find(card => card.id === id || card.id === originalId);
  const updated = existing ? withVocabularyEntry(cards, existing.id, entry) : addVocabulary(cards, {
    term: entry.headword, definition: entry.senses[0].zh, context: source.context,
    sourcePath: source.sourcePath, sourceTitle: source.sourceTitle, lang: source.lang, entry,
  }, now);
  writeVocabulary(updated, storage);
  return { alreadySaved: !!existing };
}
