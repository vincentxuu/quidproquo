---
title: "AI Agent Arxiv Digest — 2026-11-16"
date: 2026-11-16
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is that agent memory's next hurdle isn't remembering more — it's resolving which version to trust right now, and being able to check whether a lesson is actually wrong: program evolution finds only two design choices that actually matter, enterprise retrieval is already near-saturated while answer accuracy still lags, and a lesson that reads plausibly can still be wrong"
tldr: "MAPE searches the agent-memory design space with program evolution and finds only two design choices that actually transplant across systems — keeping raw conversation and routing composition by query intent — not fancier retrieval algorithms; DISCERN shows enterprise memory retrieval recall is already near-saturated (0.93-0.98) while answer accuracy still lags, because the real bottleneck is resolving which entity and which time-state of a fact currently holds; WikiTrace finds that over half of memory-induced failures trace back to a wrong lesson nobody checked, and linking lessons back to their source trajectories cuts the degradation rate from 6.5% to 4.5%"
series:
  name: "AI Agent Arxiv Digest"
  order: 176
---

## Today's Overview

Today's three papers attack the same sticking point from three different angles: agent memory already has plenty of systems competing to solve "remembering," but all three point out that remembering alone isn't nearly enough. MAPE searches the entire agent-memory design space with program evolution and finds that the gains which actually transplant across systems come from two specific design choices — keeping raw conversation as evidence and reorganizing evidence by query intent — not fancier retrieval algorithms. DISCERN shows that in enterprise settings, retrieval is effectively solved already (four near-saturated recall metrics prove it); what's actually stuck is resolution — which entity a query refers to, which time-state of a fact currently holds, and whether to answer at all. WikiTrace exposes memory's dark side: memory doesn't just fail to help — it can make an agent fail tasks it would otherwise solve, because a wrong "lesson" has no way of being checked. Put together, agent memory's maturity is shifting from "how to store more and search more precisely" toward "how to know which version to trust right now, and when to stay quiet."

```diagram
title: Three different layers where agent memory gets stuck
desc: Front to back: the memory system's design space, resolution after writing, and trust at read time. Today's three papers each find a concrete, measurable gap in one of these layers.
caption: Numbers in order from arXiv 2611.17068 (transplanted into 5 existing systems, all improve; +11 points on LongMemEval), 2611.15729 (recall near-saturated at 0.93-0.98, answer correctness still trails at 0.861 vs 0.806), and 2611.14320 (52% of memory degradation cases trace to a wrong lesson; regression cut from 6.5% to 4.5%).
---
<svg viewBox="0 0 640 340">
  <rect class="dg-box" x="72" y="24" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="52" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="52" dominant-baseline="central">Design space: where to invest in memory</text>
  <text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">Catches: a dozen memory algorithms competing, each claiming to be best</text>
  <text class="dg-sub" x="604" y="80" text-anchor="end" dominant-baseline="central">Misses: only two design choices actually transplant across systems, not the algorithm itself</text>

  <rect class="dg-box" x="72" y="112" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="140" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="140" dominant-baseline="central">After writing: resolution in enterprise settings</text>
  <text class="dg-sub" x="604" y="140" text-anchor="end" dominant-baseline="central">Catches: retrieval recall already at 0.93-0.98, near-saturated</text>
  <text class="dg-sub" x="604" y="168" text-anchor="end" dominant-baseline="central">Misses: answer accuracy still lags because confusable entities and stale values aren't resolved cleanly</text>

  <rect class="dg-box" x="72" y="200" width="552" height="80" rx="6"/>
  <text class="dg-tag" x="92" y="228" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="228" dominant-baseline="central">At read time: whether to trust a lesson</text>
  <text class="dg-sub" x="604" y="228" text-anchor="end" dominant-baseline="central">Catches: a lesson in memory that reads plausible, clearly worded</text>
  <text class="dg-sub" x="604" y="256" text-anchor="end" dominant-baseline="central">Misses: 52% of memory-degradation cases trace to a wrong lesson nobody checked</text>

  <line class="dg-rule" x1="72" y1="300" x2="624" y2="300"/>
  <text class="dg-sub" x="72" y="324" dominant-baseline="central">Residual risk: each paper validates only its own benchmark or setting; no study yet chains "design choice → correct resolution → trustworthy lesson" into one memory pipeline</text>
</svg>
```

## Terms Worth Knowing Before You Read

