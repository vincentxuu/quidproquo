---
title: "Building a Legal Contract RAG in 36 Hours: Weaviate Query Agent + ColQwen Architecture Breakdown"
date: 2026-04-23
type: guide
category: ai
tags: [rag, weaviate, legal-ai, colqwen, muvera, vector-database, agentic-search]
lang: en
tldr: "Using Weaviate Query Agent + ColQwen multi-vector model, a single prompt built a production-grade legal contract search system in 36 hours -- this post breaks down its architecture logic, technology choices, and what you actually need to watch out for."
description: "Breaking down the complete architecture of Weaviate's legal contract RAG system: ColQwen visual embeddings, Muvera multi-vector compression, Query Agent dynamic reasoning search, and the CUAD dataset data structure."
draft: false
series:
  name: "RAG 系統實戰"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-04-23-weaviate-legal-rag-architecture)

Legal document search is one of the hardest scenarios for RAG. Not because of data volume, but because of the precision requirement: if the user asks about a 2024 contract, you cannot return a semantically similar clause from 2022. Date, parties involved, governing law, specific clause type -- getting any single dimension wrong is a legal risk.

Weaviate's Victoria Slocum published an article in February 2026 documenting how they built a legal contract search system for their internal finance team in 36 hours. This post breaks down the complete architecture and explains the logic behind each technology choice.

## Why Traditional RAG Fails in Legal Scenarios

The problem with traditional Naive RAG is that it is static. You write a retriever, and it does a fixed thing: semantic search, keyword search, or hybrid. If the user's query is "find all confidentiality clauses effective after 2024 governed by California law," traditional RAG either gives you a pile of "semantically related but wrong date" results, or you have to manually write every filter rule.

The root of the problem: **legal queries are rarely one-dimensional**. They need to simultaneously satisfy the intersection of multiple conditions like date, jurisdiction, and contract type.

## Architecture Overview

```
PDF Contracts
   │
   ▼
ColQwen (Visual Embeddings)
   │ Each page → Multi-vectors
   ▼
Muvera Compression (32× memory compression)
   │
   ▼
Weaviate (Three Collections)
   │  CommercialContracts
   │  CorporateIPContracts
   │  OperationalContracts
   ▼
Query Agent (Dynamic Reasoning)
   ├─ Schema Inspection → Determine search strategy
   ├─ Filter + Aggregation Construction
   ├─ Rerank Sub-agent
   └─ Answer Sub-agent
   │
   ▼
FastAPI (Streaming) + Next.js (with source citations)
```

## ColQwen: PDF Embedding Without OCR

The traditional PDF processing pipeline is: OCR → text extraction → chunking → embedding. This path has many problems with table-dense, layout-complex contract documents -- OCR errors directly contaminate the vectors.

ColQwen takes a different approach: it treats each PDF page as an **image** and feeds it directly as input, outputting a multi-vector representation of visual tokens. No OCR needed, no text extraction preprocessing, and layout, table, and heading structural information is all preserved in the visual tokens.

Each object is a single PDF page. The schema looks like this:

```python
wvc.config.Configure.MultiVectors.multi2vec_weaviate(
    name="doc_vector",
    image_field="doc_page",        # base64 JPEG, vectorizer reads this
    model="ModernVBERT/colmodernvbert",
    encoding=wvc.config.Configure.VectorIndex.MultiVector.Encoding.muvera(
        ksim=4, dprojections=16, repetitions=20
    ),
)
```

Collection schema fields:

| Field | Type | Description |
|-------|------|-------------|
| `doc_page` | BLOB | base64 JPEG, vectorizer reads this |
| `page_text` | TEXT | Text extracted by pdfplumber, read by Query Agent |
| `contract_type` | TEXT | Contract type, skip vectorization |
| `title` / `document_id` | TEXT | Metadata, skip vectorization |
| `page_number` / `total_pages` | INT | Page numbers |

## Muvera: Multi-Vector Compression

ColQwen produces multi-vectors (multiple token vectors per page), making storage and retrieval costly. Muvera is a Fixed Dimensional Encodings algorithm proposed by Google Research at NeurIPS 2024. It compresses multi-vectors into fixed dimensions and, combined with product quantization, achieves **32x memory compression** while maintaining high recall rates.

## Why Three Separate Collections

Stuffing all 510 contracts into a single collection would work, but Weaviate split contracts into three collections for a specific purpose:

- **`CommercialContracts`**: Licensing, reselling, marketing, sponsorship, franchise, and other market-facing contracts
- **`CorporateIPContracts`**: Strategic alliances, joint ventures, intellectual property, etc.
- **`OperationalContracts`**: Maintenance, service, outsourcing, consulting, etc.

