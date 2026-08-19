---
title: "RAG and Retrieval Evaluation Across Four Exams — and One Everyone Assumes Tests It, Which Doesn't"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, rag, retrieval, evaluation, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 17
tldr: "Four certifications genuinely test RAG and retrieval evaluation: AWS AIF-C01 (chapters 2 and 3 total 52%, covering RAG, vector stores, and FM evaluation metrics), AWS AIP-C01 (11 of the 27 skill points in its 31% Domain 1 sit in vector storage and RAG), NVIDIA NCP-AAI (Knowledge Integration 10% plus Evaluation and Tuning 13%), and Microsoft AI-500 ('multi-agent RAG architecture' inside its 30–35% Develop area). Google PMLE contributes exactly one LLM-as-a-judge objective, and Claude CCDV-F — the developer certification people most readily assume covers RAG — has no retrieval objective across its eight domains, with Eval at just 2.6%. Includes a same-vendor foundational-vs-professional comparison, a four-vendor terminology map, non-transferable objectives, and a practice project."
description: "A cross-certification breakdown of RAG and retrieval evaluation: where AWS AIF-C01 and AIP-C01, NVIDIA NCP-AAI, and Microsoft AI-500 overlap and diverge, why Google PMLE has only one relevant objective and Claude CCDV-F tests no retrieval at all, with a foundational-vs-professional comparison and a four-vendor terminology map."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-rag-evaluation-exam-domains)
>
> This is preparation material built from official sources, not an exam-day account — I have not sat these exams. Every "what it tests" points back to a vendor's official exam guide or blueprint, all listed at the end. Verified 2026-08-18.

This is the second technical deep-dive in the [AI Certification Prep series](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en), following [multi-agent architecture across five exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en). Same method: **take a topic several certifications test in parallel — here, RAG and retrieval evaluation — cover the shared core once, then mark what doesn't transfer.**

One thing belongs up front, though: **pick the wrong certification and none of this gets tested at all.**

## Which exams, and where the objectives sit

| Certification | RAG / retrieval domain | Weight | Angle |
|---|---|---|---|
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) | 2. Fundamentals of GenAI | 24% | Tokens, chunking, embeddings, vectors, context engineering, the FM lifecycle |
| (same) | 3. Applications of Foundation Models | **28%** | RAG and Knowledge Bases, vector store services, customization cost trade-offs, FM evaluation metrics |
| (same) | 5. Security, Compliance, and Governance | 14% | Hallucination detection and grounding (5.1.5, added in v1.1) |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) | 1. FM Integration, Data Management, and Compliance | **31%** | 1.4 vector storage + 1.5 retrieval and RAG — the densest retrieval content in the series |
| (same) | 4. Operational Efficiency and Optimization | 12% | Retrieval speed, hybrid-search custom scoring, semantic caching |
| (same) | 5. Testing, Validation, and Troubleshooting | 11% | RAG evaluation, LLM-as-a-Judge, embedding quality diagnosis |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en) | Knowledge Integration and Data Handling | 10% | Retrieval pipelines (RAG, embedding search, hybrid), vector DB optimization |
| (same) | Evaluation and Tuning | 13% | Evaluation pipelines, task benchmarks, accuracy-vs-latency tuning |
| [Microsoft AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en) | "Multi-agent RAG architecture" inside Develop | Part of 30–35% | Three terms listed together: chunking, embedding quality, retrieval precision |
| [NVIDIA NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en) (corroboration) | Item level of Core ML and AI Knowledge | Part of 30% | Curating and embedding datasets for RAG, selecting a text-embedding model |
| [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en) | 2. Collaborating to manage data and models | ~16% | **Exactly one objective**: evaluating GenAI solutions with LLM-as-a-judge |
| [Claude CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en) | — | — | **No retrieval objective across its eight domains** |

### First, a misconception: Claude's developer certification does not test RAG

CCDV-F is the one people most readily assume covers RAG. It is the engineer-facing certification of Anthropic's four, and its official Intended Audience describes people who build agents with the Claude Agent SDK, integrate through the API, and write custom tools and MCP servers. Almost everyone doing LLM application work is also doing RAG, so intuition fills in the gap.

**But the official blueprint's eight domains are these**:

| Domain | Weight |
|---|---|
| Applications and Integration | 33.1% |
| Model Selection and Optimization | 16.8% |
| Agents and Workflows | 14.7% |
| Prompt and Context Engineering | 11.0% |
| Tools and MCPs | 10.6% |
| Security and Safety | 8.1% |
| Claude Code | 3.1% |
| Eval, Testing, and Debugging | **2.6%** |

