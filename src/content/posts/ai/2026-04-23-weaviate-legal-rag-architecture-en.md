---
title: "Building a Legal Contract RAG in 36 Hours: Weaviate Query Agent + ColQwen Architecture Breakdown"
date: 2026-04-23
updated: 2026-08-19
type: guide
category: ai
tags: [rag, weaviate, legal-ai, colqwen, muvera, vector-database, agentic-search]
lang: en
tldr: "Using Weaviate Query Agent + ColQwen multi-vector model, a single prompt built a production-grade legal contract search system in 36 hours -- this post breaks down its architecture logic, technology choices, and what you actually need to watch out for."
description: "Breaking down the complete architecture of Weaviate's legal contract RAG system: ColQwen visual embeddings, Muvera multi-vector compression, Query Agent dynamic reasoning search, and the CUAD dataset data structure."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 45
---

> 🌏 [中文版](/posts/ai/2026-04-23-weaviate-legal-rag-architecture)

Legal document search is one of the hardest scenarios for RAG. Not because of data volume, but because of the precision requirement: if the user asks about a 2024 contract, you cannot return a semantically similar clause from 2022. Date, parties involved, governing law, specific clause type -- getting any single dimension wrong is a legal risk.

Weaviate's Femke Plantinga and Victoria Slocum published an article on February 26, 2026 documenting how they built a legal contract search system for their internal finance team in 36 hours. This post breaks down the complete architecture and explains the logic behind each technology choice.

> **About "ColQwen" in the title**: the visual retrieval model this demo actually uses is not ColQwen — it is `ModernVBERT/colmodernvbert`. Both belong to the late-interaction visual document retrieval family that ColPali started, and they do the same job, but they are different models. Details in the visual embeddings section below.

## Why Traditional RAG Fails in Legal Scenarios

The problem with traditional Naive RAG is that it is static. You write a retriever, and it does a fixed thing: semantic search, keyword search, or hybrid. If the user's query is "find all confidentiality clauses effective after 2024 governed by California law," traditional RAG either gives you a pile of "semantically related but wrong date" results, or you have to manually write every filter rule.

The root of the problem: **legal queries are rarely one-dimensional**. They need to simultaneously satisfy the intersection of multiple conditions like date, jurisdiction, and contract type.

## Architecture Overview

