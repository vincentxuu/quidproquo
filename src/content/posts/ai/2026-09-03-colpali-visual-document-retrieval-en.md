---
title: "ColPali: Skip OCR, Retrieve Documents Directly from Images"
date: 2026-09-03
type: deep-dive
category: ai
tags: [colpali, visual-rag, late-interaction, document-retrieval, multi-vector, rag]
lang: en
tldr: "ColPali renders each PDF page as an image, generates patch-level multi-vector embeddings with a vision-language model, and retrieves via MaxSim late interaction. On table-heavy financial PDFs, recall jumps from 62% to 84% — no OCR, no chunking. The tradeoff: ~100× storage, GPU required, no BM25."
description: "How ColPali works: from the structural failures of OCR pipelines to patch-level multi-vector embeddings and MaxSim late interaction, with a comparison of ColPali / ColQwen2.5 / ColSmol and ViDoRe benchmark results."
draft: false
series:
  name: "RAG 技法大全"
  order: 49
---

> 🌏 [中文版](/posts/ai/2026-09-03-colpali-visual-document-retrieval)

The standard RAG pipeline processes documents through OCR → text extraction → chunking → embedding. This works well for plain text, but on PDFs with tables, charts, and complex layouts, every step loses information. ColPali takes a fundamentally different approach: skip the entire text pipeline and treat each page as an image.

## Where OCR Pipelines Break Down

The problem isn't any single step — it's that errors compound across the pipeline:

