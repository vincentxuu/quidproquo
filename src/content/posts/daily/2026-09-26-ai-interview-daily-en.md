---
title: "AI Engineer Interview Daily — 2026-09-26: Paper Reading"
date: 2026-09-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper just landed on arXiv: When Can Agents Forget Their Reasoning? — on when a long-running agent can safely drop its own reasoning history, paired with a reviewer's-eye question about why deleting reasoning can ripple into later behavior like a butterfly effect."
tldr: "Today's Paper Reading rotation covers arXiv:2609.29875, When Can Agents Forget Their Reasoning? ICLR for Long-Horizon Agent Context Compression — a paper that only went up on arXiv this September. It proposes Interaction Aware Compression for Long Horizon Reasoning (ICLR), a training-free, online method that ranks historical reasoning blocks by a frozen proxy entropy score while leaving actions, tool calls, and observations untouched. Across 260 WorkBuddyBench tasks, average reward rises from 0.699 to 0.718 while input, output, and cache-read tokens drop by 25.5%, 14.4%, and 33.3% respectively. Core concepts covered: why deleting reasoning history isn't the same as static CoT compression because it can change future actions, the nonlinear 'trajectory amplification' effect, the idea that reasoning becomes safe to forget once its conclusions have been externalized into code, files, or tool output, and how this paper's findings echo the compaction and offloading mechanisms already shipping in harnesses like Claude Code and LangChain Deep Agents. The practice question takes a reviewer's-eye view: how do you prove this method isn't just getting lucky on one benchmark's task distribution, and how would you decide when to compress context for a coding agent that runs for hours across hundreds of tool calls."
series:
  name: "AI Engineer Interview Daily"
  order: 38
---

> 🌏 [中文版](/posts/daily/2026-09-26-ai-interview-daily)

## Today's Topic

Saturday's rotation is Paper Reading. Today's pick, When Can Agents Forget Their Reasoning?, only went up on arXiv on September 24 — and it goes straight at a pain point anyone building LLM agents has hit: the longer an agent runs, the more reasoning history piles up, making context more expensive and more diluted by irrelevant content, but you can't just delete it, because deleting the wrong thing changes what the agent does next. This sits right in the middle of "context engineering," one of the hottest interview topics of 2026 — good practice for the paper-reading round in an LLM/Agent Engineering loop, and it extends naturally into system design: how do you manage context for a long-running agent, a question nearly every AI Engineer role asks in some form.

## Core Concepts Cheat Sheet

### Deleting reasoning history isn't static CoT compression, because it changes future actions

Traditional Chain-of-Thought compression operates on "static" text — once the reasoning is written, trimming redundant sentences doesn't change the outcome. An agent's reasoning history is dynamic: a given step's reasoning determines which tool gets called next and with what arguments, so deleting that reasoning after the fact isn't just an information loss — it can send the model down a completely different path when it regenerates subsequent reasoning. If you're asked "how is context compression for agents different from ordinary text summarization," this is the line that draws the boundary: static text compression is lossy but the outcome is deterministic; agent reasoning compression is lossy and can change the downstream decision trajectory.

### ICLR: rank by frozen proxy entropy, but never touch actions, tool calls, or observations

The paper's proposed method, Interaction Aware Compression for Long Horizon Reasoning (ICLR), is training-free and runs online. Its core move is scoring each historical reasoning block with entropy from a frozen proxy model, then ranking blocks by that score to decide what gets dropped first — while explicitly excluding actions, tool calls, and observations, since those three categories are things the agent actually executed and already have concrete, grounded outcomes. This design choice matters: it separates "the reasoning process" from "what already happened," and only compresses the former. When an interviewer asks "which part of an agent's history would you compress," the answer isn't "summarize everything together" — it's splitting these two categories apart first.

### When reasoning becomes safe to forget: once it's been externalized

Using representation probing, activation patching, and controlled trajectory analysis, the paper finds that once a piece of historical reasoning's task-relevant derived state has been reliably externalized into code, files, tool outputs, or environmental feedback, that reasoning itself becomes replaceable — the model no longer needs to re-read that text to keep going, because the conclusion already lives out in the world. This is structurally the same as a familiar software-engineering intuition: once a decision has been committed to code or a config file, the meeting notes discussing that decision stop being the single source of truth. When asked "how do you decide what context is safe to drop," this criterion — whether its conclusion has been externalized, not how long ago it happened — gets closer to the paper's actual insight than cutting by token count or a fixed time window.

### Trajectory amplification: local deletion, nonlinear consequences

