---
title: "AI Engineer Interview Daily — 2026-10-01: LLM & Agent Engineering"
date: 2026-10-01
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's LLM & Agent Engineering round skips the RAG-vs-agent decision framework and context engineering already covered in earlier weeks, and drills into the part that trips candidates up most: the failure modes agents actually hit once they're running, how to design termination conditions, and how to quantify agent evaluation. The practice question is a real reported interview prompt: 'What are the main failure modes of agents and how do you handle them?'"
tldr: "Today's LLM & Agent Engineering round takes a different angle than the RAG-vs-agent and context-engineering ground already covered in previous weeks, and focuses on the part candidates most often haven't prepped for — and interviewers most love to probe: the three failure modes agents run into once deployed, each needing a distinct fix (infinite loops, wrong tool selection, malformed arguments); why max_turns alone isn't enough for termination — you need step budgets, cost ceilings, and an independent goal-completion check layered together; why agent evaluation should split into three independent metrics — tool selection quality, action advancement, and context adherence — rather than a single pass/fail; and why guardrails should route by confidence or dollar-impact threshold, auto-executing low-risk actions and sending anything above the line to human review. The practice question is a real reported AI Engineer interview prompt, 'What are the main failure modes of agents and how do you handle them?', walked through as a full answer combining failure-mode defenses, termination design, and evaluation metrics."
series:
  name: "AI Engineer Interview Daily"
  order: 43
---

> 🌏 [中文版](/posts/daily/2026-10-01-ai-interview-daily)

## Today's Focus

Thursday means LLM & Agent Engineering, but the last few weeks have already thoroughly covered "when to upgrade from RAG to agentic RAG" and "context engineering isn't the same as prompt engineering." Today takes an angle candidates rarely prepare for, but that interviewers love to dig into: what actually goes wrong once an agent system is running in production, and how you design defenses for it. This angle shows up often in 2026 interview reports, because more teams have pushed agents past the demo stage into production, and interviewers want to confirm you've actually been burned by an agent in production — not just that you can wire an LLM up to some tools. Today's material fits an onsite system-design deep-dive, and gives you concrete technical detail to reach for when asked "have you operated an agent system in production?"

## Core Concepts

### Three Common Agent Failure Modes, Each Needing a Different Fix

Agent systems rarely fail because the model "isn't smart enough" — they fail in three specific, individually defensible patterns. The first is infinite planning loops: the agent repeatedly calls the same tool or rewrites the same plan without new information, which a step budget (a hard cap on steps per task) and loop detection (comparing recent tool calls and arguments for repetition) can catch. The second is wrong tool selection — as the tool count grows, the model increasingly picks the wrong tool among semantically similar options, which you fix by writing tight, non-overlapping tool descriptions or adding a routing layer, rather than dumping a long list of tool definitions and hoping the model guesses right. The third is malformed arguments — a required field missing, a type mismatch when calling an API — which schema validation plus retry-with-backoff handles, instead of letting one formatting error fail the whole task. What interviewers want to hear is that you diagnose and defend against these three failure modes separately, not a blanket "add try-catch."

### Termination Conditions: max_turns Is Only the First Layer, Not the Whole Defense

A long-running agent can't rely on "stop after N turns" alone, and interviewers often probe what else you'd layer on top. The first layer is a step budget — a hard cap on steps, to catch the worst-case runaway. The second is a cost ceiling — a dollar or token-cost cap, because some failure modes look "reasonable" at every individual step while the total cost still blows up. The third layer, and the one most often missing, is an independent goal-completion check — a separate checkpoint that asks "did this task actually finish?" instead of trusting the agent's own claim that it's done. The reason to stack all three is that they catch entirely different failure types: the step budget catches runaway execution, the cost ceiling catches inefficiency, and goal-completion catches the agent misjudging its own progress.

### Agent Evaluation: Three Independent Metrics, Not a Single Pass/Fail

Traditional software testing checks whether the output is correct; agent evaluation has to go finer-grained, because the process itself is what needs checking. The industry standard splits into three independent metrics: tool selection quality (was the tool chosen at each step the right one — a separate question from whether the overall goal was reached), action advancement (did this step actually move the task toward its goal, which catches an agent "busy but not progressing"), and context adherence (did the agent respect the constraints and instructions it was given, such as staying within an authorized scope of tools). These three can fail independently — an agent might pick the right tool at every step and genuinely be making progress, while still violating a constraint the user set at one particular step. Interviewers want to see that you know "did the task succeed" isn't enough to diagnose which layer broke.

### Guardrail Design: Route by Confidence or Dollar Threshold, Not All-Auto or All-Manual

2026 interviews increasingly ask "how do you decide which agent actions run automatically versus which get routed to a human?" The good answer is a threshold on confidence score or blast radius (especially dollar impact): below the threshold, auto-execute; above it, always route to human review, because a single bad auto-approval can be expensive. The logic behind this design is that "can the model do it" and "should the model be allowed to do it automatically" are two separate questions — the second depends on the cost of being wrong, not the model's raw capability. The same logic applies to sandboxing tool execution: risky operations (writes, deletes, anything sent externally) default to running in an isolated environment with logging, rather than giving the agent the same default permissions as a human engineer.

