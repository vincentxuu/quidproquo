import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import AskAiProvider, { parseAskAiSseChunks } from './providers/ask-ai.mjs'

test('parses Ask AI SSE across arbitrary chunk boundaries', () => {
  const result = parseAskAiSseChunks([
    'event: token\r\ndata: {"text":"課程"}\r\n\r',
    '\nevent: agent_step\ndata: {"agent":"Research","status":"completed"}\n\n',
    'event: sources\ndata: [{"title":"Stanford","url":"https://quidproquo.cc/posts/learning/stanford","slug":"learning/stanford"}]\n\n',
    'event: done\ndata: {"confidence":0.9,"usage":{"input":10,"output":2},"thread_id":"t1"}\n\n',
  ])

  assert.equal(result.answer, '課程')
  assert.equal(result.sources.length, 1)
  assert.equal(result.agentSteps[0].agent, 'Research')
  assert.equal(result.done.thread_id, 't1')
})

test('rejects malformed SSE JSON instead of silently passing', () => {
  assert.throws(
    () => parseAskAiSseChunks(['event: token\ndata: {bad json}\n\n']),
    /Invalid Ask AI SSE JSON/,
  )
})

test('loads the contract fixture through the custom provider', async () => {
  const provider = new AskAiProvider({
    id: 'fixture',
    config: { fixturePath: path.resolve('docs/rag-golden-fixture.json') },
  })
  const result = await provider.callApi('有哪些課程文章', { vars: { caseId: 'q21', query: '有哪些課程文章' } })

  assert.equal(result.error, undefined)
  assert.match(result.output, /Stanford/)
  assert.equal(result.metadata.fixture, true)
  assert.equal(result.metadata.evidenceKind, 'offline-fixture')
  assert.equal(result.metadata.sourceDatasetId, 'quidproquo-ask-ai-golden')
  assert.equal(result.metadata.uniqueSourceCount, 4)
  assert.equal(result.metadata.cached, false)
})

test('requires an admin cookie for live evaluation', async () => {
  const previousCookie = process.env.RAG_EVAL_COOKIE
  delete process.env.RAG_EVAL_COOKIE
  try {
    const provider = new AskAiProvider({ id: 'live', config: { baseUrl: 'https://quidproquo.cc' } })
    const result = await provider.callApi('有哪些課程文章', { vars: { caseId: 'q21', query: '有哪些課程文章' } })
    assert.match(result.error, /RAG_EVAL_COOKIE is required/)
  } finally {
    if (previousCookie === undefined) delete process.env.RAG_EVAL_COOKIE
    else process.env.RAG_EVAL_COOKIE = previousCookie
  }
})

test('sends an authenticated live evaluation with cache bypass', async () => {
  const originalFetch = globalThis.fetch
  let requestBody
  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init?.body ?? '{}'))
    return new Response([
      'event: token\ndata: {"text":"四篇課程"}\n\n',
      'event: done\ndata: {"cached":false,"thread_id":"t-live"}\n\n',
    ].join(''), {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }

  try {
    const provider = new AskAiProvider({
      id: 'live',
      config: { baseUrl: 'https://quidproquo.cc', cookie: 'session=test-admin' },
    })
    const result = await provider.callApi('有哪些課程文章', { vars: { caseId: 'q21', query: '有哪些課程文章' } })

    assert.equal(result.error, undefined)
    assert.equal(requestBody.traceScope, 'eval')
    assert.equal(requestBody.cacheMode, 'bypass')
    assert.equal(result.metadata.cached, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