**No domain or sub-domain mentions RAG, retrieval, vectors, or embeddings.** And evaluation — the other half of this topic — is **2.6%**, the smallest of the eight.

Its only contact point with this topic is **Prompt and Context Engineering at 11.0%**: tool-output trimming, compaction, context isolation via subagents, prompt caching, token budgeting. **That is "what to do with retrieved content once you have it", not "how to retrieve it".** Section 7 covers that material, but it isn't enough to make CCDV-F a RAG certification.

**This conclusion extends only as far as the blueprint**: the absence of retrieval objectives doesn't mean the word RAG never appears as scenario background in a question. But **you can't earn points on this exam by preparing RAG**, because the weight table gives it no place.

**By the same standard, neither is PMLE.** Across the six chapters of considerations in the [official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer), the single relevant line is chapter 2's "**evaluate GenAI solutions using LLM-as-a-judge**". No chunking, no vector store, no retrieval objective. It does have Agent Platform Feature Store, but that stores and serves ML features — a different thing from vector retrieval, and the pair most often confused during prep.

**So the four exams here are**: AIF-C01, AIP-C01, NCP-AAI, and AI-500. PMLE appears in section 5 on the strength of one objective; NCA-GENL serves as corroboration.

## Same vendor, two levels: what AIP-C01 adds over AIF-C01

This is the most useful comparison in the post, because it is **one vendor and one Bedrock stack, at two completely different levels of demand**.

| | AIF-C01 (foundational, $100) | AIP-C01 (professional, $300) |
|---|---|---|
| Assumed experience | "Uses but does not necessarily build", six months of exposure | Two years of production application work plus one year of GenAI implementation |
| Where RAG appears | An objective in the 28% chapter 3: **RAG and Bedrock Knowledge Bases** | Two full tasks in the 31% Domain 1 (1.4 and 1.5) |
| Vector storage | Lists **service names**: OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL | Lists **design decisions**: hierarchical organization, metadata frameworks, shards and multi-index, incremental updates and scheduled refresh |
| Chunking | A term in chapter 2 (alongside token, embedding, vector) | Three concrete implementations plus debugging scenarios (dynamic chunking, truncation errors) |
| Evaluation | **Metric names**: ROUGE, BLEU, BERTScore, LLM-as-a-judge, Bedrock Model Evaluation | **Evaluation process**: retrieval quality testing, automated quality gates, golden datasets, A/B and canary |
| Advanced retrieval | Not tested | Hybrid search, **Bedrock rerankers**, query expansion / decomposition / transformation |
| Question formats | Multiple choice, multiple response, **ordering, matching** | Multiple choice and multiple response only |

**One line separates them**: AIF-C01 tests whether you can **explain RAG and rank its cost against the alternatives**; AIP-C01 tests whether you can **build it and fix it when it breaks**.

The clearest illustration is **customization cost trade-offs**. AIF-C01's chapter 3 names five approaches to rank: **pre-training, fine-tuning, in-context learning, RAG, model distillation**. That is a selection question. AIP-C01 doesn't test that ranking at all — it assumes you have already chosen RAG and jumps straight to "so how is your index sharded, and how long until it syncs after a source document changes".

**A counter-intuitive difference**: **ROUGE, BLEU, and BERTScore are named only by AIF-C01.** AIP-C01's 5.1 talks about quality dimensions — relevance, factual accuracy, coherence, fluency — plus LLM-as-a-Judge and retrieval quality testing. **The foundational exam is the more classical-NLP-evaluation of the two**; the professional one has moved on to pipelines and gates. Anyone preparing AIP-C01 without reading the AIF-C01 guide will miss those three acronyms.

**Neptune is another**: AIF-C01's vector-storage service list includes Neptune (a graph database); AIP-C01's 1.4 and 1.5 do not. The two guides from the same vendor are not fully compatible on service lists, so if you are taking both, don't assume the higher tier is a superset of the lower one.

**Maps back to**: AIF-C01 chapter 2 (24%) and chapter 3 (28%), 52% between them; AIP-C01 Domain 1 (31%).

## The shared core: eight things all four test

Sections 1–4 cover retrieval mechanics (AIF-C01 at term level, AIP-C01 at implementation level, NCP-AAI at pipeline level, AI-500 in three keywords). Sections 5–8 cover evaluation and trade-offs, where the overlap is widest and PMLE and NCA-GENL join in.

**If you are preparing for only one exam, the last four sections have the highest return**, because they appear on every one.

