---
title: "AI Agent Arxiv Digest — 2026-10-29"
date: 2026-10-29
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today check the same thing at three different grain sizes: is agent memory actually helping, or quietly making things worse?"
tldr: "Memory Tax systematically benchmarks 12 memory systems and finds most have negative net value against plain RAG; Obsolete Facts shows a swap experiment where accuracy drops from 100% to 44.6% when an unrelated statement is replaced with a stale-but-related one; Rare Relevant Wrong finds that in multi-agent group decisions, a full transcript can be worse than no notes at all, because the decision model over-weights claims tagged as stated by many agents"
series:
  name: "AI Agent Arxiv Digest"
  order: 158
---

## Today's overview

Three papers today examine the same question at three different grain sizes: what is agent memory actually doing for us? Memory Tax benchmarks 12 mainstream memory systems against plain RAG and finds most have negative net value — elaborate memory designs often lose to simply retrieving from raw history. Obsolete Facts drills into a specific mechanism: why does accuracy drop as retrieval budgets grow? The answer is that a stale competing fact is more harmful than unrelated noise, by a wider margin than intuition suggests. Rare, Relevant, and Still Wrong pulls the lens out to multi-agent group decisions: what should a compressed memory keep? Both "keep the rarest claims" and "keep the most relevant claims" fail systematically, and even a complete discussion transcript can mislead the decision-maker, because the model gives extra weight to claims tagged as held by many agents — regardless of whether those agents judged independently. The throughline across all three: memory isn't a free win. Without deliberate design against these specific failure modes, a memory layer can be worse than having none at all.

## Terms worth knowing before this one

| Term | Plain-language explanation |
|---|---|
| Agent memory system | A mechanism that lets an agent retain past interactions instead of re-retrieving raw history every time — common designs include summaries, knowledge graphs, and structured records |
| RAG (retrieval-augmented generation) | The non-memory baseline: retrieve relevant chunks directly from raw history for every task. All three papers today use it as the reference point |
| Memory tax | The net loss of a memory system relative to a RAG baseline — reorganizing information can also drop or obscure evidence that was clearly present in the raw data |
| Obsolete fact | A stale statement that has been superseded by an update but remains in the memory store; the failure isn't "not retrieved" — it's "retrieved, but the model still picks the wrong version" |
| Hidden-profile task | A social-psychology group-decision design where the correct answer requires pooling information distributed across members; used to test whether groups get swamped by widely-shared information at the expense of key minority clues |
| Social-proof bias | A decision model giving extra weight to claims tagged as stated by multiple agents, even when those agents' statements are not independent |

---

## Paper 1 | Memory Tax: Dissecting the Net Value of Agent Memory

**Memory Tax: Dissecting the Net Value of Agent Memory**
Xuan He, Sining Zhoubian, Ruozhen Yang et al. (University of Illinois Urbana-Champaign + Tsinghua University + Renmin University of China + University of Waterloo + Verdent.ai)　·　arxiv: 2610.34073

