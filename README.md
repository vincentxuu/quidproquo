<div align="center">

# quidproquo

**A bilingual personal blog with a built-in AI content engine.**

[![Deploy](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml/badge.svg)](https://github.com/vincentxuu/quidproquo/actions/workflows/deploy.yml)
![Status](https://img.shields.io/badge/status-active_development-orange.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare_Workers-f38020.svg)

[Quick start](#quick-start) · [Features](#features-at-a-glance) · [Deploy](#deploy-to-cloudflare) · [Architecture](#how-it-works) · [Docs](#documentation)

[English](README.md) · [繁體中文](README.zh-TW.md)

</div>

quidproquo is the source of [quidproquo.cc](https://quidproquo.cc), a personal blog built with Astro (SSR) on Cloudflare Workers. Articles are written in Markdown, served bilingually (`zh-TW` default, `en`), and backed by a retrieval layer: posts are chunked into D1 and Vectorize to power semantic search, related posts, and a chat endpoint.

> [!IMPORTANT]
> This is a personal project under active development. The D1 schema, API routes, and content pipelines may change without notice. It is not intended as a general-purpose blogging framework.

## Features at a glance

| Area | What it does | Where it lives |
| --- | --- | --- |
| Bilingual blog | Markdown/MDX posts with categories, tags, series, RSS, sitemap, and OG image generation | `src/content/posts/`, `src/pages/` |
| RAG search & chat | Post chunks embedded into Vectorize; semantic search, related posts, and a chat API | `src/pages/api/search.ts`, `src/pages/api/chat.ts` |
| Deep research | Multi-step research workflow with evidence tracking and queued agent runs | `src/pages/api/deep-research.ts`, `flows/` |
| Content pipelines | Crawlers, YouTube-to-post, translation, and daily digest routines | `src/lib/crawl/`, `scripts/`, `docs/yt-to-post-pipeline.md` |
| Agent ecosystem | Skills, MCP Servers, Plugins management with D1 persistence and admin UI | `src/lib/agent-skills/`, `src/pages/admin/agent-ecosystem.astro` |
| Admin console | Session-authenticated admin UI for jobs, providers, and policies | `src/pages/admin/` |
| Quality gates | Lint plus post-reference, terminology, language-parity, glossary, and link checks | `scripts/check-*.mjs`, `pnpm verify` |

Search and chat work without external SaaS beyond model providers configured via `LLM_PROVIDER`; embeddings and inference use Workers AI and LangChain adapters.

## Quick start

Requirements: Node.js 22+, pnpm 10, and Git. Playwright is needed only for browser tests.

```bash
git clone https://github.com/vincentxuu/quidproquo.git
cd quidproquo
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

The site is now available at `http://localhost:4321`. Cloudflare bindings are emulated locally by Wrangler; sync article data into local D1 when needed:

```bash
pnpm sync        # local D1
pnpm sync:prod   # production D1
```

### Everyday commands

| Command | Purpose |
| --- | --- |
| `pnpm build` | Production build to `./dist/` (includes cron entry and OG image generation) |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | oxlint static analysis |
| `pnpm test` | Vitest test suite |
| `pnpm verify` | Full pre-commit verification (runs via `simple-git-hooks`) |
| `pnpm check:lang-parity` | Verify `zh-TW`/`en` content parity |
| `pnpm eval:rag` | Run the RAG baseline evaluation |
| `pnpm session:start` | Show latest commit, `progress.txt`, and run lint once |

## Deploy to Cloudflare

Deployment is automated through GitHub Actions: pushes to `main` lint, verify
references, build, and deploy to production. The repository must have a
`CLOUDFLARE_API_TOKEN` secret; see
[`deploy.yml`](.github/workflows/deploy.yml).

For a manual deployment, authenticate Wrangler, then build and deploy:

```bash
pnpm exec wrangler login
pnpm run deploy
```

`pnpm run deploy` builds first and deploys with the generated
`dist/server/wrangler.json`. Scheduled jobs (cron triggers for crawlers,
digests, and retention) are defined in [`wrangler.jsonc`](wrangler.jsonc).

### Cloudflare resources

| Binding | Type | Purpose |
| --- | --- | --- |
| `ASSETS` | Assets | Static asset serving |
| `SESSION` | KV | Session storage |
| `RATE` | KV | Rate limiting |
| `DEEP_RESEARCH_KV` | KV | Deep-research state |
| `DB` | D1 | Posts, chunks, glossary, **skills, MCP servers, plugins** (`quidproquo-db`) |
| `VECTORIZE_INDEX` | Vectorize | Embedding search (`quidproquo-vectors`) |
| `AI` | Workers AI | Embeddings and inference |
| `R2_IMAGES` | R2 | Image storage |
| `AGENT_QUEUE` | Queues | Queued agent runs (with DLQ) |

Database migrations live in [`migrations/`](migrations/) and define core
tables: `posts` (articles), `post_chunks` (RAG chunks), `doc_chunks`
(crawled documents), `user_skills` (agent skills), `mcp_servers` (MCP configs),
and `plugins` (skill packages).

## Why quidproquo?

- **Content as data:** every post is plain Markdown synced into D1, so search, recommendations, and analytics all query one source of truth.
- **RAG-native:** retrieval is not bolted on — chunking, embedding, evaluation (`pnpm eval:rag`), and trace retention are part of the repository.
- **Bilingual by construction:** language-parity and Traditional-Chinese terminology checks keep the two editions consistent.
- **Quality gates before publish:** references, series order, glossary coverage, and external links are verified in CI.
- **One platform:** compute, storage, search indexes, queues, and AI all run inside Cloudflare Workers.

## How it works

```text
Visitor / Admin
    |
    v
Astro SSR on Cloudflare Workers    sessions, rate limiting, i18n routing
    |
    +-- pages                      blog, categories, tags, series, search
    +-- api                        chat, search, deep research, crawl
    +-- D1                         posts, chunks, glossary stats
    +-- Vectorize + Workers AI     embeddings and semantic retrieval
    `-- Queues                     background agent and digest runs
```

Articles are authored as Markdown under `src/content/posts/<category>/`,
type-checked through `src/content.config.ts`, validated by the check scripts,
then synced to D1 with [`scripts/sync-to-d1.ts`](scripts/sync-to-d1.ts). The
SSR site reads from D1 so published content, search indexes, and RAG chunks
stay in lockstep.

## Project status

- Live at [quidproquo.cc](https://quidproquo.cc); deployed automatically from `main`.
- Implemented: bilingual SSR blog, RAG search and chat, deep-research workflow, agent queue console, content QA suite, RAG evaluation harness, **agent skills/MCP/plugins ecosystem**.
- In progress: agent flow/policy/artifact expansion, glossary analytics, and publishing automation — see [`docs/TODO.md`](docs/TODO.md) and [`docs/content-pipeline-roadmap.md`](docs/content-pipeline-roadmap.md).

## Agent ecosystem

The project includes a built-in agent extensibility system:

| Component | Purpose | API |
| --- | --- | --- |
| **Skills** | Reusable workflow definitions (SKILL.md format) for agents | `GET/POST/PUT/DELETE /api/skills` |
| **MCP Servers** | External tool providers (GitHub, Notion, Slack, etc.) via Model Context Protocol | `GET/POST/PUT/DELETE /api/mcp-servers` |
| **Plugins** | Distributable packages bundling skills + MCP servers | `GET/POST/PUT/DELETE /api/plugins` |

- **Admin UI**: `/admin/agent-ecosystem` — searchable tables, modal editors, import/export JSON
- **Storage**: Project skills (`.agents/skills/`, git-managed) + user skills (D1) merged at runtime
- **Compatibility**: Exposes `SUPPORTED_AGENT_SKILLS` for existing deep-research pipelines

See [`docs/skill-package-development-guide.md`](docs/skill-package-development-guide.md) for authoring skills.

## Documentation

- [AI agent content system](docs/ai-agent-content-system.md)
- [Operating charter](docs/governance/operating-charter.md)
- [Content pipeline roadmap](docs/content-pipeline-roadmap.md)
- [Translation pipeline](docs/translation-pipeline.md)
- [YT-to-post pipeline](docs/yt-to-post-pipeline.md)
- [RAG trace retention policy](docs/rag-trace-retention-policy.md)
- [Architecture decisions](docs/adr/)

## Contributing and support

This is a personal project, so there is no formal contribution process. Bug
reports and suggestions are welcome via
[GitHub Issues](https://github.com/vincentxuu/quidproquo/issues).
