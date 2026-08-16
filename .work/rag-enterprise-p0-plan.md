# RAG enterprise-quality P0 plan

Last updated: 2026-08-16

## Goal

Improve the current knowledge-base Q&A quality without migrations, production
flag changes, new dependencies, or deployment.

## Workstreams

- [x] Recall: keep `chunks_fts` consistent when local/prod sync SQL rebuilds post chunks.
- [x] Precision: fix mixed-source ranking, reranker pruning, and weak-result fallback signals.
- [x] Evaluation: replace tautological fixture scoring with assertions that exercise supplied answers and retrieval outputs.
- [x] Generation: make critic failures conservative and give the critic retrieved evidence.
- [x] Verification: targeted tests, full tests, Astro check, then `pnpm verify`.

## Boundaries

- Do not run `sync:prod`, deploy, migrations, or production flag changes.
- Do not add dependencies.
- Keep changes under 20 files.

## Verification

- `pnpm test`: 83 files, 420 tests passed.
- `node --test scripts/eval-rag-baseline.test.mjs`: 5 tests passed.
- Offline three-engine fixture matrix: 12 cases passed against independent candidates.
- `pnpm exec astro check`: 0 errors.
- `pnpm verify`: all green.

Production sync, embedding, live evaluation, and deployment require explicit
approval; tracked as Q-009 in the escalation queue.
