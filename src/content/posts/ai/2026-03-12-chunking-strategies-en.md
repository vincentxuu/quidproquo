---
title: "Chunking Strategies: How You Split Text Determines Whether RAG Can Find the Answer"
date: 2026-03-12
updated: 2026-09-03
type: guide
category: ai
tags: [rag, chunking, indexing, text-splitting, retrieval, table-chunking]
lang: en
tldr: "Chunks too large and retrieval loses precision; too small and you lose context; hit a table and retrieval falls apart entirely. Chunking is the most underrated part of RAG — pick the wrong strategy and no amount of downstream optimization will save you."
description: "A comparison of RAG chunking strategies — Fixed-size, Sentence-based, Recursive, Semantic Chunking, and table-aware splitting — covering their use cases and implementation trade-offs."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-03-12-chunking-strategies)

When a RAG system fails to find the right answer, the culprit is often not the search algorithm — it's the chunking strategy chosen at the very beginning.

Chunking is the process of splitting long documents into smaller segments that can each be embedded independently. This decision directly determines:
- How large a semantic unit each vector represents
- How much context the LLM can see when a chunk is retrieved
- How many vectors a single document generates, affecting index size and retrieval efficiency

No single strategy fits every scenario.

## Fixed-size Chunking

The simplest approach: split by a fixed number of characters or tokens.

```typescript
function fixedSizeChunk(text: string, chunkSize = 512, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap; // overlap keeps adjacent chunks from missing boundary content
  }

  return chunks;
}
```

**Overlap** is the key design choice here: letting adjacent chunks share a small window of text prevents critical information from falling exactly on a chunk boundary.

**Pros**: Simple to implement, index size is predictable.

**Cons**: Completely ignores semantic boundaries. A sentence like "The crux move is right after the third bolt, requiring—" gets sliced in half, leaving the semantic unit broken.

**Best for**: Documents with no clear structure, or as a fallback for other strategies.

---

## Sentence-based Chunking

Split along sentence boundaries so every chunk contains complete sentences.

```typescript
function sentenceChunk(text: string, maxTokens = 256): string[] {
  // NLP-based sentence splitting (handles multilingual sentence boundaries)
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (tokenCount(current + sentence) > maxTokens) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += " " + sentence;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}
```

**Pros**: Preserves semantic integrity; every chunk is a readable, complete statement.

**Cons**: Sentence lengths vary widely, leading to uneven chunk sizes. Sentence boundary detection can be unreliable for non-English text.

**Best for**: Narrative prose with clear paragraph structure (route reviews, climbing trip reports).

---

## Recursive Chunking

Popularized by LangChain: try to split with large delimiters first (paragraphs, line breaks), and if a chunk is still too large, fall back to smaller delimiters (periods, commas).

```typescript
const separators = ["\n\n", "\n", ".", ",", " "];

function recursiveChunk(
  text: string,
  maxSize: number,
  separators: string[]
): string[] {
  if (text.length <= maxSize) return [text];

  const sep = separators[0];
  const remaining = separators.slice(1);
  const parts = text.split(sep);
  const chunks: string[] = [];
  let current = "";

  for (const part of parts) {
    if ((current + sep + part).length > maxSize) {
      if (current) chunks.push(current);

      if (part.length > maxSize && remaining.length > 0) {
        // Still too long — recurse with the next delimiter level
        chunks.push(...recursiveChunk(part, maxSize, remaining));
        current = "";
      } else {
        current = part;
      }
    } else {
      current = current ? current + sep + part : part;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}
```

**Pros**: Preserves natural boundaries as much as possible (paragraph > sentence > word) while keeping chunk sizes under control.

**Cons**: More complex to implement; the right set of separators depends on the document type and needs to be tuned per content class.

**Best for**: Technical documentation and explanatory text with clear paragraph structure.

---

## Semantic Chunking

The most elaborate approach: embed each sentence, compute the semantic distance between adjacent sentences, and split at semantic "fault lines."

The conclusion before the code: **this sounds like the smartest option, and there is no evidence it earns its cost.** A 2024 systematic evaluation (arXiv:2410.13070, *Is Semantic Chunking Worth the Computational Cost?*) compared semantic chunking against plain fixed-size chunking across document retrieval, evidence retrieval, and retrieval-based answer generation, and concluded that the computational costs of semantic chunking are not justified by consistent performance gains. Chroma's chunking evaluation technical report reaches a compatible finding: heuristic strategies like a well-parameterized `RecursiveCharacterTextSplitter` often perform well in practice.

Treat it as something you reach for when you have budget *and* have measured a real improvement — not as a default.

