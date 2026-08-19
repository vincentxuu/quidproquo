---
title: "Cost, Latency, and Availability Across Six Exams: One Topic Tested From Three Altitudes"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, llm, inference, cost-optimization, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 20
tldr: "Google PMLE, AWS AIF-C01 and AIP-C01, Microsoft AI-103 and AI-500, and NVIDIA NCP-GENL all test how to make a GenAI application fast, cheap, and reliable — and they form a three-rung ladder: AIF-C01 asks whether you know cost scales with tokens, AIP-C01 and the two Microsoft exams ask whether you can instrument and control it, NCP-GENL asks whether you can change the model and the hardware. Three different altitudes. NVIDIA works at the kernel and quantization layer (Model Optimization 17% + GPU Acceleration 14% = 31%, the heaviest single cost/latency block in the whole series), AWS and Microsoft at the application layer (three caching tiers, token caps, chargeback), and Google at the MLOps layer (CPU/GPU/TPU evaluation, data vs model parallelism, scaling serving backends by throughput). The shared core is eight levers, but each lever becomes a different question at each altitude. This post deliberately carries no prices and no hardware specs — that is the part of this topic that rots fastest."
description: "A cross-certification breakdown of GenAI cost, latency, and availability objectives: comparing the official exam guides for Google PMLE, AWS AIF-C01 / AIP-C01, Microsoft AI-103 / AI-500, and NVIDIA NCP-GENL, with eight shared levers, a four-vendor terminology map, the objectives that don't transfer, and a practice checklist that covers the shared core."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-genai-cost-latency-exam-domains)
>
> This is preparation material built from official sources, not an exam-day account — I have not sat these exams. Every "what it tests" points back to a vendor's official exam or study guide, all listed at the end. Verified 2026-08-18.

This is the technical deep-dive track of the [AI Certification Prep series](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en). The A-track posts cover one certification each; this one inverts that: **it takes "cost, latency, and availability optimization" — a topic six certifications test in parallel — covers the shared core once, then marks what each vendor tests that nobody else does.**

There is one key difference from the [multi-agent architecture post](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en): **multi-agent's shared core is the same thing at the same altitude; this one is not.** The six certifications name similar levers, but they sit at different levels of abstraction — NVIDIA asks why this kernel is slow, AIP-C01 and Microsoft ask whether this request should reach the model at all, Google asks how the serving backend should scale, and foundational-level AIF-C01 only asks whether you know cost scales with tokens. **Memorizing only the shared core will lose you points on every one of them, in the details of its own layer.**

## Which six, where the objectives sit, and how heavy

| Certification | Relevant domain | Weight | Altitude |
|---|---|---|---|
| [NVIDIA NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en) | Model Optimization | **17%** | Model layer: quantization, pruning, distillation, KV cache |
| (same) | GPU Acceleration and Optimization | **14%** | Hardware layer: six parallelism modes, Tensor Cores, CUDA profiling |
| (same) | Model Deployment | 9% | Serving layer: dynamic batching, Dynamo-Triton |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) | Operational Efficiency and Optimization | 12% | Application layer: token cost, caching, latency, observability |
| (same) | FM Integration (1.2 resilience) | part of 31% | Availability: cross-region inference, circuit breakers, graceful degradation |
| (same) | Implementation and Integration (2.2, 2.4) | part of 26% | Provisioned throughput, model cascading, model routing |
| [Microsoft AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en) (beta) | Evaluate, optimize, and monitor | 20–25% | Platform availability and SLAs, token caps, chargeback |
| [Microsoft AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en) | Plan and manage an Azure AI solution | 25–30% | Quotas, scaling, rate limits, cost management |
| [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en) | Ch. 3 Scaling prototypes | ~21% | Selection and training: CPU/GPU/TPU, data vs model parallelism |
| (same) | Ch. 4 Serving and scaling | ~20% | Serving: scaling the serving backend by throughput |
| (same) | Ch. 1 Low-code AI solutions | ~13% | "Optimizing Gemini applications for cost, latency, and availability" appears verbatim here |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) (foundational) | Ch. 2 Fundamentals of GenAI | 24% | Concept layer: token-based pricing and its cost/performance effects |
| (same) | Ch. 3 Applications of Foundation Models | 28% | Concept layer: FM selection criteria including prompt caching; cost trade-offs across customization approaches |

