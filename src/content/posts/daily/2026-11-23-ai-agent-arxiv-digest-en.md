---
title: "AI Agent Arxiv Digest — 2026-11-23"
date: 2026-11-23
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today check agent memory from different angles: generic LLM-summary compaction systematically loses or distorts critical state, structure-guided folding can halve memory with almost no accuracy loss, and no matter how well memory is managed, you still need a separate way to catch which memory item is steering the agent wrong"
tldr: "CompAct-Bench tests 12 frontier models compacting long-task context with LLM summaries — even the best, Claude Opus 5, only reaches 68.5% downstream continuation accuracy, and compaction often turns unresolved guesses into stated conclusions; MemFolder instead folds memory using structural signals like entity links and temporal chains, retaining 99.0% of performance at 50% record reduction, with code open-sourced; DriftGuard uses paired counterfactual replay to flag which memory is causing drift, beating the strongest LLM-judge baseline's AUPRC by 86.2%"
series:
  name: "AI Agent Arxiv Digest"
  order: 183
---

## Today's Overview

Today's three papers together answer the same question: how should an agent's memory be managed so it doesn't cause problems? The first, CompAct-Bench, lays out the problem: the "have an LLM write a summary" approach that agent harnesses commonly use to compact accumulated context only preserves 56.7% of downstream task completion on average across 12 frontier models, and even the strongest, Claude Opus 5, only reaches 68.5% — and the failures are often not missing information but turning an unresolved guess into a stated conclusion, sending later execution in the wrong direction. The second, MemFolder, takes a different approach: instead of letting an LLM summarize freely, it uses structural signals like entity relations and temporal ordering to decide which records can merge and how, and ends up retaining 99.0% of original performance after cutting record count in half, with the code public on GitHub. The third, DriftGuard, tackles a different but related problem: no matter how well memory is managed, how do you know that this particular memory item is steering the agent in the wrong direction right now? The answer is to build causal training signals from paired counterfactual replay, then train an online risk model that flags suspicious memories in real time — far more effective than simply asking an LLM "does this memory look suspicious?" All three carry solid evidence — multiple benchmarks, baselines and ablations each — and all three are explicit about where their own claims stop.

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Working-context compaction | When an agent runs a long task, accumulated interaction history and tool outputs are shortened into a summary so execution can continue |
| Memory folding | Merging multiple semantically similar memory records into fewer, more compact units while trying to preserve the key facts |
| Causal attribution | Instead of judging a memory "suspicious-looking," actually testing whether removing it changes the agent's behavior, to confirm whether it is truly the cause |
| AUPRC | A metric for "catching the bad ones" that, when the bad ones are a small fraction of the total, reflects real detection ability better than accuracy; higher is better |
| Ablation study | Removing one design choice from a method and seeing how much performance drops, to confirm whether that choice actually contributes or the gain came from elsewhere |
| Counterfactual replay | Removing or swapping one memory and re-running the same task segment, then comparing the outcome, to judge that memory's actual effect |

---

## Paper One | CompAct-Bench: Even the Strongest Models Lose Critical State Under Current Context Compaction

**CompAct-Bench: A Benchmark for Working-Context Compaction in Long-Horizon Agent Tasks**
Jiayi Chen, Lizhe Chen, Yujia Chen et al. (Fudan University NLP group) · arxiv: 2611.25673