```typescript
async function semanticChunk(
  sentences: string[],
  threshold = 0.8,
  env: Env
): Promise<string[]> {
  // Embed every sentence
  const embeddings = await Promise.all(
    sentences.map(s => embed(s, env))
  );

  const chunks: string[] = [];
  let currentChunk = [sentences[0]];

  for (let i = 1; i < sentences.length; i++) {
    const similarity = cosineSimilarity(embeddings[i - 1], embeddings[i]);

    if (similarity < threshold) {
      // Semantic shift detected — start a new chunk
      chunks.push(currentChunk.join(" "));
      currentChunk = [sentences[i]];
    } else {
      currentChunk.push(sentences[i]);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}
```

**Pros**: Splits happen where the topic actually changes, so each chunk stays tightly focused on one idea.

**Cons**:
- Every sentence needs to be embedded — indexing cost scales linearly with sentence count (N sentences = N embedding calls)
- The threshold has no universal value and needs to be tuned per content type
- Can produce chunks that are too long or too short
- Per the evaluations above, those costs do not buy a consistent retrieval-quality gain

**Best for**: Documents with variable structure and frequent topic shifts — and only once **you have measured on your own corpus that it beats Recursive**.

---

## Late Chunking

A different route, proposed by Jina AI in 2024 (arXiv:2409.04701): instead of splitting first and embedding each piece separately, **encode all tokens of the full document with a long-context embedding model, and apply the split after the transformer but before mean pooling**. Because the split happens after the model has seen the whole document, each chunk vector carries surrounding context by construction.

It attacks the same problem as Contextual Retrieval — chunks losing their context — from the opposite direction: Contextual Retrieval generates text with an LLM and then embeds it, while Late Chunking only changes *when* pooling happens and needs no extra LLM calls.

A 2025 comparison (arXiv:2504.19754) evaluated both: Contextual Retrieval preserves semantic coherence better but costs more compute; Late Chunking is far more efficient at the cost of relevance and completeness.

**Constraint**: you need an embedding model with a long enough context window — and the input length your inference platform actually accepts is often far below the model's headline number. Verify what your platform really ingests before committing to this.

---

## The Table Chunking Problem

Every strategy discussed above was designed for continuous prose — paragraphs, sentences, semantic spans. When they hit a **table**, they all run into the same structural failure: the header row appears only in the first chunk, and every subsequent chunk becomes a pile of values with no column names.

A PDF table split by `SentenceSplitter(chunk_size=512)` into 8 chunks keeps the header in chunk 1 only. The remaining 7 chunks produce embeddings that cannot encode "which table, which column," making semantic retrieval miss critical rows. A 2026 Towards Data Science analysis calls tables "The Retrieval Black Hole" — the odds of retrieving what you need are close to random.

Three response strategies, from simplest to most involved:

### Header Propagation

Add one post-processing step after splitting: detect Markdown table structure (`|...|` + `|---|`) and prepend the header row to every subsequent chunk that lacks one.

```
Before:
  Chunk 5: real-estate limited to Taiwan... | counterparty | ... | prohibited | ...

After:
  Chunk 5: | Project | 【B1】| 【B2】| 【B3】| 【B4】|  ← header prepended
           real-estate limited to Taiwan... | counterparty | ... | prohibited | ...
```

