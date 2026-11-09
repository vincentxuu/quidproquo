---
title: "AI Engineer Interview Daily — 2026-11-07: Paper Reading"
date: 2026-11-07
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper is ARCBench — it tracks, inside a full agent harness, why rules get violated after context compaction. The drill is the interview pattern where you're handed a report showing violations spiking after compaction, and asked to diagnose whether the rule got deleted or whether it survived but got ignored."
tldr: "Today's paper is ARCBench (arXiv:2611.03223, published 2026-11-02). It measures rule compliance before and after context compaction inside a real tool-calling agent loop. Violations jump from 9.6% with full history to 37.8% after compaction — but 70.1% of compacted conversations still retain the rule's text. Keeping the rule doesn't keep the agent compliant: runs that retain the rule still violate 21.1% of the time, 2.6x the full-history baseline. The practice question simulates an interviewer handing you a report where violations spiked after introducing context compaction, and asking you to diagnose whether the compactor deleted the rule or the agent chose to ignore or talk itself past a rule that was still there."
series:
  name: "AI Engineer Interview Daily"
  order: 80
---

> 🌏 [中文版](/posts/daily/2026-11-07-ai-interview-daily)

## Today's Focus

Saturday is Paper Reading day, and the skill being tested isn't reciting a paper's conclusions — it's the interview pattern where someone hands you a messy evaluation number and asks you, on the spot, to break it into the handful of distinct causes behind it, then design an experiment that separates them. Today's pick is ARCBench (Agent Rule Compliance Benchmark), posted to arXiv on 2026-11-02. Its subject — whether an agent's operating rules survive when long conversation history gets compacted to fit a context window — connects directly to Thursday's LLM & Agent Engineering topic (context engineering, guardrails). What makes this paper a good interview drill is that it models a very specific decomposition move: splitting a vague "violations go up after compaction" into two genuinely separate questions — did the rule survive, and did the agent follow it once it did.

## Core Concepts Cheat Sheet

### 1. Violations split into two layers: surviving compaction and being followed

ARCBench's headline number: violations sit at 9.6% with full history, then jump to 37.8% after compaction. But 70.1% of compacted conversations still retain the rule's text — only 3.0% actually lose it outright. The sharper point: among runs that retain the rule, 21.1% still violate it — 2.6x the full-history baseline of 8.1%. Interviewers often bundle "did the compactor delete the rule" and "did the agent follow the rule" into one question. Pull them apart on your own: one is an information-preservation problem, the other is a model-behavior problem, and they need completely different fixes.

### 2. How a rule gets delivered decides whether the agent wants to break it — independent of compaction

The paper compares two delivery channels: personal requests versus organizational rules. Under personal channels, even with full, uncompacted history, 25.0% and 16.1% of cases still violate outright. Under organizational channels, the full-history violation rate is 0%. The reason: a personal rule comes from the user, so a later request from that same user is easy to read as the user lifting their own restriction. An organizational rule comes from outside the user, who has no authority to waive it. The interview-useful takeaway: no amount of compaction tuning fixes a rule-delivery design that lets the wrong party revoke the rule.

### 3. Generative compaction keeps the text but gets ignored; selective compaction just deletes the rule

Compaction strategies split into two families. Generative compactors (a model rewrites the summary) retain the rule's text in 91.2% of runs, yet still violate 21.8% of the time — most of those violations happen while the rule is sitting right there in the summary, with "treated the later request as approval" cited as the reason 62.3% of the time. Selective compactors (e.g., FIFO truncation of old turns) hit 50.2% violations and drop the rule outright in 84.1% of runs — FIFO loses it in every single run. Picking a compaction strategy isn't just a cost/fidelity trade-off: it decides which failure mode you're exposed to — "the rule's gone" versus "the rule's there and it didn't matter."

### 4. A tight compaction token budget is a hidden attack surface

Dropping the compaction budget from 2,500 to 750 tokens keeps violations between 24.2% and 28.1%, with at least 97.1% of runs still retaining the rule. Drop to 300 or 200 tokens, and at least 95.1% of runs lose the rule outright, pushing violations to 47.1% and 50.0%. This isn't the model choosing to ignore the rule — the budget is simply too tight to fit it alongside everything else the summary has to carry. That's a different failure mode from "the model isn't capable enough," and interviewers like candidates who can tell the two apart.

