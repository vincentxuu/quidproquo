# Cloudflare Edge Platform and AI Stack Content Plan

Last updated: 2026-08-30

## Goal

Split the existing Cloudflare coverage into two reader-facing paths:

- **Cloudflare Edge Platform**: for readers who want to run a website or app on Cloudflare and understand how to make it fast, stable, and cheap.
- **Cloudflare AI Stack**: for readers who want to build AI, RAG, or agent applications on Cloudflare without managing separate inference, search, browser, sandbox, or secret infrastructure.

The two paths are intentionally not mutually exclusive. A post can have one canonical `series` and also appear in the other path through `additionalSeries`, which is already supported by `src/content.config.ts`.

## Current Inventory

Existing posts currently sit under `Cloudflare 邊緣tech stack`:

| order | post | current fit |
|---:|---|---|
| 1 | Cloudflare Workers：不是 Lambda，不是容器，是 V8 Isolate | Edge Platform core |
| 2 | Cloudflare D1：跑在邊緣的 SQLite 關聯式資料庫 | Edge Platform / AI data |
| 3 | Cloudflare KV：全球邊緣的 Key-Value Store | Edge Platform / AI cache |
| 4 | Cloudflare R2：零 Egress 費用的 S3 替代方案 | Edge Platform / AI object storage |
| 5 | Hono：為 Edge Runtime 而生的輕量 Web Framework | Edge Platform app framework |
| 6 | @opennextjs/cloudflare：把 Next.js 跑在 Cloudflare Workers 上 | Edge Platform framework adapter |
| 7 | Cloudflare Workers AI binding 全貌：不只是 run() | AI Stack core |
| 8 | Cloudflare Workers AI 模型選型指南：依用途、價格與 context 挑模型 | AI Stack model selection |
| 9 | Gemma on Cloudflare Workers AI：繁中應用的務實選擇 | AI Stack model case study |
| 10 | Cloudflare Free Plan 設維護頁：Custom Error Pages 不能用，改用 Worker | Edge Platform production pattern |
| 11 | Cloudflare Workers 綁定自訂網域的正確寫法 | Edge Platform deployment pitfall |
| 12 | Astro + Cloudflare Workers：Native Module 在 Prerender Route 也會讓 Build 炸掉 | Edge Platform build pitfall |
| 14 | Cloudflare AI Search 怎麼用：資料來源、混合檢索與 Workers 綁定的完整解析 | AI Stack / Data |

## Series A: Cloudflare Edge Platform

Target reader: builders moving a website, product backend, or internal app onto Cloudflare.

Reader question: **How do I run a product on Cloudflare, keep it stable, and avoid unnecessary infrastructure?**

Arc: compute -> app framework -> data -> state and async work -> production delivery -> protection and observability -> escape hatches.

| order | topic | focus question | status | primary sources |
|---:|---|---|---|---|
| 0 | Series overview | What belongs in the Edge Platform path, and when should I not use Cloudflare? | drafted 2026-08-30 | Cloudflare Developer Docs |
| 1 | Workers | Why is Workers not Lambda or a container? | existing | Workers docs |
| 2 | Hono | What does an edge-native web framework change? | existing | Hono docs, Workers docs |
| 3 | OpenNext on Cloudflare | How does Next.js SSR map onto Workers and Assets? | existing | OpenNext Cloudflare docs |
| 4 | D1 | When is SQLite-at-the-edge enough? | existing | D1 docs |
| 5 | KV | When is eventually consistent global KV the right shape? | existing | KV docs |
| 6 | R2 | When should object storage live beside Workers? | existing | R2 docs |
| 7 | Durable Objects | How does serverless get state, coordination, and WebSockets? | updated 2026-08-30 | Durable Objects docs |
| 8 | Queues | How do I move slow or bursty work out of requests? | updated 2026-08-30 | Queues docs |
| 9 | Workflows | When do I need durable multi-step execution instead of a queue? | drafted 2026-08-30 | Workflows docs |
| 10 | Hyperdrive | How do Workers connect to existing Postgres/MySQL without giving up global latency? | drafted 2026-08-30 | Hyperdrive docs |
| 11 | Cache Rules | What should Cloudflare cache, and what must stay dynamic? | drafted 2026-08-30 | Cache docs |
| 12 | Smart Shield | How do I reduce origin traffic and protect the origin during spikes? | drafted 2026-08-30 | Smart Shield docs |
| 13 | Images | How do I build image resize/format/variant delivery without maintaining thumbnails? | drafted 2026-08-30 | Images docs |
| 14 | Email Service | How do Workers send transactional email and handle inbound email? | drafted 2026-08-30 | Email Service docs |
| 15 | Turnstile | How do I protect forms and public endpoints without classic CAPTCHA? | drafted 2026-08-30 | Turnstile docs |
| 16 | Observability and Analytics Engine | What should I log, what should I count, and where do those signals live? | drafted 2026-08-30 | Workers observability, Analytics Engine, GraphQL Analytics API |
| 17 | Browser Run | When should a Worker control a real browser for rendering, scraping, screenshots, or PDFs? | drafted 2026-08-30 | Browser Run docs |
| 18 | Containers | What happens when Workers is too constrained and I need Linux/container runtime behavior? | drafted 2026-08-30 | Containers docs |
| 19 | Production pitfalls appendix | Custom domains, maintenance pages, native-module build failures | drafted 2026-08-30 | existing posts, Workers docs |

