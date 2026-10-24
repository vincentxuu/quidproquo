import { describe, it, expect } from 'vitest';
import { VocabularyRepository, validateImportedCards } from '../vocabularyRepository';
import { lexiconEntrySchema } from '../vocabularyLexicon';
import { addVocabulary } from '../vocabulary';

export function fakeVocabularyDb() {
  const rows = new Map<string, {card_json:string;created_at:number}>();
  const queries: {sql:string;args:unknown[]}[] = [];
  const db = {
    prepare(sql:string) { return { bind(...args:unknown[]) {
      queries.push({sql,args});
      return {
        async all() { return {results:[...rows.entries()].filter(([key]) => key.startsWith(`${args[0]}|`)).map(([,v]) => v)}; },
        async first() { return rows.get(`${args[0]}|${args[1]}`) ?? null; },
        async run() {
          let changes = 0;
          if (sql.startsWith('INSERT')) { const key = `${args[0]}|${args[1]}`; if (!rows.has(key)) { rows.set(key, {card_json:args[2] as string,created_at:args[3] as number}); changes = 1; } }
          if (sql.startsWith('UPDATE')) { const key = `${args[1]}|${args[2]}`; const old = rows.get(key); if (old && old.card_json === args[3]) { rows.set(key,{...old,card_json:args[0] as string}); changes = 1; } }
          if (sql.startsWith('DELETE')) changes = Number(rows.delete(`${args[0]}|${args[1]}`));
          return {meta:{changes}};
        },
      };
    } }; },
    async batch(statements:{run:()=>Promise<unknown>}[]) { return Promise.all(statements.map(s => s.run())); },
  };
  return {db:db as unknown as D1Database,queries,rows};
}
const card = () => addVocabulary([], {term:'hello',definition:'你好',context:'Hello there.',sourcePath:'/post',sourceTitle:'Post',lang:'en'}, 100)[0];
describe('per-user vocabulary repository', () => {
  it('isolates list, review and delete by verified owner', async () => {
    const {db,queries} = fakeVocabularyDb(); const alice = new VocabularyRepository(db,'alice'); const bob = new VocabularyRepository(db,'bob');
    await alice.import([card()]); await bob.import([card()]);
    await alice.review('en:hello','good',200);
    expect((await alice.list())[0].repetitions).toBe(1); expect((await bob.list())[0].repetitions).toBe(0);
    await alice.delete('en:hello'); expect(await alice.list()).toEqual([]); expect(await bob.list()).toHaveLength(1);
    expect(queries.filter(q=>q.sql.startsWith('UPDATE')||q.sql.startsWith('DELETE')).every(q=>q.sql.includes('owner_sub = ? AND card_id = ?'))).toBe(true);
  });
  it('repeated import cannot overwrite newer cloud review state', async () => {
    const {db} = fakeVocabularyDb(); const repo = new VocabularyRepository(db,'alice');
    await repo.import([card()]); await repo.review('en:hello','easy',200); await repo.import([card()]);
    const saved = (await repo.list())[0]; expect(saved.repetitions).toBe(1); expect(saved.interval).toBe(4); expect(saved.definition).toBe('你好');
  });
  it('returns 404 instead of changing another owner card', async () => {
    const {db} = fakeVocabularyDb(); await new VocabularyRepository(db,'bob').import([card()]);
    await expect(new VocabularyRepository(db,'alice').review('en:hello','good')).rejects.toMatchObject({status:404});
  });
  it('saving a canonical entry enriches original card without replacing notes or schedule', async () => {
    const {db} = fakeVocabularyDb(); const repo = new VocabularyRepository(db,'alice');
    const original = {...card(),term:'grounded',id:'en:grounded',definition:'my private note'};
    await repo.import([original]); await repo.review(original.id,'easy',200);
    const entry = lexiconEntrySchema.parse({headword:'ground',kind:'word',senses:[{pos:'verb',zh:'依據',en:'To base on evidence.'}],collocations:[],phrases:[],confusables:[],synonyms:[],antonyms:[],examples:[1,2,3].map(()=>({en:'Ground the claim in evidence.',zh:'以證據支持主張。'}))});
    expect(await repo.save(entry,{context:'new',sourcePath:'/new',sourceTitle:'New',lang:'en',originalTerm:'grounded'})).toBe(true);
    const saved = (await repo.list())[0]; expect(saved.id).toBe(original.id); expect(saved.definition).toBe('my private note'); expect(saved.interval).toBe(4); expect(saved.sourcePath).toBe('/post'); expect(saved.entry).toEqual(entry);
  });
  it('retries concurrent review updates without losing either review', async () => {
    const {db,queries} = fakeVocabularyDb(); const repo = new VocabularyRepository(db,'alice');
    await repo.import([card()]);
    await Promise.all([repo.review('en:hello','good',200),repo.review('en:hello','good',300)]);
    const saved = (await repo.list())[0]; expect(saved.repetitions).toBe(2); expect(saved.interval).toBe(6);
    expect(queries.filter(q=>q.sql.startsWith('UPDATE'))).toHaveLength(3);
  });
  it('rejects corrupt stored cards instead of returning partial personal data', async () => {
    const {db,rows} = fakeVocabularyDb(); const repo = new VocabularyRepository(db,'alice');
    rows.set('alice|en:hello',{card_json:JSON.stringify({...card(),repetitions:-1}),created_at:100});
    await expect(repo.list()).rejects.toThrow('Vocabulary data is invalid');
    await expect(repo.review('en:hello','good',200)).rejects.toThrow('Vocabulary data is invalid');
  });
  it('rejects invalid or oversized imports', () => {
    expect(()=>validateImportedCards([{...card(),id:'other'}])).toThrow();
    expect(()=>validateImportedCards(Array.from({length:1001},card))).toThrow();
    expect(()=>validateImportedCards([{...card(),definition:'x'.repeat(10001)}])).toThrow();
  });
});
