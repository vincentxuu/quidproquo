# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Astro 6** (SSR, `output: server`) + TypeScript
- **Cloudflare Workers** adapter with D1 (SQLite), Vectorize (embeddings), KV (sessions/rate-limit), AI binding, R2 (images)
- **LangGraph / LangChain** for the RAG pipeline; **Langfuse** for tracing
- **Pagefind** for static full-text search (runs post-build via Astro integration)
- **pnpm** as package manager; **oxlint** for linting (no formatter configured)
- **i18n**: zh-TW (default, no prefix) and en (`/en/...`)

## Dev Commands

```bash
pnpm dev              # Start dev server with Cloudflare platform proxy (localhost:4321)
pnpm build            # cron stubs + astro build + OG images (full production build)
pnpm deploy           # Build then wrangler deploy
pnpm lint             # oxlint src/ (excludes *.astro)
pnpm test             # vitest run (unit tests)
pnpm test:watch       # vitest in watch mode
pnpm session:start    # Print pwd, latest commit, progress.txt, then run lint
pnpm check:references # Verify internal post cross-references
pnpm check:post-quality  # Run deterministic post quality checks
pnpm sync             # Sync posts to D1 (local)
pnpm sync:prod        # Sync posts to D1 (production)
```

Pre-commit hook runs `pnpm lint && pnpm check:references` automatically.

To run a single test file: `pnpm vitest run src/lib/rag/graph.test.ts`

## Architecture

### Request Flow

Browser → Cloudflare Workers → Astro SSR → pages/api/* or pages/**/*.astro

- `src/pages/api/chat.ts` — main chat endpoint: rate-limit → session auth → semantic cache lookup → RAG pipeline → Langfuse tracing → SSE stream
- `src/pages/api/admin/` — admin-only endpoints for pipelines, jobs, settings, crawl, embed
- `src/pages/admin/` — admin UI pages (jobs, rag, settings, traces, etc.)

### RAG Pipeline

`src/lib/rag/` is the core AI subsystem. Entry point: `pipeline.ts → runPipeline()`.

**Engine layer** (`engines/`): Three swappable backends — `langgraph` (default), `llamaindex`, `manual`. Selected via `RagRuntimeConfig.pipelineEngine`, stored in D1 `settings` table.

**LangGraph agents** (`agents/`): `planner → research → normalize_results → writer → deterministic_validation → critic → related/fallback`. The critic node decides whether to retry or degrade via conditional edges.

**Hybrid search** (`tools/hybrid-search.ts`): BM25 (D1 FTS5) + Vectorize vector search fused with RRF (k=60). BM25 short-circuits vector search when it finds enough results (`BM25_SHORT_CIRCUIT_THRESHOLD = 5`).

**Feature flags** are runtime-configurable via D1 `settings` table — never hardcode:

| Flag | Default | Purpose |
|------|---------|---------|
| `hydeEnabled` | false | HyDE query expansion |
| `multiQueryEnabled` | false | Multi-query retrieval |
| `rerankerEnabled` | false | Cross-encoder reranking |
| `criticEnabled` | true | LLM critic/retry loop |
| `pageIndexEnabled` | false | Page-level index search |
| `bm25ShortCircuitEnabled` | true | Skip vector when BM25 sufficient |
| `shadowModeEnabled` | false | A/B baseline comparison |

All flags loaded via `loadRagSettings()` from D1 each request. Settings UI at `/admin/settings`.

**Semantic cache** (`cache.ts`): Embeds incoming query with `@cf/baai/bge-large-en-v1.5`, checks cosine similarity against cached responses in D1. Threshold configurable (`semanticCacheThreshold`, default 0.95).

**Conversation checkpoints** (`checkpoints.ts`): Stores compressed conversation summaries in D1 per `thread_id` to handle long conversations.

### Admin Content Pipelines

`src/lib/pipelines/` — a job execution system for server-side content operations.

- **Registry** (`registry.ts`): declares all pipeline definitions (`content-ops`, `post-quality`, `translation`, `research-brief`, `youtube-brief`, etc.) with stages, tools, guards, and budget limits.
- **Runner** (`runner.ts`): executes pipeline stages sequentially; manages job lifecycle in D1 (`pipeline_jobs`, `pipeline_steps`, `pipeline_artifacts` tables); retries with exponential backoff (cap 8s).
- **Guards**: `admin_required`, `tool_allowlist`, `budget_limit`, `output_safety` — all checked before each run.
- Pipeline jobs are tracked with status: `queued → running → succeeded/failed/waiting_review/dead_letter`.

### Content & Crawl

- Posts are Markdown files in `src/content/posts/<category>/YYYY-MM-DD-slug.md`; synced to D1 via `pnpm sync`.
- External docs crawled via `src/lib/crawl/` (browser rendering + chunking) into `doc_chunks` table for RAG.
- Embeddings for both post chunks and doc chunks stored in Cloudflare Vectorize.

### D1 Schema (key tables)

- `posts` — slug, title, category, lang, tags, body text
- `post_chunks` / `doc_chunks` — chunked text for RAG with FTS5
- `settings` — key/value store for RAG feature flags and model config
- `semantic_cache` — cached query→response pairs with embeddings
- `checkpoints` — conversation summaries per thread_id
- `pipeline_jobs` / `pipeline_steps` / `pipeline_artifacts` — admin pipeline execution
- `rag_traces` — observability traces (retention managed by `rag:trace-retention` script)

### Cron Jobs

Four cron schedules defined in `wrangler.jsonc`. The build process generates a cron stub entry via `scripts/create-cron-stub.mjs` and `scripts/create-cron-entry.mjs` — do not manually edit the generated `dist/server/` cron files.

### Tests

Unit tests live alongside source as `*.test.ts`. `vitest.config.ts` aliases `cloudflare:workers` to `src/test/cloudflare-workers-mock.ts` so tests run in Node without needing a Worker runtime.

RAG eval scripts (`pnpm eval:rag`) run against fixtures (`RAG_EVAL_OFFLINE=1`) or live. `RAG_EVAL_ENFORCE=1` makes failures non-zero exit for CI.

## Content Schema (frontmatter)

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `date` | date | yes |
| `category` | string | yes |
| `tags` | string[] | yes |
| `lang` | `'zh-TW'` \| `'en'` | no (default: `zh-TW`) |
| `description` | string | no |
| `tldr` | string | no |
| `draft` | boolean | no (default: `false`) |
| `pinned` | boolean | no (default: `false`) |
| `type` | `'debug'` \| `'deep-dive'` \| `'guide'` \| `'project'` | no |
| `series` | `{ name: string, order: number }` | no |

Post filenames: `YYYY-MM-DD-slug.md` under `src/content/posts/<category>/`.

Supported categories: `tech` / `ai` / `product` / `education` / `climbing` / `surf` / `film` / `life` / `coffee` / `learning` / `marketing` / `travel` / `design` / `policy` / `anime` / `career`

## Important Decisions

- **Feature flags are mandatory** for all advanced/experimental techniques (RAG, embeddings, AI features). Every such feature must be individually toggleable via D1 settings. Do not add a feature without a corresponding flag.
- `progress.txt` at the repo root is the lightweight session memory. Update it when task status materially changes.
- Never revert file changes without explicit user confirmation.
- Use MCP scraping tools for all web scraping — never built-in WebFetch or Playwright directly.
- All Cloudflare bindings accessed via `env` from `cloudflare:workers` — cast as `unknown as Env` since types are runtime-only.

## Commit Convention

Always use the `format-commit` skill (`~/.claude/skills/format-commit.md`) to generate commit messages before every `git commit`.
