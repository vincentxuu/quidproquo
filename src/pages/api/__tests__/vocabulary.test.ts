import { beforeEach, describe, it, expect, vi } from 'vitest';
import { env } from 'cloudflare:workers';
import { GET, POST } from '../vocabulary';
import { addVocabulary, type VocabularyCard } from '../../../lib/vocabulary';
const { identity } = vi.hoisted(() => ({identity:vi.fn()}));
vi.mock('../../../lib/auth/access', () => ({requireAccessIdentity:identity}));
function fakeVocabularyDb() {
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

const workerEnv = env as Record<string,unknown>;
const card = addVocabulary([], {term:'hello',definition:'你好',context:'',sourcePath:'/post',sourceTitle:'Post',lang:'en'},100)[0];
function request(body:unknown, origin='https://quidproquo.cc') { return new Request('https://quidproquo.cc/api/vocabulary',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)}); }
const call = (body:unknown,origin?:string) => POST({request:request(body,origin)} as never);
beforeEach(()=> { identity.mockReset().mockResolvedValue({sub:'alice'}); workerEnv.DB = fakeVocabularyDb().db; });
describe('vocabulary API',()=> {
  it('requires verified identity before reading DB',async()=> { identity.mockRejectedValue(new Response('',{status:401})); expect((await GET({request:new Request('https://quidproquo.cc/api/vocabulary')} as never)).status).toBe(401); });
  it('rejects cross-origin mutations',async()=> {expect((await call({action:'import',cards:[card]},'https://attacker.example')).status).toBe(403);});
  it('imports once and keeps server review progress on repeated import',async()=> {
    expect((await call({action:'import',cards:[card]})).status).toBe(200);
    const response = await call({action:'review',id:card.id,rating:'good',now:0,owner_sub:'bob'});
    const {cards} = await response.json() as {cards:VocabularyCard[]}; expect(cards[0].repetitions).toBe(1); expect(cards[0].dueAt).toBeGreaterThan(Date.now());
    expect((await (await call({action:'import',cards:[card]})).json() as {cards:VocabularyCard[]}).cards[0].repetitions).toBe(1);
    identity.mockResolvedValue({sub:'bob'}); expect((await (await GET({request:new Request('https://quidproquo.cc/api/vocabulary')} as never)).json() as {cards:VocabularyCard[]}).cards).toEqual([]);
  });
  it.each([{action:'replace',cards:[]},{action:'review',id:card.id,rating:'bad'},{action:'import',cards:[{...card,id:'wrong'}]}])('rejects invalid operations %j',async body=> { expect((await call(body)).status).toBe(400); });
  it('bounds request bytes before parsing',async()=> { const req=request({}); req.headers.set('content-length','2000001'); expect((await POST({request:req} as never)).status).toBe(413); });
  it('does not cache personal responses',async()=> {const res=await GET({request:new Request('https://quidproquo.cc/api/vocabulary')} as never); expect(res.headers.get('Cache-Control')).toBe('private, no-store');});
  it('reports missing DB without leaking details',async()=> {delete workerEnv.DB; expect((await call({action:'import',cards:[]})).status).toBe(503);});
});