This schema allows the Query Agent to do **collection routing** -- when a query comes in, the agent first determines which collection(s) to search, narrowing the search space before performing precise retrieval. This is far more reliable than mixing everything together and relying on semantic similarity to differentiate.

## Query Agent: The Reasoning Layer

The Query Agent is the most critical part of this system. What it does is not keyword matching -- it is reasoning:

1. **Schema Inspection**: Reads your collection structure, determines the optimal search strategy; splits a complex question into multiple sub-queries when necessary
2. **Structured Querying**: Dynamically builds filters and aggregations to lock down relevant data
3. **Rerank**: The Rerank Sub-agent reorders results by true relevance (not vector similarity)
4. **Answer Synthesis**: The Answer Sub-agent generates answers with cited source passages

This is somewhat like Text-to-SQL, but applied to a multi-collection vector database scenario where the output is not SQL but Weaviate query API calls.

The Query Agent has two modes:

- **Search Mode**: Returns the most relevant contract passages for manual review
- **Ask Mode**: Directly synthesizes an answer with source citations, suitable for chatbot scenarios

## Dataset: CUAD

The test data used is CUAD (Contract Understanding Atticus Dataset) -- 510 commercial legal contracts, 13,000+ human annotations, covering 41 types of important clauses (dates, parties, governing law, non-compete, confidentiality clauses, etc.). Licensed CC BY 4.0, commercially usable.

Weaviate's prompt specified selecting 15 contracts (5 per category) as a starting point. This scale is sufficient to validate the system without making embedding time too long.

CUAD download: `https://zenodo.org/records/4595826/files/CUAD_v1.zip` (106 MB)

## Implementation Pitfalls

The article specifically mentioned several easy-to-hit issues:

**Async client**: The Weaviate backend uses `WeaviateAsyncClient`, not the synchronous version.

**Dependency injection**: Import the module, not the variable, otherwise the client will be `None` at request time:
```python
# Correct
from app import lifespan as _lifespan
def get_client(): return _lifespan.weaviate_client
```

**BLOB fields**: The sources endpoint must explicitly specify `return_properties` -- BLOBs are not returned by default.

## Is This a Production System?

"Production-ready in 36 hours" needs context. What Weaviate built is an **internal tool for the internal finance team**, not a customer-facing legal SaaS.

Truly deploying a customer-facing legal AI system involves several issues the demo did not address:

**Data sovereignty**: Legal contracts involve attorney-client privilege. Whether data can be sent to external LLMs is a compliance issue, not an engineering issue.

**Consequences of hallucination**: The Query Agent's source citation mechanism significantly reduces hallucination risk, but "reduces" does not mean "eliminates." In legal scenarios, a single incorrect citation could directly affect business decisions -- human-in-the-loop verification is needed.

**Model version consistency**: When LLM versions update, answers to the same question may change. Legal analysis requires version control.

## Overall Takeaway

The core problem this architecture combination (ColQwen + Muvera + Weaviate Query Agent) solves is: making the search strategy dynamically planned at runtime rather than statically hardcoded. For any scenario requiring precise, structured document search (legal, medical, compliance, technical documentation), this direction is worth serious evaluation.

The reason it could be up and running in 36 hours is that Agent Skills compressed months of engineering work into an operations manual usable from a single prompt. This is important context, not criticism -- you need to know that you are using someone else's completed homework so you can accurately assess which parts you truly understand and which parts you merely called.

---

## References

- [Building A Legal RAG App in 36 Hours - Weaviate Blog](https://weaviate.io/blog/legal-rag-app)
- [Weaviate Query Agent GA Announcement](https://weaviate.io/blog/query-agent)
- [Weaviate Agent Skills Release Announcement](https://weaviate.io/blog/agent-skills)
- [CUAD Dataset - HuggingFace](https://huggingface.co/datasets/theatticusproject/cuad)
- [CUAD Paper (arXiv:2103.06268)](https://arxiv.org/abs/2103.06268)
- [Muvera: Fixed Dimensional Encodings - Google Research](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-retrieval/)
- [ColQwen / PDF Retrieval with Late Interaction - Qdrant](https://qdrant.tech/documentation/tutorials/pdf-retrieval-at-scale/)
- [12 Minutes, $0.30, One Prompt: How Weaviate Redefines Legal Contract Search with Agentic Search - Akira](https://akiraxclaw.com/blog/weaviate-legal-rag-query-agent/)
