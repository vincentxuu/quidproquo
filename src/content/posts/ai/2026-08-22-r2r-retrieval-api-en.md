---
title: "R2R Deep Dive: Ingestion, Hybrid Search, and RAG behind an API"
date: 2026-08-22
category: ai
type: deep-dive
tags: [r2r, rag, retrieval, api, self-hosted]
lang: en
tldr: "R2R packages document ingestion, hybrid search, knowledge graphs, RAG, Agents, and access controls behind a REST API; it fits teams that already own their product frontend and backend and need a retrieval service."
description: "An API-resource lifecycle guide to R2R document ingestion, collections, hybrid search, RAG, Agents, access control, self-hosting, and data exit boundaries."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-r2r-retrieval-api)

[R2R](https://github.com/SciPhi-AI/R2R) is an open-source AI retrieval system that places document processing, search, RAG, knowledge graphs, Agents, and management capabilities behind a REST API. It is neither a visual workflow platform for content operators nor a node library embedded in Python code. It is closer to a self-hosted retrieval backend.

This article follows API resources through their lifecycle: start the service, ingest documents, scope them with collections, call Search, RAG, and Agent endpoints, then handle authorization, deployment, and exit. For cross-framework positioning, see the [RAG framework selection guide](/posts/ai/2026-08-22-rag-framework-selection-guide-en).

## Startup: establish a service boundary

The official repository documents a light Python server and a fuller Docker mode. Its minimal flow installs `r2r`, configures model credentials, and starts a server available at `http://localhost:7272`.

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install r2r
export OPENAI_API_KEY="..."
python -m r2r.serve
```

Production requires more than this snippet. Put the API behind authentication, TLS, rate limits, and network controls, and keep model keys in a secret manager. For full Docker mode, follow the Compose and configuration guidance for the exact deployed revision.

## Documents: ingestion is a lifecycle, not an upload

The document API accepts multiple content types, while the server handles parsing, chunking, embedding, and indexing. The Python client keeps the entry point small:

```python
from r2r import R2RClient

client = R2RClient(base_url="http://localhost:7272")
document = client.documents.create(file_path="handbook.pdf")
print(document)
```

A simple API does not remove ingestion lifecycle concerns. Store the source ID, checksum, R2R document ID, ingestion time, and processing status. Decide whether a source update replaces, versions, or deletes and recreates a document. Verify that deletion also removes chunks, embeddings, graph entities, and cached output where applicable.

Keep those mappings in your own database so a model migration, R2R rebuild, or platform exit can replay the corpus. Sending files without lineage makes it difficult to identify which source version supported an answer.

## Search: validate retrieval before generation

R2R exposes semantic and keyword matching and supports hybrid search. The official README highlights reciprocal rank fusion, knowledge graphs, and multimodal ingestion. Retrieval and generation have separate client methods:

```python
results = client.retrieval.search(query="How do we rotate API keys?")
print(results)
```

Confirm response structures against the SDK and API documentation for your version. Inspect candidate chunks through `search`, label relevant documents and ranking, and then tune filters or search configuration. Starting directly with `rag()` makes plausible answers hide retrieval mistakes.

## RAG and Agents: different execution modes over the same knowledge layer

`retrieval.rag()` searches and generates a cited answer, while `retrieval.agent()` supports multi-step agentic retrieval. The README also describes a Deep Research API that can combine the knowledge base with internet sources for complex questions.

```python
response = client.retrieval.rag(
    query="Summarize the incident response policy with citations."
)
print(response)
```

An endpoint named `rag` does not replace a quality contract. Record the query, user and collection scope, cited document IDs, model settings, latency, and errors. Agents increase cost and uncertainty. Establish golden cases for Search and RAG first, then enable an Agent only for questions that genuinely require multi-step exploration.

## Collections and authorization

R2R includes users, collections, and access controls. That is useful for multi-user products, but a backend must not trust a collection ID supplied by the frontend. Derive the permitted scope from your authentication context and pass only authorized collections or filters to R2R.

Test negative cases: one user cannot guess another user's document ID; removing a document from a collection removes it from search and citations; privileged operations produce an audit trail. A safe-looking generated answer does not prove that Search and document endpoints are protected.

## Self-hosting and exit: REST is a seam, not complete portability

The REST boundary prevents your product frontend and main backend from depending on R2R's internal Python classes. That is a strong replacement seam. Documents, chunks, collections, graphs, provider configuration, and databases remain service state. An exit plan needs source files, canonical metadata, ID mappings, an embedding rebuild process, and replayable acceptance questions.

| Option | Core deliverable | Best fit |
| --- | --- | --- |
| [R2R](https://github.com/SciPhi-AI/R2R) | Retrieval REST API and SDKs | An existing product needs an independent RAG backend |
| [Haystack](https://docs.haystack.deepset.ai/) | Python Components and Pipelines | Retrieval algorithms need deep customization and tests |
| [RAGFlow](https://github.com/infiniflow/ragflow) | Document parsing and operational UI | Human chunk and citation review matters |
| [Dify](https://github.com/langgenius/dify) | AI application workspace | Cross-functional teams operate workflows and publishing |

## The overall trade-off

R2R's clearest value is the service boundary. A team can keep its product UI, identity, and business logic while adding ingestion, hybrid search, RAG, graphs, and agentic retrieval through APIs. It saves the work of designing a retrieval backend from scratch; it does not remove data governance, evaluation, or operational responsibility.

Before adoption, ingest a small versioned corpus, verify retrieval through Search, and test RAG citations with the same questions. Then delete one document and confirm that every endpoint can no longer expose it. Completing that lifecycle says more about production readiness than a one-question demo.

## References

- [R2R repository](https://github.com/SciPhi-AI/R2R)
- [What is R2R?](https://github.com/SciPhi-AI/R2R/blob/main/docs/introduction/guides/what-is-r2r.md)
- [Haystack documentation](https://docs.haystack.deepset.ai/)
- [RAGFlow repository](https://github.com/infiniflow/ragflow)
- [Dify repository](https://github.com/langgenius/dify)
