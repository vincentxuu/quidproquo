---
title: "AI Agent Arxiv Digest — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is agent memory management: a correctly retrieved memory can still be overridden by the model itself, deterministic indexing beats generative memory, and evicting stale context at the GPU-serving layer has a real cost"
tldr: "TASK Memory cuts memory-ignoring hallucination to under 1.5%; MGMem beats three generative memory systems without any generative indexing; Contexture lifts agent-serving throughput 20-73% but carries a worst-case 3.7pp accuracy risk"
series:
  name: "AI Agent Arxiv Digest"
  order: 188
---

## Today's Overview

Today's three papers split "agent memory management" into three distinct problems that usually get lumped together. TASK Memory points at an easy-to-miss blind spot: even when a retrieval system puts the correct memory into the prompt, the model's own internal knowledge can still override it, producing a "retrieved right, answered wrong" hallucination — and this comes in three mechanically different flavors that need different fixes. MGMem starts from the opposite end, questioning the assumption that memory indexing has to go through a generative LLM call at all — it replaces generative indexing with a fully deterministic parser and still beats three generative memory systems on a standard dialogue-memory benchmark. Contexture pulls the problem down to the GPU-serving infrastructure itself: an agent's execution history keeps growing, and the KV cache it occupies directly caps how many agent sessions a server can handle at once — and evicting history that's "already been superseded" is not a free lunch. All three have reasonably solid evidence (cross-model statistical tests, rerun baselines, production-grade evaluation matrices), and all three are honest about their own boundaries — which is exactly why today's batch is worth reading closely.

## Terms to know before reading

| Term | Plain explanation |
|---|---|
| Long-Horizon Memory | An agent's ability to persistently remember information across thousands of turns or tasks, not just the current conversation's context |
| KV Cache | GPU inference stores intermediate attention results for every token so the model doesn't have to recompute them, but this consumes a large amount of GPU memory |
| Activation Steering | Adjusting a model's internal activation vectors at inference time, without changing its weights, to shift its output behavior |
| Knowledge Editing | Making a localized change to one specific fact inside a model's internals, without retraining the whole model |
| Harness | The program framework that drives an agent — system prompt, tool definitions, memory read/write logic — not the model itself |
| SLO (Service Level Objective) | A performance threshold a service commits to, e.g. "average latency under some number of milliseconds" — a standard metric for GPU-serving systems |

```diagram
title: Today's three papers mapped onto three memory layers
desc: From top to bottom: whether the model uses memory correctly, how memory is indexed and stored, and how execution history is evicted at the GPU-serving layer — corresponding to TASK Memory, MGMem, and Contexture respectively.
caption: Illustrative: the three papers map onto three conceptual layers, not a technical dependency chain — this is an editorial framing of "memory management" from application down to hardware.
---
<svg viewBox="0 0 640 248">
  <path class="dg-axis" d="M36 220V40" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">Abstract</text>
  <text class="dg-tag" x="36" y="232" text-anchor="middle" dominant-baseline="central">Concrete</text>

  <rect class="dg-box dg-box--accent" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="60" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="42" dominant-baseline="central">Correctness layer</text>
  <text class="dg-sub" x="124" y="64" dominant-baseline="central">Does the model actually use retrieved memory?</text>
  <text class="dg-sub" x="124" y="84" dominant-baseline="central">TASK Memory: ignoring hallucination 46% to &#8804;1.5%</text>

  <rect class="dg-box" x="72" y="104" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="132" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="120" dominant-baseline="central">Indexing architecture</text>
  <text class="dg-sub" x="124" y="144" dominant-baseline="central">MGMem: no generative indexing, +2.6-13.5pp over rivals</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="184" dominant-baseline="central">GPU serving layer</text>
  <text class="dg-sub" x="124" y="208" dominant-baseline="central">Contexture: context eviction raises throughput 20-73%</text>
</svg>
```

---

## Paper 1 | TASK Memory: The right memory, still the wrong answer

**TASK Memory: Beyond Text-Only Memory with Activation Steering and Knowledge Editing against Memory Hallucination**
Jin-Kun Zhao, Wen-Jun Wu (institution not listed on Semantic Scholar)　·　arxiv: 2611.34762