## Today's Practice Question

### The Question

What are the main failure modes of agents and how do you handle them?

**Source**: A real reported AI Engineer interview prompt (collected in a community-compiled interview question bank) **Difficulty**: Medium **Round**: technical screen / onsite deep-dive

### How to Break It Down

1. **Clarify first**: Ask what this agent's operating scope is — which tools it can call, whether actions are reversible (read-only queries versus writes or spend), and whether there's any existing monitoring or logging. This determines which failure mode to prioritize — a read-only agent and one that can place orders have completely different failure costs.
2. **Build a framework**: Split failure modes into three categories and address each separately — infinite loops / runaway planning, wrong tool selection, malformed arguments — pairing each with a concrete defense, instead of a vague "handle errors properly."
3. **Go deep on the real trade-off**: whether defenses set too aggressively will hurt legitimate tasks — a step budget set too low will cut off a task that genuinely needs many steps. This is where you bring in the three-layer termination design (step budget, cost ceiling, goal-completion) instead of a single hard cap, and evaluation split into tool selection quality / action advancement / context adherence so you can tell which layer actually broke.
4. **Wrap up**: Summarize failure-mode defenses plus termination design plus evaluation metrics as the three pieces of a complete answer, and proactively add that if the agent can write or move money, you'd layer in a confidence- or dollar-threshold guardrail that routes high-risk actions to human review.

### Sample Answer (how to say this in the interview)

> I'd split agent failure modes into three categories, each with its own concrete defense. **The first is infinite loops or runaway planning** — the agent repeatedly calling the same tool with no new information — which I'd catch with a step budget capping the max steps per task, plus loop detection comparing recent tool calls and arguments for repetition. **The second is wrong tool selection** — as tool count grows, the model increasingly picks the wrong tool among similar options, so I'd write tight, non-overlapping tool descriptions and add a routing layer if the tool count is large, rather than making the model guess from a long flat list. **The third is malformed arguments** — I'd validate against a schema before the call and retry with backoff on failure, instead of letting one bad format fail the whole task.
>
> Defending against failure modes isn't enough on its own — I'd also design three layers of termination conditions: a step budget for the worst-case runaway, a cost ceiling for the case where every step looks reasonable but the total cost still blows up, and a goal-completion check that catches the agent misjudging its own progress as "done." For evaluation, I wouldn't just look at task success — I'd split it into tool selection quality, action advancement, and context adherence, because an agent can pick the right tool and genuinely be progressing at every step while still violating a constraint the user gave it at one point, and "did the task succeed" alone won't surface that. If this agent can write data or move money, I'd add one more layer: a confidence or dollar threshold that auto-executes below the line and always routes to human review above it.

### Self-Check

Use this table to check whether your answer covers the key points:

| Checkpoint | Covered? |
|---|---|
| Addressed all three failure modes (infinite loops / wrong tool choice / malformed arguments) separately, each with a concrete defense | |
| Named at least two termination layers, not just max_turns | |
| Split evaluation into tool selection quality / action advancement / context adherence as independent metrics | |
| Addressed the trade-off of overly aggressive defenses hurting legitimate tasks | |
| Described guardrails routing by confidence or dollar threshold between auto-execution and human review | |
| Bonus: mentioned sandboxing risky tool execution in an isolated, logged environment by default | |

## Further Reading

- [AI Engineer Interview Theory Questions (candidate-reported real interview questions)](https://adilshamim8.medium.com/ai-engineer-interview-theory-questions-8bf23b08fafd) — the "Agents and Tool Use" and "Testing and Evaluation" sections are the original source for every core concept today, including tool selection quality / action advancement / context adherence
- [The AI Engineer Interview Playbook](https://dev.to/truongpx396/the-ai-engineer-interview-playbook-45pb) — the original phrasing and reference answer structure for today's practice question, "What are the main failure modes of agents"
- [45+ AI Engineer Interview Questions & Answers (2026 Guide)](https://mckelveyconnect.washu.edu/blog/2026/09/17/45-ai-engineer-interview-questions-answers-2026-guide/) — the discussion of routing auto-execution vs. human review by confidence or dollar threshold, source for the "Guardrail Design" section

## References

- [AI Engineer Interview Theory Questions](https://adilshamim8.medium.com/ai-engineer-interview-theory-questions-8bf23b08fafd) — source of the three failure modes, the three-layer termination design, and the three evaluation metrics
- [The AI Engineer Interview Playbook](https://dev.to/truongpx396/the-ai-engineer-interview-playbook-45pb) — source for "infinite loops, wrong tool choice, malformed arguments, budget/step limits, schema validation, retries with backoff"
- [45+ AI Engineer Interview Questions & Answers (2026 Guide)](https://mckelveyconnect.washu.edu/blog/2026/09/17/45-ai-engineer-interview-questions-answers-2026-guide/) — source for the confidence/dollar-threshold guardrail routing design