**The headline is NCP-GENL's 31%.** Model Optimization at 17% plus GPU Acceleration and Optimization at 14% is **the heaviest single cost/latency block across all fifteen certifications in this series** — other GenAI certifications test how to use a model; this one tests how to make a model run faster and in less memory on a GPU.

**Laid out in order, these six are a ladder with three rungs**:

| Rung | Certification | The question it asks |
|---|---|---|
| 1. Do you know | AIF-C01 (foundational) | **Does cost scale with tokens**, how much changes when you switch models or compress a prompt, which customization approach is expensive |
| 2. Can you control it | AIP-C01, AI-103, AI-500 | How to measure, cache, cap, charge back, and stay responsive when a provider goes down |
| 3. Can you change it | NCP-GENL (plus PMLE's training half) | Change the model itself, the precision, the hardware, the parallelism strategy |

**The ladder is practically useful**: if rung one isn't solid — you can't say how much cost changes when the same task moves to a different model — reading AIF-C01's Chapters 2 and 3 is faster than starting on AIP-C01's Chapter 4. AIF-C01's own study advice is that you should be able to **compute** how much the same task costs after switching models or compressing the prompt; that is the entry threshold for this whole topic.

**But rung one does not carry you to rung two**: AIF-C01 is foundational, and it asks about conceptual relationships (more tokens cost more; prompt caching is one selection criterion), not implementation. Of the eight levers below, AIF-C01 appears in only the first three, and always at the level of "knows this exists".

**Two scoping notes up front**:

One, **AIP-C01's cost and latency objectives are not confined to that 12%.** Operational Efficiency is its own chapter, but resilience design (1.2), deployment strategy and model routing (2.2, 2.4), and token-efficiency-to-latency-quality ratios (5.1) are scattered across three other chapters. **Budgeting study time against "12%" underestimates how much of this exam the topic actually is.**

Two, **NCP-GENL's official web page has a broken description in the Model Optimization row** — the text there describes deployment (containerized inference pipelines, Kubernetes, Triton), nearly duplicating Model Deployment (9%) in the same table. **The weight is correct; only the description text is broken**, and the correct description (pruning, sparsification, quantization, knowledge distillation, hyperparameter search, advanced sampling, TensorRT) is in the official PDF study guide. Prepare this block from the PDF. Details in the [NCP-GENL prep guide](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en).

## The shared core: eight levers

### 1. Model and hardware selection is the first lever, and the cheapest

All six sources put "choose the right thing" first, and all four require you to choose **by trade-off criteria rather than preference**:

- **PMLE Ch. 3**: choose model type (ARIMA, DNN, LLM) and product by **cost, complexity, latency, and scalability**; and **evaluate CPU, GPU, and TPU**. This is the only one of the six sources that puts all three compute types side by side for a judgment call.
- **AIP-C01 4.1**: cost-versus-capability trade-offs, **tiering FM usage by query complexity**, price-performance evaluation; 2.2 adds **model cascading** and **small task-specific models**.
- **AI-500 architecture block**: **map task requirements to model family capabilities**.
- **AI-103 planning block**: select the right model per task (LLM, small language model, multimodal, Foundry Tools).
- **[AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)** (architect's view): **implement a model router that directs requests to the most appropriate model**, judged against **ROI criteria that include total cost of ownership**.
- **[AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) Ch. 2**: model selection factors explicitly including **cost, latency, model complexity**; Ch. 3's **FM selection criteria** list is longer still — cost, modality, latency, multi-lingual, model size, complexity, customization, input/output length, prompt caching. **It is the most complete list of selection criteria of the six**, though it only asks you to recognize the criteria, not to trade them off against numbers.

**Those lines are two versions of the same thing**: static selection (which model for this task) and dynamic routing (which model for this request). AWS calls it model cascading and intelligent model routing, Microsoft calls it a model router, Google doesn't name it and buries it in "choose model type by cost, complexity, latency, and scalability". **Questions typically give you a mixed workload** — many simple requests plus a few complex ones — and the correct answer is nearly always tiering rather than sending everything to the large model.

**Maps back to**: PMLE Ch. 3 (~21%), AIP-C01 4.1 / 2.2 (12% plus part of 26%), AI-500 Architect (15–20%), AI-103 Plan (25–30%), AB-100 Plan (25–30%), AIF-C01 Ch. 2 (24%) + Ch. 3 (28%).

### 2. Caching has three tiers, and the objectives name them separately

This is the single most worthwhile set of terms in this post. **AI-500 lists caching strategies as exactly three**:

| Tier | What it caches | Hit condition |
|---|---|---|
| **Prompt caching** | Request prefix (system prompt, long context) | Prefix matches verbatim |
| **Semantic caching** | Semantically similar queries and their responses | Vector similarity above a threshold |
| **Response caching** | Full request-to-response mapping | Identical request key |

AIP-C01's 4.1 lists the same set plus two mechanisms: **semantic caching, result fingerprinting, edge caching, deterministic request hashing, prompt caching**. Deterministic request hashing and result fingerprinting are implementation techniques for response caching — **AWS tests how you build it, Microsoft tests how many tiers there are**, and reading both together gives the complete picture.

**The boundaries between tiers are the objective itself**: prompt caching saves reprocessing a repeated prefix, semantic caching saves the entire call, response caching requires an exact request match. **Treating them as one thing is the common error**, and questions like to sit precisely on "which tier fits this scenario".

The site's posts on [semantic caching](/posts/ai/2026-03-12-semantic-caching-en) and [ReAct agent cache design](/posts/ai/2026-04-03-react-agent-cache-design-en) cover the implementation layer and the real hit-rate problems — the exam guides give the names but not how to tune the thresholds.

**AIF-C01 touches this lever exactly once, and where it lands is the point**: prompt caching appears inside Ch. 3's **FM selection criteria**, alongside cost, latency, and model size. **At foundational level, caching is not a mechanism you design; it is a "does this model support it" field on a selection checklist.** Semantic caching and response caching do not appear in AIF-C01's objectives at all — those two tiers arrive with AIP-C01 and AI-500.

**Maps back to**: AI-500 Develop (30–35%), AIP-C01 4.1 (12%), AIF-C01 Ch. 3 (28%, prompt caching only).

### 3. Token budget control: caps, loops, length, compression

**AI-500 states it as three control points**: **token caps, loop control, tool calls**. That framing is agent-specific — loop control and tool calls appear because an agent's token cost is mostly consumed by repeated tool-call rounds, not by a single response.

**AIP-C01's 4.1 framing is application-specific**: token estimation and tracking, **context window optimization**, **response length control**, **prompt compression and context pruning**.

**Only together are they a complete list**, and each is missing half of the other: Microsoft never mentions prompt compression, AWS never mentions loop caps. When preparing either, read the other's half as a supplement.

**AI-103's planning block requires "manage quotas, scaling, rate limits, and costs"** — the same idea lifted one level up, to tenant and service scope.

The site's [RAG token quota system](/posts/ai/2026-03-12-rag-token-quota-system-en) and [RAG cost optimization](/posts/ai/2026-03-12-rag-cost-optimization-en) cover the implementation side, including how quotas get allocated and what happens on overrun — a depth the exam guides never reach.

**AIF-C01 tests the premise behind this lever**: objective 2.1.4 is "**token-based pricing models** and their effects on cost and inference performance" — it asks not how you control tokens but whether you know **cost scales with tokens**. The same chapter's model selection factors also list cost and latency together. **This objective is new in v1.1 (2026-04-30)**; material written for the 2024 version does not contain it.

**The gap between the two is the gap between rung one and rung two**: AIF-C01 wants you to compute how much switching models or compressing a prompt saves; AIP-C01 and AI-500 want you to turn that computation into caps, alerts, and chargeback.

**Maps back to**: AI-500 Evaluate/optimize/monitor (20–25%), AIP-C01 4.1 (12%), AI-103 Plan (25–30%), AIF-C01 Ch. 2 (24%).

### 4. Batching and parallelism: three vendors, three different things being batched

This lever is where the three altitudes are most visible:

- **NCP-GENL Model Deployment (9%)**: **dynamic batching** — batching **requests inside the inference engine**; GPU Acceleration (14%) separately tests **batch and memory management** and **gradient accumulation**, which batch **training samples**.
- **AIP-C01 4.1 / 4.2**: **batch inference**, **concurrency management**, **parallel requests** — batching **calls the application sends**.
- **AI-500 Develop**: **control agent generation, batching, and parallel execution**; the Evaluate block adds **optimizing task duration (parallelism and rate limits)** — batching **agent execution units**.
- **PMLE Ch. 4**: **deploying batch versus online inference** — testing **which mode to choose**, not how to tune batch size.

**The word "batch" means four different things across these four sources**, which is the easiest way to read this topic wrong. The disambiguation rule is simple: **look at which domain it sits in** — in a GPU or deployment block it means in-engine batching, in an application block it means caller-side batching, in an orchestration block it means agent parallelism.

**Maps back to**: NCP-GENL Model Deployment (9%) + GPU Acceleration (14%), AIP-C01 4.1 / 4.2 (12%), AI-500 Develop (30–35%) + Evaluate (20–25%), PMLE Ch. 4 (~20%).

### 5. Quantization and serving optimization: only NVIDIA really tests this

**NCP-GENL Model Optimization (17%) digs deepest here of any source in the series.** The official PDF lists: pruning, sparsification, **weight and activation quantization to reduce memory footprint**; **selecting and implementing quantization strategies** (post-training quantization, quantization-aware training, activation quantization), **tuned to hardware and task, while measuring accuracy trade-offs**; **knowledge distillation** to produce smaller models; systematic hyperparameter tuning and distributed parameter search; **advanced sampling (beam search, temperature scaling) and ablation studies**; selecting optimization methods (**TensorRT, sliding-window / streaming attention, KV cache**).

**The official wording says "measure accuracy trade-offs"**, meaning questions want a judgment about the trade-off, not a definition — they ask how far you can quantize before the accuracy loss is unacceptable, not what INT8 is.

The other five are nearly empty here. The three closest lines:

- **AIP-C01 4.2** has **"latency-optimized Bedrock models"** — that is picking a model AWS already optimized, not optimizing one yourself.
- **AIF-C01 Ch. 3** lists **model distillation** under "cost trade-offs across customization approaches", alongside pre-training, fine-tuning, in-context learning, and RAG. **Note that this treats distillation as an option whose cost you compare, not a technique you implement** — the same word in NCP-GENL is a hands-on task ("produce a smaller model").
- **[NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)'s NVIDIA Platform Implementation (7%)** has **"reduce latency with TensorRT-LLM and Triton Inference Server"** and **"deploy NIM microservices for high-performance inference"** — product-level integration, not the optimization techniques themselves.

**This is the most important non-transferable item in this post**: experience optimizing cost on Bedrock or Foundry does almost nothing for NCP-GENL's 17%, and vice versa.

The site's [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine-en), [TurboQuant and KV cache compression](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression-en), and [hardware for local inference](/posts/ai/2026-04-02-ai-hardware-local-inference-guide-en) are the practical entry points — KV cache, streaming attention, and quantization accuracy trade-offs all appear there in a hands-on form.

**Maps back to**: NCP-GENL Model Optimization (17%), NCP-AAI NVIDIA Platform Implementation (7%), part of AIP-C01 4.2 (12%).

### 6. Distributed training and throughput-based scaling

**PMLE Ch. 3 names two distributed training strategies**: **data parallelism and model parallelism**. **NCP-GENL splits the same thing far more finely** — GPU Acceleration (14%) lists **DDP, FSDP, and six parallelism modes: model, pipeline, tensor, data, sequence, expert**.

**The granularity gap between the two sources is the difficulty gap between the two exams**: PMLE wants you to tell data from model parallelism and know when each applies; NCP-GENL wants all six. Reading the six for PMLE is over-preparing; reading only two for NCP-GENL is under-preparing.

On the serving side:

- **PMLE Ch. 4**: **scale the serving backend by throughput**; the boundaries between four deployment options (Agent Platform, Cloud Run, GKE, batch inference); public versus private endpoints.
- **AIP-C01 4.1**: capacity planning, **auto-scaling**, **provisioned throughput optimization**; 2.2's deployment strategy mixes Lambda on-demand invocation, Bedrock provisioned throughput, and SageMaker endpoints.
- **NCP-AAI Deployment and Scaling**: **containerized scaling (Docker, Kubernetes) and load balancing**, performance profiling under distributed load. (Two official versions disagree on this block's weight — **the web page says 5%, the PDF says 13%**, both on nvidia.com. Treat it as an uncertainty range.)

**"On-demand versus reserved capacity" is the core judgment in this lever** — AWS tests it through provisioned throughput, Google through "scale the serving backend by throughput". **Reserve for steady high traffic, on-demand for unpredictable spikes** is the general answer, but both vendors give you cost figures to reason over — which is exactly why **price is the one thing in this topic you must always look up fresh**.

**Maps back to**: PMLE Ch. 3 (~21%) + Ch. 4 (~20%), NCP-GENL GPU Acceleration (14%), AIP-C01 4.1 / 2.2, NCP-AAI Deployment and Scaling (5–13%, versions conflict).

### 7. Availability: SLAs, degradation, and multi-region

Availability is where the six diverge most, because it is simultaneously an architecture question and a procurement question:

- **AI-500** states it in one line: **platform availability and SLAs** — the only one of the six to put "SLA" directly in its objectives.
- **AIP-C01 1.2** gives the most concrete mechanism list: **Step Functions circuit breakers, Bedrock Cross-Region Inference, multi-region deployment, graceful degradation**; 2.4 adds **exponential backoff, API Gateway rate limiting, fallback**.
- **PMLE Ch. 1** says verbatim "optimize Gemini applications for **cost, latency, and availability**", binding all three into one consideration; Ch. 4's **A/B testing and canary deployment** is the other face of availability.
- **NCP-AAI Deployment and Scaling** says **cost optimization and high availability**, likewise binding the two.

**The binding itself is the objective**: official sources do not treat cost, latency, and availability as three independent goals but as one set of mutually exchangeable constraints. **The typical question gives you two requirements and asks what the third pays** — for example, cut latency while holding availability, and what does that cost.

**Maps back to**: AI-500 Evaluate/optimize/monitor (20–25%), AIP-C01 1.2 (part of 31%) + 2.4, PMLE Ch. 1 (~13%) + Ch. 4 (~20%), NCP-AAI Deployment and Scaling (5–13%).

### 8. Cost monitoring and chargeback

**AI-500 is the only one that puts chargeback in its objectives**: "cost monitoring and management (**usage, quotas, allocation, chargeback**)", and in the same block requires **implementing tracing in Foundry (tokens, prompts, correlation IDs, alerts, execution traces)**.

**AIP-C01's 4.3 leads with observability**: CloudWatch tracking of token usage, prompt effectiveness, hallucination rate, response quality; **anomaly detection (token spikes, response drift)**; **Bedrock Model Invocation Logs**; **cost anomaly detection**.

**AI-103**, in its optimization and operations section, requires building observability and explicitly names **token analysis** and **latency breakdown** — "latency breakdown" is the only wording across the six that treats latency as a decomposable quantity.

**The three are easy to keep apart**: Microsoft tests **who the money is billed to** (allocation and chargeback), AWS tests **when the money goes abnormal** (token spikes and cost anomaly detection), AI-103 tests **where the time goes** (latency breakdown). **All three questions need answers, but only Microsoft's asks you to design the chargeback.**

**Maps back to**: AI-500 Evaluate/optimize/monitor (20–25%), AIP-C01 4.3 (12%), AI-103 Implement generative AI and agentic solutions (30–35%).

## Same idea, four vocabularies

| Concept | Google (PMLE) | AWS (AIP-C01; AIF-C01 in parentheses) | Microsoft (AI-103 / AI-500 / AB-100) | NVIDIA (NCP-GENL / NCP-AAI) |
|---|---|---|---|---|
| Dynamic model selection | "choose model type by cost, complexity, latency, scalability" | model cascading, intelligent model routing (AIF-C01: FM selection criteria, including cost, latency, complexity) | model router (AB-100) | not an objective |
| Caching | not a separate objective | semantic caching, prompt caching, result fingerprinting, deterministic request hashing, edge caching (AIF-C01: prompt caching, as a selection criterion only) | prompt / semantic / response caching (three tiers listed) | not an objective |
| Token control | not a separate objective | token estimation and tracking, context window optimization, response length control, prompt compression (AIF-C01: the concept of token-based pricing) | token caps, loop control, tool calls; quotas and rate limits | not an objective |
| Batching | choosing batch vs online inference deployment | batch inference, concurrency management | control agent generation, batching, parallel execution | dynamic batching (deployment), batch and memory management (GPU) |
| Parallelism | data parallelism, model parallelism | parallel requests | optimize task duration (parallelism and rate limits) | DDP, FSDP, six parallelism modes |
| Model compression | not an objective | "latency-optimized models" (selected, not built) (AIF-C01: model distillation, listed only as a customization cost option) | not an objective | pruning, sparsification, quantization (PTQ / QAT / activation), knowledge distillation |
| Serving optimization | scale serving backend by throughput | provisioned throughput, auto-scaling | platform availability and SLAs | TensorRT, KV cache, streaming attention, Dynamo-Triton, NIM |
| Resilience | A/B and canary deployment | circuit breakers, Cross-Region Inference, graceful degradation, exponential backoff | platform availability and SLAs | cost optimization and high availability |
| Cost observability | Model Monitoring (model-quality oriented) | CloudWatch token tracking, cost anomaly detection, Model Invocation Logs | usage / quotas / allocation / chargeback, Foundry tracing, latency breakdown | monitoring dashboards and reliability metrics, continuous benchmarking against prior versions |
| Hardware choice | evaluate CPU / GPU / TPU | tune containers by memory / GPU / token throughput | not an objective | Tensor Cores and mixed precision, CUDA profiling |

**How to use it**: after finishing one vendor's material, translate the terms across and skip the same row elsewhere — but **pay attention to the blank cells**. They are not omissions; that exam genuinely doesn't test it, and reading it is wasted time.

## What doesn't transfer

**NCP-GENL only**: the entire model compression stack (pruning, sparsification, PTQ / QAT / activation quantization, knowledge distillation), the boundaries between six parallelism modes, **Tensor Core and mixed-precision optimization**, **distributing and optimizing GEMM operations for self-attention heads**, **finding bottlenecks with CUDA profiling** and debugging kernel efficiency, TensorRT, sliding-window / streaming attention, **Dynamo-Triton deployment with dynamic batching**, and the compute trade-offs between encoder / decoder / encoder-decoder architectures. The official prerequisites say **C++ in addition to Python** — which is precisely why this block doesn't transfer.

**AIP-C01 only**: **result fingerprinting and deterministic request hashing** (the concrete implementation of response caching), **edge caching**, **prompt compression and context pruning**, **Bedrock provisioned throughput optimization**, **Bedrock Cross-Region Inference**, **Step Functions circuit breakers**, **Bedrock Model Invocation Logs**, **cost anomaly detection**, **choosing temperature and top-k / top-p and A/B testing them**, and **token-efficiency-to-latency-quality ratios** (an evaluation metric in 5.1). Nearly all of it is bound to AWS service names.

**AI-500 only**: **chargeback** (the only source of the six), the phrase **platform availability and SLAs**, the three-point token governance of **caps + loop control + tool calls**, **correlation IDs in Foundry tracing**, and the explicit three-tier naming of caching.

**AI-103 only**: the **latency breakdown** requirement, and binding **quotas, scaling, rate limits, and cost** into a single planning skill.

**PMLE only**: **evaluating CPU / GPU / TPU side by side** (only Google tests TPUs), the **data-versus-model-parallelism** dichotomy, **scaling the serving backend by throughput**, the boundaries between four deployment options (Agent Platform, Cloud Run, GKE, batch inference), and **troubleshooting training failures**. Note that PMLE's product names were renamed wholesale in 2026 (Vertex AI → Gemini Enterprise Agent Platform, Vertex AI Prediction → Agent Platform Inference), so **older material's service names won't match the questions**.

**AB-100 only**: **ROI criteria including total cost of ownership** and the **build / buy / extend** trade-off — the only source that tests cost from a procurement rather than an engineering angle.

**AIF-C01 only**: **token-based pricing itself** as a standalone objective (2.1.4), the **cost ranking across four customization approaches (pre-training, fine-tuning, in-context learning, RAG) plus model distillation**, and Chapter 3's unusually long FM selection criteria list. The professional-level guides skip all of this as assumed background — **it is the only certification here that asks directly where the cost comes from**. One caveat: these arrived in **v1.1 (2026-04-30)**, and material written for the 2024 version has none of them.

## How much one practice project covers

**About seventy percent of the shared core, and none of NCP-GENL's 31%.** This checklist maps to the eight levers above:

1. Run the same task through two model sizes, measure **the quality gap and the latency gap**, and write down the boundary condition → (1)
2. Implement **tiered routing**: simple requests to the small model, complex ones escalated, and log the escalation rate → (1)
3. Build **all three cache tiers** (prompt, semantic, response), measure hit rates for each, and deliberately produce one semantic-cache false hit → (2)
4. Add **token caps and loop caps** so a runaway agent stops inside its budget → (3)
5. Send the same batch of requests **one at a time** and **as a batch**, and compare total time and total cost → (4)
6. **Quantize** an open-source model once and measure how much accuracy drops and how much latency improves → (5, the only item that touches NCP-GENL's core)
7. Run a **load test**, find the throughput bottleneck, and actually scale the serving backend once → (6)
8. Add **exponential backoff, fallback, and graceful degradation**, then cut off the primary provider and confirm the system still responds → (7)
9. Build a **cost dashboard**: token usage split by tenant or feature, with an alert on abnormal spikes → (8)
10. **Decompose one request's latency** by stage (retrieval, embedding, model, post-processing) and find the largest segment → (8)

**Everything except item 6 misses NCP-GENL entirely.** That 31% needs hands-on GPU work and CUDA profiling; the corresponding official courses are the instructor-led Model Parallelism course and the self-paced Nsight profiling course — prices and durations are in the [NCP-GENL prep guide](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en).

## If you only read one

**It depends on which layer you work at; there is no single answer.**

- **Building LLM applications**: read Chapter 4 of the [AIP-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html). It is the most complete list of application-layer cost and latency levers of the six — caching, tokens, batching, routing, observability, nothing missing — and it is free public HTML. The downside is that every line carries an AWS service name you have to strip off.
- **Building agent systems**: read the third block of the [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500). Its naming of four concept groups — three cache tiers, three-point token governance, chargeback, SLAs — is the cleanest of the six.
- **Not solid on rung one yet**: read Chapters 2 and 3 of the [AIF-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html). It is the only one of the six that treats "where the cost comes from" as an objective rather than an assumption, and reading it first makes AIP-C01's Chapter 4 much cheaper. Make sure you read **v1.1** (effective 2026-04-30) — the token pricing objective is new.
- **Building models and inference infrastructure**: [NCP-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/) is the only route, and you must read the official PDF study guide rather than the web page (that row's description is broken).

## What will go stale (check here next time)

**This section matters more here than in any other post in the series.** Cost and latency is **the fastest-rotting body of knowledge in it** — model prices, GPU generations, and vendors' reserved-capacity offerings all move roughly quarterly.

**So this post deliberately carries no prices, no per-token rates, no latency figures in milliseconds, and no GPU specs.** Everything above is "which levers and trade-offs the objectives name", not "what a model costs or how fast a card is". **Any prep material that hard-codes those numbers has a shelf life of one quarter.** When you need a number, look it up on the vendor's official pricing page — don't trust any restatement, including this one.

| Item | Status (verified 2026-08-18) | When to re-check |
|---|---|---|
| Model prices and per-token rates | **deliberately omitted here** | Look up the official pricing page whenever you need to cost something |
| GPU generations and specs | **deliberately omitted here** | Same |
| NCP-GENL ten-domain weights | 17/14/13/13/9/9/7/7/6/5, summing to 100% | When registration opens (currently Coming soon) |
| NCP-GENL broken web descriptions | Model Optimization and Fine-Tuning rows still wrong | Quarterly |
| NCP-AAI Deployment and Scaling weight | **web page 5%, PDF 13% — versions conflict** | When registration opens |
| AIP-C01 five-chapter weights | 31 / 26 / 20 / 12 / 11 | On each AWS refresh |
| PMLE six-chapter weights | 13 / 16 / 21 / 20 / 18 / 13 | On each objectives update |
| PMLE product naming | Now Gemini Enterprise Agent Platform | After Google Cloud Next |
| AI-500 status and weights | Beta; 15-20 / 30-35 / 20-25 / 20-25 | After GA |
| AI-103 five-block weights | 25-30 / 30-35 / 10-15 / 10-15 / 10-15 | Quarterly |
| AIF-C01 five-chapter weights and version | 20 / 24 / 28 / 14 / 14, exam guide v1.1 (2026-04-30) | On each AWS refresh |

## References

- [Google Professional ML Engineer official exam guide (six chapters, weights, full considerations)](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Google Professional ML Engineer certification page](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [AWS AIF-C01 official exam guide (five chapters, weights, full task statements)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide revision history (v1.0 → v1.1, including the token pricing objective)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS AIP-C01 official exam guide (five chapters, weights, full task statements)](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [Microsoft AI-103 official study guide (five blocks and objectives)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [Microsoft AI-500 official study guide (four blocks and 22 sub-objectives)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [Microsoft AB-100 official study guide (TCO-inclusive ROI and model router)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NVIDIA NCP-GENL certification page (ten domain weights and recommended courses)](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)
- [NVIDIA NCP-AAI certification page (ten domains and weight table)](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA certification overview and FAQ](https://www.nvidia.com/en-us/learn/certification/)

**Related on this site**

- [AI Certifications for Engineers in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Multi-Agent Architecture Across Five Exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [NVIDIA NCP-GENL prep guide](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en)
- [NVIDIA NCP-AAI prep guide](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)
- [AWS AI Practitioner (AIF-C01) prep guide](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS GenAI Developer Professional (AIP-C01) prep guide](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [Microsoft AI-103 prep guide](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [Microsoft AI-500 prep guide](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [Microsoft AB-100 prep guide](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)
- [Google PMLE prep guide](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [Semantic caching](/posts/ai/2026-03-12-semantic-caching-en)
- [ReAct agent cache design](/posts/ai/2026-04-03-react-agent-cache-design-en)
- [RAG cost optimization](/posts/ai/2026-03-12-rag-cost-optimization-en)
- [RAG token quota system](/posts/ai/2026-03-12-rag-token-quota-system-en)
- [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine-en)
- [TurboQuant and KV cache compression](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression-en)
- [Hardware for local inference](/posts/ai/2026-04-02-ai-hardware-local-inference-guide-en)