The paper's most counterintuitive finding comes from an ablation study revealing "trajectory amplification" — because an agent is a stateful sequential decision system, deleting one small piece of reasoning isn't a linear loss of that piece's information. It can, by changing the next action, cascade into a completely different interaction trajectory, producing a nonlinear change in total computation or outcome. This explains why "only trimming 5% of the tokens" sometimes wrecks a case's entire trajectory and sometimes causes no problem at all — the difference is whether that piece of reasoning happened to sit at a branch point. When an interviewer pushes on "how do you guarantee compression won't hurt performance," being able to name this nonlinear amplification mechanism shows a deeper grasp of the problem than just saying "I'd run an A/B test."

### Efficiency and quality aren't necessarily a trade-off — reward actually went up here

Most context-compression papers frame the story as "trade a bit of quality for efficiency," but ICLR pushed average reward from 0.699 to 0.718 across 260 WorkBuddyBench tasks while cutting input, output, and cache-read tokens by 25.5%, 14.4%, and 33.3% respectively. That result shouldn't be read as "compression makes the agent smarter" outright — a more grounded reading is that the discarded redundant reasoning was already diluting the model's attention (echoing Anthropic's context engineering guide on the finite "attention budget"), and clearing out the noise let the model focus more on facts that were already externalized. If asked "does compressing context always cost you quality," this case is a concrete counterexample — as long as what you're cutting is noise, not signal.

## Today's Practice Question

### The Question

"A recent arXiv paper, When Can Agents Forget Their Reasoning?, proposes ICLR: rank historical reasoning blocks by frozen proxy entropy while preserving actions, tool calls, and observations. Across 260 WorkBuddyBench tasks, average reward rises from 0.699 to 0.718 while input, output, and cache-read tokens drop by 25.5%, 14.4%, and 33.3% respectively. An ablation study also surfaces a 'trajectory amplification' effect: locally deleting one piece of reasoning isn't a linear loss — it can, by changing subsequent actions, produce a nonlinear effect on total computation. Explain: (1) if you were reviewing this paper, how would you design experiments to verify this method genuinely understands 'semantic replaceability' rather than just getting lucky on this particular benchmark's task distribution; (2) if you were deploying an ICLR-style method to a coding agent that runs for hours across hundreds of tool calls, how would you decide when and at what granularity to trigger compression; and (3) what does trajectory amplification concretely imply for how you'd validate any system that trims an agent's history."

**Source**: Adapted from arXiv:2609.29875's method design and experimental findings, self-authored interview scenario   **Difficulty**: Advanced   **Round**: LLM/Agent Engineering / System Design hybrid (onsite)

### How to Break It Down

1. **Clarify the problem first**: Pin down what "safe to forget" actually means — is it that final reward doesn't drop, or that the full interaction trajectory matches the uncompressed version (these aren't equivalent — matching reward doesn't rule out the process having drifted)? Also clarify what model computes the proxy entropy and whether it's the same model as the agent being compressed — if the proxy's notion of "what matters" diverges from the main model's, the ranking itself can carry a systematic bias.
2. **Build the framework**: Set up three comparisons. (a) A random-pruning baseline — drop the same token count but pick blocks at random, and check whether ICLR's entropy ranking beats it by a meaningful margin, proving the ranking itself carries signal rather than "dropping roughly the same amount always works about the same." (b) An ablation that removes the "preserve actions/tool calls/observations" constraint on its own, isolating how much each design choice — the ranking and the structural constraint — actually contributes. (c) A cross-benchmark transfer test — take the same proxy entropy threshold to a benchmark with a meaningfully different task distribution and check whether performance drops significantly, which would flag overfitting to WorkBuddyBench's specific task structure.
3. **Go deep on the core**: Trajectory amplification is the part most worth pressing on — because an agent is a stateful sequential decision system, deleting one piece of reasoning can change the next action and cascade into an entirely different branch of the interaction, which is a fundamentally different failure mode from static text compression. A reviewer should ask how the reward confidence interval is reported alongside this nonlinear effect, and whether a handful of cases landing on the "right" branch could be inflating the average. For deploying this to a coding agent, the compression trigger shouldn't be a fixed token count or fixed time window — it should be tied to whether a piece of reasoning's conclusion has already been externalized. A block of reasoning about which function to call becomes droppable once that function has actually been invoked and its tool output received; reasoning that's still pure planning, not yet grounded in an action, carries much higher risk if dropped. The right granularity is a complete plan-then-execute cycle, not an arbitrary token-count slice.
4. **Close it out**: The implication of trajectory amplification for validation methodology is that you can't rely on offline average reward alone, because the average can be dragged down — without being visible — by a small number of cases where a bad deletion collapses the entire trajectory. In practice, you need online monitoring: keep running the agent after compression and watch for trajectory-level anomalies like repeating the same action or issuing contradictory next steps, not just tracking the token-savings rate. This echoes how production harnesses already work — Claude Code re-reads recently modified files and reloads relevant rules right after compaction, which is essentially pulling externalized state back into the attention window to hedge against exactly this kind of cascading drift.

### Sample Answer (something you could actually say in an interview)

> **Framing the problem**: This paper's core claim is knowing when it's safe to drop historical reasoning, so I'd split validation into two layers — outcome (did reward drop) and process (did the trajectory drift) — because matching reward doesn't rule out the agent having taken a different path to get there, and conflating the two can hide cases that got lucky rather than got it right. I'd also confirm what model computes the proxy entropy and whether it's the same as the agent being compressed, since a mismatch there means the ranking's accuracy itself needs separate validation.
>
> **Core logic**: I'd set up three comparisons. First, a random-pruning baseline to confirm the entropy ranking actually beats random selection by a meaningful margin. Second, an ablation that removes the "preserve actions/tool calls/observations" constraint on its own, to see how much each design choice contributes independently. Third, a transfer test on a benchmark with a different task distribution, to make sure the result isn't specific to WorkBuddyBench. For deploying this to a coding agent that runs for hours, I wouldn't trigger compression on a fixed token count or time window — I'd tie it to whether a piece of reasoning's conclusion has already been externalized. Planning discussion that's already been grounded in an actual function call with a returned tool output becomes droppable; reasoning that's still pure planning and hasn't executed yet carries much higher risk, so the granularity should be a full plan-then-execute cycle.
>
> **Deployment validation**: Trajectory amplification tells me average reward isn't enough, because a small number of cases where a bad deletion collapses the whole trajectory can drag the average down without being visible. I'd add online monitoring after compression ships, watching for trajectory-level anomaly signals like repeated actions or contradictory next steps, not just the token-savings percentage. That's the same idea behind Claude Code re-reading recently modified files right after compaction — pulling already-externalized state back into the model's attention window to lower the odds of a compression-triggered cascade.

### Self-Check List

Use this table to check whether your answer missed a key point:

| Check item | Covered? |
|---|---|
| Proposed a random-pruning baseline to causally validate the entropy ranking | |
| Discussed who computes the proxy entropy and whether it shares a source with the compressed agent | |
| Clearly named "externalized state" as the core criterion for whether reasoning is safe to forget | |
| Deployment plan tied the compression trigger to whether reasoning has been grounded in an action, not a fixed token count | |
| Named trajectory amplification's implication for validation methodology (average reward alone isn't enough) | |
| Bonus: connected this to production harness mechanisms (Claude Code / Deep Agents compaction and offloading) | |