| Term | Plain explanation |
|---|---|
| Program evolution | Having an LLM repeatedly rewrite, test, and rewrite a system's code, with each round's change decided by the previous round's measured results |
| Bi-temporal data | Tracking two separate timelines at once — when a fact was written into the system, and when it actually held true or got superseded in the real world — so old data doesn't vanish when new data arrives |
| LLM-as-a-Judge council | Scoring with several different models and taking a majority vote, instead of relying on one model, to reduce the risk of a single judge favoring its own style of output |
| Memory-induced degradation | When an agent fails a task it would otherwise solve without memory — usually because it followed a lesson that was wrong, or applied outside the situation it actually came from |
| Trajectory | The full record of what actions an agent took and what it observed, step by step, while executing a task — the raw material memory systems distill "lessons" from |

---

## Paper One | What Memory Design Actually Works? Let the Program Evolve the Answer

**Discovering Effective Agent Memory Designs through Program Evolution**
Xinheng Ding, Seyyed Saeid Cheshmi, Ziyang Zhang et al. (University of Minnesota, Stevens Institute of Technology) · arxiv: 2611.17068

Links: [arxiv](https://arxiv.org/abs/2611.17068) · [alphaxiv](https://www.alphaxiv.org/abs/2611.17068)

### TL;DR

Searching the memory-system design space with program evolution, starting from "store nothing," finds a system that beats the strongest hand-designed baseline (RAG) by 11 points on LongMemEval (77.00% vs 66.00%). The key isn't a fancier algorithm — it's "keep raw conversation" plus "organize evidence by query intent," and the latter improves accuracy in all five existing memory systems it was transplanted into.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar confirms 0 citations |
| Institution | University of Minnesota, Stevens Institute of Technology |
| Community signal | Not found on HF Daily Papers or Papers with Code reproductions (checked 2026-11-16); GitHub repo public but no star count or community discussion observed |
| Credibility | Pass — the body runs systematic comparisons on two standard benchmarks (LoCoMo, LongMemEval) under two search objectives (accuracy-only vs joint accuracy-cost), with ablations and transplantation tests for both design patterns |
| Evidence maturity | Substantial — covers cross-backbone transfer (GPT-4.1 mini, Qwen3-30B), cross-benchmark transfer (LoCoMo ↔ LongMemEval), and transplants the discovered patterns into 5 existing systems to test transferability |
| Reproducibility | Full artifacts — GitHub publishes complete code, data-fetch scripts with checksum verification, offline tests and evaluation pipeline |
| Why selected | Direct — directly answers "where should a memory system invest," one of the most common questions agent builders face |
| Novelty | Substantive — not another new memory system, but a systematic search of the whole design space that shows which design choices actually matter and which are just relabeling |
| Today's importance | High — tells any team evaluating or building a memory module exactly where to spend effort |
| Practical link | Clear — the two patterns (raw-conversation retention, intent-routed composition) transplant directly into Mem0, A-Mem, LightMem, SimpleMem, and Zep, all tested and improved |
| Editorial confidence | High — the claim stays scoped to "these two patterns generalize across the tested systems," not extrapolated into "memory is solved" |
| Reading recommendation | Must-read — teams designing or evaluating a memory module |
| Primary limitation | The quoted "serving cost" only counts inference-time LLM/embedding calls, not the compute spent on the evolutionary search itself; LoCoMo and LongMemEval are both conversational benchmarks, so applicability to code or tool-use agent memory is untested |

### Field Background

Memory construction, organization, maintenance, and retrieval have mostly been human-designed choices. Program-evolution methods have recently started automating algorithm and structure discovery, but most constrain the search to tweaking an existing architecture. MAPE asks what happens if you let evolution start from the simplest possible point and search freely.

### Mid-Level Walkthrough

- **Problem**: Imagine designing a memory system for a customer-service agent to remember what a customer said. You have a dozen off-the-shelf approaches — summary-based, graph-based, vector-retrieval-based — each claimed to be best, but you don't know which design choice actually drives the result and which is just relabeling.
- **Method**: MAPE splits a memory system into three rewritable stages — build (turn conversation into queryable memory), retrieve (pull evidence for a query), compose (assemble retrieved evidence into context for the model) — and starts from the simplest possible seed, a system that stores nothing. An LLM proposer repeatedly rewrites the program, scores it on a fixed evaluation set, and a diagnosis step reads the failure patterns to decide the next revision. It runs this once under an accuracy-only objective and once under a joint accuracy-cost objective, to see what each produces.
- **Why it matters**: The discovered system isn't a more complex black box — it converges on two clear, explainable design choices that transplant directly into other systems. That suggests the memory performance bottleneck may be more concentrated than people assume, and doesn't require reinventing the whole architecture.

### Key Findings

- LongMemEval (Qwen3-30B as serving backbone): MAPE-ALME 77.00% vs the strongest baseline RAG at 66.00% (+11 points); the joint-objective version MAPE-PLME reaches 72.25% with 90% fewer serving calls than ALME
- LoCoMo (GPT-4.1 mini): MAPE-ALCM reaches 87.94%, beating every baseline in every subcategory; the joint-objective version MAPE-PLCM reaches 85.18% at about 28% of ALCM's serving cost
- The abstract's headline "12% absolute accuracy gain at 35% serving cost" is a combined summary across both benchmarks — actual numbers vary by benchmark and backbone (see above)
- Two transplantable design patterns: (1) retaining raw conversation as retrievable evidence, so details omitted by extraction aren't lost; (2) Query-Routed Scaffolding, routing each query to an intent-specific composition template — the latter, transplanted into Mem0, A-Mem, LightMem, SimpleMem, and Zep, improves accuracy in all five
- The two search objectives shape computation differently: the accuracy-only version keeps pouring compute into LLM-based memory construction, while the joint accuracy-cost version shifts computation from construction time to selective processing at query time
- Limitation: the authors acknowledge the "35%/28% serving cost" figures only count inference-time LLM/embedding calls, not the compute spent on the evolutionary search itself

### Reviewer's One-Line Take

Replacing hand design with evolutionary search, then systematically validating transplantation, makes for a trustworthy research design; but readers should remember "12% gain, 35% cost" is an abstract-level summary — check which benchmark and backbone setting your own use case actually falls into before relying on it.

### Take-aways for You

- If you're building your own memory system: don't rush to add a new retrieval algorithm — first check whether you're already doing "keep raw conversation" and "route composition by query intent." The paper shows these two changes beat swapping retrieval algorithms.
- If you're evaluating an off-the-shelf memory framework: use these two patterns as a checklist and ask whether the framework's authors actually implemented them, rather than judging by how trendy the algorithm's name sounds.

---

## Paper Two | What Sticks Enterprise Agent Memory Isn't Retrieval — It's Resolution

**DISCERN: Preserve at Write, Resolve at Read for Persistent LLM-Agent Memory**
Chirag Ahuja, Vladislav Tanov, Ramcharan Kakarla et al. (Amazon) · arxiv: 2611.15729

Links: [arxiv](https://arxiv.org/abs/2611.15729) · [alphaxiv](https://www.alphaxiv.org/abs/2611.15729)

### TL;DR

On Amazon's own enterprise sales benchmark, even a plain RAG reader already hits 0.93-0.98 recall — yet answer correctness is only 0.806. By splitting "preserve everything at write time, resolve only at read time," DISCERN pushes abstention F1 to 0.924 (next best 0.802) and answer correctness to 0.861, with the lead driven almost entirely by entity resolution (0.800, where no other baseline exceeds 0.40).

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | NeurIPS 2026 TTCL Workshop (confirmed listed on the NeurIPS 2026 virtual program) |
| Citation velocity | Published 5 days ago; Semantic Scholar's API returned repeated 429s (retried multiple times, see note below); inferred near 0 given MAPE and WikiTrace from the same window both confirmed at 0 citations |
| Institution | Amazon |
| Community signal | Not found on HF Daily Papers; independently rewritten by automated tech-news aggregators such as techandbusiness.org; no public GitHub repo found |
| Credibility | Pass — the body compares against 8 baselines (including BM25, Dense, RRF, Agentic RAG, GraphRAG, HippoRAG2, Mem0, SEM+SUM+QE) under a 4-judge majority vote, with an ablation (removing the read-time navigation tools drops accuracy from 0.89 to a 0.33 tools-off floor) |
| Evidence maturity | Substantial — the core benchmark ENT-310 is self-built synthetic data, but the same zero-tuning pipeline transfers in the same direction to the public, out-of-domain LoCoMo corpus, which partly offsets the "self-built benchmark" concern |
| Reproducibility | Not provided — no code or ENT-310 dataset release statement found; outsiders cannot rerun the results or inspect how the samples were constructed |
| Why selected | Direct — directly challenges the industry default that "agent memory equals a retrieval problem" |
| Novelty | Substantive — reframes "the memory problem" into retrieval (already near-saturated) and resolution (entity attribution, currency, whether to answer), and designs dedicated governance for the latter |
| Today's importance | High — for any team putting agent memory into enterprise settings where entities easily collide (member records, customer relationships), this identifies exactly which piece needs reinforcing |
| Practical link | Clear — the four governance gates (EarnedAnswerGate, EarnedAbstainGate, DeclineRouter, forced citation) map directly onto whether your own system has equivalent mechanisms |
| Editorial confidence | Medium-high — the margin on answer correctness and abstention F1 is large and ablation-backed, but the core benchmark is private and uncoded, so the claim strength stays at "this team's controlled experiment shows," not "industry-validated" |
| Reading recommendation | Must-read — memory-system designers for enterprise settings (customer relationships, sales, internal knowledge bases); general readers can focus on the "resolution vs. retrieval" reframing |
| Primary limitation | The core benchmark ENT-310 is Amazon's own synthetic data, currently unreleased, so outsiders cannot independently verify its difficulty distribution or rule out a sample bias favoring the authors' own method |

### Field Background

Enterprise agent memory has mostly been treated as a retrieval problem — using a better embedding model or a finer summarization strategy to "find the right passage." But in data accumulated over the long run, the bigger trouble is often same-named entities, values updated over time, or deciding whether to answer at all when there's genuinely no answer — none of which retrieval ranking by itself can resolve.

### Mid-Level Walkthrough

- **Problem**: Imagine a sales-advisor agent that has logged six months of customer records, and gets asked "what's Zephyron's revenue right now?" The company happens to have two customers, "Zephyron Cloud Solutions" and "Zephyron Cloud Systems" — similar names, completely different companies — and the revenue figure from a month ago has since been updated by the latest visit. A retrieval system will likely find both passages and call both "relevant," but which one is the right answer, which number counts now, and whether to honestly say "not sure" if it genuinely can't tell — none of that is something retrieval ranking by itself can answer.
- **Method**: DISCERN follows one rule — preserve at write, resolve at read. At write time, every fact from each interaction gets appended into a strictly additive, bi-temporal graph: confusable entities are linked by "similar name" but never merged; updated values are soft-marked as superseded rather than deleted, so both the history and the latest value remain queryable. At read time, instead of a single similarity lookup, an adaptive navigation loop probes layer by layer — first checking how many candidate entities survive, then checking which value is currently active for that entity — and based on the candidate count, whether an active value exists, and whether it has been superseded, commits to exactly one of four actions: answer, update, clarify, or abstain.
- **Why it matters**: Most memory-system metrics only measure "was the right evidence retrieved," while in enterprise settings there's an under-tested gap between "finding evidence" and "giving the correct answer." This paper pulls that gap out and measures it directly, showing that even when retrieval already sits at a near-saturated 0.93-0.98, answer correctness and abstention judgment can still lag badly.

### Key Findings

- All eight baselines land at 0.93-0.98 on ENT-310's "retention" and "currency" recall pillars — nearly saturated — yet the strongest baseline's answer correctness is only 0.806, proving the bottleneck isn't retrieval
- DISCERN scores 0.800 on the "entity resolution" subcategory specifically, where none of the other eight baselines exceeds 0.40 — the main source of its overall answer-correctness lead
- Abstention judgment (whether to honestly say "I don't know") F1 is 0.924, versus at most 0.802 for the next-best baseline — the paper designed 100 deliberately unanswerable questions specifically to test this
- Applied with zero tuning to the public LoCoMo corpus (personal multi-session conversations, no enterprise entity-collision design), DISCERN's answer correctness still leads at 0.663 vs. 0.638, suggesting the result isn't specific to ENT-310
- Ablation: removing the read-time navigation tools (tools-off) drops accuracy straight from 0.89 to 0.33 — proving the gain comes mainly from how the system navigates at read time, not from the storage structure itself
- Limitation: the core benchmark ENT-310 (10 sales users, 50 target companies, 310 queries) is Amazon's own synthetic data; code and data remain unreleased, so outsiders cannot independently verify whether the sample construction is biased toward the authors' method

### Reviewer's One-Line Take

Reframing "the memory problem" from retrieval to resolution is a clean problem redefinition, and the ablations plus cross-benchmark transfer test back it up solidly; but with the core benchmark unreleased and no code, readers can for now only treat 0.861/0.924 as "this team's controlled result on its own synthetic data" — confirmation has to wait until outsiders can get the data and rerun it.

### Take-aways for You

- If your agent's memory serves internal enterprise data (customers, contracts, internal documents): check first whether your system has these two concrete weaknesses — mistaking similarly-named entities for the same one, and losing the ability to look up a stale value after it's overwritten. Fixing these is usually worth more than swapping in a pricier retrieval model.
- If you're designing an agent's answering strategy: borrow this paper's four-way governance gate (answer / update / clarify / abstain), so your system has at least one explicit abstain exit when it genuinely can't tell, rather than defaulting to always giving an answer.

---

## Paper Three | Don't Just Trust Your Memory: Evidence-Linked Memory Cuts the Odds of an Agent Getting Dumber

**Don't Just Trust Your Memory: Evidence-Linked Memory Reduces Memory-Induced Degradation in LLM Agents**
Yukyeong Lee, Yumin Choi, Jinheon Baek et al. (KAIST AI, DeepAuto.ai) · arxiv: 2611.14320

Links: [arxiv](https://arxiv.org/abs/2611.14320) · [alphaxiv](https://www.alphaxiv.org/abs/2611.14320)

### TL;DR

Among cases where an agent could solve a task without memory but fails with it, 52% trace back to a followed "lesson" — and most of those lessons are simply wrong. WikiTrace links every lesson back to the trajectory it came from so it can be checked, cutting the average degradation rate across eight test suites from 6.5% to 4.5%, and outperforming a trajectory-free "insights only" baseline by 3.2 points.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint; submitted to ACL Rolling Review (October 2026 cycle), under review |
| Citation velocity | Published 6 days ago; Semantic Scholar confirms 0 citations |
| Institution | KAIST AI, DeepAuto.ai |
| Community signal | Featured on HF Daily Papers, and independently covered by at least two separate AI newsletters (aiweekly.co, cctest.ai) |
| Credibility | Pass — the body runs a full comparison across 8 test suites (ALFWorld, ScienceWorld, PlanCraft, τ³-bench Retail, AppWorld) against four baselines (No Memory, AWM, ExpeL, ReasoningBank, Insights Only), and does an attribution analysis of why degradation happens before proposing the fix |
| Evidence maturity | Substantial — reports not just overall accuracy but splits Gain and Regression separately, avoiding the common pitfall where rising average accuracy masks degradation cases |
| Reproducibility | Full artifacts — GitHub publishes complete code, per-benchmark install scripts, and a three-step usage pipeline |
| Why selected | Direct — directly challenges the default assumption that "memory helps," arguing it needs to be unpacked and checked |
| Novelty | Substantive — reframes measuring "memory going wrong" from a single accuracy number into two separately attributable, separately optimizable metrics, Gain and Regression |
| Today's importance | High — for any team already accumulating agent experience in production via memory or skill libraries, this shows average accuracy alone can hide degradation that's actively happening |
| Practical link | Clear — the three-layer memory structure (lesson → diagnosis summary → raw trajectory) and the three trigger conditions for "when to dig deeper" are directly reusable design references |
| Editorial confidence | High — the claim stays scoped to "lessons degrade performance when they lack a checkable source link," and the paper honestly reports the degradation rate reduced, not eliminated (4.5%, still not 0) |
| Reading recommendation | Must-read — any agent team using experience-, skill-, or lesson-based memory |
| Primary limitation | Regression drops from 6.5% to 4.5% — mitigated, not eliminated; letting the agent actively dig into source trajectories at test time adds extra tool calls and latency that the paper doesn't quantify |

### Field Background

Agent memory systems have mostly assumed that once a "lesson" is distilled, it's trustworthy — different methods compete on how to distill past success/failure trajectories more concisely and more retrievably. But a lesson is inferred from a trajectory labeled only with a binary success/failure outcome, and that inference itself can guess wrong; existing systems typically hand the agent only the lesson, discarding the original trajectory it came from.

### Mid-Level Walkthrough

- **Problem**: Imagine an agent playing a text-adventure game that learns a lesson stating "for a lamp task, placing the object next to a lit lamp counts as done." This lesson was distilled from a successful run, but the real reason that run succeeded was a different step — "placing it next to the lamp" was just a coincidence that happened to occur alongside success, unrelated to it. Next time the agent follows this lesson literally, it botches a task it would have solved without memory at all — and because the lesson's wording sounds perfectly reasonable, the agent itself has no way to notice it's wrong.
- **Method**: WikiTrace splits memory into three linked layers, top to bottom: each "lesson" is the most concise one-line piece of advice, linking down to a "compilation" that explains why that run succeeded or failed, linking further down to the full "raw trajectory" itself. On a new task, the agent starts with all lessons up front, but only uses terminal tools to descend the links and check a lesson against its source trajectory when that lesson lacks enough detail to act on, conflicts with another lesson, or came from a failed run — and only then decides whether to follow it.
- **Why it matters**: This paper splits "is memory actually helping" into two separately measured halves — Gain (memory turns an unsolvable task solvable) and Regression (memory turns a solvable task unsolvable). Typical evaluation only looks at overall accuracy, where averaging easily lets Regression get masked by Gain — memory looks like it's always helping, while it's quietly breaking some tasks at the same time, unnoticed.

### Key Findings

- Attribution analysis: among cases solved consistently across three repeated runs without memory but failed with memory, 52% trace back to a followed memory item, and the most common cause (20%) is that the lesson itself was simply wrong
- Average across eight test suites: WikiTrace 90.2% vs. No Memory 79.5% (+10.7 points), vs. the trajectory-free Insights Only baseline at 87.0% (+3.2 points)
- Regression (degradation rate): existing memory methods average about the same as, or even higher than, simply rerunning without memory at all; WikiTrace cuts this figure from 6.5% to 4.5%
- The single biggest jump is on PlanCraft Challenge (a Minecraft crafting task): No Memory 56.3% → Insights Only 73.0% → WikiTrace 81.3%, showing the ability to dig back into evidence pays off most on the hardest tasks
- Analysis shows the agent digs into raw trajectories more often on harder tasks, and the number of times digging in changes the original plan correlates positively with the final performance gain
- Limitation: the degradation rate is reduced, not eliminated (4.5%), and the paper doesn't quantify the extra tool calls and latency cost that "digging into evidence" adds

### Reviewer's One-Line Take

Splitting "is memory actually helping" into separately reported Gain and Regression should be standard practice for agent-memory research, and the attribution analysis is concrete and honest; but the paper doesn't quantify the latency and tool-call cost of the "dig into evidence" step, so readers need to weigh that extra overhead for themselves before adopting it.

### Take-aways for You

- If you're already accumulating agent experience in production via a skill or lesson library: don't just watch whether overall accuracy is rising — separately track the subset of "tasks that used to be solvable but now fail with memory added." You may already be paying a degradation cost without noticing.
- If you're designing a memory system's data structure: at minimum, let every lesson link back to the execution record it came from. Even without WikiTrace's full three-layer architecture, a single "which run this lesson came from" field makes later debugging and manual auditing far easier.

---

## Today's Takeaway

I used to think agent memory's progress was about "storing more, searching more precisely." Today's three papers each point at something more fundamental: after searching the entire design space with program evolution, the key turns out to be two specific choices — don't discard raw evidence, organize by intent — not the algorithm itself; in enterprise settings retrieval is already near-saturated, and what's actually stuck is resolution — who this query is really about, and which version of the fact counts right now; and even when a lesson reads perfectly reasonable, a lesson nobody can check is already a lesson that might be wrong. The next step in agent-memory maturity isn't remembering more — it's knowing when to trust, when to check, and when to stay quiet.

## References

- [Discovering Effective Agent Memory Designs through Program Evolution (arXiv:2611.17068)](https://arxiv.org/abs/2611.17068)
- [MAPE source code and case study (GitHub)](https://github.com/ash-ding/MAPE)
- [DISCERN: Preserve at Write, Resolve at Read for Persistent LLM-Agent Memory (arXiv:2611.15729)](https://arxiv.org/abs/2611.15729)
- [DISCERN — NeurIPS 2026 virtual program listing](https://neurips.cc/virtual/2026/170468)
- [Don't Just Trust Your Memory: Evidence-Linked Memory Reduces Memory-Induced Degradation in LLM Agents (arXiv:2611.14320)](https://arxiv.org/abs/2611.14320)
- [WikiTrace source code and benchmark install scripts (GitHub)](https://github.com/yukyeongleee/wikitrace)
- [arXiv cs.AI new-submissions listing — Friday, 13 November 2026](https://arxiv.org/list/cs.AI/new)
