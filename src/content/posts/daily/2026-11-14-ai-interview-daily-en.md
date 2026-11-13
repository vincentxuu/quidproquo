---
title: "AI Engineer Interview Daily — 2026-11-14: Paper Reading"
date: 2026-11-14
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper is DISCERN — it argues the real difficulty in enterprise agent memory isn't retrieval, it's resolution. The drill is the interview pattern where you're handed two similarly-named customers with contradictory old-vs-new quotes and asked to design how to resolve the reference, pick the current fact, and decide whether to abstain."
tldr: "Today's paper is DISCERN (arXiv:2611.15729, Amazon, published 2026-11-11). On ENT-310, an enterprise sales-agent memory benchmark, all eight baselines sit at 0.93-0.98 on retention and currency — meaning finding the evidence was never the hard part. What's unsolved is resolution: which entity a query targets, which time-state is current, and whether to abstain when evidence is thin. DISCERN's rule is 'preserve at write, resolve at read' — at write time, confusable entities are linked but never merged, and superseded facts are soft-invalidated but never deleted; at read time, a zero-LLM navigation loop commits to one of four terminal actions: answer, update, clarify, or abstain. The result: abstention F1 of 0.924 (best baseline 0.802) and entity resolution at 0.800 (no baseline exceeds 0.40), and the same pipeline still leads with zero tuning on LoCoMo. The practice question simulates an interviewer handing you a case with two similarly-named customers and contradictory quotes, asking you to design entity resolution, temporal currency, and the abstain decision."
series:
  name: "AI Engineer Interview Daily"
  order: 87
---

> 🌏 [中文版](/posts/daily/2026-11-14-ai-interview-daily)

## Today's Focus

Saturday is Paper Reading day, and what's being tested isn't reciting a paper's conclusions — it's the interview pattern where an interviewer hands you an enterprise agent memory case and asks you, on the spot, to design how the system should resolve a reference, judge which fact is current, and decide whether to abstain. Today's pick is DISCERN, posted to arXiv on 2026-11-11 by an Amazon team. Its subject is what happens when an enterprise agent accumulates memory across sessions: similarly-named entities blur together in embedding space, and facts get superseded. The paper's central claim is that the field treats this as a retrieval problem, and it isn't — on their benchmark, even a plain RAG reader pushes retention and currency (whether the evidence was found at all) above 0.93. What's actually unsolved is resolution: which entity a query targets, which time-state is current, and whether to honestly decline when evidence is insufficient. This decomposition connects directly to Thursday's LLM & Agent Engineering topic (RAG, agent architecture, guardrails), and it's a classic case of the interview question "you thought it was a retrieval problem — it's actually a different layer."

## Core Concepts Cheat Sheet

### 1. Split memory into "retrieval" and "resolution" — retrieval is already solved

On ENT-310, all eight baselines land between 0.93 and 0.98 on retention and currency (whether the evidence was found), including the weakest vanilla RAG reader. That means "can you find the relevant memory" is already saturated. What's actually unsolved is the resolution layer: which entity a query refers to (entity resolution), which time-state of a fact is current (temporal currency), and whether to honestly say "I don't know" when evidence is insufficient (abstention). When an interviewer asks you to design a memory system for an agent, a lot of candidates pour all their effort into a better retriever or embedding model — but the paper's numbers say that's not where the actual bottleneck sits.

### 2. At write time, only add, never collapse: link confusable entities without merging, soft-invalidate superseded facts without deleting

DISCERN's core rule is "preserve at write, resolve at read." At write time, when it encounters two similarly-named entities (say, Zephyron Cloud Solutions and Zephyron Cloud Systems), it links them with a SIMILAR_NAME edge and never merges them into one node — merging risks writing one company's numbers onto the other by mistake. When a fact gets superseded (say, quarterly revenue changes from $4.8B to $5.1B), the old value is soft-invalidated (an expired_at stamp) and kept rather than deleted, so a later question about "revenue before the change" is still answerable. The payoff: the only cost of a write-time mistake is one extra node you can rule out later (drift), not data that's irreversibly destroyed.

### 3. At read time, a zero-LLM navigation loop that can only converge on one of four gated terminal actions

Many systems do a single post-retrieval LLM judgment and answer directly — the paper names this failure mode P1, "one-shot disambiguation," with no loop of evidence-gathering and verification. DISCERN goes the other way: at read time it uses a set of tools that don't rely on an LLM's judgment of the result (dense, lexical, graph, and temporal retrieval all become callable tools), navigates the graph step by step, and — gated by EarnedAnswerGate, EarnedAbstainGate, and the DeclineRouter — converges each query onto one of four terminal actions: answer, update, clarify, or abstain. This fixes what the paper calls P2, "no terminal-state contract" — many systems answer regardless of whether the evidence supports it, and the errors baked into those answers are invisible to retrieval-only metrics.