Links: [arxiv](https://arxiv.org/abs/2610.34073) · [alphaxiv](https://www.alphaxiv.org/abs/2610.34073)

### TL;DR

Benchmarking 12 mainstream memory systems against a plain RAG baseline shows most have negative net value on multiple benchmarks — compared to retrieving directly from raw history, adding memory often makes things worse.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (cs.CL, not peer-reviewed) |
| Citation velocity | 4 days since publication; Semantic Scholar API rate-limited (429) during this check, citation data unavailable |
| Institution | UIUC (with senior faculty Jiawei Han, ChengXiang Zhai) + Tsinghua + Renmin + Waterloo + Verdent.ai |
| Community signal | Included in HF Daily Papers' 2026-10-28 batch; GitHub (hexuan21/MemoryTax) already released an evaluation harness |
| Credibility | Pass — Table 1 runs a systematic ablation across 12 systems × 3 backbones × 3 benchmarks, cell-by-cell against the RAG reference |
| Evidence maturity | Substantial — covers the core claim with multiple baselines, though PersonaMem-v2 and MINT-Eval are evaluated on 10–20% subsets for cost reasons |
| Reproducibility | Full artifacts — public evaluation code and pinned baseline setups on GitHub, results hosted on Hugging Face |
| Why this paper | Direct — systematically quantifies memory's net value against RAG, the best-evidenced anchor paper in today's memory cluster |
| Novelty | Substantive — the first systematic benchmark framework comparing memory systems against RAG across 12 systems and multiple backbones |
| Today's importance | High — directly challenges the industry assumption that memory systems always beat plain retrieval |
| Practical link | Clear — teams should benchmark against RAG(2rd) before adopting a memory layer, not just compare memory systems against each other |
| Editorial confidence | High — the large-scale cross-system evaluation supports the bounded claim that most existing memory systems have negative net value |
| Reading recommendation | Must-read — for any team evaluating or selecting a memory system |
| Primary limitation | Benchmarks skew static, offline, English-only; some benchmarks evaluated on subsets only, no frontier model stronger than GPT-5.6 Luna tested |

### Field background

Memory system design has proliferated over the past two years — summarization, knowledge graphs, hierarchical lifecycle management, trained memory policies — but most papers compare only against other memory systems, rarely against "just retrieve from raw history." This paper fills that gap.

### Mid-level walkthrough

- **Problem**: Imagine two customer-service agents — one with an expensive "memory management module," the other doing nothing but dumping old conversation logs into a retriever for every task. Intuition says the one with memory should be smarter. But what if it's actually wrong more often?
- **Method**: The paper splits memory's net value into memory benefit and memory tax, using RAG as the reference. It scores 12 memory systems (grouped into Flat store, Hier/Lifecycle, Graph-based, and Trained Policy) across 3 model backbones and 3 benchmarks, cell by cell.
- **Why it matters**: Memory system designers have long focused on "how to make memory smarter," rarely asking "does this layer of complexity actually beat doing nothing?"

### Deeper points

- Table 1 shows OpenViking on Qwen3.5-4B scoring 40.4 percentage points below the RAG(2rd) baseline on LongMemEval-s — the largest negative gap in the evaluation
- Most memory systems show negative values across the 3-benchmark × 3-backbone grid; only a few (e.g., PlugMem in specific combinations) beat the RAG baseline
- LongMemEval is relatively retrieval-friendly; PersonaMem-v2 and MINT-Eval involve more complex aggregation and multi-interference reasoning, where memory systems' gaps widen further
- Deployment threshold: before adopting a memory system, run the same benchmark suite against RAG(1rd)/(2rd) baselines first — otherwise it's hard to tell whether the new system is genuinely helpful or just looks sophisticated
- Framework relevance: evaluated systems like A-Mem, MemOS, HippoRAG2, and MemoryOS are widely used open-source memory solutions, so these results directly inform current tech-stack decisions
- Limitation: benchmarks skew static, offline, English-only; PersonaMem-v2 and MINT-Eval evaluated on 10–20% subsets due to compute/API cost, no frontier model stronger than GPT-5.6 Luna tested ⚠️ (author-acknowledged limitation, awaiting larger-scale replication)

### Reviewer's one-liner

Choosing RAG as the reference is itself a contribution — it forces the usual "memory systems compared to each other" convention to confront the more basic question of whether memory beats doing nothing at all; but the static, offline, English-only evaluation setting is still some distance from real long-term deployment scenarios.

### Takeaways for you

- If you're evaluating whether to add a memory layer to your product: run this paper's evaluation framework (or at minimum an RAG(2rd) baseline) before committing to the added complexity and cost of a memory system
- If you already operate a memory system: add "net value vs. RAG baseline" to your monitoring metrics, not just relative progress between memory-system versions

---

## Paper 2 | When Retrieval Is Not Enough: Obsolete Facts in Agent Memory

**When Retrieval Is Not Enough: Obsolete Facts in Agent Memory**
Oleeviya Babu Poikarayil, Tony Basil Babu, Abdulrahman Nahhas et al.　·　arxiv: 2610.36308

Links: [arxiv](https://arxiv.org/abs/2610.36308) · [alphaxiv](https://www.alphaxiv.org/abs/2610.36308)

### TL;DR

A controlled swap ablation shows that, holding evidence size fixed, replacing one unrelated statement with an obsolete-but-related competing statement drops accuracy from 100% to 44.6% (Qwen2.5-7B) and 87.8% (Qwen3-14B) — with all 50 harmful flips landing on the stale value.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | Accepted at the NeurIPS 2026 Workshop on Personalized, Aligned, Long-Term Memory for AI Systems (PALM) |
| Citation velocity | 3 days since publication; Semantic Scholar API rate-limited (429) during this check, citation data unavailable |
| Institution | Authors include Klaus Turowski, Ernesto William De Luca, among others; full institutional affiliations not listed on the abstract page, not individually verified |
| Community signal | Not seen in the HF Daily Papers batch checked; reuses existing public MemoryAgentBench code, no dedicated repo found |
| Credibility | Pass — controlled swap ablation under a frozen prompt and fixed evidence size, replicated across 6K and 32K history lengths |
| Evidence maturity | Preliminary — the ablation design is rigorous but limited to 2 open-weight models and 1 synthetic benchmark; authors explicitly avoid a mechanistic causal claim |
| Reproducibility | Partial artifacts — built on public MemoryAgentBench (MIT) and public Qwen checkpoints (Apache-2.0), but no dedicated code release found for this paper itself |
| Why this paper | Direct — answers the mechanistic question Memory Tax leaves open: why larger retrieval budgets sometimes lower accuracy |
| Novelty | Substantive — separates "retrieving the update" from "using the update" into two distinct questions, clarifying the actual failure point |
| Today's importance | High — directly explains a counterintuitive but common memory-system phenomenon |
| Practical link | Clear — motivates memory systems that actively retire, down-weight, or flag superseded facts |
| Editorial confidence | High — the claim is narrow (a stale competing statement is more harmful than an unrelated one), but the ablation design cleanly supports it |
| Reading recommendation | Must-read — for teams building long-term conversational memory or knowledge-update mechanisms |
| Primary limitation | Only 2 open-weight Qwen models, 1 synthetic benchmark, single-hop chains of length at most two; does not rule out the confound that stale values may simply align better with familiar world knowledge |

### Field background

Memory-agent benchmarks typically collapse retrieval and answer generation into one score, making it impossible to distinguish "the model didn't retrieve the update" from "the model retrieved the update but still picked the wrong version" — two failures with very different implications for memory system design.

### Mid-level walkthrough

- **Problem**: Imagine a note-taking assistant that remembers you "moved to Taipei last month," then later you say you "moved to Taichung." Logically it should pick the newest address when both are in view — but what if the assistant picks the stale one more often as more evidence is added?
- **Method**: Using the FactConsolidation task from MemoryAgentBench, the authors first run a gold-assisted post-hoc audit confirming that the latest statement is present in every retrieved set — ruling out "retrieval failure" as the cause. Then, under a frozen prompt and fixed evidence count, they swap one unrelated statement for the obsolete competing one and observe the accuracy change.
- **Why it matters**: This shows "retrieving the correct fact" and "the model actually using the correct fact" are two separate things, and that an obsolete competing statement is far more damaging than ordinary noise — a direct engineering signal for anyone designing memory-update mechanisms.

### Deeper points

- 6K-history, BM25 retrieval: accuracy drops from 45% to 32% as the evidence budget grows from 64 to 512 tokens, even though the post-hoc audit confirms the newest statement is present every time
- Equal-size swap ablation: replacing one unrelated statement with the obsolete competing statement drops accuracy from 100% to 44.6% (Qwen2.5-7B) and 87.8% (Qwen3-14B), with all 50 harmful flips classified as stale selections
- A 32K-history replication points the same direction: BM25-64 (69%) outperforms BM25-512 (58%)
- Deployment threshold: memory systems need an active mechanism to distinguish "still valid" from "superseded" facts, rather than relying on semantic-similarity ranking to surface both together
- Framework relevance: most vector-retrieval-based memory (RAG, HippoRAG-style systems) has no built-in version/validity tagging — this is a direct warning for that design pattern
- Limitation: tested on only 2 open-weight Qwen models, deterministic decoding, 1 synthetic benchmark, single-hop chains of at most two statements, and does not rule out the confound that stale values may align better with the model's world-knowledge priors ⚠️ (authors explicitly avoid a mechanistic causal claim)

### Reviewer's one-liner

The swap ablation is clean and cleverly separates two problems usually conflated — retrieval quality and usage quality — but the sample is limited to two small open-weight models and one synthetic task, so generalization to larger, more realistic memory settings remains to be tested.

### Takeaways for you

- If you're designing long-term conversational memory: treat "flagging/retiring obsolete facts" as equally important as retrieval accuracy — don't assume semantic-similarity ranking alone is sufficient
- If you're evaluating memory-system benchmark results: split out "was the latest info retrieved" from "was the latest info used" as separate sub-scores, rather than looking only at final answer accuracy

---

## Paper 3 | Rare, Relevant, and Still Wrong: How Memory Fails LLM Group Decisions

**Rare, Relevant, and Still Wrong: How Memory Fails LLM Group Decisions**
Anouar Imel, Imad Charradi, Abderrahman Sghir, Khalil El Khammar　·　arxiv: 2610.37624

Links: [arxiv](https://arxiv.org/abs/2610.37624) · [alphaxiv](https://www.alphaxiv.org/abs/2610.37624)

### TL;DR

When a multi-agent discussion is compressed into memory for a decision-maker, both "keep the rarest claims" and "keep the most relevant claims" fail systematically — and even a complete transcript can mislead the decision, because the decision model gives extra weight to claims tagged as stated by multiple agents.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (AAAI-style template, no stated conference acceptance) |
| Citation velocity | 2 days since publication; Semantic Scholar API rate-limited (429) during this check, citation data unavailable |
| Institution | No institutional affiliation listed on the abstract page; search did not surface clear institutional information |
| Community signal | Not seen in the HF Daily Papers batch checked; Papers with Code has a listing but no linked code repository found |
| Credibility | Pass — the CrossProfile benchmark (480 tasks) across 4 models, with confidence intervals across multiple ablations |
| Evidence maturity | Substantial — multiple models and ablations support the core claim, though task types are limited to synthetic hidden-profile templates |
| Reproducibility | Partial artifacts — the appendix details template and answer-key generation, but no downloadable public code or dataset found |
| Why this paper | Direct — raises the grain size of memory failure from single-agent fact memory to multi-agent group-decision memory curation |
| Novelty | Substantive — the CrossProfile crossed design (fact ownership × role) reveals a new failure mechanism, social-proof bias |
| Today's importance | High — a counterintuitive finding (full transcript can be worse than no notes) with direct architectural implications |
| Practical link | Clear — directly informs memory-curation design for multi-agent debate and deliberation systems |
| Editorial confidence | High — multiple models, multiple ablations, and confidence intervals support the claim that neither rarity nor relevance is a safe default |
| Reading recommendation | Must-read — for teams building multi-agent debate, deliberation, or consensus mechanisms |
| Primary limitation | Tasks are synthetic hidden-profile templates; external validity to natural, open-ended group discussion remains to be verified |

### Field background

Social psychology has long documented that hidden-profile-style group decisions can be swamped by widely-shared information at the expense of minority-held key clues (the common-knowledge effect). This paper imports that classic paradigm into LLM multi-agent systems to test whether memory-curation strategies hold up.

### Mid-level walkthrough

- **Problem**: Imagine four agents, each holding part of the evidence, discussing which option to choose, and the discussion must be compressed into a short memory for the final decision-maker. Intuitively, "keep the rarest, most distinctive claims" or "keep the claims most relevant to the decision criteria" both sound reasonable — but what if both strategies fail exactly where it matters?
- **Method**: The CrossProfile benchmark crosses support, decoy, and irrelevant facts, each either shared or private, into 480 tasks with automatically verified answer keys. The "keep most relevant" strategy readmits misleading decoys because decoys are on-topic by design. The "keep rarest" strategy performs no better than random on average, winning only when rare facts happen to be the useful ones. Further, removing the "who said this" attribution tags raises the decision model's accuracy by 13–24 percentage points in the classic setting — showing the model treats "stated by multiple agents" as extra evidentiary weight, even when those agents' views aren't independent.
- **Why it matters**: This means the answer to "what should memory keep" isn't a filtering rule (rarity, relevance) — it's about the evidence balance the memory preserves, and how the decision model interprets the attribution tags on that evidence.

### Deeper points

- A perfect relevance filter still loses 23 to 31 percentage points to rarest-first selection in the classic hidden-profile configuration, because decoys are on-topic by design
- Removing attribution tags, or randomly reassigning them while keeping statement order fixed, raises accuracy by 13 to 24 percentage points in the classic configuration ⚠️ (based on the authors' own synthetic CrossProfile benchmark, external replication pending)
- Under natural discussion conditions (real multi-round message exchange rather than scripted statements), the complete transcript yields lower accuracy than no notes at all — evidence is lost or distorted before memory ever acts on it
- A prompt change (asking agents to state evidence before recommending) helps only Llama, raising its REF accuracy by 25.1–30.8 percentage points, with no detected change for Qwen — showing the fix's effect is model-dependent
- Deployment threshold: multi-agent debate or deliberation systems should check whether their decision model treats "corroborated by multiple sources" as a proxy for independent evidence, rather than analyzing the actual evidence balance, before designing memory-curation rules
- Limitation: all 60 templates come from synthetic hidden-profile task designs; generalization to real-world, open-ended multi-agent collaborative discussion remains to be verified

### Reviewer's one-liner

CrossProfile's crossed design neatly separates two long-conflated variables — how rare a fact is and whether it's useful — and the social-proof finding offers a clear engineering takeaway; but since all tasks come from synthetic templates, external validity is the next thing to verify.

### Takeaways for you

- If you're designing multi-agent debate or consensus mechanisms: don't use "rarity" or "surface relevance" as the memory-retention filter — first check your decision model's sensitivity to attribution tags, and remove or scramble attribution information if needed
- If your system feeds the full discussion transcript to the decision-maker: don't assume "more information" is always safer — this paper shows a full transcript can sometimes perform worse than no notes at all

---

## Today's takeaway

I used to think memory-system problems were just a matter of degree — some implementations are better, some worse. These three papers show the failure modes are more systematic than that: a single fact gets overridden by a stale version, an entire memory system's net value loses to doing nothing (plain RAG), and group decisions get misled by a social-proof signal from "stated by many agents." Three completely different grain sizes point to the same conclusion: adding memory is not automatically a win. Without design that specifically targets these failure modes, a memory layer can be worse than having none at all.

## References

- [Memory Tax: Dissecting the Net Value of Agent Memory (arXiv:2610.34073)](https://arxiv.org/abs/2610.34073)
- [Memory Tax — alphaxiv](https://www.alphaxiv.org/abs/2610.34073)
- [Memory Tax — official code repository](https://github.com/hexuan21/MemoryTax)
- [Memory Tax — HuggingFace Daily Papers](https://huggingface.co/papers/2610.34073)
- [When Retrieval Is Not Enough: Obsolete Facts in Agent Memory (arXiv:2610.36308)](https://arxiv.org/abs/2610.36308)
- [When Retrieval Is Not Enough — alphaxiv](https://www.alphaxiv.org/abs/2610.36308)
- [Rare, Relevant, and Still Wrong: How Memory Fails LLM Group Decisions (arXiv:2610.37624)](https://arxiv.org/abs/2610.37624)
- [Rare, Relevant, and Still Wrong — alphaxiv](https://www.alphaxiv.org/abs/2610.37624)
