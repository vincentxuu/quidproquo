---
title: "AI Engineer Interview Drill — 2026-11-21: Paper Reading"
date: 2026-11-21
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Today's paper is HEAMS, which argues that an AI agent's memory system can't be judged on accuracy alone — privacy, user sovereignty, and security need their own scores. The drill is a case where the interviewer hands you a system with the best accuracy in the company but users complaining about leaks and failed deletions, and asks you to redesign the launch bar."
tldr: "Today's paper is HEAMS (arXiv:2611.20144, a Mila team, published 2026-11-15), which splits agent memory evaluation into five independent dimensions: performance, efficiency, privacy, user sovereignty, and security. It finds HippoRAG tops the accuracy leaderboard on all three BEAM scales, yet on the privacy benchmark 94.79% of its answers are judged helpful while 71.74% simultaneously leak a field they shouldn't have; when users ask to delete a memory, even the best system only honors 47% of requests, and no system edits more than 3.66% correctly. The practice question simulates an interviewer handing you a system with the best accuracy in the company but user complaints about leaks and failed deletions, and asking you to redesign the pre-launch evaluation framework."
series:
  name: "AI Engineer 面試日練"
  order: 94
---

> :globe: [中文版](/posts/daily/2026-11-21-ai-interview-daily)

## Today's Focus

Saturday is the fixed slot for Paper Reading: one paper that just landed on arXiv, worked through the way an interviewer actually tests it — they don't care whether you've memorized the paper, they care whether you can turn its core claim into one actionable engineering judgment call.

Today's pick is HEAMS, a paper that pushes back on the default assumption that "task accuracy is enough to evaluate an agent's memory system." Its position is blunt: a memory system stores a user's persistent information, and its job isn't just helping the agent finish tasks — it also covers privacy, user sovereignty (can the user see it, delete it, correct it), and security (can it resist malicious content planted into it). These three concerns move on completely independent curves from "accuracy," and the authors prove it with controlled experiments across six real systems — which happens to be exactly the question ML system design interviews love to ask: how do you know a system is ready to ship.

## Core Concepts, Fast

### A memory system is the custodian of a user's information, not just a database

What a memory system stores outlives any single agent run, and it's often shared across several agents under the same user — including agents the user never vetted and shouldn't fully trust. So the responsibility for retention, deletion, and poison resistance belongs to the memory system itself, not to every agent that happens to call it. When asked how responsibility should be split between a memory system and the agents using it, this is the cleanest answer: the task agent's job is to use information to finish a task; the memory system's job is to guard that information's access on the user's behalf.

### Accuracy and the privacy/security scores move on independent curves — neither guarantees the other

A system scoring well on conversational-memory benchmarks (LoCoMo, LongMemEval, BEAM) tells you nothing about whether it passes privacy or security tests. HEAMS finds HippoRAG tops accuracy on all three BEAM scales (100K/500K/1M, at 58.71%–61.25%), yet on the Contextual Integrity benchmark, 94.79% of its answers are judged "helpful" while 71.74% simultaneously leak a field the user never allowed. When asked how to know a system is ready to ship: passing accuracy is necessary, not sufficient.

### A governance layer turns privacy and security into adjustable knobs — you don't swap memory systems to fix this

HEAMS designs governance as a layer that wraps around any memory system, running one check on write and one on read, each independently switchable. Adding a "necessity-gated" recall policy to MilaMem cuts the leak rate on the Contextual Integrity benchmark from 57.61% to 31.82%, at a cost of 4.8 points of helpfulness. Turning on both retention and recall governance together pushes poison resistance from 40.00% with no governance to 88.61%. The takeaway: privacy and security aren't fixed by finding a "better" memory system — they're fixed by deciding how much usefulness you're willing to trade to protect the user.

### User sovereignty is the easiest dimension to overlook: delete and edit requests actually succeed far less than you'd expect

Even among systems built to support deletion, the best performer, MilaMem, only honors 47.00% of requests; Letta manages 19.00%; everything else (in-context, Mem0, HippoRAG) fails every natural-language delete request at 0.00% — HippoRAG, for instance, can only delete on an exact text match, so it can't act on a request phrased in everyday language. Editing fares worse: no system exceeds 3.66%. When asked how to verify a deletion actually took effect, the key is paired probing — ask the agent about the fact before the request to confirm it actually knew it, then ask again after. Only when both answers are correct does the deletion count as "actually effective"; otherwise the system might simply never have known the fact in the first place.