**OCR**: Poor scan quality, multi-column layouts, and small text inside table cells all produce recognition errors. Per [arXiv:2410.21169](https://arxiv.org/abs/2410.21169), even state-of-the-art OCR engines still have 2-5% character error rates on complex layouts.

**Layout analysis**: Table boundary detection, column splitting, and mixed text-image region segmentation are each independent ML problems with their own failure modes. One misdetected table boundary propagates errors to everything downstream.

**Chunking**: Even with perfect text extraction, fixed-size chunking still shreds tables. Subsequent chunks lose their headers, embedding quality drops, and semantic retrieval intermittently misses critical rows. Per [arXiv:2605.00318](https://arxiv.org/abs/2605.00318), table fragmentation is the most common retrieval failure mode on structured documents.

ColPali's premise: **instead of patching each step, skip the entire pipeline**.

## How ColPali Works

ColPali (Faysse et al., ICLR 2025) takes the late interaction mechanism from [ColBERT](/en/posts/ai/2026-03-12-colbert-late-interaction-en) and moves it from text tokens to image patches.

### The Pipeline

```
Traditional:
  PDF → OCR → Text → Chunking → Embedding (single vector) → Retrieval

ColPali:
  PDF → Render pages as images → VLM patch embedding (multi-vector) → Retrieval
```

1. **Page rendering**: Each PDF page is rendered as a 448×448 pixel image
2. **Patch embedding**: A vision-language model's (VLM) ViT encoder processes the image, producing 1,030 patch tokens, each projected to a 128-dimensional vector via a learned linear layer
3. **MaxSim retrieval**: Query text is similarly encoded into token-level vectors. Relevance is scored via MaxSim — for each query token, find the maximum similarity across all document patches, then sum

### MaxSim: Identical to ColBERT

```
ColBERT:
  Query text tokens   ⟷ MaxSim ⟷  Document text tokens
  [q1, q2, q3]              [d1, d2, ..., d200]

ColPali:
  Query text tokens   ⟷ MaxSim ⟷  Document image patches
  [q1, q2, q3]              [p1, p2, ..., p1030]

Score = Σᵢ max_j sim(qᵢ, pⱼ)
```

The only difference is on the document side: ColBERT produces one vector per text token; ColPali produces one vector per image patch. The query side is text tokens in both cases. The MaxSim computation is exactly the same.

This enables **cross-modal fine-grained matching**: the characters "B1 regulation" in a query can directly match against the image patches corresponding to that cell region in a table — no text extraction needed.

## The Model Family

ColPali is an architecture, not a single model. As the underlying VLMs evolve, a family has emerged:

| Model | Base VLM | Parameters | Patches/page | ViDoRe V1 nDCG@5 |
|---|---|---|---|---|
| ColPali v1.3 | PaliGemma-3B | 3B | 1,024 | ~81 |
| ColQwen2.5 v0.2 | Qwen2-VL-3B | 3B | Dynamic (PatchMerger) | ~84 |
| ColSmol-500M | SmolVLM | 500M | ~832 | ~74 |

Per the [colpali GitHub](https://github.com/illuin-tech/colpali):

- **ColPali v1.3** is the original, using a fixed 32×32 grid with 1,024 patches per page
- **ColQwen2.5** replaces PaliGemma with Qwen2-VL, supports dynamic resolution, and currently delivers the best results
- **ColSmol-500M** is the lightweight variant — 1/6 the parameters, runnable on consumer GPUs and Apple Silicon

A major development in 2026: **the colpali-engine package is deprecated**. The official recommendation is to migrate to Sentence Transformers v6's `MultiVectorEncoder`:

```python
from sentence_transformers import MultiVectorEncoder

model = MultiVectorEncoder("vidore/colqwen2-v1.0")

query_embeddings = model.encode_query(queries)
document_embeddings = model.encode_document(images)
scores = model.similarity(query_embeddings, document_embeddings)
```

## ViDoRe Benchmark: Purpose-Built for Visual Document Retrieval

The ColPali team also created ViDoRe (Vision Document Retrieval), a benchmark in three progressively harder versions:

| Version | Scope | Focus |
|---|---|---|
| V1 | Technical PDFs + slides, 10 sub-tasks | Scientific and industry documents, in-domain evaluation |
| V2 ([arXiv:2505.17166](https://arxiv.org/abs/2505.17166)) | Zero-shot cross-domain, multilingual queries | More realistic usage: queries don't depend on document content |
| V3 ([arXiv:2601.08620](https://arxiv.org/abs/2601.08620)) | Multi-hop reasoning, open-ended, non-textual queries | Complex real-world retrieval scenarios |

Top models approach saturation on V1 (nDCG@5 > 90), but on V3, **even the best late-interaction models stay below 65% nDCG@10** — multi-hop, open-ended, and non-textual queries remain difficult. Per [Emergent Mind's analysis](https://www.emergentmind.com/topics/vidore-benchmarks), models that perform well on V1 drop noticeably on V2/V3, highlighting persistent generalization gaps.

The benchmark itself is as significant as the models: it shifts the evaluation standard for document retrieval from pure text to the visual layer.

## Performance and Tradeoffs

### Where ColPali Shines

Particula's evaluation provides the clearest picture: on financial PDFs (heavy on tables and charts), traditional dense retrieval recall is 62%, while ColQwen reaches 84%. The gap is largest on structured layouts — table structure is 100% preserved, unlike text chunking which fragments it.

Per [arXiv:2602.12510](https://arxiv.org/abs/2602.12510) (Visual RAG Toolkit), 2-stage retrieval (coarse prefetch then MaxSim rerank) gives ColPali and ColQwen2.5 a ~4× QPS improvement with near-lossless nDCG@5 and nDCG@10 (±0.01).

### The Costs

| Dimension | ColBERT (text) | ColPali (visual) | Impact |
|---|---|---|---|
| Vectors/document | ~200 (per token) | ~1,030 (per patch) | Storage ~5× |
| Vector dimension | 128 | 128 | Same |
| Index size vs Bi-Encoder | ~200× | ~1,030× | Significantly larger |
| Full-text search (BM25) | ✅ Available | ❌ No text | Hybrid retrieval not possible |
| Inference hardware | CPU works | GPU required | Infrastructure cost |
| Ingestion speed | Fast | Slow (VLM inference) | Large corpus ingestion takes time |

The biggest limitation isn't performance — it's **architectural compatibility**: ColPali entirely bypasses text extraction, which means BM25 full-text search is unavailable. In RAG systems where hybrid retrieval (BM25 + vector) is standard practice, adopting ColPali means giving up half the retrieval pipeline.

The production solution is a **hybrid architecture**: route text-heavy documents through the traditional pipeline, and table/chart-heavy documents through ColPali. Per Spheron's deployment guide, Qdrant supports multi-vector collections with MaxSim scoring, and Vespa supports phased retrieval for scaling to large corpora.

## Positioning Within Existing RAG Techniques

ColPali doesn't replace the entire RAG pipeline — it fills a specific gap:

```
Document type spectrum:

Text-heavy documents ──────────────── Table/chart-heavy PDFs
    │                                      │
    ├─ Traditional chunking + embedding    ├─ ColPali
    ├─ Contextual Retrieval               ├─ ColQwen2.5
    ├─ Hybrid Search (BM25 + vector)      │
    ├─ Reranking                          │
    └─ Header Propagation (header fix)    └─ Skip text entirely
```

- If documents are mostly text with occasional tables → [Header Propagation](/en/posts/ai/2026-03-12-chunking-strategies-en) + [Contextual Retrieval](/en/posts/ai/2026-03-12-contextual-retrieval-en) suffice
- If documents are heavily tables, charts, and scans → ColPali is currently the most effective approach
- Mixed corpora → route by document type to different pipelines

## What's Next

ColPali's impact extends beyond the model itself — it opens a new research direction:

**Vision-Guided Chunking** ([arXiv:2506.16035](https://arxiv.org/abs/2506.16035)): Rather than skipping text entirely, use visual information to guide chunking boundaries — let the model see the page image to decide where to split. This is a middle ground between ColPali's "all-visual" and the traditional "all-text" approach.

**ViDoRe V3 challenges**: Even as ColPali-family models approach saturation on V1, V3 reveals that multi-hop reasoning and cross-page associations remain unsolved. Late interaction excels at single-page retrieval, but global reasoning across pages requires different architectures.

**Sentence Transformers unification**: colpali-engine merging into Sentence Transformers v6's `MultiVectorEncoder` gives ColBERT (text) and ColPali (visual) a shared API and infrastructure. This lowers the adoption barrier — teams already using Sentence Transformers can add visual retrieval without learning a new framework.

## The Bottom Line

ColPali demonstrates an elegant conceptual extension: ColBERT proved that late interaction + MaxSim works for text retrieval; ColPali moves the same mechanism to image patches and solves the structural problems of OCR pipelines. Simple concept, significant results.

But "simple" doesn't mean "universal." ColPali is currently best suited for table/chart-heavy PDF corpora — financial reports, regulatory documents, technical specifications. In those scenarios, its recall advantage (+22 percentage points) justifies the storage and GPU costs. For text-heavy documents, the traditional pipeline with header propagation and Contextual Retrieval remains the more economical choice.

The most likely future isn't "ColPali replaces everything" but rather **routing by document type to the most suitable retrieval pipeline** — fully aligned with the broader RAG trend toward adaptive retrieval and query routing.

## References

- [ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)](https://arxiv.org/abs/2407.01449)
- [ViDoRe Benchmark V2: Raising the Bar for Visual Retrieval (arXiv:2505.17166)](https://arxiv.org/abs/2505.17166)
- [ViDoRe V3: A Comprehensive Evaluation of RAG in Complex Real-World Scenarios (arXiv:2601.08620)](https://arxiv.org/abs/2601.08620)
- [Visual RAG Toolkit: Scaling Multi-Vector Visual Retrieval (arXiv:2602.12510)](https://arxiv.org/abs/2602.12510)
- [Vision-Guided Chunking: Enhancing RAG with Multimodal Document Understanding (arXiv:2506.16035)](https://arxiv.org/abs/2506.16035)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects (arXiv:2410.21169)](https://arxiv.org/abs/2410.21169)
- [Structure-Aware Chunking for Tabular Data in RAG (arXiv:2605.00318)](https://arxiv.org/abs/2605.00318)
- [ColPali GitHub — illuin-tech/colpali](https://github.com/illuin-tech/colpali)
- [Sentence Transformers v6 MultiVectorEncoder — Hugging Face Blog](https://huggingface.co/blog/multi-vector-encoder)
- [Visual RAG vs OCR: ColPali for PDF Tables and Charts — Particula](https://particula.tech/blog/visual-rag-vs-ocr-colpali-pdf-tables-charts)
- [An Overview of Late Interaction Retrieval Models — Weaviate](https://weaviate.io/blog/late-interaction-overview)
- [ColBERT: The Third Way in Vector Search](/en/posts/ai/2026-03-12-colbert-late-interaction-en)
- [Chunking Strategies: How Splitting Determines Whether RAG Finds the Answer](/en/posts/ai/2026-03-12-chunking-strategies-en)
- [Contextual Retrieval: Adding "What This Chunk Is About" to Every Chunk](/en/posts/ai/2026-03-12-contextual-retrieval-en)