### 1. Chunking is a named objective, not background knowledge

AIP-C01's 1.5 breaks chunking into three concrete implementations: **Bedrock built-in chunking, fixed-size via Lambda, hierarchical**. It is the only source that enumerates splitting strategies.

Equivalents elsewhere:

- **AIF-C01**: chapter 2 lists **token, chunking, embedding, vector** together in one objective — a recognition-level requirement
- **AI-500**: "multi-agent RAG architecture (chunking, embedding quality, retrieval precision)" — three terms listed together, a direct hint that they form one skill
- **NCP-AAI**: its 10% Knowledge Integration domain says "retrieval pipelines (RAG, embedding search, hybrid)"; chunking is folded into the pipeline
- **NCA-GENL**: at item level, "**curate and embed content datasets for RAG**"

**AIP-C01 also tests chunking as a debugging topic**: 5.2 names **context window overflow, dynamic chunking, and truncation errors**, plus "correcting vectorization and chunking". **The same subject is design in chapter 1 and firefighting in chapter 5** — which means questions will hand you a symptom like "retrieved content is truncated" and ask what is wrong with the splitting strategy.

[Chunking strategies](/posts/ai/2026-03-12-chunking-strategies-en) and [contextual retrieval](/posts/ai/2026-03-12-contextual-retrieval-en) cover the implementation differences; this post doesn't repeat them.

**Maps back to**: AIP-C01 Domain 1 (31%) task 1.5 and Domain 5 (11%) task 5.2, AIF-C01 chapter 2 (24%), AI-500 Develop (30–35%), NCP-AAI Knowledge Integration (10%), NCA-GENL Core ML (item level of 30%).

### 2. Embeddings: both a selection problem and a diagnosis problem

AIP-C01's 1.5 is the most granular: **Amazon Titan embeddings, dimensionality and domain adaptation, batch embedding via Lambda** — three keywords, three different jobs.

- **AIF-C01**: embeddings and vectors are chapter 2 vocabulary; the requirement is to explain them, not to tune them
- **NCA-GENL**: "**select a model for creating text embeddings**" is its own item-level objective
- **AI-500**: just "embedding quality", but listed alongside chunking and retrieval precision as one skill
- **NCP-AAI**: "embedding search" — the emphasis is on the search, not the selection

**AIP-C01 again tests it as debugging**: the "retrieval problems" line in 5.2 names **embedding quality diagnosis and drift monitoring**. **Embedding drift as a term appears only in AIP-C01** — it expects you to know that an existing index goes stale when the embedding model version or the data distribution changes.

[Choosing an embedding model with BGE-M3](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en) and [how Traditional Chinese embeddings break RAG](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en) give "domain adaptation" a concrete shape.

**Maps back to**: AIP-C01 Domain 1 task 1.5 and Domain 5 task 5.2, AIF-C01 chapter 2 (24%), AI-500 Develop, NCA-GENL Core ML, NCP-AAI Knowledge Integration.

### 3. Vector storage: from "list the services" to "make the design decisions"

**AIP-C01's task 1.4 is the most demanding vector-storage objective in the series**, and it lists product combinations rather than principles: hierarchical organization in Bedrock Knowledge Bases; OpenSearch Service with the Neural plugin; RDS with an S3 document store; DynamoDB with a vector store; **metadata frameworks** (S3 object metadata, custom attributes, tags); **high-performance indexing (OpenSearch shards, multi-index, hierarchical indexes)**; document-management-system integration; **data maintenance (incremental updates, real-time change detection, sync flows, scheduled refresh)**. Task 1.5 adds the deployment side: OpenSearch, **Aurora pgvector**, Bedrock Knowledge Bases managed vector store.

**AIF-C01's equivalent is a service list**: OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL. **Recognizing which AWS services can serve as a vector store** is enough; you are not asked to design an index.

**NCP-AAI's equivalent is a single clause**: "**vector database configuration and optimization**". Compressing the whole area into one line is the price of platform neutrality — you have to pick a vector store to practice on, because the official material won't tell you which. NCA-GENL is shallower still, mentioning **vector databases** only inside "Python NL packages (spaCy, NumPy, vector databases)".

**PMLE is empty here**, and Feature Store does not count, as noted above.

**The most underrated line is data maintenance**: incremental updates, real-time change detection, sync flows, scheduled refresh — all four are operations problems, not build problems. Most people have built a vector store but never handled "the source document changed, how does the index catch up", and AIP-C01 tests it explicitly. [Vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en) and [knowledge pipeline RAG quality control](/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control-en) cover this ground.

