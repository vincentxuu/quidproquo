---
title: "AI Agent Arxiv Digest — 2026-08-27"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today puncture three separate blind spots in agent tool-calling: models that write tools and models that use them are disconnected from each other, parallel tool calls that ignore resource limits, and early context in multi-turn conversations getting silently overwritten when the next action is generated"
tldr: "SMITH trains a single 4B model to both write and use its own tools, hitting 79.8% on 13 procedural reasoning tasks and transferring zero-shot to visual QA; PeakBench shows agents with strong logical planning often ignore resource limits when calling tools in parallel, causing avoidable overload; OODA-Tool splits 'tracking state' from 'taking action' into four stages, improving task success rate by up to nearly 7 points across the Qwen3 family, with smaller models benefiting the most"
series:
  name: "AI Agent Arxiv Digest"
  order: 95
---

> 🌏 [中文版](/posts/daily/2026-08-27-ai-agent-arxiv-digest)

## Today's Overview

All three papers today converge on one point: completing a task doesn't mean the tool-calling step behind it is actually reliable. SMITH blames the training setup — the model that writes a tool and the model that uses it have long been two disconnected roles, and the writer never has to test whether its own tool actually works. PeakBench blames runtime execution — even when an agent correctly figures out which tool calls can run in parallel, its actual scheduling often ignores the underlying resource limits. OODA-Tool blames the architecture itself — during multi-turn tool use, "remembering what happened so far" and "deciding the next action" get crammed into the same generation step, and the two compete for the model's attention. Together, the three papers make the same point: tool-calling quality, safety, and consistency are three separate problems that each need their own check. Miss any one of them, and a "task completed" score can be an illusion.

## Terms to Know Before Reading

| Term | Plain-language explanation |
|---|---|
| Schema (Tool Specification) | A structured description of a tool's name, parameters, and types — the model reads this to learn how to call the tool |
| GRPO / DAPO | A reinforcement learning method that updates the model by comparing a batch of candidate answers against each other; DAPO is a variant tuned for training stability |
| Parallel Tool Invocation | An agent sends multiple tool calls at once instead of running them one by one — this cuts latency but can also make them compete for resources simultaneously |
| Peak Load / Resource Burst | Multiple tools competing for limited hardware or API quota at the same time, causing congestion or even an outage |
| State-Action Competition | Within a single generation step, "remembering accumulated information" and "producing the next action" interfere with each other, causing earlier information to be overwritten or ignored |
| OODA Loop | Observe-Orient-Decide-Act, a military decision theory that treats decision-making as a continuously updating feedback loop rather than a direct reaction to the latest information |

---

## Paper 1 | Joint Optimization of Tool Creation and Use for Large Language Model Agents

**Joint Optimization of Tool Creation and Use for Large Language Model Agents**
Zhi Rui Tam, Chieh-Yen Lin, Yun-Nung Chen et al. (Appier AI Research / National Taiwan University) · arxiv: 2608.24571

