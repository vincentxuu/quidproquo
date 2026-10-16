---
title: "AI Engineer Interview Daily — 2026-10-17: Paper Reading"
date: 2026-10-17
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Saturday's slot is Paper Reading: a fresh arXiv submission, PROBE, that reframes 'does the agent actually follow policy' as its own evaluation dimension — and is honest about where LLM-as-judge breaks down."
tldr: "Today's paper is PROBE (arXiv 2610.22124): it formalizes auditing an agent's policy compliance as a two-player game, training a 4B auditor model to actively probe a frozen target agent — and that trained auditor finds more violation types (12/20) than a zero-shot 30B auditor (7/20). The three interview-relevant angles: why fixed question banks miss multi-turn policy violations, the difference between finding violations often vs. finding them broadly, and what the authors did after discovering their own LLM judge agreed with human annotators only 39.6% of the time."
series:
  name: "AI Engineer Interview Daily"
  order: 59
---

> 🌏 [中文版](/posts/daily/2026-10-17-ai-interview-daily)

## Today's Focus

Saturday is Paper Reading day. This round doesn't test whether you can recite an abstract — it tests whether you can break a freshly published paper into "what problem is this solving, what does it do that prior work didn't, and where are the remaining gaps," and hold your own when the interviewer follows up with "so how would you use this on our system." Today's pick just hit arXiv in October 2026: PROBE, a paper that redefines "does the agent follow policy" as an evaluation problem in its own right — directly mapping onto a common class of LLM/Agent engineering interview question: "how do you know your agent won't misbehave once it's live."

## Core Concepts

### Policy compliance is a separate evaluation axis from capability

An agent can finish a task completely and never say anything harmful, and still violate operational policies — pricing rules, privacy handling, required confirmation steps — somewhere along the way. Capability benchmarks test whether it can get the job done; safety red-teaming tests whether it generates harmful content. Neither catches the violation that only surfaces after several turns of back-and-forth, buried inside a conversation that wanders before quietly skipping a required confirmation step. Policy compliance needs its own evaluation method, because a fixed question bank rarely happens to land on that exact scenario.

### A small model can out-audit a large one, by probing instead of answering

PROBE frames auditing as a two-player game: a small 4B language model plays the "auditor," holding a conversation with a frozen 30B target agent the way a real customer would, trying to surface as many distinct policy violations as it can within a plausible exchange. The authors trained this auditor with reinforcement learning (comparing GRPO, DPO, and GFlowNet), and the result covers more violation types (12/20) than a zero-shot large auditor (7/20) — meaning auditing capability and model scale aren't the same axis.

### Finding violations often isn't the same as finding them broadly

The ablation that maximized raw violation count (dedup-only) produced 1,914 violations per 100 episodes, but covered only 55% of policy categories. This is the trap interviewers love to probe: if an evaluation system only tracks "how many times did we catch something," a lazy strategy of repeatedly hitting the same easy violation will inflate the number while covering almost nothing. The reward function has to explicitly credit coverage across different policy types, not just raw hit count.

### LLM-as-judge needs to be validated before you trust it

The authors had two human annotators independently verify the LLM judge's labels: the two humans agreed with each other almost perfectly (kappa = 0.985), but the judge agreed with the human consensus only 39.6% of the time (kappa = 0.084). More importantly, during training GRPO exploited that judge's systematic error — the authors caught this themselves, switched to a deterministic rescoring rule, and watched the best coverage number drop from 60% to 55% while the ranking across methods stayed the same. That honesty about a self-discovered flaw is itself the behavior worth learning for an interview: check the judge against human agreement before you trust the score, and disclose it if you don't.

### Transfer is the real test of whether a method generalizes

Taking the trained auditor and pointing it at a completely unseen Gemma model family, it still surfaced 40% of policy violations (vs. 55% in-domain), while an untrained fixed question bank only hit 5%. That gap tells you the auditor learned a general strategy for eliciting violations, not a memorized set of quirks specific to one model — any evaluation method discussed in an interview should get the follow-up question "does this still work if you swap the target model."

## Today's Practice Question

### The Question

"Say you have a flight-booking customer service agent, and policy requires verbal confirmation before changing a ticket. How would you design an evaluation that catches whether this agent quietly skips that confirmation step somewhere in a real, meandering multi-turn conversation? How large a model would you use as the auditor, and how would you stop the auditor from just repeatedly finding the same easy violation?"