Links: [arxiv](https://arxiv.org/abs/2611.25673) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25673)

### TL;DR

Inserting compaction boundaries at different stages of 200 long-horizon tasks and letting 12 frontier models compact the preceding history before continuing, the strongest model, Claude Opus 5, only reaches 68.5% continuation accuracy, with a 56.7% average across all 12 models — and failures are often not plain omissions but turning unresolved questions into stated conclusions.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 4 days ago; preprint, no citations yet |
| Institution | Fudan University NLP group (authors include Tao Gui, Qi Zhang, Xuanjing Huang, Shihan Dou; the paper's abstract page lists no institution, inferred from the authors' usual affiliation) |
| Community signal | Cross-posted to both cs.AI and cs.CL / not found on HF Daily Papers or Papers with Code |
| Credibility | Pass — 200 tasks across 3 domains, 12 models evaluated, human-annotated error types linked to continuation outcomes, plus a statistical test supporting a key finding |
| Evidence maturity | Substantial — three domains, 12 models, human error annotation and a statistical test are all covered; the only paper today with a formal significance test (Mann–Whitney p=3×10⁻⁸) |
| Reproducibility | Partial artifacts — BrowseComp and SWE-bench are public benchmarks; CompanyBench is an internal dataset, not released |
| Why this one | Direct — directly measures what the compaction mechanism widely used by agent harnesses like Claude Code actually loses |
| Novelty | Substantive — reframes "compaction quality" from classic summarization metrics to "can downstream execution still complete the task," with a six-category error taxonomy covering distortion, omission, premature commitment, and more |
| Today's importance | High — nearly every long-task agent harness relies on context compaction; this paper pins down its actual failure rate |
| Practical link | Clear — the error taxonomy (premature commitment, losing an already-resolved question, etc.) maps directly onto one's own compaction prompt design |
| Editorial confidence | High — the conclusions only claim "compaction remains lossy" and "distortion is more dangerous than omission," and the numbers map directly onto the human-annotated proportions, without extrapolating to a general ranking of compaction methods |
| Reading recommendation | Must-read — directly relevant to anyone designing or choosing a compaction mechanism for an agent harness |
| Primary limitation | CompanyBench is an internal evaluation set that cannot be checked externally; continuation results are also mixed with the executor's own tolerance for ambiguous context, which the paper's environment-state ablation only partly disentangles |

### Field Context

Modern agent harnesses such as Claude Code and DeepSeek Harness commonly have the LLM write its own summary to compact history once the context nears its limit, letting execution continue from that summary. Whether this mechanism actually preserves the information a task needs has never been systematically tested — existing summarization benchmarks measure "does it read like the original," not "can the task still be completed."

### Mid-level Walkthrough

- **The problem**: Imagine a detective halfway through a case, whose notebook is full and who needs to condense the earlier clues into a one-page summary before continuing. If the summary writes "this lead is confirmed to be this person" when it was really still unconfirmed, the rest of the investigation heads down the wrong path from there — the issue isn't that the summary is too short and dropped a detail, it's that the summary stated an uncertain thing too confidently.
- **The method**: CompAct-Bench picks successfully completed trajectories from three task types — BrowseComp (search), SWE-bench (coding), and CompanyBench (workspace) — cuts a compaction boundary at 25%/50%/75% of execution progress, has 12 models compact everything before that boundary, and lets the original executor continue the task from there. Separately, human annotators compare the compacted content against a frozen fact inventory, labeling each unit as preserved, omitted, distorted, or uncertain.
- **Why it matters**: This turns "is the summary good enough" from a subjective call into a quantifiable task-completion rate, and finds concrete evidence that distortion is more dangerous than omission — meaning checking compaction quality can't just ask "did it lose information," it also has to ask "did it state something uncertain as if it were certain."

```diagram
title: Different compaction stages fail in different ways
desc: Compacting later hurts Search tasks more but helps Coding tasks more, because of where task state is kept
---
<svg viewBox="0 0 680 320">
  <path class="dg-line" d="M160 70 V110" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 70 V110" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M160 166 V200" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M520 166 V200" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="40" y="20" width="600" height="46" rx="6"/>
  <text class="dg-label" x="340" y="43" text-anchor="middle" dominant-baseline="central">Same compaction, boundary inserted at 25% / 50% / 75% execution progress</text>

  <rect class="dg-box" x="30" y="110" width="260" height="56" rx="6"/>
  <text class="dg-label" x="160" y="129" text-anchor="middle" dominant-baseline="central">Search task (BrowseComp)</text>
  <text class="dg-sub" x="160" y="149" text-anchor="middle" dominant-baseline="central">Clues exist only in the dialogue history</text>

  <rect class="dg-box" x="390" y="110" width="260" height="56" rx="6"/>
  <text class="dg-label" x="520" y="129" text-anchor="middle" dominant-baseline="central">Coding task (SWE-bench)</text>
  <text class="dg-sub" x="520" y="149" text-anchor="middle" dominant-baseline="central">Progress is already written into the repo</text>

  <rect class="dg-box dg-box--warn" x="30" y="200" width="260" height="60" rx="6"/>
  <text class="dg-label" x="160" y="222" text-anchor="middle" dominant-baseline="central">Worse the later it compacts</text>
  <text class="dg-sub" x="160" y="244" text-anchor="middle" dominant-baseline="central">52.9% → 42.6% → 34.6%</text>

  <rect class="dg-box" x="390" y="200" width="260" height="60" rx="6"/>
  <text class="dg-label" x="520" y="222" text-anchor="middle" dominant-baseline="central">Better the later it compacts</text>
  <text class="dg-sub" x="520" y="244" text-anchor="middle" dominant-baseline="central">64.0% → 72.7% → 86.1%</text>
</svg>
```

### Deep-dive Points

- Across 200 compaction tasks, the 12-model overall average is 56.7%, ranging 46.0%–68.5%; Claude Opus 5 is highest (68.5%), followed by Gemini 3.8 Flash (65.5%) and Kimi K3 (62.0%)
- For Search tasks, late-stage compaction accuracy drops from 52.9% to 34.6% because clues exist only in the dialogue history, making compaction the sole carrier of progress; for Coding tasks it instead rises from 64.0% to 86.1%, because the repository itself retains completed edits, so compaction losses can be recovered from the environment
- Human annotation shows 69.1% of information units were correctly preserved, 25.3% omitted, and 5.6% distorted — "premature commitment" (stating an unresolved question as settled) is a common distortion pattern
- Coding tasks with a materialized edit average 86.9% continuation accuracy, versus only 53.0% without one (Mann–Whitney p=3×10⁻⁸), showing that whether state has been "externalized" into the environment is key to whether compaction losses can be recovered
- Limitation: CompanyBench is the authors' own internal workspace evaluation set, not released for external checking; continuation results also reflect the executor's own tolerance for ambiguous context, not purely compaction quality

### Reviewer's One-line Take

Replacing classic summarization metrics with "can downstream execution still finish the task" is an overdue but solid quantification of agent context compaction, and the human error taxonomy surfaces a subtler distortion problem beyond plain omission; but only two of the three task domains are public benchmarks, and CompanyBench's results can't yet be checked externally.

### Take-aways for You

- If you're designing compaction prompts for an agent harness: don't just check for missing important information — also check whether the compaction turned a still-unverified hypothesis into a stated conclusion, since this paper shows that kind of distortion derails later execution more easily than plain omission
- If your task state can be externalized (a code repository, a ticketing system): prioritize writing progress into the environment rather than leaving it only in the dialogue history — this paper's data shows that substantially reduces the damage from compaction

---

## Paper Two | MemFolder: Structure-Guided Memory Folding Keeps 99% of Performance After Halving Memory

**MemFolder: Structure-Guided Memory Folding for Efficient Agent Memory Management**
Xuyang Liu, Chenwen Lu, Junxi Wang et al. (Sichuan University + Fudan University + Zhejiang University + Shanghai Jiao Tong University, multi-institution) · arxiv: 2611.26427

Links: [arxiv](https://arxiv.org/abs/2611.26427) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26427)

### TL;DR

Instead of letting an LLM summarize freely, this paper uses structural signals like entity links and temporal chains to decide which memory records can merge, retaining 99.0% of average performance on Mem0 after halving the record count — 1.9 points above the strongest baseline — with retrieval latency cut by up to 5.34x, and the code is open-sourced.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 4 days ago; preprint, no citations yet |
| Institution | Sichuan University + Fudan University + Sun Yat-sen University + Zhejiang University + Shanghai Jiao Tong University (multi-institution) |
| Community signal | Code public on GitHub (xuyang-liu16/MemFolder) / cross-posted to cs.CL and cs.CV / not found on HF Daily Papers |
| Credibility | Pass — full comparison tables against 6 existing compression baselines across 5 benchmarks, plus three independent ablations on anchor selection, affinity signals, and the planner/verifier loop |
| Evidence maturity | Substantial — multiple benchmarks and baselines averaged over three runs, plus a retrieval-latency measurement beyond accuracy alone; but answer correctness is judged by an LLM, with no reported agreement against human judgment |
| Reproducibility | Full artifacts — code public on GitHub, all 5 benchmarks used are public datasets, full hyperparameters listed in the appendix |
| Why this one | Direct — directly answers the question CompAct-Bench raises today: can memory compaction have it both ways |
| Novelty | Substantive — reframes memory compaction from "merge by semantic similarity alone" to structure-guided folding combining entity relations and temporal chains, handling both record count and content length at once |
| Today's importance | High — directly answers the problem CompAct-Bench exposes: proves that with the right signals, compaction doesn't have to be this lossy |
| Practical link | Clear — RecordFolder and ContextFolder are both pluggable components that can attach to existing memory frameworks like Mem0 or MemOS |
| Editorial confidence | Medium — the performance numbers are concrete and ablation-supported, but judge agreement is unreported, so the "almost no accuracy loss" claim needs that caveat |
| Reading recommendation | Must-read — directly relevant to teams selecting or optimizing a long-term memory framework |
| Primary limitation | Answer correctness is judged by gpt-4o-mini/gpt-4o, and the paper reports no agreement between this judge and human annotation, nor any deployment validation on a real production agent |

### Field Context

A long-term agent's external memory store keeps accumulating as interactions unfold, creating two coupled costs: more records slow down retrieval, and merging them into fewer units can make the content longer, raising token cost. Existing approaches mostly address only one axis — pruning can discard useful evidence, while merging can turn compact records into longer units. MemFolder aims to address both axes at once.

### Mid-level Walkthrough

- **The problem**: Imagine the same fact got written into your notes app six times, each phrased slightly differently. Deleting five and keeping one risks deleting the one copy that happened to carry a key detail; stringing all six together instead makes the notes longer and harder to read. MemFolder's goal is merging them so the result is both fewer and shorter, without losing the important details.
- **The method**: RecordFolder first grounds entity mentions (names, places) in each record, then uses semantic similarity plus entity relations plus temporal order to pick "anchors" that are representative yet complementary, merging compatible records into the same group. ContextFolder then encodes each group's original records into compact text, using an independent verification loop that checks whether key facts can still be recovered from the encoding — if not, it requires a rewrite.
- **Why it matters**: This paper shows that "memory compaction must lose information" is not a law of physics, just a matter of picking the wrong signal for summarization — with the right structural signals, compaction can halve the record count while keeping nearly all the performance, and substantially cut retrieval latency at the same time.

### Deep-dive Points

- At 50% record reduction on Mem0, RecordFolder retains 99.0% of average performance across three text benchmarks, 1.9 points above the strongest baseline, MemForest (97.1%)
- Combined with ContextFolder, per-record tokens drop a further 40%, 38%, and 31% on LoCoMo, LongMemEval, and M3-Bench-robot respectively, with limited accuracy loss
- Retrieval latency: keeping 30% of records yields an average 1.88–5.34x speedup; on LongMemEval, tail latency (95th percentile) drops from 97.5ms to 15.5ms
- Ablation shows removing the semantic-similarity signal causes the largest drop (3.4 points), followed by gain gating (1.9), entity affinity (1.1), and temporal chaining (0.6) — semantic similarity is the main signal, with the others fine-tuning it
- Limitation: the paper acknowledges that answer correctness is judged by an LLM, with no reported agreement against human annotation, and no deployment validation on a real production agent

### Reviewer's One-line Take

The design motivation for both components (RecordFolder/ContextFolder) is clear, the ablations are solid, and the latency measurement goes beyond accuracy alone, making this today's most evidence-dense paper in the memory cluster; but LLM-judge agreement is unreported, so the "almost no accuracy loss" claim needs to keep that caveat.

### Take-aways for You

- If you use a memory framework like Mem0 or MemOS and your store is getting slower as it grows: RecordFolder's anchor selection plus structural-signal design is directly worth referencing — this shows semantic similarity alone isn't enough, and adding entity and temporal signals noticeably improves retention
- If you're evaluating memory compaction methods: don't just look at how much accuracy was retained — also measure retrieval latency, since this paper shows the latency improvement (up to 5.34x) affects the user experience more directly than the accuracy number alone

---

## Paper Three | DriftGuard: Even Well-Managed Memory Still Needs a Way to Catch What's Steering the Agent Wrong

**DriftGuard: Online Memory-Drift Detection via Causal Attribution for LLM Agents**
Licheng Pan, Yuzhou Chen, Zhixuan Chu et al. (Zhejiang University + Peking University + Alibaba Group) · arxiv: 2611.25583

Links: [arxiv](https://arxiv.org/abs/2611.25583) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25583)

### TL;DR

Using paired counterfactual replay to build causal labels for "would removing this memory change the behavior," then training an online risk model on those labels, this paper beats the strongest LLM-judge baseline (few-shot Claude Opus 5) by 86.2% in AUPRC on the hardest benchmark, MPBench, and its online defense cuts the success rate of three attack types by over 80% on average.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer reviewed) |
| Citation velocity | Submitted about 4 days ago; preprint, no citations yet |
| Institution | Zhejiang University + Peking University + Alibaba Group |
| Community signal | Code public via an anonymized link (double-blind submission) / not found on HF Daily Papers |
| Credibility | Pass — tested on three memory-poisoning benchmarks against zero-shot/few-shot LLM judges and three existing defenses, plus independent ablations on execution context and the four supervision signals, and a generalization study across 3 model families |
| Evidence maturity | Substantial — three benchmarks, multiple ablations, and cross-model generalization are all covered; but the causal supervision data used for training comes from the authors' own paired replays, not real production incidents |
| Reproducibility | Partial artifacts — code public via an anonymized link; the three benchmarks used are existing public datasets |
| Why this one | Direct — directly tackles "how do you know which memory is suspicious," a problem different from, but complementary to, today's other two papers |
| Novelty | Substantive — replacing online real-time replay with paired counterfactual replay, moving the expensive part of causal attribution offline, is an uncommon systems-design approach to this problem |
| Today's importance | High — the only paper in today's memory cluster addressing "trust" rather than "capacity/efficiency," filling in an angle the other two don't touch |
| Practical link | Clear — the online risk model can be attached directly after an existing memory-retrieval pipeline as an extra layer of protection |
| Editorial confidence | High — the authors state two explicit limitations (no multi-memory interaction, untested on unseen attack types), and the article's claims are scoped accordingly to "effective against known attack types" |
| Reading recommendation | Must-read — directly relevant to teams running production agents with external memory |
| Primary limitation | The authors acknowledge that the method only handles single-memory interventions, not interactions among multiple retrieved memories, and that the defense is not guaranteed to remain safe under distribution shift or unseen attack types |

### Field Context

Once an agent's external memory is seeded with misleading content — whether planted by an attacker or arising naturally as memory accumulates — it can derail the entire execution path. Existing defenses mostly rely on content-level features (perplexity, retrieval relevance) or simply asking an LLM "does this memory look suspicious," but neither can confirm the causal question of "would behavior actually change if this memory were removed," and testing that directly online is too expensive — each additional candidate memory checked requires another full replay.

### Mid-level Walkthrough

- **The problem**: Imagine a flight-booking agent that retrieves five memories before one action, one of which looks perfectly normal but has quietly swapped the payment URL for an attacker-controlled page. Looking only at content (how fluent it reads, how relevant it is to the task) can't tell it apart from the other four as more dangerous — but removing it and re-running changes the outcome immediately. That's a causal signal, not a content signal.
- **The method**: DriftGuard works in two stages. Offline, at each decision point, it removes one candidate memory, continues both the original and the memory-removed version for a stretch, and compares the behavioral difference, aggregating this into a memory drift score covering whether the action changed, the attack was removed, the violation was removed, and the task recovered. This score then trains an online risk model that, once deployed, estimates each memory's risk from a single look at the current execution state — no further real-time replay needed.
- **Why it matters**: This paper resolves the tension between "causal attribution" and "real-time deployment" by splitting the work offline/online — the expensive paired replay happens offline, while online a single forward pass flags suspicious memories, making causal-level memory protection practically deployable.

### Deep-dive Points

- On the hardest benchmark, MPBench, DriftGuard reaches an AUPRC of 0.2415, beating the strongest zero-shot/few-shot LLM-judge baseline (few-shot Claude Opus 5 at 0.1297) by 86.2%
- In online defense experiments against three attack types — Direct Override, MemoryGraft, and Sleeper Memory — DriftGuard cuts attack success rate (ASR) by over 80% on average while task success rate (TSR) improves at the same time
- Generalization experiments show the online risk model still works when swapped to Qwen2.5, Llama3, or Falcon3 at scales from 1B to 8B; even Qwen2.5-1.5B already beats the Claude Opus 5 (few-shot) baseline by 12.2%
- Ablation shows removing the execution context drops AUPRC on AgentPoison from 0.6139 to 0.4746, while shuffling the execution context's order drops it further to 0.3851 — indicating the model relies on the context's structural order, not just extra tokens
- Limitation: the authors state two explicit limitations — the method only handles single-memory interventions, not interactions among multiple retrieved memories, and the defense is not guaranteed to remain safe under distribution shift or unseen attack types

### Reviewer's One-line Take

The design of moving causal attribution's cost offline via paired counterfactual replay, then training a lightweight online model, is solid, and the validation across three benchmarks plus multiple ablations is thorough; but the authors themselves flag the next open question — whether this approach still holds up against attack methods it never saw during training — and that question doesn't yet have an answer.

### Take-aways for You

- If your agent has external memory written by multiple sources: don't rely only on perplexity or retrieval relevance to judge a suspicious memory — this paper shows causal-level signals (does behavior change when it's removed) catch the real problem memories better than content-level features do
- If you're designing an evaluation for memory defenses: prioritize testing whether the method still works against attack types it never saw during training — the authors themselves name this as today's biggest unknown

---

## Today's Takeaway

I used to think memory compaction was necessarily a trade-off between "saving space" and "keeping information"; today's contrast made me rethink it — the issue isn't whether to compact, but which signal you compact with. Making memory smaller and shorter the same way, by letting an LLM summarize freely, systematically loses or distorts critical state (CompAct-Bench), while folding guided by entity and temporal structure can keep almost all the performance (MemFolder). And even when memory management is done well, you still need a separate mechanism to catch which memory is steering the agent wrong (DriftGuard) — managing memory and trusting memory are two problems that need to be solved separately.

## References

- [CompAct-Bench: A Benchmark for Working-Context Compaction in Long-Horizon Agent Tasks](https://arxiv.org/abs/2611.25673)
- [MemFolder: Structure-Guided Memory Folding for Efficient Agent Memory Management](https://arxiv.org/abs/2611.26427)
- [MemFolder code (GitHub)](https://github.com/xuyang-liu16/MemFolder)
- [DriftGuard: Online Memory-Drift Detection via Causal Attribution for LLM Agents](https://arxiv.org/abs/2611.25583)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