Links: [arxiv](https://arxiv.org/abs/2608.24571) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24571)

### TL;DR

Reinforcement learning trains "writing tools" and "using tools" into the same policy. A 4B Qwen3 model reaches the best overall score across 13 procedural reasoning tasks at 79.8%, beating an untrained 30B tool-writer, and transfers zero-shot to tabular and visual QA tasks.

### Read Priority

Must-read — it names a structural flaw in existing tool-creation agents (the writer and the user are disconnected) and offers a trainable fix instead of relying on prompt engineering alone.

### Background

Earlier approaches to letting an agent build its own tools, like LATM, simply prompted a frozen LLM to generate a tool on the spot, with no training optimization for tool quality. More importantly, the model that writes the tool and the model that uses it are usually two separate roles — a strong model writes, a weak model uses — and the writer is never required to use its own tool. It has no incentive to write a clear schema.

### Mid-level Walkthrough

- **Problem**: Imagine asking a skilled engineer to write API documentation for a newcomer. The engineer hands it off without ever testing the API themselves — so the newcomer discovers the parameter descriptions are vague and the behavior doesn't match expectations.
- **Method**: SMITH (Schema-grounded Multi-task Iterative Tool Honing) makes the same model handle both a "build task" — writing a tool, including Python code and a JSON schema, from a few examples — and a "use task" — calling that tool to answer a question while seeing only the schema, not the code. Three independent rewards (execution correctness, an LLM judge's quality score, and format consistency) separately correct schema errors and code errors as two distinct failure modes. The judge model periodically syncs its weights from the training policy rather than sharing live weights, avoiding the circular problem of a model grading itself.
- **Why it matters**: Because the model that writes the tool also has to use it, a vague schema costs it points directly on the use task. That feedback loop is something a purely prompt-based approach can't produce.

### Deep Dive

- After SMITH training, the 4B Qwen3 model reaches a 79.8% macro-average accuracy on held-out tests across 13 Reasoning-Gym procedural reasoning tasks — the highest score of any method tested, beating an untrained 30B-A3B tool-writer ⚠️ (author-reported, pending independent replication)
- Zero-shot transfer scores 40.4 on TabMWP-Hard and 42.6 on GQA visual QA (+7.6 points over the best inference-time baseline on the same backbone), despite never seeing tabular or visual data during training
- Tools written by the 4B policy let a frozen 350M model (LFM-2.5-350M) match the level of a 30B tool-writer
- Training uses DAPO, a clip-higher variant of GRPO, to stabilize entropy and avoid reward collapse
- Deployment prerequisite: designing the three rewards requires tasks with exact verifiers, which makes this harder to apply directly to open-ended tasks without a ground truth
- Limitation: validated only on procedural reasoning and a small set of transfer tasks; more complex multi-step agentic workflows remain uncovered

### Reviewer's One-liner

Forcing quality feedback by requiring the same model to write and use its own tool is a clever training-signal design, and the 79.8% result is solid; but relying on exact verifiers means the validated scope is still limited to tasks with a clear right answer.

### Your Take-aways

- If you're building a system where agents generate their own tools or plugins: SMITH's "the writer must also be the user" design is currently the most direct, workable quality-feedback mechanism — cheaper than pure prompt generation followed by manual review
- If you're training a small model for agentic tasks: the path of "a strong model generates tools, a small model applies them directly" is worth considering — you don't need to train a large model for every task

---

## Paper 2 | PeakBench: Benchmarking Resource-Aware Tool Invocation in LLM Agents

**PeakBench: Benchmarking Resource-Aware Tool Invocation in LLM Agents**
Zhi-Kai Chen, Xu-Xiang Zhong, Song-Yan Li et al. (Nanjing University) · arxiv: 2608.24509

Links: [arxiv](https://arxiv.org/abs/2608.24509) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24509)

### TL;DR

Existing agent benchmarks only check whether the task got done. PeakBench separately evaluates "logical planning" and "physical scheduling," and finds that agents that correctly identify which tool calls can run in parallel often still ignore resource limits at execution time, causing avoidable overload.

### Read Priority

Must-read — if your agent system actually calls multiple tools in parallel, whether MCP tools, internal APIs, or third-party services, this paper identifies a systematic risk that existing benchmarks don't test at all.

### Background

Existing tool-calling benchmarks like ToolBench and APIBank mostly test whether the agent picked the right tool, got the parameters right, and completed the task, almost always in a sequential-execution environment. But in real deployments, agents send multiple tool calls in parallel to cut latency, and those calls can simultaneously compete for limited hardware or API quota, causing a resource spike. Existing benchmarks don't measure this dimension at all.

### Mid-level Walkthrough

- **Problem**: Imagine an agent that needs to call three resource-heavy tools at once, say three large image-processing APIs. It correctly determines the three calls are independent and can run in parallel — but it has no idea the backend server can only handle two running at the same time. It fires off all three at once and takes the system down.
- **Method**: PeakBench splits evaluation into two dimensions. Dimension I tests logical planning: can the agent correctly identify which steps depend on each other and which can run in parallel? Dimension II, given the correct dependency structure, tests whether the agent can schedule a safe execution timeline within a limited resource budget. This lets a failure be attributed to a planning error, a scheduling error, or both.
- **Why it matters**: Treating "did the task get done" as a single score gave no visibility into whether an agent bought its speed by sacrificing system stability. PeakBench makes that trade-off measurable and attributable.

### Deep Dive

- Core finding: strong logical-planning ability doesn't imply safe or efficient physical scheduling — the two are separable capabilities ⚠️ (author-reported, pending independent replication)
- Proactively exposing resource information to the agent, instead of letting it call tools blindly in parallel, reduces avoidable resource overload and improves resource utilization
- Benchmark construction pipeline: generate executable multi-tool queries with MCP tools → measure actual resource usage of each step in a sandbox → perturb execution order to reverse-engineer the true dependency/parallel structure
- Deployment prerequisite: applying this evaluation requires visibility into each tool's resource usage (memory, API quota, GPU usage, etc.), which is hard to quantify for black-box third-party APIs
- Limitation: current evaluation scenarios are based on synthetic MCP tool queries; real production environments likely have more complex and heterogeneous resource fluctuations
- Code is open source: [github.com/Czzzk/Staggering-the-Peaks](https://github.com/Czzzk/Staggering-the-Peaks)

### Reviewer's One-liner

Separating "logical planning" from "physical scheduling" and using measured resource profiles to make failures attributable is one of the few evaluation designs that addresses the safety of an agent's parallel tool calls rather than just their correctness. But an evaluation built on synthetic workflows still has a gap to close before it reflects the resource heterogeneity of real production environments.

### Your Take-aways

- If your agent platform calls tools in parallel: assume by default that your agent has strong logical planning but weak resource awareness, and add a resource-budget check layer to the architecture instead of assuming the agent will avoid resource conflicts on its own
- If you're designing agent evaluations: PeakBench's approach of splitting evaluation into two dimensions for attribution is worth porting directly into your own internal evaluations — separate "did it get done" from "was the way it got done safe"

---

## Paper 3 | From State to Action: OODA-Tool for Reliable Multi-Turn Tool Use

**From State to Action: OODA-Tool for Reliable Multi-Turn Tool Use**
Rongfeng Guo, Yinxuan Huang, Yusen Wu et al. (Huazhong University of Science and Technology, corresponding author Vincent Tao Hu) · arxiv: 2608.24368

Links: [arxiv](https://arxiv.org/abs/2608.24368) · [alphaxiv](https://www.alphaxiv.org/abs/2608.24368)

### TL;DR

During multi-turn tool use, "remembering what happened so far" and "deciding what to call next" get crammed into the same generation step and end up competing for resources. OODA-Tool borrows the military OODA loop to split the two apart, improving task success rate across the entire Qwen3 0.6B–14B family, with the improvement growing larger for smaller models.

### Read Priority

Skim — directly useful for agent systems that are multi-turn, multi-tool, and need information to accumulate across turns (customer service, order modification). If your use case is mostly single-turn or simple tool calls, the conclusions alone will do.

### Background

Existing approaches like direct function-calling and ReAct handle "tracking the current task state" and "producing the next action" within the same autoregressive generation step. The paper finds this causes "state-action competition": the pressure to quickly produce the next action overwrites or ignores information accumulated over previous turns, so the call ends up using stale or incomplete state.

### Mid-level Walkthrough

- **Problem**: Imagine a ticket-booking agent. In turn 3 you tell it, "no window seat." By turn 7, when it picks your final seat, it has forgotten that constraint — not because it doesn't "know," but because the pressure of generating the next action overwrote that earlier information.
- **Method**: OODA-Tool splits each round of decision-making into four type-checked stages. Observe rebuilds the current task state (goal, entities, constraints, unfinished sub-goals). Orient judges what's currently feasible, across five modes: solvable with available tools, needs clarification, direct reply, recovering from failure, or already complete. Decide chooses the action structure within what Orient allows — a single call, sequential calls, or parallel calls. Act turns that decision into an actual valid tool call or reply. A central controller checks each handoff between stages, so Decide can never force out a tool call when Orient has determined that clarification is needed.
- **Why it matters**: Checking "whether to act" separately from "how to act" keeps constraints accumulated in earlier turns from being accidentally overwritten when the next action is generated — the effect is most visible in tasks where information has to accumulate across many turns.

### Deep Dive

- Across five Qwen3 model sizes — 0.6B / 1.7B / 4B / 8B / 14B — Specialized OODA improves task success rate over the Direct-LoRA baseline by 6.86 / 6.79 / 6.99 / 5.94 / 4.48 points respectively, with smaller models seeing larger gains ⚠️ (author-reported, pending independent replication)
- The improvement is larger on hard and out-of-distribution (OOD) tasks, and smaller on easy tasks or tasks with heavily parallel tool calls
- Test scenarios: ToolDial plus three additional benchmarks, covering multi-turn, multi-tool, and incomplete-information settings
- Trade-off: generating in four separate stages costs more inference than Direct-LoRA's single-pass approach; if your scenario prioritizes single-call latency, Direct-LoRA remains the cheaper option
- Deployment prerequisite: requires redesigning the agent's execution loop to split a single generation into four typed-interface stages, plus a central controller to validate handoffs
- Limitation: the paper itself identifies "executing parallel calls" as the architecture's current main weakness — splitting into stages actually yields limited benefit on tasks that need heavy parallel tool calling

### Reviewer's One-liner

Naming "state-action competition" explicitly and resolving it with the OODA loop's four-stage split is a rare attempt to turn military decision theory into an agent architecture, and the gains on small models are especially practical. But given the latency cost of four-stage generation and the limited benefit in parallel-call scenarios, whether it's worth adopting depends on whether your use case really suffers from cross-turn state accumulation.

### Your Take-aways

- If your agent use case needs to remember constraints across many turns — customer service, order modification, multi-step forms — OODA-Tool's four-stage split is worth considering, especially if you're using a small or mid-sized model
- If your agent use case is mostly single-turn and latency-sensitive: confirm you actually have a state-action competition problem before paying the extra inference latency cost to fix it

---

## Today's Takeaway

I used to think an agent's tool call was done as long as it picked the right tool and filled in the right parameters. Now I realize genuine reliability requires handling three entirely different layers — the quality of the tool itself (who wrote it, and whether the writer can actually use it), resource safety at execution time (whether parallel calls can take down the system), and state consistency across turns (whether earlier information gets overwritten when the next action is generated). Miss any one of these layers, and a "task completed" score can be an illusion.

## References

- SMITH paper (Joint Optimization of Tool Creation and Use for Large Language Model Agents): [arxiv 2608.24571](https://arxiv.org/abs/2608.24571)
- PeakBench paper (Benchmarking Resource-Aware Tool Invocation in LLM Agents): [arxiv 2608.24509](https://arxiv.org/abs/2608.24509), code [GitHub](https://github.com/Czzzk/Staggering-the-Peaks)
- OODA-Tool paper (From State to Action: OODA-Tool for Reliable Multi-Turn Tool Use): [arxiv 2608.24368](https://arxiv.org/abs/2608.24368)