```diagram
title: DISCERN: preserve at write, resolve at read
desc: At write time, observations are only appended into an immutable event log, which grows into an entity graph that never merges and a bi-temporal fact store; at read time, a zero-LLM navigation loop converges each query onto one of four terminal actions: answer, update, clarify, or abstain
caption: On ENT-310, DISCERN reaches an abstention F1 of 0.924 (best baseline 0.802) and entity resolution of 0.800 (no baseline exceeds 0.40)
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M320 100 V114 H174 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 100 V114 H466 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M174 200 V228" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M466 200 V228" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M102 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M242 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M382 292 V324" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M522 292 V324" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="40" y="36" width="560" height="64" rx="6"/>
  <text class="dg-label" x="320" y="59" text-anchor="middle" dominant-baseline="central">Write time: Event Log</text>
  <text class="dg-sub" x="320" y="79" text-anchor="middle" dominant-baseline="central">per-actor, append-only, immutable</text>

  <rect class="dg-box" x="40" y="128" width="268" height="72" rx="6"/>
  <text class="dg-label" x="174" y="155" text-anchor="middle" dominant-baseline="central">Entity graph</text>
  <text class="dg-sub" x="174" y="175" text-anchor="middle" dominant-baseline="central">linked, never merged (SIMILAR_NAME)</text>

  <rect class="dg-box" x="332" y="128" width="268" height="72" rx="6"/>
  <text class="dg-label" x="466" y="155" text-anchor="middle" dominant-baseline="central">Bi-temporal fact store</text>
  <text class="dg-sub" x="466" y="175" text-anchor="middle" dominant-baseline="central">old value kept, new value appended</text>

  <rect class="dg-box" x="40" y="228" width="560" height="64" rx="6"/>
  <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">Read time: zero-LLM navigation loop</text>
  <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">navigates the graph, decides the terminal action</text>

  <rect class="dg-box" x="40" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="102" y="343" text-anchor="middle" dominant-baseline="central">Answer</text>
  <text class="dg-sub" x="102" y="363" text-anchor="middle" dominant-baseline="central">evidence complete</text>

  <rect class="dg-box" x="180" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="242" y="343" text-anchor="middle" dominant-baseline="central">Update</text>
  <text class="dg-sub" x="242" y="363" text-anchor="middle" dominant-baseline="central">writes new fact</text>

  <rect class="dg-box" x="320" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="382" y="343" text-anchor="middle" dominant-baseline="central">Clarify</text>
  <text class="dg-sub" x="382" y="363" text-anchor="middle" dominant-baseline="central">reference unclear</text>

  <rect class="dg-box dg-box--accent" x="460" y="324" width="124" height="56" rx="6"/>
  <text class="dg-label" x="522" y="343" text-anchor="middle" dominant-baseline="central">Abstain</text>
  <text class="dg-sub" x="522" y="363" text-anchor="middle" dominant-baseline="central">F1 0.924</text>
</svg>
```

### 4. Evaluation splits into two independent axes: whether the answer is right, and whether abstention happened as a classification problem

DISCERN's evaluation uses a four-judge LLM council. One axis scores answer correctness; the other treats "should this be answered or declined" as a precision/recall/F1 classification problem, specifically measuring how many unanswerable questions got forced an answer anyway. The result: DISCERN's abstention F1 reaches 0.924, versus at most 0.802 across eight baselines; its lead in macro answer correctness (0.861, versus 0.806 for the strongest baseline) is driven mainly by the entity-resolution sub-score (0.800, where no baseline exceeds 0.40). This split gives a strong closing point for an interview: a single accuracy number can't tell you whether a system is guessing. You need at least three independent axes — whether the evidence was found, whether the answer built from it is correct, and whether the system honestly declines when it's unsure.

### 5. Leading on a different benchmark with zero tuning proves it isn't overfit to its own data

The paper also applies the exact same pipeline, unmodified, to LoCoMo — a fully independent conversational-memory benchmark it was never tuned on — and it still leads macro answer correctness (0.663 versus 0.638 for the baseline) and stays among the best-calibrated on false-premise abstention. Interviewers love asking "is your method only good-looking on the benchmark you designed it for" to probe whether a candidate has thought about overfitting risk, and this paper directly demonstrates how to answer that challenge with a zero-tuning cross-benchmark transfer.

## Today's Practice Question

### Question

An interviewer shows you a memory-system case for an enterprise sales agent: there are two customers in the system, one named "Jiefang Tech" (annual contract quoted at 12 million) and another named "Jiefang Tech Co., Ltd." (annual contract quoted at 4.5 million, a new customer another sales rep opened last month). A sales rep asks the agent: "What was the annual contract amount we last discussed with Jiefang?" Meanwhile, Jiefang Tech's own quote in the database also changed from 12 million to 10.5 million three months ago. The interviewer asks: "How would you design this memory system so it correctly distinguishes which Jiefang is being asked about, which amount is the current quote, and whether to honestly decline when the evidence is insufficient?"

**Source**: Adapted from DISCERN's (arXiv:2611.15729, Chirag Ahuja et al., Amazon, published 2026-11-11) entity-resolution and bi-temporal fact-store design, simulating the "handed a memory case with similarly-named entities and contradictory data, discuss how to redesign the system" question type common in paper-reading interviews **Difficulty**: Advanced **Round**: Onsite system design / research discussion