**Maps back to**: AIP-C01 Domain 1 (31%) tasks 1.4 and 1.5, AIF-C01 chapter 3 (28%), NCP-AAI Knowledge Integration (10%), NCA-GENL Core ML (item level of 30%).

### 4. Hybrid retrieval, rerankers, and query processing

AIP-C01's 1.5 lists advanced retrieval as two lines: **advanced search (keyword + vector hybrid, Bedrock reranker models)** and **query processing (expansion, decomposition, transformation)**. Task 4.2 tests it again from the performance angle: **retrieval speed (index optimization, query preprocessing, hybrid-search custom scoring)**.

NCP-AAI has one matching word: "hybrid" inside its retrieval pipelines line. **Rerankers appear nowhere in the official wording of AIF-C01, NCP-AAI, NCA-GENL, AI-500, or PMLE** — an AIP-C01-only named objective, and the point where the foundational-to-professional gap is widest.

AIP-C01 also has an **access-mechanism** line nobody else has: function calling, **querying a vector store via an MCP client**, standardized retrieval APIs. Only it pulls MCP into the retrieval layer — worth noting because AIF-C01 and AI-500 both test MCP, but as agent-to-tool connectivity, not as a way to query a vector store.

On this site: [hybrid search with BM25, vectors, and RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en), [cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking-en), [multi-query expansion](/posts/ai/2026-03-12-multi-query-expansion-en).

**Maps back to**: AIP-C01 Domain 1 task 1.5 and Domain 4 (12%) task 4.2, NCP-AAI Knowledge Integration (10%).

### 5. Measuring retrieval precision: RAG evaluation and LLM-as-a-judge

**This is the widest-covered section in the post — all six sources hit it.**

- **AIF-C01** chapter 3: FM evaluation methods and metrics — **human-in-the-loop, benchmarks, Bedrock Model Evaluation, ROUGE / BLEU / BERTScore / LLM-as-a-judge** — plus the explicit line "**evaluate applications built on FMs (RAG, agent, workflow)**" and **business-alignment metrics** (task completion rate, user satisfaction, cost per interaction; 3.4.5, added in v1.1)
- **AIP-C01** 5.1: **RAG evaluation and LLM-as-a-Judge**, human feedback; **retrieval quality testing (relevance scoring, context matching, retrieval latency)**; quality metrics (relevance, factual accuracy, coherence, fluency); Bedrock Model Evaluations, A/B and canary, **automated quality gates**
- **NCP-AAI** Evaluation and Tuning (13%): evaluation pipelines and task benchmarks, comparison across tasks and datasets
- **AI-500**: **evaluate memory, knowledge, tools, and prompts separately**, plus an **LLM-as-a-judge framework** for continuous improvement
- **PMLE** chapter 2: "**evaluate GenAI solutions using LLM-as-a-judge**" — this one line is its entire contribution to the topic
- **NCA-GENL** Experimentation (22%): "how to run, evaluate, and interpret experiments, including AI model evaluation"

**LLM-as-a-judge is the only term written into all six sources.** If you remember one thing from this post, remember that.

**Four cuts are worth memorizing separately**, because they produce different question shapes:

| Cut | Who tests it | What the question looks like |
|---|---|---|
| Metric names (ROUGE / BLEU / BERTScore) | **AIF-C01 only** | Given an evaluation task, which metric applies |
| Quality dimensions (relevance / factual accuracy / coherence / fluency) | AIP-C01 | Given a scenario, which dimension to measure |
| Component layer (memory / knowledge / tools / prompt separately) | AI-500 | Given a broken system, which component to evaluate first |
| Application layer (evaluating a RAG / agent / workflow system as a whole) | AIF-C01, AIP-C01 | "The model is fine but the system isn't" — how to locate it |

**Pull out AIP-C01's "retrieval quality testing" line specifically**: relevance scoring, context matching, and retrieval latency are listed together, which means the official view treats **latency as part of retrieval quality**, not as a separate dimension. That cuts against most people's intuition.

[RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en), [self-reflection and LLM-as-judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge-en), and [the gap between semantic similarity and retrieval relevance](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap-en) are the implementation background; this post doesn't rewrite them.

**Maps back to**: AIF-C01 chapter 3 (28%), AIP-C01 Domain 5 (11%) task 5.1, NCP-AAI Evaluation and Tuning (13%), AI-500 Evaluate (20–25%), PMLE chapter 2 (~16%), NCA-GENL Experimentation (22%).

### 6. Humans in the loop: annotation, feedback, and review

