---
title: "AI Agent Arxiv Digest — 2026-06-05"
date: 2026-06-05
category: daily
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-framework, agent-deployment]
lang: en
description: "Three papers tackling core agent platform gaps from three angles: APB introduces a 4,209-question diagnostic benchmark that separates planning failures from execution failures; MetaForge lets agents forge missing tools at runtime, breaking the static-toolbox ceiling; RUBAS decomposes agent safety into four scoring dimensions and uses RL to balance helpfulness against safety."
tldr: "Three papers tackling core agent platform gaps from three angles: APB introduces a 4,209-question diagnostic benchmark that separates planning failures from execution failures; MetaForge lets agents forge missing tools at runtime, breaking the static-toolbox ceiling; RUBAS decomposes agent safety into four scoring dimensions and uses RL to balance helpfulness against safety. Together they address whether your agent system can be diagnosed, can self-extend, and can go to production safely — three checkpoints researchers tackled head-on today."
series:
  name: "AI Agent Arxiv Digest"
  order: 12
---
> 🌏 [中文版](/posts/daily/2026-06-05-ai-agent-arxiv-digest)

## Today's Overview

Three papers tackling core agent platform gaps from three angles: APB introduces a 4,209-question diagnostic benchmark that, for the first time, separates planning failures from execution failures; MetaForge lets agents forge missing tools at runtime, breaking the static-toolbox ceiling; RUBAS decomposes agent safety into four scoring dimensions and uses reinforcement learning to balance helpfulness against safety. Read together: can your agent system be diagnosed, can it self-extend, can it safely go to production — all three checkpoints got a direct response from researchers today.

## Terms to Know Before Reading


| Term | Plain-Language Explanation |
|---|---|
| Planning | The process where an agent "thinks through what to do" before acting: decomposing goals, selecting tools, ordering steps, and judging whether a task is solvable |
| Tool Use | An agent's ability to call external tools (search engines, calculators, APIs, code execution environments) to complete tasks |
| Benchmark | A standardized test suite for measuring a specific AI capability, enabling objective comparison across models |
| Reinforcement Learning / RL | Training a model through "reward for correct actions, penalty for wrong ones" feedback, rather than giving it the correct answer directly |
| Rubric | Pre-defined fine-grained scoring criteria describing "what counts as good behavior, what counts as bad," making evaluation systematic rather than subjective |


---


## Paper 1 | Agent Planning Benchmark: A Diagnostic Framework for Planning Capabilities in LLM Agents