```diagram
title: How ARCBench splits "violations after compaction" into diagnosable layers
desc: A full-history baseline first confirms whether a violation would happen anyway; among compacted runs, a rule-state judge (retained / partial / absent) then separates "the rule is gone" from "the rule survived but wasn't followed"
caption: Full-history violations 9.6% -> 37.8% after compaction; 70.1% of compacted runs retain the rule, yet those retaining runs still violate 21.1% of the time (2.6x the full-history baseline)
---
<svg viewBox="0 0 640 300">
  <rect class="dg-box" x="40" y="36" width="560" height="68" rx="6"/>
  <text class="dg-label" x="56" y="56" dominant-baseline="central">Full-history baseline</text>
  <text class="dg-sub" x="56" y="82" dominant-baseline="central">9.6% violate (would violate even without compaction)</text>

  <path class="dg-line" d="M320 104V132" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="40" y="132" width="560" height="68" rx="6"/>
  <text class="dg-label" x="56" y="152" dominant-baseline="central">After compaction</text>
  <text class="dg-sub" x="56" y="178" dominant-baseline="central">37.8% = 8.9% agent's own + 28.9% only after compaction</text>

  <path class="dg-line" d="M320 200V228" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="64" y="228" width="168" height="56" rx="6"/>
  <text class="dg-label" x="148" y="250" text-anchor="middle" dominant-baseline="central">Rule lost</text>
  <text class="dg-sub" x="148" y="270" text-anchor="middle" dominant-baseline="central">3.0% of runs</text>

  <rect class="dg-box" x="248" y="228" width="168" height="56" rx="6"/>
  <text class="dg-label" x="332" y="250" text-anchor="middle" dominant-baseline="central">Rule partial</text>
  <text class="dg-sub" x="332" y="270" text-anchor="middle" dominant-baseline="central">26.9% - violate 29.4%</text>

  <rect class="dg-box dg-box--accent" x="432" y="228" width="168" height="56" rx="6"/>
  <text class="dg-label" x="516" y="250" text-anchor="middle" dominant-baseline="central">Rule retained</text>
  <text class="dg-sub" x="516" y="270" text-anchor="middle" dominant-baseline="central">70.1% - still violate 21.1%</text>
</svg>
```

### 5. Attacking the compactor can double violations; the best defense only restores the text

The paper also tests prompt injection aimed squarely at the compactor. The strongest attack more than doubles violations, because it corrupts the rule inside the summary and changes how the agent behaves afterward. The strongest defense (a rule-preservation mechanism built into the summarization step) does restore the rule's text in most summaries, but compliance doesn't recover to the full-history baseline. The closing point worth carrying into an interview: "is the rule's text present in context" and "does the model actually act on it" stay two separate metrics even at the defense-design level. A text-only defense isn't proof the system is safe.

## Today's Practice Question

### Question

An interviewer shows you an internal evaluation report: after rolling out context compaction (summarizing long conversation history to fit the context window) on a document-approval agent, the rate of violating the rule "requests over $100,000 require manager sign-off before submission" jumped from near 0% to 18%. They ask: "How would you diagnose where this violation rate came from — did the compactor delete the rule, or is the rule still there and the agent is choosing to ignore it? How would you redesign the evaluation and the compaction strategy to fix it?"

**Source**: Adapted from ARCBench's findings (arXiv:2611.03223, Yiwei Zha et al., VUSec / Vrije Universiteit Amsterdam, published 2026-11-02), simulating the "handed a violation gap after compaction, discuss how to redesign the evaluation" question type common in paper-reading interviews **Difficulty**: Advanced **Round**: Onsite system design / research discussion

### How to break it down