All four agree automated evaluation is not enough, but they ask for different things:

- **AIF-C01**: **human-in-the-loop is the first item listed** in its FM evaluation objective; chapter 4 adds "**human-centered design (user feedback mechanisms, transparency of AI decisions)**" and detection tooling (label quality analysis, human audit, subgroup analysis)
- **AIP-C01** 5.1: **user feedback interfaces, rating systems, annotation workflows**; 3.4 puts "LLM-as-a-judge automated evaluation" alongside human judgment
- **NCP-AAI**: "**collecting and integrating structured user feedback**" inside Evaluation and Tuning, plus a standalone 5% Human-AI Interaction and Oversight domain
- **AI-500**: "**design human review workflows in Foundry**" is an explicit skill in the evaluation area
- **NCA-GENL**: the official definition of its 22% Experimentation area says "**using human subjects in labeling or RLHF**"

**Note the wording difference**: AIF-C01 wants **recognition** (knowing human-in-the-loop is one evaluation method); AIP-C01 wants **interfaces and workflows** (you must design a usable feedback-collection mechanism); NCA-GENL wants **experimental method with human subjects** (closer to research ethics and study design). None of the three substitutes for another.

**Maps back to**: AIF-C01 chapter 3 (28%) and chapter 4 (14%), AIP-C01 Domain 5 task 5.1 and Domain 3 (20%) task 3.4, NCP-AAI Evaluation (13%) and Human-AI Interaction (5%), AI-500 Evaluate (20–25%), NCA-GENL Experimentation (22%).

### 7. The latency / cost / accuracy triangle

- **NCP-AAI** states it as one skill: "**tuning the trade-off between accuracy and latency efficiency**"
- **AIP-C01** is the most granular. 4.1 cost: token estimation and tracking, **context window optimization**, **prompt compression and context pruning**, **tiering FMs by query complexity**, **semantic caching, result fingerprinting, edge caching, deterministic request hashing, prompt caching**. 4.2 performance: **latency-optimized Bedrock models**, parallel requests, streaming, benchmarking, throughput, **temperature and top-k / top-p selection**
- **AIF-C01** covers the same ground conceptually: chapter 2's **token pricing models and their effect on cost and inference performance** (2.1.4, added in v1.1) and **the role of context engineering in FM applications** (2.1.5); chapter 3's FM selection criteria explicitly name **cost, latency, input/output length, and prompt caching**
- **PMLE** chapter 1: "**optimize Gemini applications for cost, latency, and availability**"

**AIF-C01's token pricing objective is worth borrowing even if you aren't taking it**: it asks for a quantifiable judgment — how much does the same task cost after switching models or compressing the prompt — and that is the first question anyone asks about a RAG system in production.

**This is also the only place CCDV-F touches the topic**: its Prompt and Context Engineering (11.0%) covers token budgeting and cost modeling, **prompt caching and cache check-pointing**, tool-output trimming and compaction, and context isolation via subagents. **"Tool-output trimming" and AIP-C01's "context pruning" are two names for the same thing**, and **cache check-pointing is CCDV-F's alone**. But as established above, this is context management, not retrieval.

[Semantic caching](/posts/ai/2026-03-12-semantic-caching-en) and [RAG cost optimization](/posts/ai/2026-03-12-rag-cost-optimization-en) cover this section.

**Maps back to**: AIP-C01 Domain 4 (12%) tasks 4.1 and 4.2, AIF-C01 chapter 2 (24%) and chapter 3 (28%), NCP-AAI Evaluation and Tuning (13%), PMLE chapter 1 (~13%).

### 8. Output side and post-launch: grounding, hallucination rate, and drift

The output side and post-launch monitoring is where the vendors diverge most interestingly — **each watches something different**:

| Certification | What the official objectives ask for |
|---|---|
| AIF-C01 (5.1.5, added in v1.1) | **Hallucination detection and grounding: RAG grounding, output verification, confidence scores** — the official guide frames RAG itself as a grounding technique |
| AIP-C01 (4.3) | Token usage, prompt effectiveness, **hallucination rate**, response quality; anomaly detection (token spikes, **response drift**); **Bedrock Model Invocation Logs**; **vector store operational monitoring**; **golden datasets for hallucination detection**, output diffing, reasoning-path tracing |
| NCP-AAI (Run/Monitor/Maintain) | Monitoring dashboards and reliability metrics, logging and anomaly tracking, **continuous benchmarking against prior versions** |
| AI-500 | **Sliding-window amnesia, summary drift, vector-only recall, entity continuity** — four context-window failure modes |
| PMLE (chapter 6) | **Training-serving skew, data drift, concept drift, feature attribution drift** — four kinds, via Model Monitoring |