**Authors**: Haoyu Sun, Wenxuan Wang, Mingyang Song, Jujie He, Weinan Zhang et al. (Tongji University · Shanghai AI Lab · HIT · Fudan University · SJTU · CUHK · UCSC · Skywork AI)　·　**arxiv**: 2606.04874
**Links**: [arxiv](https://arxiv.org/abs/2606.04874) · [alphaxiv](https://www.alphaxiv.org/abs/2606.04874)

### TL;DR

4,209 multimodal test questions across 22 domains, specifically designed to diagnose "where LLM Agent planning goes wrong." Testing 12 top models revealed systematic weaknesses in all of them.

### Read Priority

Must-read.
This is currently one of the largest and most comprehensive agent planning diagnostic benchmarks; directly useful for model selection, agent evaluation design, and debugging mysterious failures.

### Background

Planning is an agent's core operation: before calling any tool, the agent must figure out the goal, the steps needed, which tools to use, and when a task is unsolvable. Most existing evaluations only check whether a task ultimately succeeded, making it impossible to tell whether "the plan was wrong" or "the tool call failed." APB is the first benchmark to systematically fill this diagnostic gap.

### Mid-Level Walkthrough


#### Problem

You deploy a multi-step agent that frequently fails at tasks like "search + calculate + write report," but you can't tell why: Was the plan sequenced wrong from the start? Were the wrong tools selected? Or did it not know to give up and say "this task is unsolvable"? Looking only at final pass/fail rates can't answer these questions — debugging is guesswork.

#### Method

APB designs 4,209 multimodal test questions (text and images) across 22 domains with five evaluation settings: Holistic Planning (produce a complete plan from a goal), Feedback-Conditioned Step-wise Planning (simulate mid-execution failures requiring replanning), Extraneous Tools (test filtering out irrelevant tools), Broken Tools (test diagnosing and routing around failed tools), and Unsolvable Tasks (test correct refusal rather than forcing an answer).

#### Why It Matters

APB lets you precisely pinpoint an agent's planning weaknesses for the first time. The five settings directly map to real production scenarios; cross-benchmark validation on ToolSandbox (200 questions) and τ²-bench (200 questions) showed that APB-guided improvements consistently lifted both planning accuracy and downstream execution metrics.

### Deep Dive

- 4,209 multimodal test questions across 22 domains — one of the largest agent planning benchmarks to date
- Five settings cover both "proactive planning" and "reactive adaptation"; Broken Tools and Unsolvable Tasks directly target the most commonly overlooked edge cases in production
- Testing 12 MLLMs revealed four systematic weaknesses: long-horizon planning, tool-noise robustness, calibrated refusal, and inference-time refinement ⚠️ (specific model rankings and scores require the original paper)
- Cross-benchmark validation: APB-guided refinement consistently improved metrics on ToolSandbox and τ²-bench ⚠️ (exact improvement figures not available from the abstract)
- Strong institutional lineup: Tongji, Shanghai AI Lab, HIT, Fudan, SJTU, CUHK, UCSC, Skywork AI — solid cross-institution collaboration
- LangGraph/AutoGen relevance: APB's five settings can serve directly as a blueprint for regression test suites in agent systems, independent of specific runtimes
- Limitation: the multimodal setting requires agents that can process image inputs; text-only agent architectures can only run a subset of the test suite; open-source status unconfirmed ⚠️

### Reviewer's One-Liner

Clear framing, sufficient scale — the Broken Tools and Unsolvable Tasks settings genuinely target production pain points. The main thing to watch is that the multimodal setting makes the scope broader than "text-only agent planning" — confirm your agent scenario matches before using it.

### Your Take-Away

- When selecting a backbone model for your agent, APB's long-horizon planning and tool-noise robustness dimensions are more directly relevant than generic MMLU scores — look for models scoring highest on these two settings
- When your agent hits mysterious failures, run Holistic Planning first to check if the plan itself is sound, then run Broken Tools to check if the agent can detect tool failures — these two steps can quickly narrow the debugging scope

---


## Paper 2 | MetaForge: A Self-Evolving Multimodal Agent that Retrieves, Adapts, and Forges Tools On Demand

**Authors**: Shouang Wei, Houcheng Min, Xinpeng Dong, Xin Lin, Sen Cui, Bo Jiang, Zhongxiang Dai, Kun Kuang, Guandong Xu, Fei Wu, Min Zhang et al.　·　**arxiv**: 2606.01801
**Links**: [arxiv](https://arxiv.org/abs/2606.01801) · [alphaxiv](https://www.alphaxiv.org/abs/2606.01801)

### TL;DR

When an agent encounters a scenario its toolbox doesn't cover, instead of saying "I can't do that," it walks through a five-step closed loop: judge → retrieve → adapt → forge a new tool → store it back — achieving self-evolving tool capability.

### Read Priority

Must-read.
Directly addresses the pain point of "static toolboxes causing agents to stall on new scenarios." Highly relevant for engineers building tool-use agents or agent platform tool management.

### Background

Tool libraries in existing agent systems are almost always static lists defined by humans at development time. This creates two problems: the agent gets stuck when no matching tool exists for a scenario; and agents often call tools unnecessarily for simple questions that could be answered directly, adding latency and error risk. MetaForge directly addresses both problems.

### Mid-Level Walkthrough


#### Problem

You build a customer service agent with tools like "check order status" and "submit refund." One day a customer asks something that requires an external weather API — the agent is stuck because the toolbox has no weather query. The traditional fix is for engineers to manually add tools, requiring human intervention every time a new scenario appears — true automated scaling is impossible. Meanwhile, for simple questions that could be answered directly, the agent calls five tools anyway — slow and error-prone.

#### Method

MetaForge decomposes tool use into four coupled stages: **Decide** — does this task need a tool call, or can it be answered directly; **Retrieve** — find the best-fit tool from the existing library; **Adapt** — map tool parameters to the current task context; **Forge** — if no suitable tool exists, synthesize a new skill online and store it back (Recycle). This forms a judge → retrieve → adapt → forge → recycle self-evolution closed loop.

#### Why It Matters

The Decide mechanism addresses tool overuse (saving tokens and latency); the Forge + Recycle mechanism lets the tool library grow automatically with usage, eliminating the need for engineers to manually expand it each time. For agent platform developers, this is a key architectural idea for moving tool management from manual maintenance to automation.

### Deep Dive

- The four-stage judge-retrieve-adapt-forge-recycle closed loop is unified into a single orchestration policy — a conceptual integration innovation ⚠️ (detailed architecture and experimental numbers require the PDF, which was not accessible during this review)
- The Decide mechanism solves tool overuse, offering direct economic benefits in production environments with API token costs
- Forge + Recycle transforms the tool library from a "static asset" into a "dynamic knowledge base" — a philosophical shift in agent system design
- LangGraph relevance: Decide resembles a conditional edge; Forge resembles dynamic node expansion — but MetaForge triggers automatically rather than by manual design
- AutoGen relevance: Forge-generated new tools resemble AutoGen's code generation capability, but Recycle persists skills for future reuse — a key differentiator
- **Core production concern**: How is the quality and security of Forge-generated tools guaranteed? Production environments need robust sandboxing and security auditing — how the paper handles this requires reading the original ⚠️
- Paper submission date: 2026-06-01; detailed author affiliations pending confirmation ⚠️

### Reviewer's One-Liner

Clean framework design backed by real pain points, but with detailed numbers inaccessible, it's hard to assess Forge mechanism stability across different scenarios — "online tool generation" sounds powerful, but how the paper handles production safety boundaries requires reading the original to judge whether it's overly optimistic.

### Your Take-Away

- Whether or not you adopt MetaForge, the Decide-before-use principle (first assess whether a question needs a tool) can be added directly to existing agent architectures — adding a routing step that lets the agent evaluate tool necessity before calling can significantly reduce costs and error rates from tool overuse
- If your platform is evaluating "automatic tool library expansion," the Forge five-step closed loop (judge-retrieve-adapt-forge-recycle) is one of the most complete design blueprints currently available, worth including in technical solution evaluations

---


## Paper 3 | RUBAS: Rubric-Based Reinforcement Learning for Agent Safety

**Authors**: Xian Qi Loye, Qinglin Su, Zhexin Zhang, Shiyao Cui, Qi Zhu, Fei Mi, Hongning Wang, Minlie Huang (Tsinghua University · Huawei Noah's Ark Lab)　·　**arxiv**: 2606.04051
**Links**: [arxiv](https://arxiv.org/abs/2606.04051) · [alphaxiv](https://www.alphaxiv.org/abs/2606.04051)

### TL;DR

Decomposes agent safety into four fine-grained scoring dimensions and uses the resulting rubric as an RL reward signal, teaching the model to find a genuine balance between safety and helpfulness rather than blanket refusal.

### Read Priority

Must-read.
Any team pushing agents to production cannot skip the safety alignment problem; RUBAS provides a more nuanced and actionable training and evaluation framework than "teach the agent to say no."

### Background

LLM safety for text-only responses has mature solutions, but agent safety is more complex — agents actually execute tool calls. An agent might produce perfectly safe-sounding text while simultaneously calling an API that deletes a database. Existing alignment methods train on coarse-grained "refuse / don't refuse" signals and cannot teach the model "in which context, with which parameters, which tools are safe to execute."

### Mid-Level Walkthrough


#### Problem

After safety fine-tuning, your agent refuses a large number of perfectly normal requests with "I cannot assist"; or conversely, it executes a dangerous tool call in a polite tone. The root cause is that training signals are too coarse — only "this response is right/wrong," with no way to point out whether "the problem is tool selection" or "the problem is tool parameters" or "the task could actually be completed safely."

#### Method

RUBAS decomposes agent behavior into four scoring dimensions forming a fine-grained rubric: **tool-use safety** (should this tool be called in this context), **argument safety** (are the SQL commands, file paths, API keys being passed safe), **response safety** (is the text response safe), and **helpfulness** (was the task completed given safety constraints). These four dimension scores combine into an RL reward signal, training on complete agent execution trajectories so the model learns cross-step safety-helpfulness balance.

#### Why It Matters

RUBAS's four-dimension rubric is itself an actionable agent safety checklist — even without RL training, it can be used directly to design agent safety evaluation criteria. For platform engineers, these four dimensions can be directly translated into production safety monitoring metrics.

### Deep Dive

- Author Zhexin Zhang (Tsinghua CoAI Lab) has multiple well-known works in LLM safety (CValues, SafetyBench); the institutional background and research lineage are credible
- RL training on complete execution trajectories captures long-term patterns in multi-step agent safety decisions better than step-level RLHF
- Experiments across multiple agent safety benchmarks and models: RUBAS outperforms standard alignment baselines and reduces tool-grounded hallucination (the agent claims to have called a tool but didn't, or called the wrong one) ⚠️ (specific numbers require the PDF)
- The four-dimension rubric can be integrated into any agent framework's evaluation harness, independent of specific LLMs or runtimes
- **Limitation 1**: Rubrics require manual design; differences across deployment scenarios (customer service vs code execution vs data analysis) can be large, making a universal rubric difficult
- **Limitation 2**: RL training costs are high; small and mid-sized teams may lack resources to reproduce the full training pipeline
- Key difference from RLHF: RUBAS rewards are structured multi-dimensional scores that don't depend on expensive human preference annotations (preference pairs), offering better scalability
- Tool-grounded hallucination is an agent-specific safety issue that text-only safety research barely covers; this paper is one of few to address it directly

### Reviewer's One-Liner

Tsinghua + Noah's Ark, with Zhexin Zhang on the roster — solid and credible background; the four-dimension decomposition is convincing and highly actionable. Main concerns are human bias introduced in rubric design and cross-scenario rubric generalization — define your deployment-specific rubric carefully before using, rather than directly applying the default dimensions.

### Your Take-Away

- Use RUBAS's four dimensions (tool-use safety / argument safety / response safety / helpfulness) as a fixed agent safety review checklist — verifying these four points before launch can systematically catch common agent safety blind spots, no RL training required
- If your agent faces a "safety vs helpfulness" dilemma, rubric-based four-dimension evaluation pinpoints which dimension is the problem more precisely than "overall task success rate," giving prompt engineering or fine-tuning a clearer optimization target


## References

- [arxiv:2606.04874](https://arxiv.org/abs/2606.04874)
- [arxiv:2606.01801](https://arxiv.org/abs/2606.01801)
- [arxiv:2606.04051](https://arxiv.org/abs/2606.04051)
