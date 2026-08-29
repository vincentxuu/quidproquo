# Cloudflare AI Search evaluation

Date: 2026-08-29
Repo baseline: quidproquo main 6e67b2ca

## Summary

Cloudflare AI Search is a good candidate for a shadow-mode retrieval backend and agent-facing MCP/search endpoint, but it should not replace the current D1 + Workers AI + Vectorize retrieval path in one step.

The current project already has:

- Public `/api/search` with keyword, hybrid, and rag modes.
- D1 `posts`, `post_chunks`, `doc_chunks`, and `chunks_fts`.
- Workers AI embeddings with the active Qwen3 embedding provider.
- Vectorize retrieval for posts, docs, related posts, and internal agents.
- Custom CJK token expansion, trigram FTS migration, BM25 short-circuiting, RRF fusion, and retrieval metrics.

AI Search overlaps the managed indexing/search part of this stack. It can reduce operational code, but a migration must preserve metadata filters, result contracts, public rate limits, admin status checks, and Chinese recall behavior.

## Official Cloudflare facts checked

- AI Search is a managed search service for natural-language queries over connected website, R2 bucket, or uploaded documents.
- Website data source can crawl only domains onboarded to the same Cloudflare account.
- Website crawling can use sitemaps/discovery, content selectors, rendering mode, auth headers, and meta-tag metadata extraction.
- Workers binding now uses `ai_search` or `ai_search_namespaces`; previous `env.AI.autorag()` binding is no longer recommended.
- Search API supports `search()` and `chatCompletions()`, hybrid/vector/keyword retrieval, filters, reranking, context expansion, and streaming chat completions.
- MCP endpoint is available through public endpoints; custom domains can be protected with Cloudflare Access, but the default endpoint should be disabled when using Access.
- During open beta, AI Search is free within limits; Workers AI and AI Gateway usage are billed separately.

## Recommended path

1. Keep `/api/search?mode=hybrid` as the public product surface.
2. Convert retrieval into multiple internal providers instead of choosing one backend:
   - `d1Keyword`
   - `vectorizeSemantic`
   - `cloudflareAiSearch`
3. Create one AI Search instance for public site content using website crawling against `https://quidproquo.cc`, sitemap parse type, content selectors around article body, and metadata fields for `lang`, `category`, `title`, and `description`.
4. Add an `ai_search` instance binding or `ai_search_namespaces` binding to `wrangler.jsonc`, behind source-level settings such as `rag_source_ai_search_enabled=false`.
5. Add a small adapter in `src/lib/retrieval/tools/ai-search.ts` that converts AI Search chunks into the existing `SearchResult` shape.
6. Update `/api/search` so `mode=hybrid` queries an enabled provider set, merges results, dedupes by URL/slug, and returns the same UI contract.
7. Run AI Search in shadow mode first: query it, record metrics, but do not include it in rendered public results until eval data proves it helps.
8. Promote AI Search into the visible provider set after comparing recall, source URL quality, zh-TW/CJK queries, latency, and rate-limit behavior.
9. If results are good, use AI Search for `docs/custom uploaded knowledge` and agent MCP access before considering any reduction of the custom Vectorize pipeline.

## Proposed multi-source architecture

The external API should stay stable:

```txt
SearchWidget
  -> /api/search?q=...&mode=hybrid
  -> source planner
  -> provider fan-out
  -> normalize SearchResult
  -> dedupe by slug/source_url
  -> RRF or weighted merge
  -> response in current UI shape
```

Provider roles:

| Provider | Best at | Notes |
| --- | --- | --- |
| `d1Keyword` | exact titles, model names, route names, errors, short CJK phrases | Keep this as the first precision path. |
| `vectorizeSemantic` | current custom semantic search over D1 chunks | Preserves existing metadata, related posts, and eval baseline. |
| `cloudflareAiSearch` | managed hybrid retrieval over crawled/uploaded content | Add with timeout, metrics, and feature flags. |

Provider config should be explicit:

```ts
type RetrievalSourceId = 'd1Keyword' | 'vectorizeSemantic' | 'cloudflareAiSearch'

interface RetrievalSourceConfig {
  enabled: boolean
  visible: boolean
  shadow: boolean
  weight: number
  timeoutMs: number
}
```

`enabled` means the source is called. `visible` means it can affect user-visible ranking. `shadow` means it is only measured. This lets the system support multiple sources without forcing a one-backend switch.

## Admin information architecture

Use three flat Admin navigation items, separated by the operator's intent. Do not nest these under a generic `Settings` area.