```
PDF Contracts
   │
   ▼
Late-interaction visual embedding model
   │ Each page → Multi-vectors
   ▼
MUVERA encoding (multi-vectors → fixed dimension)
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

## Visual Embeddings: Indexing PDFs Without OCR

The traditional PDF processing pipeline is: OCR → text extraction → chunking → embedding. This path has many problems with table-dense, layout-complex contract documents -- OCR errors directly contaminate the vectors.

Late-interaction visual retrievers take a different approach: they treat each PDF page as an **image** and feed it directly as input, outputting a multi-vector representation of visual tokens. No OCR needed, no text extraction preprocessing, and layout, table, and heading structural information is all preserved in the visual tokens.

This line of work was started by [ColPali (arXiv:2407.01449)](https://arxiv.org/abs/2407.01449) and spawned a whole family including ColQwen2. Note that checkpoint licenses differ: `vidore/colpali*` is built on PaliGemma and carries the Gemma license, while `vidore/colqwen2*` is built on Qwen2-VL under Apache-2.0 (the early v0.1 adapters were labelled MIT). If you self-host, read the terms yourself.

**But this demo does not use ColQwen.** Weaviate's prompt specifies `ModernVBERT/colmodernvbert` — the late-interaction member of the [ModernVBERT (arXiv:2510.01149)](https://arxiv.org/abs/2510.01149) family, a 250M-parameter model whose [weights and training code are MIT licensed](https://huggingface.co/ModernVBERT/colmodernvbert). The reason is straightforward: it is currently the only model offered by the Weaviate Embeddings multimodal vectorizer (see the [official docs](https://docs.weaviate.io/weaviate/model-providers/weaviate/embeddings-multimodal)), and a hosted vectorizer removes the entire self-managed GPU inference path. That vectorizer landed in Weaviate `v1.35.0` and is **Weaviate Cloud only** — self-hosted instances do not have it.

Each object is a single PDF page. The collection is created like this:

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

client.collections.create(
    "CommercialContracts",
    properties=[
        Property(name="doc_page", data_type=DataType.BLOB),
        Property(name="page_text", data_type=DataType.TEXT),
        Property(name="contract_type", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="title", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="document_id", data_type=DataType.TEXT, skip_vectorization=True),
        Property(name="page_number", data_type=DataType.INT),
        Property(name="total_pages", data_type=DataType.INT),
    ],
    vector_config=[
        Configure.MultiVectors.multi2vec_weaviate(
            name="doc_vector",
            image_field="doc_page",   # singular; image_fields raises TypeError
            model="ModernVBERT/colmodernvbert",
            encoding=Configure.VectorIndex.MultiVector.Encoding.muvera(
                ksim=4, dprojections=16, repetitions=20
            ),
        )
    ],
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

## MUVERA: Multi-Vector Encoding

Late-interaction models produce multi-vectors (multiple token vectors per page), making storage and retrieval costly. MUVERA is a Fixed Dimensional Encodings algorithm proposed by Google Research at NeurIPS 2024 ([arXiv:2405.19504](https://arxiv.org/abs/2405.19504)). It squeezes a set of multi-vectors into a single fixed-dimensional vector so that multi-vector similarity collapses into single-vector MIPS, with the original Chamfer similarity used to rerank the candidates.

The frequently quoted "32x memory compression" comes from the MUVERA paper itself: on the BEIR datasets, applying product quantization to the FDEs cut the memory footprint by roughly 32x with minimal impact on retrieval quality. That is a paper result, not a number measured by this legal demo — the actual compression ratio and recall cost need to be measured on your own corpus.

## Why Three Separate Collections

CUAD ships 510 contracts in total (this demo ingests just 15 of them). Stuffing everything into a single collection would work, but Weaviate split contracts into three collections for a specific purpose:

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

- **Search Mode**: Returns the raw matching objects for manual review or for a retrieval step inside your own pipeline
- **Ask Mode**: Directly synthesizes an answer with source citations, suitable for chatbot scenarios

It reached [general availability in September 2025](https://weaviate.io/blog/query-agent-generally-available) and ships as a separate `weaviate-agents` package installed alongside the main client:

```bash
pip install -U "weaviate-client[agents]"
```

```python
from weaviate.agents.query import QueryAgent

qa = QueryAgent(
    client=client,  # Weaviate Cloud client
    collections=["CommercialContracts", "CorporateIPContracts", "OperationalContracts"],
)

res = qa.ask("List all confidentiality clauses effective after 2024 governed by California law")
res.display()
```

The async counterpart is `AsyncQueryAgent`, which is what this demo's FastAPI backend uses. Two things to confirm before you plan around it: **the Query Agent only runs on Weaviate Cloud** — a self-hosted Weaviate does not have it; and free-tier allowances and pricing change, so check the [pricing page](https://weaviate.io/pricing) and the [Query Agent docs](https://docs.weaviate.io/query-agent) rather than copying any number hardcoded in a blog post.

## Dataset: CUAD

The test data used is CUAD (Contract Understanding Atticus Dataset) -- 510 commercial legal contracts, 13,000+ human annotations, covering 41 types of important clauses (dates, parties, governing law, non-compete, confidentiality clauses, etc.). Licensed CC BY 4.0, commercially usable.

Weaviate's prompt specified taking a random subset of 15 contracts (5 per category) as a starting point. This scale is sufficient to validate the system without making embedding time too long.

CUAD download: `https://zenodo.org/records/4595826/files/CUAD_v1.zip` (~106 MB). The `full_contract_pdf/` folder inside the zip holds text-based PDFs, so no OCR is required.

## Implementation Pitfalls

The article specifically mentioned several easy-to-hit issues:

