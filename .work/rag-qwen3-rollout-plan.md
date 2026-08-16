# Qwen3 embedding rollout plan

Last updated: 2026-08-16

## Goal

Replace the English-only BGE Large embedding path with Cloudflare-hosted
Qwen3 Embedding 0.6B for the bilingual technical knowledge base, without a
schema migration or a new Vectorize index.

## Evidence

- Corpus: 760 published posts, 382 zh-TW / 378 en.
- Chunks: 12,489 generated from source; 48.3% zh-TW, 51.7% en.
- 36.4% of chunks mix Han and Latin text; 19.1% include fenced code.
- Golden queries: 16/20 zh-TW and 16/20 mix Han text with English technical terms.
- Existing BGE Large limit is 512 tokens; a tokenizer proxy puts 5.75% of chunks above it.
- Qwen3 is multilingual and code-aware, exposes query instructions, has an 8,192-token
  Cloudflare context window, emits up to 1,024 dimensions, and fits the current index.

## Workstreams

- [x] Centralize provider selection, query instruction, response validation, and document/query helpers.
- [x] Replace all RAG, cache, related-post, abstract, and LlamaIndex BGE hardcodes.
- [x] Namespace semantic-cache rows by embedding version so old vectors are never compared.
- [x] Add focused tests for provider contracts, Qwen query/document payloads, adaptive input splitting, and cache isolation.
- [x] Run targeted tests, full tests, Astro check, and `pnpm verify`.
- [ ] Commit and push the implementation.
- [ ] Run deploy preflight and deploy.
- [ ] Clear old production semantic-cache rows, rebuild all post vectors, verify 12,498 vectors.
- [ ] Run the 20-question live evaluation and report quality plus latency separately.

## Boundaries

- No schema migration and no new dependency.
- Keep the existing 1,024-dimension cosine Vectorize index.
- Do not change unrelated feature flags.
- Preserve `.work/daily-frontend-plan.md` as user-owned, untracked work.