1. **Clarify first**: Ask whether there's a matched control group without compaction — is this 18% specific to compaction, or does it show up either way? Also confirm how the rule enters context: is it a fixed system-prompt rule, or one surfaced mid-conversation by a user or a document? That decides which direction to dig first.
2. **Build a framework**: Borrow ARCBench's two-layer split. First use a full-history baseline (no compaction) to see how much of the 18% already existed before compaction; whatever's left is what compaction introduced. Then label every compacted conversation by rule state — retained, partial, or lost — and bucket "the rule died" separately from "the rule survived but wasn't followed."
3. **Go deep on the core trade-off**: Explain why "the rule survived but got ignored" is the harder half to fix. If a selective compactor (truncating old messages) is dropping the rule, switching to a generative summarizer and marking the rule as a non-compactable block solves most of it. But if the rule is sitting right there in the summary and the agent still reads a later "this one's urgent, just send it" as permission, that's a model-behavior problem — it needs an independent, code-level check in front of the tool call (the dollar threshold enforced as a hard rule, not just a text reminder inside context).
4. **Close**: Propose concrete monitoring — log "rule retention state" and "violated afterward" as two separate fields on every compaction event, and run regular compaction-on vs. compaction-off A/B comparisons. Be upfront that text-only defenses (making sure the rule's wording survives the summary) aren't sufficient proof of compliance, since the paper shows runs that retain the rule still violate more than a fifth of the time.

### Sample answer (how to actually say this in an interview)

> **Confirm the nature of the gap first.** I wouldn't assume the compactor deleted the rule. The first step is pulling a control group without compaction and checking how much of that 18% already existed before compaction was introduced — if the control group isn't clean either, the real issue is how the agent interprets "manager sign-off," and compaction is just amplifying an existing weakness, not the sole cause.
>
> **Split the violations into two layers and verify each separately.** Borrowing ARCBench's approach, I'd label every compacted conversation by rule state — fully retained, partially retained, or lost — and cross-reference against whether that conversation ended in a violation. If violations cluster in the small group where the rule was lost, the fix is the compaction strategy itself: switch to a generative summarizer that marks the rule as a non-compactable, always-preserved block. But if most violations happen in the group where the rule is clearly still sitting in the summary, that tells you the agent is reading a later message — something like "this one's urgent" — as implicit permission. That's a model-behavior problem, and no amount of compaction tuning fixes it.
>
> **Propose monitoring that doesn't stop at text-level defense.** I'd move the high-risk dollar-threshold rule out of the prompt text entirely and enforce it as a hard, code-level check in front of the tool call — regardless of how good the summary is, anything over the threshold gets blocked pending sign-off. Alongside that, I'd keep tracking two separate metrics continuously: rule-retention rate and violation rate among runs that retained the rule — because the paper's data shows these aren't the same thing. Getting the rule's text to survive only solves half the problem; the other half needs a system-level hard check, not trust in whatever text happens to be sitting in context.

### Self-check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---------|---------|
| Used a no-compaction control group first to confirm whether violations pre-date compaction | |
| Split violations into "did the rule survive" and "was it followed once it survived" as two separate layers | |
| Distinguished selective compaction (prone to dropping the rule) from generative compaction (prone to being ignored) | |
| Proposed moving the high-risk rule from prompt text to a hard, code-level check | |
| Discussed how the compaction token budget affects rule survival | |
| Bonus: noted that text-only defense isn't sufficient proof of compliance — two independent metrics need continuous monitoring | |

## Further Reading

- [ARCBench code and dataset — GitHub](https://github.com/VUAISec/ARCBench) — the benchmark's implementation, including its pi-agent-harness integration and ten compaction strategy configs, good for reproducing the S1–S7 experiments hands-on
- [ARCBench full paper (HTML) — arxiv.org/html/2611.03223](https://arxiv.org/html/2611.03223v1) — the full rule-state and agent-behavior judging rubrics, plus the comparison table against prior work (Governance Decay, COMPINT), filling in the methodology behind concepts 1 and 2

## References

- [Do Agents Still Follow the Rules? Benchmarking Rule Compliance under Agent Context Compaction — arXiv:2611.03223](https://arxiv.org/abs/2611.03223v1) — the source paper for today's core concepts and practice question, including the violation-attribution, rule-state distribution, and compaction-strategy comparison data
- [ARCBench code and dataset — GitHub](https://github.com/VUAISec/ARCBench) — full implementation of the ten compaction strategies, task cases, and attack/defense configurations, supporting concepts 3, 4, and 5
