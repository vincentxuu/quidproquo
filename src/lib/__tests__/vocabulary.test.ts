import { describe, expect, it } from 'vitest';
import { addVocabulary, dueVocabulary, readVocabulary, saveVocabularyEntry, withVocabularyEntry, reviewVocabularyCard, STORAGE_KEY, vocabularyId, writeVocabulary, type VocabularyInput } from '../vocabulary';

const input: VocabularyInput = { term: ' compound  AI ', definition: '複合式 AI', context: 'Build compound AI systems.', sourcePath: '/posts/ai/example/', sourceTitle: 'Example', lang: 'en' };
const makeCard = () => addVocabulary([], input, 1000)[0];
const memory = () => {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
};
describe('vocabulary storage', () => {
  it('round trips cards and treats missing storage as an empty library', () => {
    const storage = memory();
    expect(readVocabulary(storage)).toEqual([]);
    writeVocabulary([makeCard()], storage);
    expect(readVocabulary(storage)).toEqual([makeCard()]);
  });
  it('rejects corrupt JSON without writing over it', () => {
    const storage = memory();
    storage.values.set(STORAGE_KEY, '{broken');
    expect(() => readVocabulary(storage)).toThrow();
    expect(storage.values.get(STORAGE_KEY)).toBe('{broken');
  });
  it.each([{}, [null], [{ ...makeCard(), dueAt: 'tomorrow' }], [{ ...makeCard(), id: 'bad' }], [{ ...makeCard(), repetitions: 1.5 }], [makeCard(), makeCard()]])('rejects invalid schema %j', (value) => {
    const storage = memory();
    storage.values.set(STORAGE_KEY, JSON.stringify(value));
    expect(() => readVocabulary(storage)).toThrow();
  });
  it('propagates access and quota errors', () => {
    const storage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('quota'); } };
    expect(() => readVocabulary(storage)).toThrow('blocked');
    expect(() => writeVocabulary([makeCard()], storage)).toThrow('quota');
  });
});
describe('vocabulary cards', () => {
  it('normalizes identity and deduplicates without resetting schedule or original source', () => {
    const existing = reviewVocabularyCard(makeCard(), 'easy', 2000);
    const cards = addVocabulary([existing], { ...input, term: ' COMPOUND AI ', sourcePath: '/new/' }, 5000);
    expect(vocabularyId(' compound\nAI ', 'en')).toBe('en:compound ai');
    expect(cards).toEqual([existing]);
    expect(makeCard().term).toBe('compound AI');
    expect(addVocabulary(cards, { ...input, lang: 'zh-TW' }, 5000)).toHaveLength(2);
  });
  it('rejects blank words and invalid timestamps', () => {
    expect(() => addVocabulary([], { ...input, term: ' ' })).toThrow();
    expect(() => addVocabulary([], input, Number.NaN)).toThrow();
  });
  it('schedules again in one minute, resets repetitions, and bounds ease', () => {
    const card = reviewVocabularyCard({ ...makeCard(), ease: 1.3, repetitions: 5 }, 'again', 1000);
    expect(card.dueAt).toBe(61000);
    expect(card.repetitions).toBe(0);
    expect(card.ease).toBe(1.3);
  });
  it('advances good reviews through one day, six days, then ease-based intervals', () => {
    const first = reviewVocabularyCard(makeCard(), 'good', 0);
    const second = reviewVocabularyCard(first, 'good', first.dueAt);
    const third = reviewVocabularyCard(second, 'good', second.dueAt);
    expect([first.interval, second.interval, third.interval]).toEqual([1, 6, 15]);
    expect(third.repetitions).toBe(3);
  });
  it('provides shorter hard and longer easy schedules', () => {
    expect(reviewVocabularyCard(makeCard(), 'hard', 0).interval).toBe(1);
    expect(reviewVocabularyCard(makeCard(), 'easy', 0).interval).toBe(4);
    expect(reviewVocabularyCard(makeCard(), 'hard', 0).ease).toBeLessThan(makeCard().ease);
  });
  it('selects due cards in order without mutating the library', () => {
    const early = makeCard();
    const later = { ...early, id: vocabularyId('later', 'en'), term: 'later', dueAt: 2000 };
    const future = { ...early, id: vocabularyId('future', 'en'), term: 'future', dueAt: 5000 };
    const cards = [future, later, early];
    expect(dueVocabulary(cards, 2000)).toEqual([early, later]);
    expect(cards[0]).toBe(future);
  });
});

const fullEntry = {
  headword: 'compound AI', kind: 'phrase' as const, ipa: '/ˈkɒmpaʊnd/',
  senses: [{pos: 'noun',zh: '複合式人工智慧',en: 'An AI system combining several components.'}],
  collocations: ['compound AI system'], phrases: [], confusables: [], synonyms: [], antonyms: [],
  examples: [
    {en: 'A compound AI system uses several models.',zh: '複合式人工智慧系統使用數個模型。'},
    {en: 'We evaluate compound AI systems.',zh: '我們評估複合式人工智慧系統。'},
    {en: 'Compound AI combines retrieval and generation.',zh: '複合式人工智慧結合檢索與生成。'},
  ],
};
describe('full vocabulary entries', () => {
  it('reads old cards without an entry and enriches them without losing notes or schedule', () => {
    const original = reviewVocabularyCard(makeCard(), 'good', 1000);
    const updated = withVocabularyEntry([original], original.id, fullEntry);
    expect(updated[0]).toEqual({...original,entry:fullEntry});
    expect(original.entry).toBeUndefined();
    const storage=memory();writeVocabulary(updated,storage);
    expect(readVocabulary(storage)[0].entry?.examples).toHaveLength(3);
  });
  it('saves a complete new entry and enriches duplicates while preserving progress', () => {
    const storage=memory();
    const source={context:input.context,sourcePath:input.sourcePath,sourceTitle:input.sourceTitle,lang:input.lang};
    expect(saveVocabularyEntry(fullEntry,source,storage,1000)).toEqual({alreadySaved:false});
    const reviewed=reviewVocabularyCard(readVocabulary(storage)[0],'good',2000);writeVocabulary([reviewed],storage);
    expect(saveVocabularyEntry(fullEntry,{...source,sourcePath:'/new'},storage,3000)).toEqual({alreadySaved:true});
    expect(readVocabulary(storage)).toEqual([reviewed]);
  });
  it('rejects incomplete entries without overwriting saved records', () => {
    const storage=memory();writeVocabulary([makeCard()],storage);const before=storage.values.get(STORAGE_KEY);
    expect(()=>saveVocabularyEntry({...fullEntry,senses:[]},input,storage)).toThrow();
    expect(storage.values.get(STORAGE_KEY)).toBe(before);
  });
});