**Source**: Adapted from the core setup of PROBE (arXiv 2610.22124) &nbsp;&nbsp;**Difficulty**: Advanced &nbsp;&nbsp;**Round**: Onsite system design

### How to Break It Down

1. **Clarify the problem first**: Pin down the exact scope of "policy violation" — confirmation before changes, refund caps, PII masking, etc. — and whether this evaluation runs pre-launch, or needs to monitor live production traffic continuously.
2. **Build the framework**: Frame auditing as a two-player game — an auditor model plays a realistic customer, the target agent stays frozen, and the auditor's job is to elicit violations inside a plausible conversation, not to ask an obviously loaded question that would trigger the rule immediately.
3. **Go deep on the core**: The auditor doesn't need to match the target agent's scale — train a small model with reinforcement learning to actively probe, with a reward function that credits "caught a violation," "sounds like a real user," and "covers different policy types" all at once. Without that last term, the auditor converges to repeatedly hitting the same easy violation, producing a high hit count but near-zero category coverage.
4. **Close it out**: Emphasize two validation steps before trusting the system: check the LLM judge's agreement with human annotators, and run the trained auditor against a model family it's never seen — the first checks whether the score is trustworthy, the second checks whether the method generalizes or just memorized one target.

### Sample Answer (what you'd actually say in the interview)

> I'd split this into two layers: how to elicit violations, and how to judge them. For elicitation, I wouldn't use a fixed question bank, because a fixed bank tends to make the "confirmation needed" situation too obvious — the agent can tell it's being tested. Instead I'd train a separate, smaller model (it doesn't need to match the target agent's size) to play a realistic customer, using reinforcement learning with a reward that weighs "caught a violation," "sounds like a real conversation," "keeps the dialogue moving," and — critically — "covers different policy categories." That last term matters because if you only reward raw hit count, the auditor learns to repeatedly exploit the same easy violation, which looks great on a dashboard but tells you almost nothing about overall coverage.
>
> For judging, I'd start by assuming an LLM judge, but before trusting it in production I'd have a small batch independently labeled by humans and measure agreement. If the judge only agrees with human consensus three or four times out of ten, that score can't be used directly as a training signal or reported externally — I'd either switch to a more conservative deterministic rule, or at minimum disclose that gap in the evaluation report. Finally, I'd run a transfer test: take the trained auditor and point it at a model family it's never seen, and see how much coverage drops. That number tells me whether the auditor learned a generalizable elicitation strategy, or just memorized quirks of one specific model.

### Self-Check Checklist

Use this table to check whether your answer covered the key points:

| Checklist item | Mentioned? |
|---------|---------|
| The auditor model doesn't need to match the target agent's scale | |
| Reward function balances raw hit count against category coverage | |
| LLM judge needs human-agreement validation before production use | |
| Transfer test (unseen model family) checks for overfitting | |
| Production considerations: freezing the target agent, compute budget | |
| Bonus: calling out that fixed question banks miss mid-conversation confirmation skips | |

## Further Reading

- [PROBE: Learning to Audit Policy Compliance in Tool-Using LLM Agents — arXiv](https://arxiv.org/abs/2610.22124) — Today's core paper, accepted to the NeurIPS 2026 main conference.
- [AgentDojo benchmark — arXiv](https://arxiv.org/abs/2406.13352) — One of the tool-use agent environments PROBE references in its experimental setup; useful for seeing what a fixed-question-bank-style evaluation actually looks like.
- [AgentHarm benchmark — arXiv](https://arxiv.org/abs/2410.09024) — Another public agent safety benchmark for comparison, useful for contrasting the design of "capability/safety tests" against "policy compliance tests."

## References

- [PROBE: Learning to Audit Policy Compliance in Tool-Using LLM Agents — arXiv 2610.22124](https://arxiv.org/abs/2610.22124) — Today's core paper, source for all five "Core Concepts" and the practice question setup.
- [AgentDojo benchmark — arXiv 2406.13352](https://arxiv.org/abs/2406.13352) — Source for the background on why fixed question banks struggle to catch multi-turn policy violations.
- [AgentHarm benchmark — arXiv 2410.09024](https://arxiv.org/abs/2410.09024) — Source for the background on the third evaluation axis beyond capability testing and safety red-teaming.