### Edge Platform Cliff Handling

- **D1/KV/R2 -> Durable Objects**: readers may think all storage is interchangeable. The DO post must explicitly separate per-entity coordination from queryable storage and object storage.
- **Queues -> Workflows**: both are background-ish. The Queues post should end with a clear handoff: queues move work; workflows remember a multi-step process.
- **Cache Rules -> Smart Shield**: Cache Rules are request/content policy; Smart Shield is origin protection architecture. Do not duplicate cache basics.
- **Browser Run -> Containers**: Browser Run is managed headless Chrome; Containers are arbitrary runtime escape hatches.

## Series B: Cloudflare AI Stack

Target reader: builders shipping AI, RAG, or agent features on Cloudflare.

Reader question: **How do I build an AI app on Cloudflare without owning the inference, retrieval, browser, sandbox, and secret-management stack myself?**

Arc: inference -> model choice -> gateway control -> retrieval -> agent runtime -> tools -> production control.

| order | topic | focus question | status | primary sources |
|---:|---|---|---|---|
| 0 | Series overview | What does Cloudflare actually provide for AI apps? | drafted 2026-08-30 | Cloudflare AI docs |
| 1 | Workers AI binding | What can `env.AI` do besides `run()`? | existing | Workers AI docs |
| 2 | Workers AI model guide | Which model should I choose for chat, embedding, vision, rerank, and cost? | existing, needs regular refresh | Workers AI models, pricing, changelog |
| 3 | Gemma on Workers AI | What did the Gemma 3 -> Gemma 4 migration teach for Traditional Chinese RAG? | existing, minor tone refresh later | Gemma model pages |
| 4 | AI Gateway | How do I observe, cache, rate-limit, retry, and fallback AI calls across providers? | drafted 2026-08-30 | AI Gateway docs |
| 5 | AI Search | When should I use Cloudflare's managed RAG pipeline? | existing, migrated 2026-08-30 | AI Search docs |
| 6 | Vectorize | When should I build retrieval myself instead of using AI Search? | drafted 2026-08-30 | Vectorize docs |
| 7 | Agents | What does Cloudflare provide for durable agent identity, sessions, tools, and real-time channels? | drafted 2026-08-30 | Agents docs |
| 8 | Agent Memory | What should be stored as memory, and how is that different from RAG documents? | drafted 2026-08-30 | Agent Memory docs |
| 9 | Browser Run for agents | When does an agent need a browser instead of HTTP fetch? | cross-listed 2026-08-30 | Browser Run docs |
| 10 | Sandbox SDK | How do I let an agent execute code without giving it the main system? | existing, migrated 2026-08-30 | Sandbox docs |
| 11 | Secrets Store | How do I manage provider keys and BYOK across Workers and AI Gateway? | drafted 2026-08-30 | Secrets Store docs |
| 12 | D1/R2/DO for AI apps | Where should conversations, artifacts, blobs, locks, and eval traces live? | drafted 2026-08-30 | D1, R2, Durable Objects docs |
| 13 | AI production patterns | How do Gateway, logs, evals, rate limits, and feature flags fit together? | optional synthesis | AI Gateway, Analytics Engine, Flagship |

### AI Stack Cliff Handling

- **Workers AI -> AI Gateway**: model inference and model control are separate. Gateway is not a model host; it is the policy and observability layer.
- **AI Search -> Vectorize**: managed RAG vs self-built retrieval must be the main contrast. Do not make Vectorize a generic vector database explainer only.
- **Agents -> Durable Objects**: the agent post should explain the runtime at the product level, then link to DO for the underlying state/coordination primitive.
- **Agent Memory -> RAG**: memory is user/session/persona knowledge; RAG is document retrieval. Keep the boundary explicit.
- **Browser Run -> Sandbox SDK**: browsing the web and executing code are different tool risks.

## Cross-Listing Rules

Use `series` for the post's main reader question and `additionalSeries` for the other path when the post is genuinely useful there.

