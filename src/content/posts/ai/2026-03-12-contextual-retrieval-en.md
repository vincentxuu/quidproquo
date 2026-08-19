---
title: "Contextual Retrieval: Giving Every Chunk Its \"What This Is About\" Context"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, contextual-retrieval, chunking, indexing, embedding]
lang: en
tldr: "When you split a document into chunks, each chunk loses its place in the original document. Contextual Retrieval solves the isolated-chunk problem by generating a per-chunk context from the whole document and prepending it at index time."
description: "The design behind Contextual Retrieval: the isolated-chunk problem, per-chunk context generation, the indexing pipeline, and the impact on search quality."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 6
---

> 🌏 [中文版](/posts/ai/2026-03-12-contextual-retrieval)

RAG systems typically index long documents by splitting them into small chunks, embedding each one, and storing them in a vector database. This approach has a fundamental flaw: **once split, each chunk loses the context it had within the original document.**

Consider a route description document that contains:

- Section 1: Route overview (location, difficulty, type)
- Section 2: Key technical moves
- Section 3: Safety notes and recommended gear

If you store only the Section 2 chunk — "The crux move comes after the third bolt; it requires precise balance and footwork" — it's completely adrift without context. There's no mention of which route, which crag, or what grade. When a search hits that chunk, the LLM receives it without the information it actually needs.

Contextual Retrieval (introduced by Anthropic in September 2024) fixes this: **at index time, prepend to every chunk a short passage explaining where that chunk sits within the whole document, then embed the combined text.**

One thing needs to be straight before going further, because most second-hand write-ups (including the first version of this post) get it wrong:

- **The original method generates context per chunk.** The whole document plus that one chunk go to an LLM, which writes a short blurb situating *that specific chunk*. Every chunk gets a different context string.
- **"Generate one document summary and prepend it to all chunks" is a cheaper approximation** — one LLM call per document instead of one per chunk. It is not equivalent, and **Anthropic's published numbers do not apply to it.**

Both variants are covered below, but don't map the simplified version's results onto the official figures.

## Design

The indexing pipeline goes beyond a simple chunk → embedding step:

Original (per-chunk context):

```text
Document
    ↓
[Chunk Splitting]        ← split first
    ↓
For each chunk:
  LLM(whole document + this chunk) → context string specific to this chunk
  contextualized = "{chunk_context}\n\n{chunk_content}"
    ↓
[Embedding] + (recommended) [BM25 index]
    ↓
[Vector Store]
```

Simplified (one shared document summary):

```text
Document
    ↓
[Document Summary]  ← LLM generates a 2–3 sentence summary (one call per document)
    ↓
[Chunk Splitting]
    ↓
Prepend the same summary to every chunk:
  context = "[Document summary: {summary}]\n\n{chunk_content}"
    ↓
[Embedding]
    ↓
[Vector Store]
```