## Further Reading

- [Context Engineering Inside the Harness: 4 Mechanisms That Beat Context Overflow and Goal Loss on Long-Horizon Tasks — MarkTechPost](https://www.marktechpost.com/2026/09/12/context-engineering-inside-the-harness-4-mechanisms-that-beat-context-overflow-and-goal-loss-on-long-horizon-tasks/) — Surveys how Claude Code, LangChain Deep Agents, and OpenAI Codex handle context budgeting, compaction, and todo-state, and cross-session memory — a good pairing with today's "externalized state" and "trajectory amplification" concepts.
- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Explains why n tokens create n² pairwise attention relationships, which is why context behaves like a finite resource — the mechanism behind today's "efficiency and quality aren't necessarily a trade-off" section.
- [awesome-harness-engineering — ai-boost](https://github.com/ai-boost/awesome-harness-engineering) — A curated list of agent harness engineering tools, patterns, and memory-management resources, good for digging further into context compression implementations.

## References

- [When Can Agents Forget Their Reasoning? ICLR for Long-Horizon Agent Context Compression — arXiv:2609.29875](https://arxiv.org/abs/2609.29875) — Source paper for today's Paper Reading core concepts and practice question, including the ICLR method design, WorkBuddyBench experiments, and the trajectory amplification ablation analysis.
- [Context Engineering Inside the Harness — MarkTechPost](https://www.marktechpost.com/2026/09/12/context-engineering-inside-the-harness-4-mechanisms-that-beat-context-overflow-and-goal-loss-on-long-horizon-tasks/) — Source for the Claude Code compaction re-read behavior and Deep Agents offloading mechanism referenced in the "efficiency vs. quality" and "closing it out" sections.
- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Source for the attention-budget concept referenced in the fifth core-concept section.