**AIF-C01's 5.1.5 is the only place in these sources that explicitly positions RAG as the fix for hallucination**, and it binds grounding, output verification, and confidence scores together. AIP-C01's 3.1 has an equivalent combination (Knowledge Base grounding plus fact-checking, confidence scores, JSON Schema structured output) — but files it under security rather than governance. **The same technique sits in different chapters on the two guides**, so don't hunt for it by chapter title.

**All five talk about drift, and none of them mean the same drift.** PMLE's four are statistical distribution shifts (classical ML monitoring); AIP-C01's "response drift" and "embedding drift" sit in the generation and retrieval layers; AI-500's four are context-window failure modes. **When drift appears in a question, first work out which layer it is.**

**Golden datasets are named only by AIP-C01**, and **AI-500's vector-only recall** is the one named failure mode across these sources that directly describes what pure vector retrieval misses — for anyone building RAG, that term is more useful than its home in a multi-agent exam guide suggests.

**One weight caveat on NCP-AAI**: Run, Monitor, and Maintain is **5% on the official web page and 7% in the official PDF study guide**, both on nvidia.com. The same table disagrees on Deployment and Scaling too (13% web, 5% PDF). Treat it as an uncertainty range; don't pick one and call it fact.

[RAG observability and tracing](/posts/ai/2026-03-12-rag-observability-tracing-en), [RAG failure modes](/posts/ai/2026-03-12-rag-failure-modes-en), and [RAG A/B testing](/posts/ai/2026-03-12-rag-ab-testing-en) cover this section.

**Maps back to**: AIF-C01 chapter 5 (14%) objective 5.1.5, AIP-C01 Domain 4 (12%) task 4.3 and Domain 3 (20%) task 3.1, NCP-AAI Run/Monitor/Maintain (5–7%, sources conflict), AI-500 Evaluate (20–25%), PMLE chapter 6 (~13%).

## Same idea, four vocabularies

| Concept | AWS (AIF-C01 / AIP-C01) | NVIDIA (NCP-AAI / NCA-GENL) | Microsoft (AI-500) | Google (PMLE) |
|---|---|---|---|---|
| Document splitting | Chunking as a term / three implementations + dynamic-chunking debugging | Folded into "retrieval pipelines"; "curate datasets for RAG" | Chunking (with embedding quality, retrieval precision) | **Not tested** |
| Vectorization | Embedding and vector as terms / Titan embeddings, dimensionality and domain adaptation, embedding quality diagnosis | Embedding search; "select a model for text embeddings" | Embedding quality | **Not tested** (Feature Store is not this) |
| Vector storage | Service list (OpenSearch / Aurora / Neptune / RDS) / design decisions (shards, multi-index, metadata frameworks, incremental updates) | "Vector database configuration and optimization", one clause | (not listed separately) | **Not tested** |
| Advanced retrieval | Not tested / keyword + vector hybrid, **Bedrock reranker**, query expansion, decomposition, transformation | The single word "hybrid" | Retrieval precision | **Not tested** |
| Evaluation metrics | **ROUGE / BLEU / BERTScore** / relevance, factual accuracy, coherence, fluency | Task benchmarks, cross-dataset comparison | Memory / knowledge / tools / prompt evaluated separately | **Not tested** |
| LLM as judge | LLM-as-a-judge (both) | Evaluation pipelines | LLM-as-a-judge framework | **LLM-as-a-judge** (its only relevant objective) |
| Human in the loop | Human-in-the-loop recognition / feedback interfaces, rating systems, annotation workflows | Structured feedback collection, Human-AI Oversight 5% | Human review workflows in Foundry | Responsible AI and bias monitoring |
| Cost control | Token pricing models, prompt caching / semantic caching, context pruning, FM tiering | Accuracy-vs-latency tuning | Parallelism and rate limits | Optimize Gemini apps for cost, latency, availability |
| Hallucination handling | **RAG grounding, output verification, confidence scores** / grounding + fact-checking + structured output | Bias and toxicity mitigation | Vector-only recall and three other failure modes | Model Armor |
| Post-launch monitoring | Not tested / hallucination rate, response drift, golden datasets, vector store monitoring | Monitoring dashboards, benchmarking against prior versions | Four context-window failure modes | Four kinds of drift, Model Monitoring |