The point of the original is that each chunk's context is written for that chunk; the simplified version trades that for cost. No need to guess at the gap: [Anthropic's own post](https://www.anthropic.com/engineering/contextual-retrieval) says they tried adding generic document summaries to chunks and *saw very limited gains*. The simplified variant saves cost by giving up most of the effect.

When a search retrieves a chunk, it now carries document-level context. Even when the LLM sees only a small passage, it understands where that passage came from and what broader topic it belongs to.

## Prompt Design

Anthropic's published prompt for the original, per-chunk variant:

```text
<document>
{{WHOLE_DOCUMENT}}
</document>
Here is the chunk we want to situate within the whole document
<chunk>
{{CHUNK_CONTENT}}
</chunk>
Please give a short succinct context to situate this chunk within the overall
document for the purposes of improving search retrieval of the chunk.
Answer only with the succinct context and nothing else.
```

That last line matters more than it looks. Without it the model tends to answer with "This chunk describes…" boilerplate, and you end up embedding the noise along with the signal.

Document summary generation for the simplified variant (what this site's climbing index actually uses):

```text
Please write a concise 2–3 sentence summary of the following climbing content,
capturing the most important information (crag, grade, style, etc.).
This summary will be prepended to every segment of the document to aid
semantic understanding during search.

Content: {document_content}

Summary (2–3 sentences):
```

Example generated summary:

```text
Longdong North Wall route, grade 5.11a, sport climbing, located in Gongliao District, New Taipei City.
The route is known for its technical difficulty, demanding good footwork and balance.
Suitable for intermediate-to-advanced climbers; protection is adequate but bolts are spaced.
```

The chunk after injection:

```text
[Document summary: Longdong North Wall route, grade 5.11a, sport climbing, located in Gongliao District, New Taipei City.
The route is known for its technical difficulty, demanding good footwork and balance. Suitable for intermediate-to-advanced climbers; protection is adequate but bolts are spaced.]

The crux comes after the third bolt — balance and footwork must work together; it's worth resting fully before committing to this section...
```

Now this chunk makes sense on its own. Both the search engine and the LLM can understand its context even in isolation.

## Async Execution

Summary generation does not sit on the main query path — it happens when a document is added to the index, using Cloudflare Workers' `ctx.waitUntil()`:

```typescript
async function indexDocument(doc: Document, env: Env, ctx: ExecutionContext) {

  // Synchronous: basic document embedding (immediately searchable)
  await embedAndStore(doc);

  // Async: generate contextual embeddings and upgrade the index (non-blocking)
  ctx.waitUntil(
    generateContextualEmbeddings(doc, env)
  );
}
```

This way the document is searchable immediately via its basic embedding, and the contextual version upgrades it in the background — no downtime, no full re-index required.

## Results

First, a correction to a number that gets miscopied everywhere: what Anthropic published is the **relative reduction in the top-20 chunk retrieval failure rate**, not an improvement in recall. The three data points from the original write-up:

| Setup | Top-20 retrieval failure rate | Relative reduction |
|---|---|---|
| Baseline (plain embeddings) | 5.7% | — |
| Contextual Embeddings | 3.7% | 35% |
| Contextual Embeddings + Contextual BM25 | 2.9% | 49% |
| The above plus reranking | 1.9% | 67% |

So "49%" requires hybrid retrieval with BM25, and "67%" requires a reranker on top of that. Neither figure comes from context injection alone. All of it is measured on Anthropic's own evaluation set (codebases, fiction, arXiv papers and science papers) — a different corpus will give different numbers.

A 2025 comparison study (arXiv:2504.19754) put Contextual Retrieval head to head with Jina's Late Chunking and found that Contextual Retrieval preserves semantic coherence better but costs considerably more compute, while Late Chunking is far more efficient at the expense of relevance and completeness. If indexing cost is a hard constraint, Late Chunking — encode the full document with a long-context embedding model, then split and pool afterwards — is worth evaluating.

In a climbing context, the gains are especially pronounced: many route-information chunks are inherently short ("the crux of the third pitch is..."), and they're nearly meaningless without context. Once you inject the crag name, grade, and route style, the relevance of those same chunks improves dramatically.

## Cost Considerations

The original variant costs one LLM call **per chunk**; the simplified variant costs one **per document**. That order-of-magnitude difference is the whole reason the simplified variant exists.

Anthropic notes that what makes the original economically viable is **prompt caching**: every chunk's prompt contains the entire document, but that document is a shared prefix and can be cached rather than reprocessed each time. Turn it on before running the original at any scale, or the bill gets ugly fast (unit prices change — check the provider's current pricing page).

Other mitigations:

1. **Incremental indexing**: only regenerate context for new or modified documents
2. **Batch processing**: run updates during off-peak hours overnight
3. **Caching**: if a document hasn't changed, reuse the context already generated for it

The retrieval-quality gain usually justifies the indexing overhead — but measure it on your own corpus rather than borrowing someone else's numbers.

## The Bottom Line

Contextual Retrieval addresses a root-level problem in RAG systems: chunking destroys context. This problem is far more effectively solved at the indexing stage than patched later during search or generation — improving data quality at the source beats algorithmic workarounds downstream.

"Garbage in, garbage out" is the most common cause of RAG system failures. Contextual Retrieval ensures that every chunk entering the index is a **meaningful unit of information**, not just a truncated fragment of text.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Introducing Contextual Retrieval (Anthropic Engineering, Sep 2024)](https://www.anthropic.com/engineering/contextual-retrieval)
- [Contextual Retrieval — Anthropic News](https://www.anthropic.com/news/contextual-retrieval)
- [Anthropic Cookbook — Contextual Embeddings implementation notebook](https://github.com/anthropics/claude-cookbooks/blob/main/capabilities/contextual-embeddings/guide.ipynb)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (arXiv:2005.11401, the original RAG paper)](https://arxiv.org/abs/2005.11401)
- [Reconstructing Context: Evaluating Advanced Chunking Strategies for RAG (arXiv:2504.19754)](https://arxiv.org/abs/2504.19754)
- [Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models (arXiv:2409.04701)](https://arxiv.org/abs/2409.04701)
- [Full text queries (Elasticsearch / BM25 hybrid retrieval)](https://www.elastic.co/docs/reference/query-languages/query-dsl/full-text-queries)
- [iThome — Contextual Retrieval article](https://ithelp.ithome.com.tw/articles/10389779)
- [NobodyClimb Architecture: Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