**Async client**: The Weaviate backend uses `weaviate.WeaviateAsyncClient`, not the synchronous version -- and correspondingly `AsyncQueryAgent` rather than `QueryAgent`.

**Dependency injection**: Import the module, not the variable, otherwise the client will be `None` at request time:
```python
# Correct
from app import lifespan as _lifespan
def get_client(): return _lifespan.weaviate_client
```

**BLOB fields**: The sources endpoint must explicitly specify `return_properties` -- BLOBs are not returned by default.

**`image_field` is singular**: writing `image_fields` raises a `TypeError`.

## Is This a Production System?

"Production-ready in 36 hours" needs context. What Weaviate built is an **internal tool for the internal finance team**, not a customer-facing legal SaaS.

Truly deploying a customer-facing legal AI system involves several issues the demo did not address:

**Data sovereignty**: Legal contracts involve attorney-client privilege. Whether data can be sent to external LLMs is a compliance issue, not an engineering issue. And both the Query Agent and this multimodal vectorizer are managed Weaviate Cloud services -- the data necessarily leaves your machines, which is the first question any compliance review will ask about.

**Consequences of hallucination**: The Query Agent's source citation mechanism significantly reduces hallucination risk, but "reduces" does not mean "eliminates." In legal scenarios, a single incorrect citation could directly affect business decisions -- human-in-the-loop verification is needed.

**Model version consistency**: Both the managed LLM and the managed embedding model get updated by the vendor, so answers to the same question may change over time. Legal analysis requires version control.

## Overall Takeaway

The core problem this architecture combination (late-interaction visual embeddings + MUVERA + Weaviate Query Agent) solves is: making the search strategy dynamically planned at runtime rather than statically hardcoded. For any scenario requiring precise, structured document search (legal, medical, compliance, technical documentation), this direction is worth serious evaluation.

The reason it could be up and running in 36 hours is that Agent Skills compressed months of engineering work into an operations manual usable from a single prompt. This is important context, not criticism -- you need to know that you are using someone else's completed homework so you can accurately assess which parts you truly understand and which parts you merely called.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Building A Legal RAG App in 36 Hours - Weaviate Blog](https://weaviate.io/blog/legal-rag-app)
- [Query Agent GA Announcement (Sep 2025)](https://weaviate.io/blog/query-agent-generally-available)
- [Query Agent Documentation](https://docs.weaviate.io/query-agent)
- [Introducing Weaviate Agent Skills](https://weaviate.io/blog/weaviate-agent-skills)
- [weaviate/agent-skills (GitHub)](https://github.com/weaviate/agent-skills)
- [Weaviate Embeddings Multimodal Vectorizer Docs](https://docs.weaviate.io/weaviate/model-providers/weaviate/embeddings-multimodal)
- [ModernVBERT/colmodernvbert (HuggingFace, MIT)](https://huggingface.co/ModernVBERT/colmodernvbert)
- [ModernVBERT: Towards Smaller Visual Document Retrievers (arXiv:2510.01149)](https://arxiv.org/abs/2510.01149)
- [ColPali: Efficient Document Retrieval with Vision Language Models (arXiv:2407.01449)](https://arxiv.org/abs/2407.01449)
- [CUAD Dataset - HuggingFace](https://huggingface.co/datasets/theatticusproject/cuad)
- [CUAD Paper (arXiv:2103.06268)](https://arxiv.org/abs/2103.06268)
- [MUVERA: Making multi-vector retrieval as fast as single-vector search - Google Research](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/)
- [MUVERA: Multi-Vector Retrieval via Fixed Dimensional Encodings (arXiv:2405.19504)](https://arxiv.org/abs/2405.19504)
- [ColQwen / PDF Retrieval with Late Interaction - Qdrant](https://qdrant.tech/documentation/tutorials/pdf-retrieval-at-scale/)
- [12 Minutes, $0.30, One Prompt: How Weaviate Redefines Legal Contract Search with Agentic Search - Akira](https://akiraxclaw.com/blog/weaviate-legal-rag-query-agent/)