**Anthropic's absence from this table is itself the finding**: across these ten rows, CCDV-F's eight domains fill exactly one cell — cost control (token budgeting, prompt caching, cache check-pointing, compaction).

**The cells worth studying hardest are the "Not tested" ones.** They aren't gaps in my research — the official considerations and blueprints genuinely have nothing there. Time spent on chunking and vector stores while preparing for PMLE will not be repaid by the exam.

## What doesn't transfer

**AIF-C01 only**: the three metrics **ROUGE / BLEU / BERTScore**; **ranking five customization approaches by cost** (pre-training / fine-tuning / in-context learning / RAG / distillation); listing **Neptune** as a vector store; **token pricing models**; **business-alignment metrics** (task completion rate, user satisfaction, cost per interaction); the **Generative AI Security Scoping Matrix**; the four prompt risks (exposure, poisoning, hijacking, jailbreaking). **Plus the ordering and matching question formats** — both all-or-nothing, and absent from AIP-C01.

**AIP-C01 only**: Bedrock reranker models; metadata frameworks (S3 object metadata / custom attributes / tags); OpenSearch shards, multi-index, and hierarchical indexes; Aurora pgvector; **querying a vector store via an MCP client**; incremental updates, real-time change detection, and scheduled refresh; **embedding quality diagnosis and drift monitoring**; **golden datasets for hallucination detection**; semantic caching, result fingerprinting, and deterministic request hashing; **the three dimensions of retrieval quality testing**; automated quality gates; Bedrock Agent evaluations. **This is the only one that covers RAG end to end on its own.**

**NCP-AAI only**: the 7% NVIDIA Platform Implementation domain — **NeMo Guardrails, NIM microservices, NeMo Agent Toolkit, TensorRT-LLM, Triton Inference Server** — plus "real-time access to and reasoning over structured and unstructured knowledge" and knowledge-graph relational reasoning. Outside that 7%, its wording is **the most vendor-neutral of these sources** and works as a general glossary.

**AI-500 only**: the named context-window failure modes including **vector-only recall**; **evaluating memory / knowledge / tools / prompts separately**; and placing RAG inside a multi-agent context ("knowledge integration for multi-agent consumption").

**PMLE only**: telling the **four kinds of drift** apart (training-serving skew, data drift, concept drift, feature attribution drift) and **Model Monitoring**; **Model Armor**. None of this is about retrieval, but all of it is about watching an AI system in production.

## How much one practice project covers

This checklist maps to the eight sections above. **Finishing it covers the shared core and none of the exam-specific section.**

1. Index the same corpus three ways — fixed-size, hierarchical, semantic-boundary — and measure recall differences on one question set → (1)
2. Re-run with a **different embedding model**, so you experience firsthand why an existing index goes stale after a model swap → (2)
3. Stand up **two vector stores** (one managed, one self-managed), compare metadata filtering and **incremental updates**; deliberately edit a source document and time how long the index takes to catch up → (3)
4. Add **keyword + vector hybrid retrieval** and a **reranker**, measuring the change in top-k each time → (4)
5. Build a **golden dataset** and score it twice — once with **LLM-as-a-judge**, once with **ROUGE / BERTScore** — then check whether the two rank the same answers the same way → (5)
6. Build a **human annotation interface** — even just a form — and compare human ratings against the judge's → (6)
7. Add **semantic caching** and **prompt caching**; measure how much cost drops and how often the cache hits wrongly, and work out the cost-per-interaction delta from switching models or compressing the prompt → (7)
8. After launch, watch four things — **hallucination rate**, **embedding drift**, vector store query latency, and the share of responses below your confidence threshold — with an alert on each → (8)

**Step 5 is the best value in the list**, because it covers AIF-C01's metric questions and AIP-C01's quality-gate questions at once, and most people have only ever done one of the two.

Shortest paths to the non-transferable objectives: for AWS, chapter 3 of the [AIF-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) and tasks 1.4 / 1.5 / 5.1 of the [AIP-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html); for NVIDIA's 7%, product documentation or a DLI course ([Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1) is the cheapest of its five at $30 / 3 hours and maps directly onto Evaluation and Tuning); for Microsoft, the [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500); for Google, the Model Monitoring and Model Armor docs.

## If you only read one

**Depends which level you want.**

**For the complete retrieval checklist: the [AIP-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html).** Tasks 1.4 and 1.5 are the only place in these sources that enumerates RAG from data intake to retrieval output — 11 of 27 skill points sit there, which [the AIP-C01 post](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) converts by skill-point ratio into roughly 15–18% of the whole exam (**that is an extrapolation, not an official number — AWS publishes chapter weights only**). It is a free public HTML page requiring no registration, and it names things nobody else names (embedding drift, golden datasets, the three dimensions of retrieval quality testing).