Minimal change, deterministically testable ("every table chunk starts with a header row"), directly improves embedding quality. The cost is one extra header row per chunk (~50 tokens); affected files need re-embedding. For an open-source implementation, [Chonkie](https://docs.chonkie.ai)'s TableChunker "splits markdown tables by row, always preserving the header"; Microsoft Azure Data Parsing also provides built-in column header restoration and cross-page table merging.

### Table-Aware Chunking (Structure-Aware Splitting)

Change the splitting logic at the root: use **rows** as the atomic unit so tables are never sliced across columns. The 2025 STC framework (arXiv:2605.00318, *Structure-Aware Chunking for Tabular Data in RAG*) works in three steps:

1. **Row Tree**: Convert the table into a root → sheet → row hierarchy, each row in key-value format
2. **Token-budget recursive splitting**: Only subdivide when a chunk exceeds the budget
3. **Greedy merging**: Combine adjacent small chunks

On the MAUD legal-document dataset, Recall@1 rose from a baseline of 0.347 to **0.539** (+55%), while chunk count dropped 40% — smarter splits, smaller index. In BM25-only scenarios the improvement was even larger: Recall@1 jumped from 0.366 to **0.754**.

Limitations: requires replacing the existing SentenceSplitter and modifying the ingestion pipeline; the paper evaluated CSV/Excel formats, so PDF → Markdown conversion quality is a prerequisite.

### Proposition Chunking

The opposite extreme: use an LLM to decompose text into atomic factual propositions (arXiv:2312.06648, *Dense X Retrieval*, EMNLP 2024). Each proposition is a self-contained, independent statement.

Recall@5 improves by roughly +12%, but chunk count explodes (a single paragraph can yield 5–10× more propositions), and LLM processing costs are high. For tabular data that is already structured, proposition format is not necessarily better than preserving the original table structure — the structure is already there; the problem is that splitting destroyed it.

---

## The Chunk Size Trade-off

| Chunk size | Retrieval precision | Context completeness | Index size |
|------------|--------------------|--------------------|------------|
| Small (128 tokens) | High (exact hits) | Low (fragments) | Large |
| Medium (512 tokens) | Medium | Medium | Medium |
| Large (1024 tokens) | Low (fuzzy) | High (complete) | Small |

The numbers above are illustrative orders of magnitude, not recommendations. The real ceiling is set by how long an input your embedding model — and your inference platform — will accept; hosted platforms frequently cap single-request input tokens well below the model's own specification, so check the limit for your model on your platform before choosing a chunk size.

The solution: **Parent Document Retriever** (a two-level architecture)

- Small chunks for retrieval (precise matching)
- On a hit, fetch the parent large chunk (full context) to pass to the LLM

```
Indexing:
  small chunk (128 tokens) → embedding
  large chunk (512 tokens) → stored as text, linked to its small chunks

Retrieval:
  query → find the most relevant small chunk
        → fetch the associated large chunk
        → send to LLM for generation
```

This design lets retrieval precision and context completeness coexist without compromising either.

## Applying This in a Climbing Context

Route descriptions have a consistent structure (name, grade, type, description, notes), which makes them a natural fit for Recursive Chunking — split at paragraph boundaries so each chunk is a semantically complete descriptive unit.

Pair that with Contextual Retrieval (injecting a document summary into each chunk) to compensate for the context lost when a small chunk is retrieved in isolation.

## The Bottom Line

Chunking is the most foundational — and most globally impactful — decision in a RAG system. Every technique you layer on top (HyDE, Multi-Query, Reranker) depends on the premise that the index contains correct semantic units. If the index itself is broken, better retrieval can't fix it.

The most practical starting point: Recursive Chunking + Contextual Retrieval. Then evaluate actual retrieval quality — look at the chunks that get hit in your traces and ask whether they make sense — before deciding whether to switch strategies.

Further reading: [Hierarchical Chunking + Auto-Merge: Small Chunks for Precision, Large Chunks for Context](/en/posts/ai/2026-09-03-hierarchical-chunking-auto-merge-en), [Table Serialization: How to Turn Tables into Text for RAG](/en/posts/ai/2026-09-03-table-serialization-rag-en), [Agentic Parsing: Letting Agents Decide How to Parse Documents](/en/posts/ai/2026-09-03-agentic-parsing-document-agents-en).

---

## Changelog

- 2026-09-03: Added "The Table Chunking Problem" section covering Header Propagation, Table-Aware Chunking (STC), and Proposition Chunking, with associated references.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Anthropic - Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [LangChain Text Splitters Documentation](https://docs.langchain.com/oss/python/integrations/splitters/)
- [LlamaIndex - Node Parsers / Text Splitters](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/)
- [Evaluating Chunking Strategies for Retrieval (Chroma technical report, Jul 2024)](https://research.trychroma.com/evaluating-chunking)
- [Is Semantic Chunking Worth the Computational Cost? (arXiv:2410.13070)](https://arxiv.org/abs/2410.13070)
- [Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models (arXiv:2409.04701)](https://arxiv.org/abs/2409.04701)
- [Reconstructing Context: Evaluating Advanced Chunking Strategies for RAG (arXiv:2504.19754)](https://arxiv.org/abs/2504.19754)
- [Unstructured.io - Chunking Best Practices](https://docs.unstructured.io/open-source/core-functionality/chunking)
- [Structure-Aware Chunking for Tabular Data in RAG (arXiv:2605.00318)](https://arxiv.org/abs/2605.00318)
- [Dense X Retrieval: What Retrieval Granularity Should We Use? (arXiv:2312.06648, EMNLP 2024)](https://arxiv.org/abs/2312.06648)
- [Beyond Chunk-Then-Embed: Comprehensive Taxonomy of Chunking Strategies (arXiv:2602.16974)](https://arxiv.org/abs/2602.16974)
- [A Systematic Investigation of Document Chunking Strategies (arXiv:2603.06976)](https://arxiv.org/abs/2603.06976)
- [Chonkie TableChunker — row-level table splitting with header preservation](https://docs.chonkie.ai)
- [NobodyClimb System Architecture: Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