| post | canonical series | additional series |
|---|---|---|
| Workers | Cloudflare Edge Platform | Cloudflare AI Stack |
| D1 | Cloudflare Edge Platform | Cloudflare AI Stack |
| KV | Cloudflare Edge Platform | Cloudflare AI Stack |
| R2 | Cloudflare Edge Platform | Cloudflare AI Stack |
| Durable Objects | Cloudflare Edge Platform | Cloudflare AI Stack |
| Browser Run | Cloudflare Edge Platform | Cloudflare AI Stack |
| Workers AI binding | Cloudflare AI Stack | Cloudflare Edge Platform |
| AI Gateway | Cloudflare AI Stack | Cloudflare Edge Platform |
| AI Search | Cloudflare AI Stack | Cloudflare Edge Platform |
| Vectorize | Cloudflare AI Stack | Cloudflare Edge Platform |
| Secrets Store | Cloudflare AI Stack | Cloudflare Edge Platform |
| Observability / Analytics Engine | Cloudflare Edge Platform | Cloudflare AI Stack |

Avoid cross-listing when the relationship is only incidental. A link inside the article is enough.

## First Batch

Write these before doing broad metadata migration:

1. `Cloudflare AI Gateway：Workers AI 之外，你真正需要的模型控制層` - drafted 2026-08-30
2. `Cloudflare Durable Objects：讓 serverless 有狀態的那塊拼圖` - updated 2026-08-30
3. `Cloudflare Queues：把 Workers 的慢工作丟到背景處理` - updated 2026-08-30
4. `Cloudflare Workflows：把多步驟流程跑到完成` - drafted 2026-08-30
5. `Cloudflare Cache Rules：什麼該快取，什麼要保持動態` - drafted 2026-08-30
6. `Cloudflare Vectorize：什麼時候該自建向量搜尋，而不是用 AI Search` - drafted 2026-08-30
7. `Cloudflare Email Service：讓 Workers 寄信、收信與處理產品通知` - drafted 2026-08-30
8. `Cloudflare Observability：Workers Logs、Traces 與 Analytics Engine 的分工` - drafted 2026-08-30
9. `Cloudflare Browser Run：在 Workers 上跑 headless Chrome` - drafted 2026-08-30
10. `Cloudflare Containers：當 Workers 需要完整 Linux runtime` - drafted 2026-08-30
11. `Cloudflare Agents：durable agent runtime、工具與即時連線` - drafted 2026-08-30
12. `Cloudflare Agent Memory：把 agent 記憶和 RAG 文件分開` - drafted 2026-08-30
13. `Cloudflare Secrets Store：Workers secret reuse 與 AI Gateway BYOK` - drafted 2026-08-30
14. `Cloudflare AI app 資料怎麼放：D1、R2、Durable Objects 的分工` - drafted 2026-08-30
15. `Cloudflare Edge Platform 上線前檢查：自訂網域、維護頁與 Workers limits` - drafted 2026-08-30
16. `Cloudflare Edge Platform 導讀：把網站和 app 跑在 Cloudflare 上` - drafted 2026-08-30
17. `Cloudflare AI Stack 導讀：在 Workers 上做 AI、RAG 和 agent` - drafted 2026-08-30

## Metadata Migration Status

Completed 2026-08-30:

1. Reassigned the existing canonical `Cloudflare 邊緣tech stack` / `The Cloudflare Edge Stack` posts into `Cloudflare Edge Platform` or `Cloudflare AI Stack`.
2. Added `additionalSeries` only for real second reading paths.
3. Preserved original `date`, slug, category, and draft status.
4. Confirmed `node scripts/check-series-order.mjs` has no Cloudflare blocking issues after migration.

## Official Source Set

Use Cloudflare official docs as the source of truth for product names, plan availability, limits, pricing, and API shape:

- https://developers.cloudflare.com/
- https://developers.cloudflare.com/workers/
- https://developers.cloudflare.com/durable-objects/
- https://developers.cloudflare.com/queues/
- https://developers.cloudflare.com/workflows/
- https://developers.cloudflare.com/hyperdrive/
- https://developers.cloudflare.com/cache/
- https://developers.cloudflare.com/smart-shield/
- https://developers.cloudflare.com/images/
- https://developers.cloudflare.com/email-service/
- https://developers.cloudflare.com/turnstile/
- https://developers.cloudflare.com/browser-run/
- https://developers.cloudflare.com/containers/
- https://developers.cloudflare.com/workers-ai/
- https://developers.cloudflare.com/ai-gateway/
- https://developers.cloudflare.com/ai-search/
- https://developers.cloudflare.com/vectorize/
- https://developers.cloudflare.com/agents/
- https://developers.cloudflare.com/agent-memory/
- https://developers.cloudflare.com/sandbox/
- https://developers.cloudflare.com/secrets-store/
- https://developers.cloudflare.com/analytics/analytics-engine/
- https://developers.cloudflare.com/analytics/graphql-api/