Suggested sidebar:

```txt
New
Flows
Search Page
Custom Agent
RAG
Models
Extensions
Permissions
Access
Site Ops
```

`Settings` should disappear as a primary label. The old settings bucket was too broad; each operational surface should be visible directly in the sidebar.

### Search Page

Purpose: configure the public `/search` page and `/api/search` behavior.

Suggested route: `/admin/search-page`

Owns:

- Public search mode defaults.
- Which retrieval sources can contribute to public search results.
- Source visibility, weights, timeout, and fallback for the public search page.
- Search result formatting options that affect the public UI.
- Public search daily limits and abuse guardrails.

Example settings:

```txt
search_page_enabled=true
search_page_default_mode=hybrid
search_page_sources=d1Keyword,vectorizeSemantic,cloudflareAiSearch
search_page_source_d1_keyword_visible=true
search_page_source_vectorize_visible=true
search_page_source_ai_search_enabled=true
search_page_source_ai_search_visible=false
search_page_source_ai_search_shadow=true
search_page_source_ai_search_weight=1
search_page_source_ai_search_timeout_ms=1500
search_page_daily_limit=20
```

### Custom Agent

Purpose: configure named agents and which retrieval/tool sources each agent can use.

This is where Ask AI belongs. Ask AI should be a named custom agent profile, not a special one-off settings page.

Suggested route: `/admin/custom-agents`

Owns:

- Agent profiles such as `ask-ai`, `research-assistant`, `post-planner`, or future task-specific agents.
- Per-agent retrieval source policy.
- Per-agent model/provider routing.
- Per-agent tool access, including whether the agent may use AI Search MCP.
- Per-agent prompt/system behavior.
- Per-agent budgets, timeouts, and safety gates.

Example `ask-ai` profile:

```txt
agent.ask-ai.enabled=true
agent.ask-ai.model_provider=groq
agent.ask-ai.model=llama-3.3-70b-versatile
agent.ask-ai.retrieval_sources=d1Keyword,vectorizeSemantic,cloudflareAiSearch
agent.ask-ai.source_d1_keyword_visible=true
agent.ask-ai.source_vectorize_visible=true
agent.ask-ai.source_ai_search_enabled=true
agent.ask-ai.source_ai_search_visible=true
agent.ask-ai.source_ai_search_timeout_ms=2000
agent.ask-ai.allow_ai_search_mcp=false
```

This lets a specific agent use only AI Search, only the local D1/Vectorize stack, or a blended source set without changing the public Search Page configuration.

### RAG

Purpose: configure the shared retrieval/indexing substrate.

Suggested route: `/admin/rag`

Owns:

- Index health and sync status.
- D1 chunk counts, Vectorize status, AI Search binding status.
- Embedding provider and embedding version.
- Chunking/indexing settings.
- Global retrieval defaults used when a Search Page or Custom Agent profile does not override them.
- Eval, golden dataset runs, and shadow comparison reports.

Example settings:

```txt
rag_embedding_provider=qwen3
rag_bm25_short_circuit_enabled=true
rag_default_retrieval_sources=d1Keyword,vectorizeSemantic
rag_ai_search_instance=quidproquo-public
rag_ai_search_namespace=default
rag_ai_search_health_enabled=true
```

Boundary rule:

- Search Page answers: "What does the public search UI do?"
- Custom Agent answers: "What sources and tools may this agent use?"
- RAG answers: "What retrieval/indexing infrastructure exists, and what are the shared defaults?"

Routing migration from the current Admin v2 map:

| Current bucket | New flat item | Route direction |
| --- | --- | --- |
| `/admin/settings/site/rag` | `RAG` | Move or alias to `/admin/rag`. |
| Public search config currently implicit in `/api/search` | `Search Page` | Add `/admin/search-page`. |
| Ask AI/admin chat behavior currently mixed with Admin home/session flow | `Custom Agent` | Add `ask-ai` profile under `/admin/custom-agents`. |
| `/admin/settings/models` | `Models` | Flatten to `/admin/models` or keep old route as alias during migration. |
| `/admin/settings/extensions` | `Extensions` | Flatten to `/admin/extensions`. |
| `/admin/settings/permissions` | `Permissions` | Flatten to `/admin/permissions`. |
| `/admin/settings/access` | `Access` | Flatten to `/admin/access`. |

## Rollout plan

### Phase 1: binding and read-only adapter

