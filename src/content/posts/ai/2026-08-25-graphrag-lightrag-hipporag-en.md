---
title: "Which Graph RAG to Choose: GraphRAG v3.1.2 vs LightRAG vs HippoRAG 2 — Design, Cost, and Selection"
date: 2026-08-25
category: ai
type: deep-dive
tags: [rag, graphrag, lightrag, hipporag, knowledge-graph, retrieval]
lang: en
tldr: "Same 'knowledge graph + retrieval' label, three different bets: Microsoft GraphRAG v3.1.2 pays indexing cost for global summarization, LightRAG cuts cost with dual-level retrieval and incremental updates, HippoRAG 2 turns RAG into growing associative memory via PPR — this guide splits the trade-offs by component with four query modes, indexing pipelines, and a selection matrix."
description: "Component-by-component comparison of Microsoft GraphRAG v3.1.2 (TextUnit→Entity→Leiden→Community Summary and Global/Local/DRIFT/Basic queries), LightRAG's dual-level retrieval and incremental updates, and HippoRAG 2's PPR associative memory — with vector-only and LongRAG baselines, an ASCII architecture, and copy-paste config samples."
series:
  name: "The RAG Techniques Compendium"
  order: 47
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-graphrag-lightrag-hipporag)

Vector search finds similar passages but misses connections — "who is related to whom" and "what does the whole corpus say" require links between documents. Graph RAG fills that gap by extracting entities and relations into a graph and retrieving over it. The question is how to pay for the graph — this guide puts three mainstream approaches side by side so you can choose by cost, update frequency, and question type.

