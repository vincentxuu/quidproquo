import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runEmbeddingSync } from '../embedding-sync.mjs'
const ok = (hasMore = false) => new Response(JSON.stringify({ ok: true, results: [{ source: 'posts', vectors: 1, deleted: 0, hasMore, errors: [] }] }))
function harness(responses, extra = {}) {
  const calls = [], delays = []
  return { calls, delays, run: () => runEmbeddingSync({ origin: 'https://example.test', secret: 'test', log: () => {}, sleep: async ms => delays.push(ms), fetch: async (_url, init) => { calls.push(JSON.parse(init.body)); const value = responses.shift(); if (value instanceof Error) throw value; assert.ok(value, 'unexpected request'); return value }, ...extra }) }
}
test('resource-limit failure shrinks the next request and retains the smaller limit', async () => {
  const h = harness([new Response('<span>1102</span>Worker exceeded resource limits', {status:503}),ok(true),ok()])
  await h.run(); assert.deepEqual(h.calls.map(x => x.limit), [20,10,10]); assert.deepEqual(h.delays,[500])
})
test('temporary network failures retry but authorization failures fail immediately', async () => {
  const h=harness([new TypeError('fetch failed'),ok()]);await h.run();assert.equal(h.calls.length,2)
  const denied=harness([new Response('no',{status:401})]);await assert.rejects(denied.run(),/401/);assert.equal(denied.calls.length,1)
})
test('permanent resource exhaustion terminates at the retry bound, never below one', async () => {
  const h=harness(Array.from({length:6},()=>new Response('1102 Worker exceeded resource limits',{status:503})))
  await assert.rejects(h.run(),/503/);assert.deepEqual(h.calls.map(x=>x.limit),[20,10,5,2,1,1]);assert.equal(h.delays.length,5)
})
test('an ambiguous full rebuild failure never repeats the reset', async () => {
 const h=harness([new Response('1102',{status:503})],{full:true});await assert.rejects(h.run(),/full|rebuild/i);assert.equal(h.calls.length,1)
})
test('retries after a confirmed reset do not reset checkpoints again', async () => {
 const h=harness([ok(true),new Response('1102',{status:503}),ok()],{full:true});await h.run();assert.deepEqual(h.calls.map(x=>x.full),[true,false,false])
})
test('batch budget counts successes, reports pending work, and bounds retries separately', async () => {
 const h=harness([new Response('unavailable',{status:503}),ok(true)],{maxBatches:1});const r=await h.run();assert.equal(r.batches,1);assert.equal(r.hasMore,true);assert.equal(h.calls.length,2)
})
test('honors bounded Retry-After on throttling without shrinking for ordinary errors', async () => {
 const h=harness([new Response('slow',{status:429,headers:{'Retry-After':'999'}}),ok()]);await h.run();assert.deepEqual(h.delays,[30000]);assert.deepEqual(h.calls.map(x=>x.limit),[20,20])
})
test('rejects semantic errors and malformed success without retrying or masking failure', async () => {
 for(const payload of [{ok:true,results:[]},{ok:true,results:[{source:'posts',errors:['bad chunk']}]},{ok:true,results:[{source:'posts',vectors:1,deleted:0,hasMore:'false'}]}]) {
 const h=harness([new Response(JSON.stringify(payload))]);await assert.rejects(h.run());assert.equal(h.calls.length,1)
 }
})
test('rejects invalid options before sending any request',async()=>{
 for(const extra of [{limit:0},{limit:501},{maxBatches:0},{maxRetries:-1}]){const h=harness([],extra);await assert.rejects(h.run());assert.equal(h.calls.length,0)}
})

test('stops retries when the overall time budget cannot cover backoff', async () => {
 const h=harness([new Response('busy',{status:503})],{maxDurationMs:100,now:()=>0});await assert.rejects(h.run(),/time budget/);assert.equal(h.calls.length,1);assert.deepEqual(h.delays,[])
})
test('does not acknowledge an empty batch with more pending work',async()=>{
 const h=harness([new Response(JSON.stringify({ok:true,results:[{source:'posts',vectors:0,deleted:0,hasMore:true,errors:[]}]}))]);await assert.rejects(h.run(),/no progress/)
})

test('CLI recovers against a real HTTP server and never logs its secret', async () => {
 const {createServer}=await import('node:http');const {spawn}=await import('node:child_process');const bodies=[]
 const server=createServer(async(req,res)=>{let body='';for await(const chunk of req)body+=chunk; bodies.push(JSON.parse(body));if(bodies.length===1){res.writeHead(503);res.end('1102 Worker exceeded resource limits')}else{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,results:[{source:'posts',vectors:1,deleted:0,errors:[],hasMore:false}]}))}})
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 try {
  const output=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/sync-embeddings-prod.mjs','--max-batches','1'],{env:{...process.env,WORKER_URL:`http://127.0.0.1:${server.address().port}`,INDEX_SYNC_SECRET:'fixture-secret',EMBED_SYNC_LIMIT:'20',EMBED_SYNC_MAX_RETRIES:'5',EMBED_SYNC_MAX_DURATION_MS:'10000'}});let text='';child.stdout.on('data',d=>text+=d);child.stderr.on('data',d=>text+=d);child.on('error',reject);child.on('close',code=>resolve({code,text}))})
  assert.equal(output.code,0,output.text);assert.match(output.text,/retry=1/);assert.match(output.text,/complete/);assert.ok(!output.text.includes('fixture-secret'));assert.deepEqual(bodies.map(x=>x.limit),[20,10])
 } finally {await new Promise(resolve=>server.close(resolve))}
})
