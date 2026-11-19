---
title: "AI Agent Arxiv Digest — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is agent shared memory: benchmarks that can't tell memory designs apart, evidence that disappears at the worker-to-lead handoff, and a conflict-resolution habit that makes systems easier to poison"
tldr: "RAG in a Trenchcoat shows a deliberately minimal memory system matches top designs on three standard benchmarks, exposing that those benchmarks can't distinguish memory architectures; Multi-Agent Memory Inconsistency uses a real legal document review task to show delegated investigation loses conflicting evidence at the worker-to-lead handoff; Surfacing Disagreement Beats Resolving It proves with a rigorous ablation that hiding contradictory evidence makes multi-agent debate easier to poison than surfacing it"
series:
  name: "AI Agent Arxiv Digest"
  order: 179
---

## Today's Overview

Today's three papers examine the same question from different angles: when an agent's shared memory system "cleans up" evidence for it, is that actually helping? RAG in a Trenchcoat (accepted at NeurIPS 2026) uses a deliberately minimal memory system to match complex industry designs on standard benchmarks, exposing that current benchmarks simply can't tell memory architectures apart — the real differences only show up under adversarial probes. Multi-Agent Memory Inconsistency uses a real legal document review task to show that delegating investigation to multiple workers surfaces more raw evidence, yet conflict detection actually drops from 16.2% to 13.2%, because the evidence gets stuck at the worker-to-lead handoff. Surfacing Disagreement Beats Resolving It overturns a common design assumption with a careful ablation study: filtering contradictory evidence down to a single "correct" answer before handing it to agents makes the system easier to poison, not safer. The shared lesson: agent memory problems usually aren't about remembering too little — they're about who gets to see what evidence, and when that handoff design breaks down.

## Terms to Know Before Reading

| Term | Plain-language explanation |
|---|---|
| Shared Memory | A memory space multiple agents read from and write to together, where evidence and conclusions get stored |
| Delegation | A lead agent splits investigation work across multiple worker agents, who report back for the lead to synthesize |
| Evidence Flow | The full path a piece of evidence takes from being read, reported by some agent, to appearing in the final conclusion |
| Trust Gate | A mechanism that scores content before it's written to shared memory and blocks anything that scores too low |
| Provenance Weighting | Weighting how trustworthy a piece of information is based on who wrote it and when |
| Adversarial Probe | A test designed so the question never hints which memory should be used, forcing the agent to recall the right one on its own |

---

## Paper One | Strip Off the Coat, and Memory Is Just Minimal RAG

**RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't**
Jingyu Liu, Zongze Li, Zach Xu et al. (University of Chicago + UC Berkeley) · arxiv: 2611.22179