### Core memory functionality doesn't filter malicious content on its own — that takes a separate line of defense

With no governance at all, MilaMem resists only 40.00% of MPBench's memory-poisoning attacks, and only 25.00% against the attack type it handles worst — because storage and retrieval, the two core functions of a memory system, were never designed to distinguish useful content from malicious content. Turning on both retention governance (screening at write time) and recall governance (screening at read time) is what pushes resistance up to 88.61%, and even then 11.39% of answers still get swayed by the attack. When asked about security, saying "no configuration here is perfect" shows a better grasp of the trade-off than claiming "we added protection so we're fine."

```flow-diagram
{
  "title": "Recall governance: asking \"does this task actually need it?\" before handing a memory over",
  "lang": "en",
  "width": 900,
  "height": 460,
  "nodes": [
    {"id": "query", "label": "Agent queries for the memory it needs\nSystem retrieves top_k=10 candidates", "x": 450, "y": 55, "w": 680, "h": 70},
    {"id": "check", "label": "Recall governance\nAn LLM checks each candidate:\ndoes this task clearly need it?", "x": 450, "y": 170, "w": 680, "h": 80, "tone": "accent"},
    {"id": "block", "label": "Uncertain or not needed\n-> withheld, agent never sees it", "x": 210, "y": 350, "w": 360, "h": 80, "tone": "warn"},
    {"id": "deliver", "label": "Clearly needed\n-> handed to the agent for its answer", "x": 690, "y": 350, "w": 360, "h": 80}
  ],
  "edges": [
    {"from": "query", "to": "check", "step": 1},
    {"from": "check", "to": "block", "step": 2, "label": "leak risk", "via": [[450, 260], [210, 260]], "labelAt": [310, 236], "tone": "warn"},
    {"from": "check", "to": "deliver", "step": 3, "label": "task needs it", "via": [[450, 260], [690, 260]], "labelAt": [590, 236]}
  ],
  "steps": [
    "The agent is about to answer a user's question. The memory system first retrieves the top_k=10 most semantically similar candidate memories, unfiltered.",
    "A necessity-gated recall governance policy runs an LLM check on each candidate: does this task clearly need this memory? Anything uncertain or unneeded is withheld — the agent never sees it.",
    "Only memories judged clearly needed reach the agent's answer. The paper's controlled experiment shows this gate cuts the leak rate on the Contextual Integrity benchmark from 57.61% to 31.82%, at a cost of 4.8 points of helpfulness."
  ],
  "caption": "Simplified for clarity: only the recall-time gate is shown; the write-time retention governance check is omitted. Numbers are from the before/after comparison of adding a necessity-gated recall policy to MilaMem (paper Table 5)."
}
```

## Today's Practice Question

### The Question

Your agent ships with a memory system that has the highest LongMemEval accuracy of any option your company has tested. Three months after launch, you get two kinds of complaints: first, personal data a user asked to have deleted months ago is showing back up in the agent's answers; second, a user discovers the agent told another user details of their travel plans. How would you redesign the pre-launch evaluation framework to catch problems like these before the next release?

**Source**: Adapted from empirical findings in HEAMS (arXiv:2611.20144, Mila – Quebec AI Institute, published 2026-11-15) **Difficulty**: Advanced **Round**: ML system design / onsite system design round

### How to Break It Down

1. **Clarify the problem first**: Pin down exactly what kind of failure "deleted data reappearing" is — did the delete request never actually remove it from storage, or was it removed but the agent can reconstruct the same fact through another channel (say, a semantically similar fragment)? Also confirm whether "leaked to another user" is a recall-time failure or a case where the two users' memory spaces were never properly isolated in the first place.
2. **Build a framework**: Bring in the idea that a memory system has five independent dimensions that need to be reported separately — performance, efficiency, privacy, user sovereignty, security — each measured with purpose-built scenarios rather than collapsed into one score, because a high score on any single dimension doesn't guarantee the others pass.
3. **Go deep on the core**: Give a concrete counterexample where accuracy and privacy move independently (a system with the best accuracy in the company can still leak on more than seven out of ten privacy-test cases), showing that accuracy alone can't surface a user-sovereignty problem. Extend this to deletion: use paired probing — ask about the fact before the request to confirm the agent actually knew it, then ask again after. Only count the deletion as "actually effective" if both answers are correct, which rules out the false positive of "it looked deleted because the agent never knew it to begin with."
4. **Close strong**: Collapse it into one line — passing a performance benchmark doesn't mean a system is ready to ship. You need to run privacy, user-sovereignty, and security scenarios on the same configuration at the same time, and adding a governance check at both read and write time is the only approach with evidence behind it for moving those scores in the right direction — but it isn't free, and the team has to decide how much usefulness it's willing to give up.

