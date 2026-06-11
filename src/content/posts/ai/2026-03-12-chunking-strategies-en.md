---
title: "Chunking Strategies: How You Split Text Determines Whether RAG Can Find the Answer"
date: 2026-03-12
type: guide
category: ai
tags: [rag, chunking, indexing, text-splitting, retrieval]
lang: en
tldr: "Chunks too large and retrieval loses precision; too small and you lose context. Chunking is the most underrated part of RAG — pick the wrong strategy and no amount of downstream optimization will save you."
description: "A comparison of RAG chunking strategies — Fixed-size, Sentence-based, Recursive, and Semantic Chunking — covering their use cases and implementation trade-offs."
draft: false
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

The most sophisticated approach: embed each sentence, compute the semantic distance between adjacent sentences, and split at semantic "fault lines."

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

**Best for**: Documents with variable structure and frequent topic shifts; high-quality indexing where budget allows.

---

## The Chunk Size Trade-off

| Chunk size | Retrieval precision | Context completeness | Index size |
|------------|--------------------|--------------------|------------|
| Small (128 tokens) | High (exact hits) | Low (fragments) | Large |
| Medium (512 tokens) | Medium | Medium | Medium |
| Large (1024 tokens) | Low (fuzzy) | High (complete) | Small |

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

---

## References

- [Anthropic - Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [LangChain Text Splitters Documentation](https://docs.langchain.com/oss/python/integrations/splitters/)
- [LlamaIndex - Node Parsers / Text Splitters](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/)
- [Evaluating Chunking Strategies for Retrieval (arXiv:2406.14497)](https://arxiv.org/abs/2406.14497)
- [Unstructured.io - Chunking Best Practices](https://docs.unstructured.io/open-source/core-functionality/chunking)
- [NobodyClimb System Architecture: Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
