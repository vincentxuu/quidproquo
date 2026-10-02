---
title: "Framework Update: Haystack v3.3.0"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, framework, daily, haystack]
lang: en
description: "Haystack 3.3 patches an anyio CVE, cuts SentenceWindowRetriever's Document Store queries from one per document to one per run, and tightens BM25 retrieval and top_k validation — re-indexed corpora can land on different chunk boundaries"
tldr: "Three things in Haystack v3.3.0: (1) security — `anyio` is bumped to `>=4.14.2`, patching CVE-2026-63374 (GHSA-82r6-8w77-94w6); it's pulled in transitively through `httpx`/`openai`, so older versions were vulnerable; (2) performance — `SentenceWindowRetriever` now queries the Document Store once per `run`/`run_async` call instead of once per retrieved document; (3) Breaking: BM25L/BM25Plus (the default) now only return documents that contain at least one query term, which can shrink result counts; passing a negative `top_k` now raises `ValueError` instead of silently slicing; and a fix for lost whitespace at quoted sentence endings shifts chunk boundaries for re-indexed corpora."
series:
  name: "AI Framework Changelog"
  order: 31
---

> 🌏 [中文版](/posts/daily/2026-10-02-framework-haystack-3.3.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Haystack |
| Version | `v3.3.0` |
| Previous | `v3.2.0` |
| Released | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.6k |

## Why this release matters

There's no new agent primitive or memory module in this release — it's entirely about correctness, performance, and security on existing components. On performance, `SentenceWindowRetriever` used to query the Document Store once per retrieved document; now it queries once per `run`, cutting latency and Document Store load with no output change — a free upgrade. On correctness, BM25 retrieval is tightened to "must match at least one query term" — previously, completely unrelated documents could still score positively and fill up `top_k`; passing a negative `top_k` used to be silently treated as a negative slice that quietly dropped the last few results, and now raises an error instead of failing silently. On security, it closes an `anyio` CVE pulled in transitively through `httpx`/`openai`. None of this is exciting new functionality, but for teams running Haystack pipelines in production, it's the kind of maintenance release you prioritize — especially if you filter retrieval results with a fixed score threshold, or have indexed a corpus containing quoted sentences, both of which behave differently after upgrading.

## What changed

- **Fewer `SentenceWindowRetriever` queries**: now queries the Document Store once per `run`/`run_async` call instead of once per retrieved document → output is unchanged, but latency and Document Store load both drop with no code changes required
- **`anyio` CVE patch (security)**: requires `anyio>=4.14.2`, patching CVE-2026-63374 (GHSA-82r6-8w77-94w6); `anyio` is pulled in transitively through `httpx`/`openai` → most projects don't depend on `anyio` directly, but upgrading Haystack closes this vulnerability in that indirect dependency chain
- **CJK tokenization fix**: `InMemoryDocumentStore`'s BM25 tokenization now splits CJK characters into individual tokens and applies NFC normalization before tokenizing → single-term queries now correctly match words embedded in long unspaced runs of text, and composed vs. decomposed spellings (e.g. different normalization forms) now produce the same tokens — a direct accuracy improvement for CJK-heavy corpora
- **`TextCleaner` input validation**: now raises a clear `TypeError` when `texts` isn't a list or one of its elements isn't a `str`, instead of failing later or producing unexpected results → pipeline misconfigurations surface faster
- **Several hook/pipeline bug fixes**: `ChatPromptBuilder` no longer drops every content part after the first `TextContent` when the template is a list of `ChatMessage` objects; `CompactionHook.close()`/`close_async()` now release the token counter's resources too (e.g. `OpenAITokenCounter`'s HTTP client); `ConfirmationHook` no longer drops messages that follow the last user/tool message when it rewrites conversation history

## Breaking Changes