You will get: the full indexing and four-query model of [Microsoft GraphRAG](https://microsoft.github.io/graphrag/) v3.1.2, why [LightRAG](https://github.com/HKUDS/LightRAG) achieves cheap incremental updates, how [HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG) turns RAG into continual memory, and a matrix for "when to use a graph, when vectors are enough, and when you need neither."

## The short version: three graphs, three products

GraphRAG is the heavy, global-summarization pipeline. LightRAG is the light, incrementally updatable engineering compromise. HippoRAG 2 is the continual-learning memory system. The split visible in papers and docs is **where you pay**: GraphRAG pays at index time (graph + community summaries) for coverage on global questions; LightRAG and HippoRAG deliberately reduce LLM calls and shift cost toward query time.

If you remember one thing: **the decision hinges on update frequency and question shape**, not leaderboard numbers — daily-changing vs. quarterly-stable corpora and point lookups vs. corpus-wide summaries lead to opposite choices.

## Microsoft GraphRAG v3.1.2: cook documents into a summarizable graph

[Microsoft GraphRAG](https://microsoft.github.io/graphrag/) ([docs](https://microsoft.github.io/graphrag/) | [releases v3.1.2](https://github.com/microsoft/graphrag/releases)) structures the corpus before querying it. As of v3.1.2 (2025-08-21) the canonical indexing flow is:

**TextUnit → Entity / Relationship extraction → Leiden clustering → Community Summary (bottom-up)**

Documents are split into TextUnits (overlapping chunks). Each TextUnit is passed to an LLM to extract entities and relations, deduplicated into a graph, then partitioned with the [Leiden algorithm](https://arxiv.org/abs/1810.08473) into hierarchical communities. Each community's entities and relations are summarized bottom-up with an LLM. The docs put it directly: *_GraphRAG builds a knowledge graph and then generates community summaries bottom-up_* — those summaries are the real index for global queries, and they explain why initial indexing is expensive.

Compared with alternatives, GraphRAG keeps both "graph + summaries" layers compared with vector-only and [LightRAG](https://arxiv.org/abs/2410.05779) (arXiv:2410.05779), which drops the heavyweight community reports to save cost, and [HippoRAG 2](https://arxiv.org/abs/2502.14802) (arXiv:2502.14802), which replaces build-time summarization with query-time diffusion. The shared failure mode is extraction quality — wrong entities downstream corrupt everything.

Good fit: relation-dense, global-question workloads such as regulation, medical literature, financial research, and enterprise wikis. Poor fit: frequently changing corpora (daily updates), one-off demos, or purely factoid single-passage QA — the graph tax never pays back there.

Config sample:

```yaml
# settings.yaml — GraphRAG v3.x indexing (illustrative)
input:
  type: csv
  file_pattern: ".*\\.csv$"
chunks:
  size: 1200
  overlap: 100
  group_by_columns: [id]
extract_graph:
  model_id: gpt-4o-mini
  prompt: "extract_graph.txt"
  max_gleanings: 1
cluster_graph:
  max_cluster_size: 10
  use_lcc: true
summarize_descriptions:
  model_id: gpt-4o-mini
  max_length: 500
community_reports:
  model_id: gpt-4o-mini
  max_length: 2000
  max_input_length: 8000
```

```bash
# Index and query (v3 CLI)
graphrag index --root ./ragtest
graphrag query --root ./ragtest --method global "What common risks appear across these contracts?"
graphrag query --root ./ragtest --method local  "What is the relationship between Company A and Company B?"
```

v3.1.2 ships four query modes, as defined in the docs:

- **Global**: answers corpus-wide summaries from community reports.
- **Local**: entity-centric graph expansion for point lookups and relation tracing.
- **DRIFT**: dynamic hybrid — starts global, then drills local.
- **Basic**: pure vector similarity search as a baseline / cheap fallback.

Limitations: indexing still costs many LLM calls; v3's streaming and storage backends (including the new [CosmosTableProvider with namespace partitioning](https://github.com/microsoft/graphrag/releases)) improve throughput and tenant isolation without eliminating the cost. Pilot indexing on a subset before full builds. v3 also carries breaking changes — read `breaking-changes.md` before upgrading.

## LightRAG: keep the graph light, make incremental updates cheap

[LightRAG](https://github.com/HKUDS/LightRAG) ([paper arXiv:2410.05779](https://arxiv.org/abs/2410.05779), v3 2025-04-28) keeps entity/relation extraction but removes GraphRAG's most expensive layer — community reports — and compensates with **dual-level retrieval** and **incremental updates**.

Dual-level means retrieving on two tracks: low-level on entities (precise relations and attributes) and high-level on topics/concepts (coverage), then merging. This gives LightRAG point-lookup precision plus reasonable global coverage without pre-built summaries. Against GraphRAG it may trail on extreme global summarization but wins on cost for mixed workloads; against [HippoRAG 2](https://arxiv.org/abs/2502.14802), LightRAG's graph is more explicit and its update path is more direct, while HippoRAG leans toward memory and associative diffusion.

Good fit: knowledge bases that change often (product docs, support KBs, research notes) where budget is tight but you need more than vectors. Poor fit: one-shot massive summarization demanding strict global consistency, or extremely noisy corpora where lightweight extraction degrades quickly.

Sample usage (Python, illustrative):

```python
# pip install lightrag-hku
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete
from lightrag.utils import EmbeddingFunc
import openai

rag = LightRAG(
    working_dir="./lightrag_cache",
    llm_model_func=gpt_4o_mini_complete,
    embedding_func=EmbeddingFunc(
        embedding_dim=3072,
        max_token_size=8192,
        func=lambda texts: openai.embeddings.create(
            model="text-embedding-3-large", input=texts
        ).data[0].embedding
    ),
)

# Incremental writes — call insert repeatedly, no full rebuild
rag.insert("LightRAG supports incremental updates; deletion removes only the relevant subgraph.")
rag.insert(["Second batch...", "Third batch..."])

# Dual-level retrieval: mix traverses low + high together
result = rag.query("What dependencies does Product A have?", param=QueryParam(mode="mix"))
print(result)

# Deletion (backend-dependent): clears only related entities/edges
# rag.delete_by_doc_id("doc-123")
```

Limitations: 39k+ stars on GitHub, and post-2026-05 it merged [RAGAnything](https://github.com/HKUDS/LightRAG) for MinerU/Docling multimodal chunking and additional backends — but the core constraint remains: documents never extracted into entities will not become retrievable knowledge. Fusion parameters for `mix` mode need tuning on your own data.

## HippoRAG 2: treat RAG as growing memory

[HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG) ([paper arXiv:2502.14802](https://arxiv.org/abs/2502.14802), ICML 2025) takes its metaphor from the hippocampus: retrieval is not a one-off lookup but **accumulating associative memory**. The core is **Personalized PageRank (PPR)**.

Passages and entities form a joint graph. At query time, a few seed nodes launch PPR random walks that diffuse across the graph; passages mapped from high-scoring nodes are returned for generation. The paper reports ~7% gains on associative tasks over strong embedding baselines — the signal matters less than the implication: treating "how memory is organized" as a first-class decision enables non-parametric continual learning where new knowledge arrives as nodes and edges without retraining.

Against GraphRAG's build-time summaries, HippoRAG shifts computation to query time; against LightRAG's dual-level, HippoRAG's duality is "text similarity + graph diffusion"; against vector-only and [LongRAG](https://arxiv.org/abs/2408.09843) (large chunks + long context), HippoRAG shines on cross-document multi-hop while not necessarily beating single-passage fact extraction where vectors or long context already suffice.

Good fit: multi-document associative QA, research KBs, personal/org memory that grows over time and must retain historical context. Poor fit: single-hop factoid workloads where a managed vector store's latency matters more than association.

Sample usage (illustrative):

```python
from hipporag import HippoRAG

rag = HippoRAG(
    llm_model="gpt-4o-mini",
    embedding_model="text-embedding-3-large",
    graph_type="openie",  # or llm-based extraction
)

# Index passages and entities together
rag.index(docs=[
    {"id": "doc1", "text": "Drug A inhibits protein X, which interacts with Y."},
    {"id": "doc2", "text": "Protein Y is overexpressed in disease B."},
])

# Retrieval: PPR diffusion over the graph, then mapped passages
answer = rag.query("Is Drug A indirectly related to disease B?", method="ppr")
print(answer)

# Continual memory: new knowledge extends the graph incrementally
rag.index([{"id": "doc3", "text": "New study links Y to Z."}])
```

Limitations: PPR step count and damping are hyperparameters — over-diffusion injects noise. The graph grows over time and needs weighting / forgetting policies for old nodes. Quality still depends on extraction; noisy extraction plus diffusion just spreads the noise further.

## Against vector-only and LongRAG: when graphs are waste

The intuition "vectors not enough → add a graph" overestimates the return curve.

**Vector-only** is simple, cheap, and operable. Many factoid and single-passage QA workloads are already served. Its blind spot is relations — vectors do not know "A cites B" or "A and C belong to the same group." **LongRAG** ([Xiao et al., 2024](https://arxiv.org/abs/2408.09843)) takes a different route: large chunks + long-context models preserve boundary-crossing information for small corpora in one shot, at the cost of tokens and latency.

Graph payoff concentrates in two quadrants:

| Question type | Vector / LongRAG enough? | Graph incremental value |
|---|---|---|
| Single-passage fact (article number, API param) | Yes — vectors fastest | None, wasted cost |
| Cross-document association (citation chain, org relations) | No — chains missed | Clear win for PPR / graph traversal |
| Corpus-wide summary (trends, risk rollups) | LongRAG viable for small corpora | GraphRAG community summaries most robust |
| Frequently updated KB | Vectors incremental; LongRAG must re-stuff | LightRAG / HippoRAG incrementality wins |

Attribution check: do not credit graphs alone for "answering global questions" — LongRAG can answer global questions on small corpora; graphs earn their keep by **maintaining global consistency and traceable associations at scale and under churn**. On small, static corpora, graphs are often over-engineering.

Actionable step: run a 50-question mixed eval (summary / associative / single-fact) across three baselines — vector vs. LongRAG (large chunks) vs. your chosen graph — and split results by question type before deciding which quadrant justifies paying for a graph.

## How to choose: three axes

| Axis | Choose GraphRAG v3.1.2 | Choose LightRAG | Choose HippoRAG 2 |
|---|---|---|---|
| **Cost tolerance** | OK to pay heavy first indexing for global precision | Tight budget, minimize LLM calls | Moderate, query-time compute OK |
| **Update frequency** | Low (monthly/quarterly) fine | High (daily / write-as-you-go) preferred | Continuously growing memory preferred |
| **Question shape** | Corpus-wide summaries, hierarchical reports | Mixed (point lookup + moderate summary) | Cross-document multi-hop, memory recall |
| **Operations** | Must run pipeline + community reports | Lightest — local delete/insert | Must tune PPR + memory growth |

Quick rules:

- **Ask update frequency first** — daily → LightRAG / HippoRAG; infrequent → GraphRAG.
- **Ask question shape second** — global rollups → GraphRAG; multi-hop association → HippoRAG; mixed → LightRAG.
- **Ask ops capacity last** — if you cannot tune graphs and PPR, start vector-only and prove with eval that relations are the bottleneck before adding a graph.

## Architecture

```
                        Query
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   GraphRAG v3.1.2    LightRAG         HippoRAG 2
   ─────────────      ────────         ──────────
   Doc → TextUnit     Doc → Entity/Rel Doc + Passage → Graph
         │  (extract)        │  (light)        │  (openie/LLM)
         ▼                   ▼                 ▼
   Entity/Rels Graph    Entity Graph       Entity + Passage Graph
         │                   │                 │
    Leiden clustering   no Community Summary  PPR diffusion
         │                   │                 │
   Community Summary    dual-level retrieval  Passage recall
   (bottom-up LLM)      low + high fusion    (diffusion result)
         │                   │                 │
        Global/Local/DRIFT/Basic  mix / hybrid   PPR-ranked
         │                   │                 │
         └─────────────────┼─────────────────┘
                           ▼
                   LLM generation + citations
                           │
                  eval / observability / cost
```

Costs shift horizontally: GraphRAG pays on the left (index time), HippoRAG pays on the right (query time), LightRAG keeps both sides thin.

## Takeaway

The choice is not "which scores highest" but "where you are willing to pay and how the corpus grows." [Microsoft GraphRAG](https://microsoft.github.io/graphrag/) v3.1.2 fits teams that accept indexing cost for global explainability. [LightRAG](https://github.com/HKUDS/LightRAG) fits teams whose corpus keeps growing under tight budget and ops constraints. [HippoRAG 2](https://github.com/OSU-NLP-Group/HippoRAG) fits teams treating RAG as a memory system that must accumulate cross-document associations over time. If unsure, start vector-only and measure the share of failures caused by missing relations on a mixed eval — only pay for a graph when that share is large; otherwise better chunking or LongRAG is the cheaper win.

## References

- [Welcome to GraphRAG — Microsoft Docs](https://microsoft.github.io/graphrag/) — GraphRAG docs, Leiden clustering, community summaries, and four query modes
- [GraphRAG Releases v3.1.2](https://github.com/microsoft/graphrag/releases) — 2025-08-21 latest release, breaking-changes, CosmosTableProvider
- [Microsoft GraphRAG GitHub](https://github.com/microsoft/graphrag) — repo and `settings.yaml` parameters
- [LightRAG: Simple and Fast Retrieval-Augmented Generation](https://arxiv.org/abs/2410.05779) — arXiv:2410.05779, v3 2025-04-28, dual-level and incremental updates
- [LightRAG — HKUDS GitHub](https://github.com/HKUDS/LightRAG) — 39.2k stars, RAGAnything / MinerU multimodal evolution
- [From RAG to Memory: Non-Parametric Continual Learning via HippoRAG 2](https://arxiv.org/abs/2502.14802) — arXiv:2502.14802, ICML 2025, PPR and continual memory
- [HippoRAG — OSU NLP GitHub](https://github.com/OSU-NLP-Group/HippoRAG) — NeurIPS'24 → ICML'25 method and implementation
- [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449) — arXiv:2407.01449, ICLR 2025, vision retrieval boundary reference
- [LongRAG: Enhancing Retrieval-Augmented Generation with Long-context LLMs](https://arxiv.org/abs/2408.09843) — large-chunk baseline for comparison
- [RAG Techniques Compendium](https://quidproquo.cc/posts/ai/2026-03-14-rag-patterns-complete-guide-en) — series overview and generation map