### How to break it down

1. **Clarify first**: Confirm whether the data source assigns unique IDs to "Jiefang Tech" and "Jiefang Tech Co., Ltd.", whether every quote carries a timestamp, and whether the rep's own question contains extra signal (for example, they only cover one of the two accounts).
2. **Build a framework**: Borrow DISCERN's "preserve at write, resolve at read." At write time, two similarly-named companies are never merged — they're linked with a SIMILAR_NAME-style edge that preserves the signal "these look alike but are different." Every quote is recorded as a bi-temporal edge; an old quote is soft-invalidated but kept, never overwritten.
3. **Go deep on the core trade-off**: Explain why read time can't just do one LLM judgment and answer. First comes entity resolution — using name similarity and interaction history to decide which Jiefang the rep means (and if it's genuinely ambiguous, converge on "clarify" rather than guessing). Only after the entity is resolved does temporal resolution kick in — find the latest, not-yet-superseded quote under that entity. If both steps are done and it's still ambiguous (say, the two Jiefangs have similar interaction counts and the question gives no extra clue), the system should converge on "abstain" or "clarify" rather than picking a number — this is exactly where the paper's entity-resolution score shows the biggest gap over baselines.
4. **Close**: Propose an evaluation design — score two independent axes: whether the answer is correct given the right entity and the right time-state, and whether cases that should be clarified or declined were actually clarified or declined, treated as a precision/recall/F1 classification problem, rather than a single overall accuracy number. Also note this logic needs to be re-validated on a completely different customer dataset to convince an interviewer it isn't tuned to one specific dataset.

### Sample answer (how to actually say this in an interview)

> **First confirm whether the reference itself has been resolved.** I wouldn't let the system just look up "Jiefang" and pick a quote. Step one is entity resolution: "Jiefang Tech" and "Jiefang Tech Co., Ltd." in the database should be linked with something like a SIMILAR_NAME edge, flagged as "similar names, two different entities" — not merged into one node. Merging risks writing one company's quote onto the other, and once merged it's hard to undo. If the rep's question and interaction history don't give enough signal to tell them apart, I'd have the system converge on "clarify" and ask the rep directly — "do you mean Jiefang Tech, or Jiefang Tech Co., Ltd.?" — rather than gambling on an answer.
>
> **Only after the entity is resolved do I handle currency.** Once I've confirmed the rep means "Jiefang Tech," I'd record every quote as a bi-temporal edge — the 12 million from three months ago gets a valid-to stamp marking it superseded, but it's kept, not overwritten; the new 10.5 million is an open valid-from edge. The answer only pulls the current, not-yet-superseded value, while keeping the ability to answer "what was the quote before the change" if someone asks.
>
> **Treat whether the system can answer at all as its own judgment call.** I wouldn't assume the system can always produce an answer. If both entity resolution and temporal resolution are done and the evidence is still ambiguous — say, the two Jiefangs have similar interaction counts and the question gives no extra clue — I'd have it converge on "abstain" or "clarify" rather than forcing a number. For evaluation, I'd look at two separate metrics: answer correctness given the right entity and right time-state, and — treated as a classification problem with precision, recall, and F1 — whether cases that should be clarified or declined actually were, rather than one blended overall accuracy number. That's the only way to tell whether the system actually resolved the case or just got lucky.

### Self-check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---------|---------|
| Linked confusable entities without merging them into one node | |
| Recorded quotes bi-temporally, soft-invalidating old values instead of overwriting them | |
| Separated "entity resolution" and "temporal resolution" into two independent steps | |
| Converged on clarify/abstain instead of forcing a number when evidence is insufficient | |
| Split evaluation into "answer correctness" and "whether abstention happened" as two independent metrics | |
| Bonus: noted the need to re-validate on a different dataset to rule out overfitting to one's own benchmark | |

## Further Reading

- [MEMOIR adds 11.92pt evidence recall to LLM agent memory — AI Weekly](https://aiweekly.co/alerts/memoir-adds-1192pt-evidence-recall-to-llm-agent-memory) — coverage of another agent-memory paper from the same week, approached from training-free evidence recall, a useful contrast to DISCERN's "resolution over retrieval" argument
- [AstroMemBench: a benchmark for memory systems in embodied spacecraft agents — ArXivSignals](https://arxivsignals.io/papers/2611.16590) — a sibling memory-system benchmark from the same week, finding that after a session restart Mem0 actually beats RAG by 12.25 points, filling in today's Concept 1 point that retrieval being saturated doesn't mean the gap is the same in every setting

## References

- [DISCERN: Preserve at Write, Resolve at Read for Persistent LLM-Agent Memory — arXiv:2611.15729](https://arxiv.org/abs/2611.15729) — the source paper for today's core concepts and practice question, including the ENT-310 and LoCoMo evaluation data
- [DISCERN full paper (HTML) — arxiv.org/html/2611.15729v1](https://arxiv.org/html/2611.15729v1) — architecture details on the write-time bi-temporal provenance graph and the read-time four terminal actions and gates, supporting Concepts 2 and 3