Links: [arxiv](https://arxiv.org/abs/2611.34762) · [alphaxiv](https://www.alphaxiv.org/abs/2611.34762)

### TL;DR

Even when the correct memory has already been retrieved and placed in the prompt, tests across five open models show up to 46% of queries still get overridden by the model's own stale internal knowledge. TASK Memory brings this "memory-ignoring" hallucination down to at most 1.5% across all ten model-dataset cells tested.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 3 days ago, no citation data yet on Semantic Scholar |
| Institution | Not publicly listed (2 authors, no affiliation field populated on Semantic Scholar) |
| Community signal | Not found on HF Daily Papers (checked 2026-11-26, 2026-11-27) / no GitHub reproduction repo found |
| Credibility | Pass — pre-registered protocol across 5 models/4 families, 95% paired-bootstrap CIs across multiple benchmarks |
| Evidence maturity | Substantial — covers provided-evidence, library, and continual-revision protocols plus multi-hop composition |
| Reproducibility | Not provided — no code or data release link found in the abstract or body |
| Why this paper | Direct — exposes a core failure mode of memory-augmented agents, not a peripheral issue |
| Novelty | Substantive — splits "memory hallucination" into three distinct mechanisms (ignoring, misapplying, version confusion), each addressed separately |
| Today's importance | High — most memory-system evaluations only measure retrieval accuracy; this shows correct retrieval doesn't guarantee correct use |
| Practical link | Clear — but limited to open-weight models whose internals you can access; doesn't apply to agents built on closed APIs |
| Editorial confidence | High — the pre-registered, cross-model statistical rigor is unusually strong for this literature |
| Reading recommendation | Must-read — for any team evaluating memory-augmented agents |
| Primary limitation | Requires read/write access to the model's internal weights and activations, so it can't be applied to agents built on closed APIs |

### Field Context

Memory-system evaluations have mostly asked one question: "did retrieval find the right memory?" — treating retrieval accuracy as the finish line. But once retrieval succeeds, does the model actually follow it? This paper shows the answer is sometimes no — the model's own weights, or memory misapplied to the wrong entity, are failure modes retrieval accuracy simply can't measure.

### Mid-level Walkthrough

- **The problem**: Imagine a customer-support agent retrieves "this customer already returned the item last week" and puts it in the prompt — but the model still replies "sure, I can process your return," because its own training-time prior about "how returns usually go" overrides what's written right in front of it. It's not a retrieval failure; retrieval worked and still didn't help.
- **The method**: TASK Memory binds a text note, an activation-steering pair, and a removable knowledge edit to one shared in-model address. The text carries the content; the knowledge edit supplies the address key (and supports multi-hop composition); a pair of steering vectors decides, query by query, whether the model should adopt the memory or fall back to its own answer. Each part can fail or be fixed independently.
- **Why it matters**: This paper turns the vague phrase "memory hallucination" into three separately measurable and separately fixable mechanisms: the model reverting to stale weights (up to 46%), misapplying memory to unrelated entities (up to 24%, 49% when combined with weight editing), and version confusion (53% of answers about revised facts still assert the superseded value).

### Deep Dive

- On CounterFact (300 worlds), the TASK configuration lifts accuracy from a baseline 0.811 to 0.919 (+10.80pp, 95% CI excludes 0)
- In the library protocol (retrieving from a pool of memories), TASK beats BM25 RAG on CounterFact by 16.36 percentage points
- Against six context-steering baselines, it wins in 9 of 10 model-dataset cells; 21 of 23 cross-model comparisons (8B-27B, four model families) are statistically significant
- Cuts "neighbour misuse" from 39.2% to 7.5% (+10.8pp composite score on CounterFact)
- Adoption barrier: the method needs to edit the model's internal activations and weights, so it only works on open-weight models you can access — not on closed-API models most production agents actually run on (Claude/GPT-class services)
- Limitation: hallucination types are classified by a "normalised assertion matcher," not by human annotation — but since all comparisons use the same matcher, the relative ranking and statistical significance remain credible

### Reviewer's One-Liner

The pre-registered, cross-model statistical protocol is unusually rare for this space, and splitting "memory hallucination" into three mechanisms turns a vague complaint into something testable; but the method needs internal weight access, so it's currently limited to self-hosted open models — it's not yet a drop-in fix for your Claude/GPT-based agent.

### Takeaways for you

- If you're evaluating memory-augmented agents: don't stop at retrieval accuracy — add a test for whether the model actually uses the memory that's already in the prompt; this paper's three-way taxonomy can be used directly as a classification scheme
- If you're building memory systems on self-hosted open models: TASK's "text + activation steering + knowledge editing" division of labor is worth studying, especially when your memory store gets revised over time (the version-confusion problem)

---

## Paper 2 | MGMem: Memory indexing doesn't have to go through a generative LLM

**MGMem: An Efficient, Deterministic, and Provenance-Preserving Framework for Long-Horizon Agent Memory**
Jun-Hong Huang, Xin Tong, Jun Xia (supported by the Red Bird MPhil program at HKUST(Guangzhou); funding acknowledgments include NSFC, Ant Group and Shanghai AI Lab)　·　arxiv: 2611.33174

Links: [arxiv](https://arxiv.org/abs/2611.33174) · [alphaxiv](https://www.alphaxiv.org/abs/2611.33174)

### TL;DR

Most long-horizon memory systems use a generative LLM to rewrite dialogue history into summaries or knowledge graphs before indexing — costing thousands of generative calls per build. MGMem skips that step entirely with a deterministic parser, and still beats three generative memory systems on the LoCoMo dialogue-memory benchmark (+2.60 to +13.47 percentage points).

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint; the body includes a NeurIPS paper checklist and thanks to "anonymous reviewers," suggesting a conference submission, but Semantic Scholar has not confirmed a venue yet |
| Citation velocity | Originally submitted 2026-10-21, publicly surfaced in the 2026-11-26 announcement batch; no citation data yet |
| Institution | Acknowledgments cite the Red Bird MPhil program at HKUST(Guangzhou), NSFC, CCF-GHFund, and funding support from Ant Group and Shanghai AI Lab |
| Community signal | Not found on HF Daily Papers (checked 2026-11-26, 2026-11-27) / code released on GitHub (github.com/junhong-h/MGMem) |
| Credibility | Pass — reran three competing systems locally with matched seeds (42-44), bootstrap CIs, and an explicitly disclosed failure category |
| Evidence maturity | Substantial — two independent long-horizon memory benchmarks (LoCoMo, LongMemEval-S), plus episode-level retrieval metrics |
| Reproducibility | Full artifacts — code released, evaluated on public benchmarks |
| Why this paper | Direct — directly challenges the assumption that memory indexing requires a generative LLM |
| Novelty | Substantive — a deterministic parser fully replaces the generative indexing step, addressing cost, non-determinism, and provenance loss in one move |
| Today's importance | High — the cost and non-determinism of generative indexing are real pain points when scaling memory systems in production |
| Practical link | Clear — a lightweight alternative alongside generative memory systems, especially where cost and reproducibility matter |
| Editorial confidence | High — rerunning competitors locally and disclosing a failure mode makes the comparison trustworthy |
| Reading recommendation | Must-read — for any team worried about the cost of building memory indexes |
| Primary limitation | Only tested on English dialogue, and its average accuracy on open-domain questions is below two retrieval baselines (Dense, HippoRAG 2) |

### Field Context

Mainstream long-horizon memory systems (Mem0, A-Mem, etc.) typically have an LLM rewrite raw dialogue into summaries, facts, or knowledge graphs before indexing. That step looks obvious — but it costs thousands of generative calls to build one index (expensive), the same conversation can produce a different summary on a rerun (non-deterministic), and readers only ever see the rewritten text, not the original turn (provenance lost).

### Mid-level Walkthrough

- **The problem**: Imagine a support system handling tens of thousands of conversations a day, each needing a memory index. If every one requires an LLM call to rewrite into a summary, the indexing API bill alone becomes a sizable fixed cost — and re-indexing the same conversation tomorrow might produce a different summary, breaking any attempt to reproduce an investigation.
- **The method**: MGMem skips generative rewriting entirely. Recurring mentions across sessions are organized into an incidence graph; mentions in a question are resolved back to the original dialogue through a subject-conditioned, three-stage resolver; raw dialogue episodes — not LLM-rewritten text — are returned to the reader.
- **Why it matters**: This paper demonstrates that "memory indexing" and "memory summarization" are actually separable — indexing is about finding the relevant raw passage, and that doesn't inherently require a generative LLM. What you save isn't just call volume; it's also determinism and provenance.

### Deep Dive

- Reaches 75.89% overall judge accuracy on the four LoCoMo categories, beating locally rerun EMem (73.29%, +2.60pp), AnchorMem (71.69%, +4.20pp), and LightMem (62.42%, +13.47pp) — with zero generative indexing calls
- At the episode-retrieval level: hit@1 = 0.591, hit@5 = 0.837, hit@10 = 0.893 — exceeding BM25, Dense, and Hybrid on every metric
- Beats the locally rerun Hybrid baseline (66.62%) by 9.27 percentage points overall
- Limitation (self-reported): tested only on English dialogue (mention extraction via spaCy's en_core_web_trf); on open-domain questions, its mean accuracy (49.65%) falls below the reference results for Dense and HippoRAG 2 (50.00%) — showing that the core assumption ("recently recurring entities are the relevant evidence") doesn't hold universally for open-domain questions
- Adoption barrier: needs a cross-session mention-resolution pipeline (currently spaCy-based NER/coref); switching language or domain needs separate validation
- Framework fit: can sit alongside Mem0/A-Mem-style generative memory systems as an alternative indexing layer — the paper notes it can even compose with dense or LLM-generated complements

### Reviewer's One-Liner

Rerunning three competitors locally with matched seeds and scoring deserves credit for rigor; but the authors are also upfront that open-domain questions are the one category where it loses to plain retrieval baselines, showing the core "recent recurrence = relevant" assumption isn't universal — readers should decide by question type.

### Takeaways for you

- If you're worried about memory-indexing API cost and reproducibility: MGMem's deterministic parser pipeline is worth considering as an alternative to generative indexing, especially for single-hop, multi-hop, and temporal-heavy question loads
- If your workload is heavily open-domain: check the paper's failure analysis first — MGMem does not guarantee a win over plain retrieval baselines on this category

---

## Paper 3 | Contexture: Evicting old memory saves GPU, but it's not free

**Contexture: Runtime Context Eviction for High-Throughput Agent Serving**
Authors not fully captured (byline stripped by content extraction) (institution not verified — Semantic Scholar API repeatedly rate-limited)　·　arxiv: 2611.26980

Links: [arxiv](https://arxiv.org/abs/2611.26980) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26980)

### TL;DR

An agent's execution history keeps growing, and the GPU KV cache it occupies directly caps how many agent sessions a server can serve at once. Contexture finds that 64% of history tokens have already been superseded by later operations and can be safely removed — raising throughput by 20-73% in real GPU-serving deployments, but live-agent experiments show a worst-case accuracy drop of 3.7 percentage points.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (cs.DC primary, cross-listed to cs.AI/cs.MA/cs.OS) |
| Citation velocity | Published 8 days ago (a Layer-C lookback candidate); Semantic Scholar API returned 429 repeatedly, unresolved |
| Institution | Not verified (author byline stripped by content extraction; Semantic Scholar lookup rate-limited) |
| Community signal | Not found on HF Daily Papers (checked 2026-11-26, 2026-11-27) / no GitHub link found, but baselines are real production tools (Hermes, OpenClaw, vLLM, LMCache) |
| Credibility | Pass — production-grade evaluation matrix across two models, two harnesses, two benchmarks, against both production-default and academic baselines |
| Evidence maturity | Substantial — reports throughput, latency, energy, and task accuracy together, including the disclosed worst-case accuracy drop |
| Reproducibility | Not provided — no code/artifact release link found in the fetched sections |
| Why this paper | Direct — extends "memory management" down to the real cost of GPU-serving infrastructure |
| Novelty | Substantive — combines tool-execution semantics with global KV-pressure state for a harness- and model-agnostic eviction mechanism |
| Today's importance | Medium — a direct infrastructure problem for teams scaling agent services |
| Practical link | Clear — a concrete architecture for the GPU-serving bottleneck in long-horizon agent tasks |
| Editorial confidence | Medium — the evaluation matrix is broad and credible, but reproducibility is unconfirmed and the worst-case accuracy risk needs the reader's own judgment |
| Reading recommendation | Skim — useful for agent-platform infra/SRE teams; application developers can read the conclusion first |
| Primary limitation | Live-agent experiments show a worst-case 3.7pp accuracy drop; the assumption that "superseded history won't be needed again" doesn't hold in every case |

### Field Context

As agent tasks run longer, execution history (tool outputs, intermediate results) keeps accumulating, and every request has to recompute KV cache against all of it. Existing context-reduction methods lack global visibility into GPU cache pressure, while existing GPU cache managers lack the semantic information about which tool-call outputs have already been superseded. Neither side can see what the other knows — leaving room on the table.

### Mid-level Walkthrough

- **The problem**: Imagine an agent reading a document draft via a tool call, then later reading a revised version — the draft's content is now useless, but it still sits in the conversation history, getting recomputed into KV cache on every request. It's like an office keeping an obsolete draft and re-photocopying it before every meeting.
- **The method**: Contexture separates the harness's full conversation history from the model's actual execution context. It traces tokens to their originating tool operations to identify which history has been superseded, then combines that with global KV-pressure state and prefix residency (what's still cached) to decide when and what to evict — without modifying harness logic or the model itself.
- **Why it matters**: This paper pulls "memory management" down from "what should we remember" to "what does it cost in GPU to remember it" — directly relevant to how many concurrent users a production agent platform can actually support.

### Deep Dive

- Tracing tokens to their originating tool operations finds 64% of recorded final-history tokens are removal candidates
- Across two models (Qwen3.8-27B on H200, Qwen3.6-35B-A3B MoE on H100), two open-source harnesses (Hermes, OpenClaw), and two long-horizon benchmarks (Terminal-Bench 2.1, SWE-Atlas-QnA), throughput under SLO improves 20-73% over the best of no-eviction, harness default compaction, AgentDiet, and Continuum
- Beats observation masking by 7-63% in five of eight configurations; on H100, beats LMCache alone by 23% in throughput under SLO
- Live-agent experiments: mean accuracy improves 1.4pp over no-eviction, but the worst case drops 3.7pp (compared to observation masking's worst-case loss of 3-28pp)
- Also reduces GPU energy per completed session by up to 11%
- Limitation: the rule for deciding "this history has been superseded, safe to remove" isn't always correct — the worst-case accuracy drop is the cost of that rule being wrong sometimes; the paper doesn't further break down which task types are most prone to this failure

### Reviewer's One-Liner

A broad, credible evaluation matrix — two models, two harnesses, two benchmarks, measured against both production defaults and academic methods — and it's honest about reporting the worst case, not just the favorable mean; but how often the "supersession" judgment itself is wrong, and which task types are most at risk, isn't broken down further, leaving readers to assess that risk on their own.

### Takeaways for you

- If you run agent-serving infrastructure and GPU KV cache is your throughput bottleneck: Contexture's "trace tool semantics + global KV pressure" design is worth studying, but test the worst-case accuracy impact on your own task distribution before deploying — don't just look at average throughput gains
- If you're choosing a harness compaction strategy: this paper's baseline data shows Hermes/OpenClaw's default length-triggered compaction clearly underperforms an eviction mechanism that factors in KV pressure — worth re-examining your own harness's compaction timing

---

## Today's Takeaway

I used to think agent memory was mainly about "can it remember, can it find it" — today's batch shows it's actually three independently failable layers stacked on top of each other: get the memory right, and the model's own stale knowledge can still override it (TASK Memory); build the index, and a generative LLM turns out not to be a requirement — a deterministic parser can be more reliable (MGMem); and even with a well-designed memory architecture, the decision to evict stale context at the GPU-serving layer carries its own risk of getting it wrong — it's not a pure free lunch (Contexture). Memory management isn't one problem; it's three problems stacked together.

## References

- [TASK Memory: Beyond Text-Only Memory with Activation Steering and Knowledge Editing against Memory Hallucination](https://arxiv.org/abs/2611.34762)
- [MGMem: An Efficient, Deterministic, and Provenance-Preserving Framework for Long-Horizon Agent Memory](https://arxiv.org/abs/2611.33174)
- [Contexture: Runtime Context Eviction for High-Throughput Agent Serving](https://arxiv.org/abs/2611.26980)
- [MGMem GitHub repository](https://github.com/junhong-h/MGMem)
- [arXiv cs.AI new submissions, 2026-11-26](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-26](https://arxiv.org/list/cs.CL/new)