**For the shortest glossary: the [AIF-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html).** Chapters 2 and 3 total 52%, and it is the only one of these that enumerates the evaluation metric acronyms. It costs far less time than AIP-C01 while sweeping the whole topic's vocabulary. **But mind the version**: v1.1 (2026-04-30) added seven objectives including token pricing, context engineering, agentic AI with MCP, and hallucination detection and grounding — the [revisions page](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html) has the line-by-line comparison, and almost every older summary on the web is missing those seven.

**Their shared bias**: both orbit the Bedrock ecosystem, and the vocabulary is AWS's. For a neutral version, read [NCP-AAI's ten domain descriptions](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/) — the Knowledge Integration and Evaluation and Tuning entries are product-free.

For RAG methodology on this site, [the complete RAG patterns guide](/posts/ai/2026-03-14-rag-patterns-complete-guide-en) is the entry point.

## What will go stale (check here next time)

| Item | Status (verified 2026-08-18) | Recheck when |
|---|---|---|
| AIF-C01 guide version | **v1.1 (published 2026-04-30)**, seven new objectives | Whenever the revisions page updates |
| AIF-C01 five-chapter weights | 20 / 24 / 28 / 14 / 14 | Every revision |
| AIP-C01 five-chapter weights | 31 / 26 / 20 / 12 / 11 | Every revision |
| AIP-C01 scope | Includes Bedrock AgentCore (2026-03 refresh) | After each AWS re:Invent |
| NCP-AAI registration | Coming soon; not yet open | Monthly |
| NCP-AAI weight conflict | Web page totals 98%, PDF totals 92%; two entries differ | When registration opens |
| AI-500 status | Still beta; the official blog says GA is expected 2026-10 | Monthly |
| Whether PMLE adds retrieval objectives | Considerations currently hold one LLM-as-a-judge line | After Google Cloud Next |
| Whether CCDV-F adds retrieval objectives | None across the blueprint's eight domains today | Every guide revision |

## References

- [AIF-C01 official exam guide (five chapter weights and all objectives)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide revision history (v1.0 → v1.1, line by line)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Certified AI Practitioner certification page](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIP-C01 official exam guide (five chapter weights and all skill points)](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [NCP-AAI official certification page (ten domains and the weight table)](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NCA-GENL official certification page (spec and blueprint)](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA DLI — Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1)
- [Microsoft AI-500 official study guide (source of the "multi-agent RAG architecture" objective)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [Google Professional ML Engineer exam guide (used to confirm it has only one LLM-as-a-judge objective)](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Claude Certified Developer – Foundations certification page (exam guide download; used to confirm it tests no retrieval)](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Multi-agent architecture across five exams (first deep-dive in this series)](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [AWS AIF-C01 preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS AIP-C01 preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [NVIDIA NCP-AAI preparation path](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)
- [Microsoft AI-500 preparation path](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [NVIDIA NCA-GENL preparation path](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en)
- [Google PMLE preparation path](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [Claude Certified Developer (CCDV-F) preparation path](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en)
- [The complete RAG patterns guide](/posts/ai/2026-03-14-rag-patterns-complete-guide-en)
- [Chunking strategies](/posts/ai/2026-03-12-chunking-strategies-en)
- [Contextual retrieval](/posts/ai/2026-03-12-contextual-retrieval-en)
- [Choosing an embedding model with BGE-M3](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en)
- [How Traditional Chinese embeddings break RAG](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en)
- [Vector database comparison](/posts/ai/2026-03-12-vector-database-comparison-en)
- [Hybrid search with BM25, vectors, and RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)
- [Cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking-en)
- [Multi-query expansion](/posts/ai/2026-03-12-multi-query-expansion-en)
- [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
- [Self-reflection and LLM-as-judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge-en)
- [The gap between semantic similarity and retrieval relevance](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap-en)
- [RAG A/B testing](/posts/ai/2026-03-12-rag-ab-testing-en)
- [Semantic caching](/posts/ai/2026-03-12-semantic-caching-en)
- [RAG cost optimization](/posts/ai/2026-03-12-rag-cost-optimization-en)
- [RAG observability and tracing](/posts/ai/2026-03-12-rag-observability-tracing-en)
- [RAG failure modes](/posts/ai/2026-03-12-rag-failure-modes-en)
- [Knowledge pipeline RAG quality control](/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control-en)