### A Sample Answer (how you'd actually say this in an interview)

> **First I'd define the real scope of the problem.** I'd confirm exactly what "deleted data reappearing" looks like — did the user's delete request never actually remove the data from storage, or was it removed but the agent can reconstruct the same fact through another channel? That's a different failure mode from "leaked to another user" — one is a user-sovereignty problem, the other is a privacy problem — so they can't be caught by the same benchmark, and you can't assume high accuracy means either one is fine.
>
> **I'd split the evaluation into five independent dimensions reported separately**: performance, efficiency, privacy, user sovereignty, security, each measured with purpose-built scenarios instead of one combined score. This isn't a hunch — the HEAMS paper found that HippoRAG tops accuracy on all three BEAM scales, yet on the Contextual Integrity benchmark, 94.79% of its answers are judged "helpful" while 71.74% simultaneously leak a field they shouldn't. User sovereignty tells the same story: even among systems designed to support deletion, the best measured success rate is only 47%, no system edits correctly more than 3.66% of the time, and several systems sit at exactly 0% on natural-language delete requests.
>
> **To close, I'd talk about turning this into an actual launch bar.** For every delete or edit request, I'd use paired probing — ask about the fact before the request to confirm the agent actually knew it, then ask again after. Only count it as "actually effective" if both answers are correct, so you don't credit a system for "forgetting" something it never knew. I'd also push for a governance layer on the read path: an LLM that checks each candidate memory handed to the agent against whether this specific task clearly needs it. In the paper, that gate cut the leak rate by almost half for a roughly 5-point drop in helpfulness — that's the knob I'd recommend shipping first, because it's the cheapest change with the clearest payoff.

### Self-Check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---|---|
| Distinguished "deleted data reappearing" from "leaked to another user" as two different failure modes | |
| Covered the five dimensions (performance/efficiency/privacy/user sovereignty/security) needing separate reporting, not one combined score | |
| Gave a concrete counterexample of high accuracy paired with a low privacy score (e.g. HippoRAG) | |
| Explained paired probing (ask before and after the request) for user sovereignty, ruling out the "never knew it" false positive | |
| Mentioned governance at both read and write time as the approach with evidence behind it, with real numbers | |
| Bonus: noted governance isn't free — helpfulness/coverage drop with it, and the trade-off is the team's call | |

## Further Reading

- [HEAMS: Holistic Evaluation of Agent Memory Systems (arXiv:2611.20144)](https://arxiv.org/abs/2611.20144) — the full paper: the five-dimension framework, ten benchmarks, and the controlled experiment across six systems
- [GitHub: milatechtransfer/heams](https://github.com/milatechtransfer/heams) — the open-source HEAMS framework, including the governance layer and the MilaMem implementation
- [GitHub: mila-iqia/agent-memory-system-card](https://github.com/mila-iqia/agent-memory-system-card) — the Agent Memory System Card mentioned in the paper, covering the architectural responsibilities benchmarks can't measure (data hosting, user-facing control surfaces)

## References

- [HEAMS: Holistic Evaluation of Agent Memory Systems (arXiv:2611.20144)](https://arxiv.org/abs/2611.20144) — source for all five "Core Concepts" and every number cited in "Today's Practice Question" (HippoRAG's accuracy and leak rate, delete/edit success rates, MPBench resistance)
- [GitHub: milatechtransfer/heams](https://github.com/milatechtransfer/heams) — source for the independently switchable retention/recall checks described in "A governance layer"
- [GitHub: mila-iqia/agent-memory-system-card](https://github.com/mila-iqia/agent-memory-system-card) — source for the architectural-responsibility documentation standard mentioned in "A memory system is the custodian of a user's information"