Links: [arxiv](https://arxiv.org/abs/2611.22179) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22179)

### TL;DR

A deliberately minimal RAG memory system called BRIDGE matches or beats complex industry designs on three standard memory benchmarks (beating the strongest baseline on EverMemBench by 5.7-6.3 points, using 17-154x fewer tokens), which the authors argue proves current benchmarks can't actually distinguish memory architectures; only under five adversarial probes do real design differences emerge.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | NeurIPS 2026, officially accepted (Main Conference) |
| Citation velocity | Published 1-2 days ago; Semantic Scholar persistently 429 rate-limited, inferred near-zero given recency |
| Institution | University of Chicago (Ce Zhang's lab) + UC Berkeley (Dawn Song) |
| Community signal | Not found on the first two pages of same-day HuggingFace Daily Papers; Papers with Code not checked |
| Credibility | Pass — the body provides full comparison tables across three standard benchmarks, pass-rate tables for five adversarial probes (20 scenarios each), and a controlled experiment where moving a rule to a labeled block at the top of the prompt raised a score from 52.6% to 94.7% |
| Evidence maturity | Substantial — results hold across multiple benchmarks and reader-model families with repeated runs, and the authors themselves decline to interpret differences under about 15 points |
| Reproducibility | Partial artifacts — probe scenarios and grading criteria are described in the text; no explicit public code link found |
| Why this paper | Direct — it targets a flaw in how memory architectures themselves get evaluated, affecting every team choosing a memory system |
| Novelty | Substantive — using a deliberately simplified system to expose a benchmark's lack of discriminative power is itself a methodological contribution |
| Today's importance | High — most teams still pick memory systems by these three benchmark scores, and this paper shows those scores may have no discriminative power |
| Practical link | Clear — if your memory system needs to decide whether to apply an unstated rule, atomic-fact memory (like LangMem) is more reliable than summary-style memory |
| Editorial confidence | High — the combination of multiple benchmarks plus a controlled experiment supports the narrow claim that current benchmarks lack discriminative power |
| Reading recommendation | Must-read — for teams evaluating or choosing an agent memory system |
| Primary limitation | Probe scenarios were model-generated with only spot-check human review; the grader checks whether a constraint was honored, not overall answer quality |

### Field Context

Agent memory systems have sprouted a lot of seemingly sophisticated designs over the past couple of years — atomic fact extraction, knowledge-graph synthesis, reflective rewriting — but the field has lacked a control group: if you do nothing fancy and just use plain RAG, how much worse is it really? This paper supplies that control group.

### Mid-level Walkthrough

- **The problem**: Imagine you need to pick a long-term memory system for your agent team, and you have scores from three commonly used benchmarks to compare. This paper asks: do those scores actually tell you which design is better, or do they all score about the same regardless of design?
- **The method**: The authors built BRIDGE, a deliberately minimal memory system — conversations are chunked into blocks, an LLM writes one observation note per block, hybrid BM25-plus-embedding retrieval picks relevant blocks, and they're presented to the reader in chronological order. No knowledge graph, no reflection, no sophisticated conflict resolution. Run against three standard benchmarks, it ties or beats complex industry designs. The authors then built five "adversarial probes" — the question never hints which memory to use, forcing the agent to recall on its own which rule or pattern applies — and only here did real design differences appear: LangMem's atomic-fact memory excelled at "should I apply this stated rule," while BRIDGE's summary-style memory excelled at "should I continue this unstated pattern."
- **Why it matters**: If you're picking a memory system based only on scores from three standard benchmarks, you might not actually be choosing the design that fits your task, because those scores can't tell the difference. To know which design truly fits, you first need to know whether your task looks more like "applying a stated rule" or "continuing an unstated pattern."

### Deep-dive Points

- EverMemBench: BRIDGE beats the strongest baseline MemOS by 5.7-6.3 points, using only 5-7K tokens — 17 to 154x fewer than full-context baselines
- LongMemEval-S, BEAM 100K: BRIDGE ties with industry baselines, with overlapping 95% confidence intervals ⚠️ (authors' own testing, pending external replication)
- Adversarial probes (20 scenarios each): LangMem scores 80% on "rule application" vs. BRIDGE's 35%; BRIDGE scores 88% on "pattern continuation" vs. LangMem's 55%
- Controlled experiment: moving the rule into a labeled block at the top of the prompt raised BRIDGE's rule-application score from 52.6% to 94.7%, proving the gap is about presentation, not retrieval
- Deployment threshold: building an adversarial-probe evaluation requires designing your own scenarios and grading criteria — it's not as plug-and-play as running a standard benchmark suite
- Framework relevance: Mem0, LangMem, and Graphiti all served as comparison baselines; BRIDGE's RRF hybrid-retrieval approach can be dropped into any RAG-based memory layer
- Limitation: probe scenarios were model-generated with only spot-check human review; at 20 scenarios per probe, differences under 15 points aren't interpreted

### Reviewer's One-liner

Using a deliberately simplified system to argue that the benchmarks lack discriminative power is a clever framing, and the five probes genuinely capture a real difference between atomic and summary memory; but the probe sample size is small (20 per probe) and grading still relies on an LLM judge — the next thing to verify is whether these probes hold up at larger scale with human annotation.

### Your Take-away

- If you're choosing an agent memory system: don't just look at scores on LongMemEval, BEAM, or similar standard benchmarks. First figure out whether your task needs "applying an unstated rule" before deciding between atomic-fact and summary-style memory
- If you're designing memory evaluations: this paper's adversarial-probe design (never hinting which memory to use) is worth adopting directly — it surfaces real differences better than plain retrieval accuracy

---

## Paper Two | Delegated Investigation Reads More Evidence, Pieces Together Less of It

**Multi-Agent Memory Inconsistency: Where Factual Conflicts Disappear in LLM Agents**
Hejia Zhang, Zhongming Yu, Yimin Ding et al. (UC San Diego + Intel + Hewlett Packard Enterprise) · arxiv: 2611.22245

Links: [arxiv](https://arxiv.org/abs/2611.22245) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22245)

### TL;DR

Testing three delegation policies on a real legal document-review task, required delegation (workers investigate separately, the lead doesn't read source documents) raised the share of conflicts where both contradictory values got read from 50.2% to 68.7% — but the share of conflicts actually surfaced and correctly handled dropped from 16.2% to 13.2%, because 43.4 of those 68.7 percentage points were cases where the two contradictory values each landed with a different worker and never appeared together in any one message.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 1-2 days ago; Semantic Scholar persistently 429 rate-limited, inferred near-zero given recency |
| Institution | UC San Diego + Intel (some authors completed this work as Intel interns) + Hewlett Packard Enterprise |
| Community signal | Not found on the first two pages of same-day HuggingFace Daily Papers; Papers with Code not checked |
| Credibility | Conditional — 198 task executions and 1,314 conflict observations is a reasonable scale, but the text explicitly states it reports only descriptive percentages with no significance testing or confidence intervals, and grading relies entirely on a single LLM judge |
| Evidence maturity | Preliminary — the direction is consistent across three models and three policies, but untested statistically, from 11 tasks run twice each — a modest scale |
| Reproducibility | Partial artifacts — the evidence-flow profiler and benchmark construction are described clearly; no public code or data link found |
| Why this paper | Direct — delegated investigation is one of the most common multi-agent design patterns, and this paper names its exact cost to conflict detection |
| Novelty | Substantive — decomposing "evidence flow" into source/worker/lead/final stages and measuring each separately is a genuine methodological contribution |
| Today's importance | High — any team using multi-agent delegation for due diligence, auditing, or research synthesis should know about this handoff gap |
| Practical link | Clear — systems that require workers to report full context rather than summarized conclusions, or that let the lead spot-check source documents, show markedly higher conflict detection |
| Editorial confidence | Medium — the direction is consistent and the task is realistic, but the lack of statistical testing discounts confidence in the exact numbers |
| Reading recommendation | Must-read — for teams using multi-agent delegation for investigation or review tasks |
| Primary limitation | Only 11 tasks, 2 runs per combination, and grading depends on an LLM judge with no reported human-agreement data |

### Field Context

A common multi-agent design splits investigation across workers who each dig into part of the problem and report back to a lead, on the theory that parallel work covers more ground faster. This paper asks: does what the workers find actually make it to the lead intact? If it doesn't, covering more ground in parallel may not actually help.

### Mid-level Walkthrough

- **The problem**: Imagine a legal team doing merger due diligence, where the same figure has been edited in some documents but not others across a pile of files. If you split the work across three assistants who each search a different folder, will the person assembling the final report actually notice the two numbers don't match?
- **The method**: In a real Harvey LAB document-review task, the authors planted 73 numerical conflicts — the same value changed to a different one in some locations but left unchanged in others — then compared three policies: no delegation (one agent reads everything), optional delegation (the lead decides whether to split work), and required delegation (workers investigate separately; the lead synthesizes without reading source documents). An "evidence-flow profiler" traced every planted value from being read, to a worker's report, to the lead's evidence, to the final deliverable.
- **Why it matters**: Required delegation did get more raw evidence read by some worker (68.7% vs. 50.2% for no delegation) — but a large share of that was cases where the two contradictory values each landed with a different worker and never showed up together in any single report, so the lead had no way to notice the conflict. For anyone designing multi-agent review pipelines, this means "investigating more broadly" and "actually catching conflicts" are two separate things that need to be designed for separately.

### Deep-dive Points

- Share of conflicts where both contradictory values got read, by policy: no delegation 50.2%, optional delegation 62.8%, required delegation 68.7%
- But the share actually surfaced and correctly handled (Judge Pass): no delegation 16.2%, optional delegation 24.2% (highest across all three models), required delegation only 13.2%
- Under required delegation, of 301 cases where both raw values were read, only 106 (35.2%) made it into any worker's report, and only 107 (24.4%) reached the lead
- Claude Haiku 5.5 chose to spin up workers in 22 of 22 optional-delegation runs, far more often than GPT-5.6 (9/22) or GPT-6 (10/22) — showing delegation tendency is itself a model-specific trait
- Deployment threshold: requiring workers to report full context rather than summarized conclusions raises token cost, but this paper shows it's the key variable for conflict detection
- Framework relevance: LangGraph's and AutoGen's supervisor-worker patterns both fit this finding, especially for audit, compliance, and due-diligence applications
- Limitation: a modest sample (11 tasks x 2 runs), and the authors acknowledge no statistical testing was performed, so exact numbers should be read cautiously

```diagram
title: Under required delegation, evidence drains away at every stage
desc: Under required delegation, 68.7% of planted conflicts have both contradictory values read by some worker, but only 24.4% appear together in a worker's report, 15.8% appear together in the final report, and only 13.2% end up correctly flagged and handled by the judge
caption: Numbers are pooled results for the Required delegation policy (198 task executions, 1,314 conflict observations); the paper reports no confidence intervals
---
<svg viewBox="0 0 640 372">
  <path class="dg-axis" d="M40 348V40" marker-end="url(#arrow)"/>
  <text class="dg-small" x="52" y="320" dominant-baseline="central">Evidence drains</text>
  <text class="dg-small" x="52" y="338" dominant-baseline="central">at each handoff</text>

  <text class="dg-small" x="320" y="26" text-anchor="middle" dominant-baseline="central">68.7% enters the funnel: both values read by some worker</text>

  <polygon class="dg-box" points="60,44 580,44 490,140 150,140"/>
  <polygon class="dg-box" points="150,144 490,144 440,244 200,244"/>
  <polygon class="dg-box dg-box--accent" points="200,248 440,248 424,348 216,348"/>

  <text class="dg-big" x="320" y="78" text-anchor="middle" dominant-baseline="central">24.4%</text>
  <text class="dg-sub" x="320" y="108" text-anchor="middle" dominant-baseline="central">both in worker report</text>

  <text class="dg-big" x="320" y="180" text-anchor="middle" dominant-baseline="central">15.8%</text>
  <text class="dg-sub" x="320" y="210" text-anchor="middle" dominant-baseline="central">both in final report</text>

  <text class="dg-big dg-text--accent" x="320" y="284" text-anchor="middle" dominant-baseline="central">13.2%</text>
  <text class="dg-sub" x="320" y="314" text-anchor="middle" dominant-baseline="central">judge: correctly handled</text>

  <text class="dg-small" x="548" y="90" dominant-baseline="central">−44.3pp</text>
  <text class="dg-small" x="476" y="194" dominant-baseline="central">−8.6pp</text>
  <text class="dg-small" x="444" y="298" dominant-baseline="central">−2.6pp</text>
</svg>
```

### Reviewer's One-liner

Testing delegation policies on a real legal document-review task rather than a synthetic benchmark is a strong choice, and the four-stage evidence-flow decomposition is worth borrowing for other multi-agent research; but the text admits no statistical testing and reliance on a single LLM judge — the next thing to verify is whether this handoff gap still holds at larger scale with human-checked grading.

### Your Take-away

- If you're designing multi-agent review or investigation pipelines: don't stop at "delegation surfaces more evidence." Require workers to report full context (not just conclusions), and let the lead retain the ability to spot-check source documents — this paper shows both directly affect conflict-detection rates
- If you're deciding whether to use required delegation: first ask whether your task cares more about "broad coverage" or "catching contradictions" — this paper shows the two pull against each other under required delegation

---

## Paper Three | Hiding Contradictory Evidence Makes Systems Easier to Break

**Surfacing Disagreement Beats Resolving It: A Gated Ablation Study of Provenance-Weighted Memory for Multi-Agent Debate**
Ziaullah Khan, Abdul Rehman Khalid, Shrestha Nischal Lal et al. (Inje University, Korea) · arxiv: 2611.22461

Links: [arxiv](https://arxiv.org/abs/2611.22461) · [alphaxiv](https://www.alphaxiv.org/abs/2611.22461)

### TL;DR

A systematic ablation of shared memory mechanisms in multi-agent debate finds that the only mechanism that genuinely helps is keeping contradictory evidence intact and handing debaters a ranked conflict set with provenance — instead of pre-selecting a single answer. That change raises F1 by 0.34 and cuts successful poisoning attacks from 22 of 122 to 7 of 122; meanwhile two mechanisms that sound safer — a pre-write trust gate and provenance-weighted retrieval routing — both measured as net-negative.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 1-2 days ago; found on Semantic Scholar but with 0 citations (newly published) |
| Institution | Inje University, Korea (Dept. of Digital Anti-Aging Healthcare + Dept. of Computer Engineering) |
| Community signal | Not found on the first two pages of same-day HuggingFace Daily Papers; Papers with Code not checked |
| Credibility | Pass — 39 runs, paired bootstrap (10,000 resamples), Wilcoxon and exact McNemar tests, pre-declared thresholds for every mechanism, and the authors honestly disclose a harness bug that revised an early +0.084 result up to +0.340 once fixed, explaining exactly how |
| Evidence maturity | Substantial — replicated across two retrieval backends, a directional cross-corpus replication on HotpotQA, and even the p-value's sensitivity to tie-handling is disclosed |
| Reproducibility | Full artifacts — the authors state they release the harness, attack set, and complete logs |
| Why this paper | Direct — it directly challenges the common design assumption that shared memory should resolve conflicts for the agent |
| Novelty | Substantive — ablating five mechanisms one at a time, rather than comparing whole systems, isolates which one actually works |
| Today's importance | High — multi-agent system designers commonly assume conflict resolution is good design; this paper refutes it with data |
| Practical link | Clear — any system using shared memory for multi-agent collaboration or debate can directly check whether it's quietly resolving conflicts for the agent |
| Editorial confidence | High — pre-declared thresholds, honest disclosure of a bug and of statistical sensitivity support the narrative strength used |
| Reading recommendation | Must-read — for teams designing multi-agent shared memory or debate systems |
| Primary limitation | Injected contradictions are template-generated, not naturally occurring; tested on only one model family (gpt-oss-120b) — a second family was attempted but infeasible given available compute |

### Field Context

A common intuition in multi-agent shared-memory design is to filter out noise and resolve conflicts for the agent, presenting one clean answer so the agent doesn't get confused by contradictory information. This paper directly tests whether that intuition is correct.

### Mid-level Walkthrough

- **The problem**: Imagine several agents debating a question, where shared memory holds two contradictory pieces of evidence at once — one true, one maliciously planted. If the memory system helps out by pre-selecting "the more credible one" before handing it to the agents, is that actually safer?
- **The method**: The authors built DebateGraph, a shared-memory service where five common mechanisms can each be switched on or off independently. The central comparison is "Collapse" (pass only the top-ranked piece of evidence to debaters) vs. "Surface" (pass the full ranked conflict set with provenance). Result: Surface beat Collapse by 0.340 F1, and cut the number of times poisoned evidence successfully misled the conclusion from 22 of 122 to 7 of 122. Meanwhile two mechanisms that sound safer — a trust gate that scores content before writing it, and a provenance-weighted retrieval router — both measured negative, because poisoned evidence tends to point to entities already present in the graph, making it look more "well-grounded" than genuine evidence.
- **Why it matters**: This overturns a common assumption — that "cleaning up the answer for the agent" is the same as "helping the agent judge better." For anyone designing shared-memory systems, preserving disagreement and letting the agent face it directly may be safer than pre-filtering on its behalf.

### Deep-dive Points

- Core comparison: Surface vs. Collapse at cap=200 (the setting where contradictory evidence is retrievable) raises F1 by 0.340 (95% CI [0.267, 0.414], p < 10⁻⁴)
- Successful poisoning attacks: 22 of 122 under Collapse, down to 7 of 122 under Surface (McNemar exact p = 0.0003)
- Trust gate: filtering suspicious content before writing actually drops F1 by 0.075 (p = 0.039), because poisoned evidence points to entities already in the graph, making it pass "groundedness" checks more easily than genuine first mentions
- Provenance-weighted retrieval router: drops F1 by a further 0.096 (p = 0.030)
- Honest disclosure: the initial cap=40 result was only +0.084; investigation found a pre-declared candidate cap was blocking about three-quarters of planted contradictions from ever being retrievable — fixing it revealed the full +0.340 effect
- Limitation: injected contradictions are template-generated "type-consistent" fake evidence, not naturally occurring conflicts; only one model family tested (gpt-oss-120b); the HotpotQA replication is significant only on a pre-specified subset, with the full-sample confidence interval including zero

### Reviewer's One-liner

Pre-declaring thresholds, honestly disclosing and fixing a harness bug, and even reporting the statistical sensitivity of tie-handling — this level of transparency is rare in agent papers and earns trust; the next thing to verify is whether "surfacing beats resolving" still holds for naturally occurring contradictions rather than template-injected ones.

### Your Take-away

- If you're designing multi-agent shared memory: check whether your system is quietly resolving contradictory evidence during writing or retrieval. This paper shows handing agents the full conflict set with provenance, and letting them judge for themselves, performs and defends better
- If you're adding a "trust score" or "provenance weighting" safety mechanism because it sounds reasonable: validate it with an ablation first — this paper found both measured as net-negative in practice

---

## Today's Takeaway

I used to think agent memory problems were about remembering too little or too imprecisely. Today I learned the real problem is often the handoff and cleanup step: evidence gets stuck between workers and leads during delegation, and shared memory that "helpfully" resolves conflicts actually hides the danger. Memory systems don't need to solve a capacity problem — they need to solve a "who gets to fully see what" design problem.

## References

- [RAG in a Trenchcoat: When Minimal Memory Is Enough for Agentic Systems, and When It Isn't (arXiv:2611.22179)](https://arxiv.org/abs/2611.22179)
- [Multi-Agent Memory Inconsistency: Where Factual Conflicts Disappear in LLM Agents (arXiv:2611.22245)](https://arxiv.org/abs/2611.22245)
- [Surfacing Disagreement Beats Resolving It: A Gated Ablation Study of Provenance-Weighted Memory for Multi-Agent Debate (arXiv:2611.22461)](https://arxiv.org/abs/2611.22461)
- [arXiv cs.AI new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions, 2026-11-18 announcement batch](https://arxiv.org/list/cs.MA/new)