- Add Cloudflare AI Search binding in `wrangler.jsonc`.
- Add optional env type in `src/lib/config/env.ts`.
- Add `src/lib/retrieval/tools/ai-search.ts`.
- Add unit tests with mocked AI Search chunks.
- No public behavior change.

### Phase 2: provider fan-out behind settings

- Introduce a provider orchestration helper, likely `src/lib/retrieval/tools/multi-source-search.ts`.
- Move current D1/Vectorize path behind provider-style functions without changing returned API JSON.
- Add source metrics: source id, result count, error, timeout, latency, visible/shadow.
- Add Admin controls across the three flat areas:
  - Search Page: public source set, visibility, weight, timeout, and daily limit.
  - Custom Agent: per-agent source set and tool permissions, including the `ask-ai` profile.
  - RAG: shared defaults, binding health, instance names, indexing status, and eval reports.

### Phase 3: shadow evaluation

- Keep `cloudflareAiSearch.visible=false`.
- For public/admin searches, call AI Search only when `shadow=true`.
- Store or expose shadow metrics through the existing RAG/admin status path.
- Run `docs/rag-golden-dataset.json` and manual zh-TW checks against both visible and shadow result sets.

### Phase 4: visible blend

- Set `cloudflareAiSearch.visible=true` for selected modes after parity checks.
- Merge AI Search chunks with D1/Vectorize results using RRF first; weight tuning only after enough query logs exist.
- Keep per-source timeout so AI Search cannot block existing fast keyword results.

### Phase 5: agent/MCP use

- Enable AI Search public endpoint only if needed for agent access.
- Prefer custom domain + Cloudflare Access for MCP.
- Disable the default generated public endpoint if protected access is required.

## Acceptance criteria

- `/api/search?mode=hybrid` response shape does not change.
- Search UI does not need to know which providers were used.
- AI Search failure or timeout returns current D1/Vectorize results.
- Admin can tell whether AI Search is bound, enabled, shadowed, visible, and contributing results.
- Existing CJK precision cases still pass or improve.
- Golden eval shows no regression before AI Search affects public ranking.

## Why not direct replacement yet

- Existing code has CJK-specific FTS behavior and 2-char fallback that AI Search may or may not match.
- Existing output shape and UI expect `title`, `category`, `url`, `slug`, `score`, `evidence`, and `reason`.
- Related posts currently depend on custom Vectorize metadata.
- Admin status currently checks D1, KV, Vectorize, Workers AI, and D1 chunk counts.
- The project has explicit ADR decisions around BM25 short-circuit, RRF metrics, search daily limits, and shadow comparison.

## Main files likely affected

- `wrangler.jsonc`: add AI Search binding.
- `src/lib/config/env.ts`: add binding type once workers types support it locally.
- `src/lib/retrieval/tools/ai-search.ts`: new adapter.
- `src/lib/retrieval/tools/multi-source-search.ts`: new provider fan-out and merge helper.
- `src/pages/api/search.ts`: use Search Page source config while preserving the existing public response shape.
- `src/pages/api/chat.ts`: route Ask AI through a named Custom Agent profile rather than hard-coded source behavior.
- `src/pages/api/admin/site/status.ts`: report AI Search binding/instance health.
- `src/pages/api/admin/site/rag.ts` and settings migrations: keep shared RAG defaults, health, and eval/shadow settings; expose them through flat `/admin/rag`.
- Admin Search Page route/UI: add flat `/admin/search-page` for public search source controls.
- Admin Custom Agent route/UI: add flat `/admin/custom-agents` for per-agent source/tool controls, including `ask-ai`.
- Tests near `src/lib/retrieval/tools/*.test.ts` and search API tests: add adapter contract and fallback coverage.

## Open decisions

- Website crawl vs uploaded built-in storage:
  - Website crawl is fastest and uses existing published URLs.
  - Built-in storage gives stronger metadata and document keys, but needs an export/upload pipeline.
- Instance binding vs namespace binding:
  - Instance binding is simpler for one public index.
  - Namespace binding is better if future tenant/agent memory indexes matter.
- Whether to expose MCP:
  - Useful for agents querying site knowledge directly.
  - Should use custom domain + Access and disable default public endpoint if protected access is required.

## Sources

- https://developers.cloudflare.com/ai-search/
- https://developers.cloudflare.com/ai-search/get-started/
- https://developers.cloudflare.com/ai-search/configuration/data-source/website/
- https://developers.cloudflare.com/ai-search/api/search/workers-binding/
- https://developers.cloudflare.com/ai-search/api/search/mcp/
- https://developers.cloudflare.com/ai-search/platform/limits-pricing/
