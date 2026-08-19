---
title: "HyDE: Boosting Vector Search Recall with Hypothetical Answers"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, hyde, embedding, vector-search, query-enhancement]
lang: en
tldr: "Have an LLM generate an 'ideal answer' first, then embed that hypothetical document for search — it outperforms searching with the raw query."
description: "The design rationale behind HyDE (Hypothetical Document Embeddings), when to use it, and its practical impact in real RAG systems."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 14
---

> 🌏 [中文版](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)

Vector search has a fundamental asymmetry problem: **the language patterns of a user's query and the documents in your database are very different**.

A user asks: "Which route at Longdong is good for a first outdoor climb?"
The document in the database reads: "Longdong North Wall, 5.9, sport climbing, well-protected, clean fall zones, suitable for beginners getting into outdoor climbing."

The query is a question; the document is a description. Their embeddings end up far apart in vector space, and search recall suffers.

HyDE (Hypothetical Document Embeddings) solves this by **using an LLM to transform the query into a "hypothetical ideal answer document," then searching with that document instead**. The hypothetical document shares much closer language patterns with real documents in the database, resulting in smaller embedding distances and better search quality.

## How It Works

```
User Query → LLM → Hypothetical Document → Embedding → Vector Search
                                                              ↓
                                                    Real Documents in DB
```

The LLM-generated hypothetical document doesn't need to be accurate — it's just a semantic bridge. Even if the content is wrong, as long as the language patterns (vocabulary, structure, tone) resemble the documents in the database, the embedding will surface more relevant results.

## Prompt Design

```
Based on the following climbing question, generate a hypothetical ideal answer document (under 100 words).
It doesn't need to be accurate — just written in a style similar to a climbing route description.

Question: {query}
Hypothetical answer document:
```

The direction of the length limit matters — too long and unrelated semantics dilute the embedding; too short and there isn't enough semantic signal to capture. The specific number (100 words here) is not a general rule: it depends on your chunk size and the effective input length of your embedding model, and it needs tuning against your own eval set.

## When to Trigger HyDE

HyDE doesn't run on every query — it only activates when `queryType === 'complex'`. The reasoning:

- **Simple queries** (e.g., "How many routes are at Longdong?"): semantics are clear, no hypothetical document needed
- **General knowledge queries** (e.g., "forearm training methods"): answered directly by the LLM, no RAG needed
- **SQL queries** (e.g., "How many routes did I complete this year?"): handled by structured queries, no embedding needed
- **Complex queries** (e.g., "Longdong route recommendations for intermediate climbers"): semantically ambiguous, multi-condition — this is where HyDE delivers the most value

## Parallel Execution

The HyDE LLM call and the embedding of the original query run **in parallel**, so there's no added serial latency:

```typescript
const [queryEmbedding, hydeEmbedding] = await Promise.all([
  embed(query),
  generateHyDEAndEmbed(query), // LLM generation + embed
]);

// Each embedding searches independently; results are merged with RRF
const [queryResults, hydeResults] = await Promise.all([
  searchVectorize(queryEmbedding, filter, topK),
  searchVectorize(hydeEmbedding, filter, topK),
]);
```

When fed into RRF, the HyDE search results are treated as a separate lane, merged alongside other search paths (BM25, Multi-Query).

## Why It Works

The original query vector represents the **semantics of the question**, while the hypothetical document vector represents the **semantics of an answer**. Documents in the database are much closer to "answer semantics," so searching with the hypothetical document naturally yields higher recall.

[The paper's](https://arxiv.org/abs/2212.10496) final formulation (Eq. 8) already averages the original query embedding back in — `v̂ = 1/(N+1)[Σf(d̂_k) + f(q)]` — so it does not replace it entirely. In practice, **combining both and merging results via RRF** outperforms either alone: the query embedding preserves original intent, while the HyDE embedding expands semantic coverage.

## An Important Correction: HyDE Is Not a Guaranteed Win

This needs saying plainly, because most HyDE write-ups skip it.

First, **the original paper's baseline was an unsupervised retriever**. HyDE's headline result is a large win over an unsupervised Contriever; against retrievers that had been fine-tuned for the task, the paper describes its performance as *comparable*, not superior. Reading HyDE as "add this and beat your current baseline" misreads the result.

Second, and more importantly: Weller et al. (EACL 2024) ran a systematic study across 11 expansion techniques, 12 datasets, and 24 retrieval models, and found a **strong negative correlation between retriever strength and the gains from expansion — expansion helps weaker models but generally harms stronger ones**. Their explanation is that expansions do add information (potentially improving recall) but also add noise, making the genuinely top-relevant documents harder to distinguish from the rest and introducing false positives. Their recipe is blunt: **use expansions for weaker retrievers, or when the target corpus differs substantially in format from the training corpus; otherwise avoid them and keep the relevance signal clear.**

That is why keeping the original query lane present matters: even if the HyDE lane pulls in noise, it does not replace the clean signal outright. The paper does this too, by averaging the query vector in; the difference here is only that the fusion happens over retrieval results with RRF rather than over vectors. But that is a mitigation, not immunity — **you still have to measure on your own eval set and confirm the HyDE lane is a net gain**, especially once you have moved to a newer, stronger multilingual embedding model.

Third, there is a cost-side alternative. ReDE-RF (2024) reframes hypothetical document generation as a relevance estimation task: instead of writing a whole document, the LLM only picks which documents are relevant, so it needs to emit a single token and requires no domain knowledge of its own. The paper reports beating HyDE across a range of low-resource retrieval datasets while substantially cutting per-query latency. If HyDE's token cost is what is blocking you, that is the direction worth reading.

## Limitations

- One extra LLM call adds latency cost (even though it runs in parallel, it still consumes tokens)
- If the generated hypothetical document drifts too far from the domain, it can introduce noise
- Limited benefit for short queries (3–5 words) where the semantics are already clear
- The stronger the retriever, the smaller — and eventually negative — the marginal benefit of expansion (see above)

Overall, for complex or ambiguous natural language queries, and where the underlying retriever is not already a strong model for the domain, HyDE is a low-cost way to improve recall. But it is a technique **you turn on after measuring**, not a default part of the stack — run the eval, confirm the net gain is positive, then ship it.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE) (Gao et al., 2022)](https://arxiv.org/abs/2212.10496)
- [When do Generative Query and Document Expansions Fail? (Weller et al., EACL 2024)](https://arxiv.org/abs/2309.08541)
- [Zero-Shot Dense Retrieval with Embeddings from Relevance Feedback (ReDE-RF, 2024)](https://arxiv.org/abs/2410.21242)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) (zh-TW only)
