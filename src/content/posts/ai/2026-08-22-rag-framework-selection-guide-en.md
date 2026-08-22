---
title: "Choosing a RAG Framework: LlamaIndex, Haystack, RAGFlow, Dify, and R2R Operate at Different Layers"
date: 2026-08-22
category: ai
type: deep-dive
tags: [rag, framework, llamaindex, haystack, ragflow, dify, r2r]
lang: en
tldr: "LlamaIndex and Haystack are code-first frameworks; RAGFlow and Dify are managed application platforms; R2R packages retrieval as an API service. Choose how much control your team needs over ingestion, retrieval, and operations before choosing a tool."
description: "A shared decision framework for LlamaIndex, Haystack, RAGFlow, Dify, and R2R across product layer, ingestion, retrieval customization, workflows, UI, deployment, evaluation, and exit cost."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-rag-framework-selection-guide)

Putting [LlamaIndex](https://developers.llamaindex.ai/python/framework/), [Haystack](https://docs.haystack.deepset.ai/), [RAGFlow](https://github.com/infiniflow/ragflow), [Dify](https://github.com/langgenius/dify), and [R2R](https://github.com/SciPhi-AI/R2R) into one "RAG framework ranking" starts with the wrong comparison. Their problem spaces overlap, but their deliverables sit at different product layers: the first two primarily ship Python abstractions, RAGFlow and Dify ship operable platforms, and R2R ships a self-hostable retrieval API.

The distinction is larger than low-code versus code. The real selection questions are: **who turns source documents into queryable data, who can change retrieval logic, who maintains the operating UI and execution history, and what must be moved when you leave the tool?**

This article compares product boundaries and engineering ownership. It does not repeat RAG techniques. For chunking, hybrid retrieval, reranking, and evaluation, use the site's [Complete RAG Techniques](/series/rag-techniques). For LlamaIndex abstractions, Workflows, and Traditional Chinese defaults, use the existing [LlamaIndex deep dive](/posts/ai/2026-08-21-llamaindex-rag-framework-en).

## Start with layers: these tools do not sell the same thing

| Tool | Primary deliverable | Where the team works | Closest description |
|---|---|---|---|
| [LlamaIndex](https://developers.llamaindex.ai/python/framework/) | Python framework and integrations | Application code, data processing, and workflows | Document-centric development kit |
| [Haystack](https://docs.haystack.deepset.ai/) | Components, Pipelines, and Document Store interfaces | Python pipelines and deployed services | Modular AI orchestration framework |
| [RAGFlow](https://github.com/infiniflow/ragflow) | Full-stack parsing, datasets, retrieval, chat, and agents | Admin UI, APIs, and platform configuration | RAG platform |
| [Dify](https://github.com/langgenius/dify) | Visual workflows, knowledge, agents, models, and app management | Studio, plugins, APIs, and platform operations | AI application platform |
| [R2R](https://github.com/SciPhi-AI/R2R) | Ingestion, search, RAG, agent, and document APIs | REST API, SDKs, and backend configuration | Retrieval backend |

This is not a quality ranking. A library preserves code-level control while leaving product UI, permissions, and deployment to you. A platform ships more of that product surface while storing more state in its own model.

## The shared decision spine

| Dimension | LlamaIndex | Haystack | RAGFlow | Dify | R2R |
|---|---|---|---|---|---|
| Library / platform | Library-first, with separate managed products | Library / framework | Full-stack platform | AI application platform | API-first service |
| Ingestion ownership | Compose readers, nodes, and transformations in code | Compose indexing pipelines from components | Platform manages parsing, chunks, and datasets | Knowledge Pipeline and datasources manage ingestion | APIs create and manage documents |
| Retrieval customization | Replace retrievers, postprocessors, and storage | Components, branches, loops, and custom Document Stores | Primarily platform configuration and APIs | Visual nodes, plugins, and APIs | Search / RAG APIs and server configuration |
| Workflow / agents | Event-driven Workflows and agents | Pipeline branches, loops, tools, and agents | Built-in agent workflows | Visual Workflow, Agent Strategy, and tools | Built-in agent and deep research APIs |
| UI / operations | Core framework does not ship an operations UI | Core framework does not ship a complete product UI | Dataset, chat, and agent UI included | Studio, workspaces, and app management included | Primary boundary is API and SDK |
| Deployment / data boundary | Determined by application architecture | Determined by application architecture | Cloud or Docker self-hosting | Cloud, VPC, or Docker self-hosting | Python light mode or Docker full mode |
| Evaluation / observability | Evaluators, instrumentation, and integrations | Component and end-to-end evaluators | Document preview, retrieval, and citations emphasize inspection | Run history and observability integrations | Public README does not present an evaluation harness as a core feature |
| Exit-cost locus | Python abstractions and integrations | Pipeline and component interfaces | Datasets, parsing configuration, and platform services | Workflow DSL, plugins, and knowledge assets | API contract, server config, and ingested data |

The final two rows are engineering interpretations of public interfaces, not vendor migration scores. In particular, "not presented as a core feature" does not prove a feature is absent; it means you should not treat it as verified during selection.

## Ingestion ownership determines who rebuilds the index later

LlamaIndex and Haystack both make ingestion a composable program. LlamaIndex models `Document`, `Node`, transformations, and storage. Haystack connects fetchers, converters, embedders, and writers in a Pipeline; a Document Store is a data interface used by pipeline components. You can keep source files, chunk IDs, metadata, and the vector database in your own system, but incremental updates, retry behavior, and deletion propagation remain your responsibility.

RAGFlow puts this work inside datasets and document parsing, with a UI for inspecting and intervening in chunks. That is useful for layout-heavy documents whose parsing needs human review. The trade-off is concrete: the [official quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx) says that after a dataset parses a file with an embedding model, you cannot simply switch that model because all files must remain in the same embedding space. A model change therefore requires a rebuild plan.

Dify's Knowledge Pipeline turns datasources, processing, and knowledge bases into platform assets. Its official plugin docs classify datasources as web crawlers, online documents, and online drives, making source management accessible beyond backend engineers. R2R approaches the same layer from an API boundary: ingest through its documents API, then query through search, RAG, or agent APIs.

**Action**: test with a real document that will be updated and deleted, not a one-off PDF. Record where the source ID lives, whether reruns duplicate content, how deletion propagates, how an embedding upgrade rebuilds data, and where failed jobs retry. Every blank is future operations work.

## Retrieval control: replaceable components are not equally easy to change

When the main uncertainty is whether you will replace a vector store, reranker, or query transformation, LlamaIndex and Haystack provide abstractions for that exact kind of substitution. LlamaIndex offers retrievers, query engines, node postprocessors, and storage integrations. Haystack Pipelines are directed multigraphs with branches and loops, and teams can implement custom components and the Document Store protocol.

Their centers of vocabulary differ. LlamaIndex grew outward from documents, indexes, and context augmentation. Haystack grew outward from components and pipelines. The former fits teams for whom document ingestion and querying are the product core. The latter fits teams that want retrieval, routing, generation, and evaluation in one programmable flow graph.

RAGFlow, Dify, and R2R are customizable through different entry points. RAGFlow prioritizes parsing and retrieval options supported by the platform. Dify defines model, tool, agent strategy, datasource, trigger, and other plugin types. R2R encourages applications to depend on a REST boundary. If the requirement fits those interfaces, delivery can be faster than assembling services yourself. If the core algorithm must frequently change outside them, you will read platform source code or move that stage into an external service.

## Workflows and agents: decide whether RAG is the main character

LlamaIndex now describes RAG as one of the tools an agent can use, with Workflows providing event-driven multi-step execution. Haystack can also assemble agentic flows from Pipeline loops, branches, and tools. Both fit teams that want flow versions reviewed, tested, and deployed with application code.

RAGFlow still centers on turning documents into traceable answers; agent workflows extend that center. Dify is broader: RAG is one capability inside an AI application workflow, alongside external events, tools, model management, and app publishing. R2R places agentic retrieval behind its API, including a deep-research entry point that can query a knowledge base and the web.

A straightforward internal document assistant does not need the largest platform merely because it may gain an agent later. Conversely, if operators need to revise workflows and publish several AI applications, rebuilding an admin product around a library may not save work.

## UI and operations: who touches the system every day after launch?

The core users of LlamaIndex and Haystack are engineers. Both can emit traces, connect evaluation, and run as services, but accounts, workspaces, dataset administration, app publishing, and operator-readable run history are not complete products supplied by the core libraries.

Much of the value of RAGFlow and Dify lives here. RAGFlow exposes datasets, parsing results, chat, and agents. Dify puts a workflow canvas, knowledge, model providers, plugins, and publishing into a shared workspace. This is not merely UI being easier than code. It moves some change authority from the engineering deployment process into platform permissions.

R2R fits teams that already have a product front end and admin surface but need a retrieval service. An API-first boundary avoids introducing another end-user application platform. The existing system or team still owns operational tooling.

**Action**: list everyone who will change prompts, tune retrieval, rerun documents, and investigate failures after launch. If that list includes non-engineers, make "can they complete this work without a code deployment?" an acceptance criterion.

## Deployment and data boundaries: self-hostable does not mean equal operational weight

LlamaIndex and Haystack are application dependencies. Whether data leaves your environment depends on the model, parser, embedding service, vector store, and observability provider you connect. They provide the most architectural freedom and do not perform complete platform upgrades for you.

RAGFlow, Dify, and R2R can all be self-hosted, but they carry different operational weight. RAGFlow's official deployment includes a backend, frontend, MySQL, Redis, object storage, and a document engine; it uses Elasticsearch for full text and vectors by default, and its official images primarily target x86. Dify's Docker Compose deployment also contains application and middleware services and supports configurable vector stores. R2R offers a lightweight Python server and a full Docker mode, fitting the shape of a standalone retrieval service.

"Self-hosted" therefore answers whether data can remain on your network. It does not answer who owns backups, schema migrations, service upgrades, queue congestion, and parser reruns.

**Action**: draw a data-flow diagram before the proof of concept. Place source documents, parsed content, embedding requests, LLM prompts, traces, and backups on the services that actually receive them. A box labeled "all self-hosted" is not enough.

## Evaluation and observability: run history is not quality evaluation

Haystack's official evaluation module explicitly separates component evaluation from end-to-end evaluation and statistical evaluators with ground truth from model-based evaluators. LlamaIndex also provides retrieval and response evaluators plus instrumentation. Both make it natural to version test data beside pipeline code.

Dify provides workflow run history and lists Opik, Langfuse, and Arize Phoenix among its observability integrations. RAGFlow's chunk preview, retrieved context, and citations make data quality easier to inspect manually. Those capabilities matter, but they do not automatically answer whether a new retriever beats the old one. R2R's public README documents retrieval and document management without presenting an evaluation harness as a core deliverable; validate that requirement separately.

Whichever product you choose, keep a fixed test set outside the framework. At minimum, store each query, expected source, forbidden source, and acceptable answer. The site's [RAG evaluation guide](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) covers RAGAS, DeepEval, and TruLens, so this comparison does not repeat those metrics.

## Exit cost: preserve rebuildable assets first

Exit cost depends on where system state hides, not only on licensing.

- With LlamaIndex or Haystack, coupling usually lives in Python classes, pipeline wiring, and integration data structures. If the team owns the vector store and source corpus, migration tends to mean application changes and revalidation.
- With RAGFlow, datasets, parsing templates, chunk edits, and the document engine form a platform state bundle. Changing embeddings or moving platforms needs an explicit rebuild.
- With Dify, workflows, plugins, knowledge assets, workspace permissions, and publishing configuration jointly define the application. Even when a flow is exportable, do not assume run history and all data state travel in the same format.
- With R2R, the REST API is a clear replacement seam, but ingested documents, collections, graphs, and server configuration still require your own backup and rebuild path.

The safest approach is not predicting which tool you will never replace. Keep source documents, stable source IDs, chunking specifications, metadata schema, evaluation sets, prompts, and deployment configuration outside the platform. Then a migration is a rebuild, not a reverse-engineering project against a platform database.

## Five selection paths

**Choose LlamaIndex** when document processing and heterogeneous data sources are central, a Python team wants deep control over ingestion, retrieval, and agent workflows, and you are prepared to build the product UI. Read the site's [complete LlamaIndex deep dive](/posts/ai/2026-08-21-llamaindex-rag-framework-en), especially its current language and package boundaries.

**Choose Haystack** when you want explicit component interfaces across indexing, retrieval, routing, generation, and evaluation, with the pipeline treated as a testable and serializable engineering asset.

**Choose RAGFlow** when complex document parsing, visible chunks, traceable citations, and a knowledge-base operations UI matter more than unrestricted algorithm changes, and the team can operate a full platform.

**Choose Dify** when RAG is one of several AI application capabilities and non-engineers need to collaborate on workflows, knowledge, plugins, models, and publishing.

**Choose R2R** when you already own the front end and application backend and want a REST service for ingestion, hybrid search, knowledge graphs, RAG, and agentic retrieval.

If the decision remains unclear, do not build five complete proofs of concept. Pick two candidates from different layers and run the same small corpus—one with updates, deletions, and permission metadata—through its full lifecycle. Compare who can change the flow, where failures are diagnosed, how data is deleted, and how the system can be rebuilt. The demo answer is the least interesting output.

## References

- [LlamaIndex Python Framework documentation](https://developers.llamaindex.ai/python/framework/)
- [LlamaIndex Ingestion Pipeline documentation](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/)
- [Haystack Pipelines documentation](https://docs.haystack.deepset.ai/docs/pipelines)
- [Haystack Evaluation documentation](https://docs.haystack.deepset.ai/docs/evaluation)
- [RAGFlow official README and self-hosting guide](https://github.com/infiniflow/ragflow/blob/main/README.md)
- [RAGFlow official Quickstart](https://github.com/infiniflow/ragflow/blob/main/docs/quickstart.mdx)
- [Dify official README](https://github.com/langgenius/dify/blob/main/README.md)
- [Dify official plugin-type selection guide](https://docs.dify.ai/en/develop-plugin/getting-started/choose-plugin-type)
- [R2R official README](https://github.com/SciPhi-AI/R2R)
- [LlamaIndex Is Not a RAG Framework Anymore, and Old Tutorials Won't Tell You](/posts/ai/2026-08-21-llamaindex-rag-framework-en)
- [Complete RAG Techniques](/series/rag-techniques)