- Tighter BM25 retrieval behavior:
  - `InMemoryDocumentStore.bm25_retrieval` and `InMemoryBM25Retriever` with the default `BM25L` (or `BM25Plus`) now only return documents containing at least one query term
  - Previously, documents with zero matching query terms could still get a positive score and fill up `top_k`; those documents no longer appear, so result counts can shrink or drop to zero
  - The `delta` lower bound now applies only to query terms actually present in the document (matching the original BM25L/BM25+ definitions), so scores overall run lower than before
  - Affected: pipelines filtering retrieval results with a fixed score threshold need to re-check that threshold after upgrading; `BM25Okapi` is unaffected
- Tighter `top_k` validation:
  - `InMemoryBM25Retriever`/`InMemoryEmbeddingRetriever`/`MultiRetriever` (`top_k`, `top_k_per_retriever`) now raise `ValueError` when passed a negative value at runtime
  - Previously a negative value was applied as a negative slice, silently dropping the last few documents without an error; `MultiRetriever` now also validates both parameters are `>0` at initialization
  - Affected: code relying on the old "negative top_k silently works" behavior will now raise an error instead
- `SentenceSplitter` whitespace-loss fix:
  - When a sentence ends with a closing quote (e.g. `He said "Hi." Bye.`), the old version lost the whitespace between sentences and shifted every following chunk's `split_idx_start` offset, so chunks no longer mapped back onto the original text
  - Affected: every component that splits on sentences (`DocumentSplitter`, `RecursiveDocumentSplitter`, `MarkdownHeaderSplitter`, `EmbeddingBasedDocumentSplitter`); re-indexing a corpus containing quoted sentences will produce different chunk boundaries than before

## Migration Guide

### Upgrading from 3.2.x to 3.3.0

```bash
pip install --upgrade haystack-ai==3.3.0
```

```python
# If you filter BM25 results with a fixed score threshold, re-check it after upgrading
# Before: unrelated documents could still score positively, so a looser threshold worked
results = retriever.run(query="...", filters={"score_threshold": 0.3})
# After: scores overall run lower (unrelated documents no longer get scored), so
# the threshold may need to come down, or matching documents get filtered out too
```

```python
# If your code relied on the old negative top_k behavior (silently dropping the last few), be explicit
# Before — top_k=-2 used to act as a slice (drop the last 2 results)
retriever.run(query="...", top_k=-2)

# After — compute the count you actually want; a negative value now raises ValueError
desired = max(len(all_docs) - 2, 0)
retriever.run(query="...", top_k=desired)
```

If your corpus has quoted sentence endings and you use a sentence-based splitter with an existing index-comparison workflow, re-index after upgrading to confirm chunk boundaries match expectations. The other bug fixes (`ChatPromptBuilder`, `CompactionHook`, `ConfirmationHook`, etc.) only matter if you directly depend on the old behavior of those components.

## How this compares to other frameworks

Agno 3.1, released the same day, went the opposite direction — adding new platform-level capability (RBAC, a native filesystem). Haystack 3.3 added no new agent primitive at all; it's purely correctness, performance, and security work on existing pipeline components. That matches Haystack's long-standing positioning: it presents itself as a modular pipeline framework rather than a batteries-included agent platform, prioritizing predictability and robustness over feature velocity. For teams already running Haystack pipelines in production with CJK-heavy corpora, the tokenization fix here is worth as much as the performance or security items.

## Today's takeaway

I used to assume CJK tokenization issues would have been solved long ago in a framework this mature. Seeing this release still fixing "CJK characters weren't split into individual tokens" and "composed vs. decomposed spellings produced different tokens" made it clear that multilingual retrieval tokenization isn't a feature you ship once and move on from — it's technical debt that keeps surfacing new edge cases as corpora and usage patterns evolve, and it's especially easy for a framework tested mostly against English corpora to overlook.

## References

- [Haystack v3.3.0 — GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.1.0 — previous framework update](/en/posts/daily/2026-08-26-framework-haystack-3.1.0-en)
- [CVE-2026-63374 / GHSA-82r6-8w77-94w6 — anyio security advisory](https://github.com/advisories/GHSA-82r6-8w77-94w6)
