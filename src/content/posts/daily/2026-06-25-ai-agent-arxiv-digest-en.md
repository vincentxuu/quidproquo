---
title: "AI Agent Arxiv Digest — 2026-06-25"
date: 2026-06-25
category: daily
tags: [ai-agent, arxiv, daily, agent-security, agent-evaluation, agent-reasoning]
lang: en
description: "Three papers exploring the boundaries and breakthrough paths of agent capabilities"
tldr: "Three papers exploring the boundaries and breakthrough paths of agent capabilities. Sakana Fugu (Sakana AI) trained a 0.6B orchestrator model that learns to dynamically coordinate a pool of frontier LLMs, achieving public SOTA on SWE-Bench Pro and other benchmarks — the core thesis is that the orchestrator itself can be trained rather than hard-coded by engineers. NatureBench uses 90 real research tasks from Nature journals to ask: can coding agents actually make scientific discoveries? The best configuration only surpasses published SOTA by 17.8%, mainly by translating problems into familiar ML tasks rather than truly inventing new methods. Finally, Rising from the Ashes — six security researchers systematically map how agentic AI can take over five categories of labor-intensive tasks that have long plagued defenders, with 16 case studies as deployment references."
series:
  name: "AI Agent Arxiv Digest"
  order: 32
---
> 🌏 [中文版](/posts/daily/2026-06-25-ai-agent-arxiv-digest)

## Today's Overview

Three papers today all explore the boundaries and breakthrough paths of agent capabilities. Sakana Fugu (Sakana AI) trained a 0.6B orchestrator model that learns to dynamically coordinate a pool of frontier LLMs, achieving public SOTA on SWE-Bench Pro and other benchmarks — the core thesis is that "the orchestrator itself can be trained, rather than having engineers hard-code rules." NatureBench uses 90 real research tasks from Nature journals to ask: can coding agents actually make scientific discoveries? The best configuration only surpasses published SOTA by 17.8%, and it does so by "translating problems into familiar ML tasks" rather than genuine invention. Finally, *Rising from the Ashes* — six security researchers systematically map how agentic AI can take over five categories of labor-intensive tasks that have long plagued defenders, with 16 case studies as deployment references.

## Terms to Know Before Reading


| Plain-language explanation | Term |
|---|---|
| A "conductor model" that doesn't solve problems directly but assigns tasks to other AI models; Sakana Fugu is this type of system | Orchestrator |
| A standardized benchmark for software engineering agents based on real GitHub issues; higher scores mean more real bugs solved | SWE-Bench Pro |
| The percentage by which an agent exceeds the best result reported in the original paper; NatureBench's core metric | Surpass-SOTA rate |
| NatureBench's design: deliberately removes the paper's solution, giving only the problem and data, forcing the agent to invent its own method | Information Firewall |
| An AI system that can receive tasks, plan autonomously, use tools, and execute multi-step workflows; as opposed to a "single-turn chatbot" | Agentic AI |


---


## Paper 1 | Sakana Fugu Technical Report

**Authors**: Yujin Tang, Edoardo Cetin et al. (14 authors, Sakana AI) · **arxiv**: 2606.21228
**Links**: [arxiv](https://arxiv.org/abs/2606.21228) · [alphaxiv](https://www.alphaxiv.org/abs/2606.21228)

### TL;DR

Sakana AI trained a 0.6B orchestrator that "learns to conduct other models," combining the capabilities of existing frontier models like Claude and GPT to outperform any single model, reaching 73.7% on SWE-Bench Pro (publicly the strongest).

### Read Priority

Must-read.
"The orchestrator itself can be learned and trained" directly challenges the mainstream design of LangGraph/AutoGen where "engineers hand-write routing logic" — this is the paper's core thesis, most insightful for agent platform architects.

### Domain Background

Existing multi-agent systems (AutoGen, LangGraph) rely on engineers hard-coding routing rules — task A goes to model A, task B goes to model B — inflexible and hard to maintain. Past attempts at LLM routing with classifiers were only static decisions. Sakana AI published two papers at ICLR 2026 — Trinity and The Conductor — with initial breakthroughs; Fugu is the fully realized system built on that foundation.

### Mid-level Walkthrough


#### Problem

You have 10 LLMs with different strengths (one excels at math, another at code, another at reasoning). How do you get them to "automatically team up to solve any problem" without engineers manually assigning tasks each time?

#### Method

Fugu's core is TRINITY — an ~0.6B parameter orchestrator trained with evolutionary algorithms (CMA-ES, a gradient-free optimization method) that learns to decompose problems into Thinker, Worker, and Verifier roles assigned to different frontier LLMs. Another component, Conductor, uses reinforcement learning to learn optimal natural-language coordination strategies across multiple models. The final product ships as Fugu Mini (low-latency priority) and Fugu Ultra (performance priority), served through an OpenAI-compatible API endpoint.

#### Why It Matters

Fugu Ultra achieves 73.7% on SWE-Bench Pro while also reaching public SOTA on Terminal Bench, LiveCodeBench, GPQA-Diamond, Humanity's Last Exam, and CharXiv Reasoning. This demonstrates that the "small orchestrator combining large models" approach can surpass any single frontier model across multiple hard tasks — an important signal for agent platform architecture: the next foundation model competition may not be about the model itself, but about who has the strongest orchestrator.

### Deep Dive

- The TRINITY orchestrator has only ~0.6B parameters, far smaller than the worker models it directs (typically tens to hundreds of billions of parameters)
- Training: TRINITY uses CMA-ES (evolutionary strategy, no gradients), Conductor uses reinforcement learning — combining two non-traditional training approaches
- Built on two ICLR 2026 papers: "Trinity: An Evolved LLM Coordinator" and "Learning to Orchestrate Agents"
- SWE-Bench Pro 73.7% is Sakana's self-reported number with no independent third-party replication yet **⚠️**
- Fully closed-source, only accessible through Sakana's API, cannot be self-hosted **⚠️**
- Users have reported complex tasks taking 30+ minutes; latency issues remain unresolved **⚠️**
- Relationship to LangGraph/AutoGen: Fugu "learns how to orchestrate," while the other two are "programmed to orchestrate" — a higher level of abstraction
- MCP connection: Fugu can serve as a higher-level coordinator, deciding which worker calls which MCP tools
Learned orchestration is a genuinely new direction, but SWE-Bench Pro 73.7% is only self-reported, fully closed-source, and latency issues persist — claims of "surpassing all public models" should be discounted until independent third-party replication. **⚠️**

### Your Take-aways

- When designing an Agent Router, ask yourself: could this if/else routing logic become a trainable small model? This paper shows the direction is viable
- Wait for third-party SWE-Bench replication results after Sakana's API opens to public beta — that will be the real litmus test for this paper

---


## Paper 2 | NatureBench: Can Coding Agents Match the Published SOTA of Nature-Family Papers?

**Authors**: Yuru Wang, Lejun Cheng, Yuxin Zuo, Kaiyan Zhang (corresponding) et al. (17 authors, Horizon Research, [Frontis.AI](http://Frontis.AI), Tsinghua University) · **arxiv**: 2606.24530
**Links**: [arxiv](https://arxiv.org/abs/2606.24530) · [alphaxiv](https://www.alphaxiv.org/abs/2606.24530)

### TL;DR

Testing coding agents on 90 real research tasks from Nature journals: the strongest agent only surpasses published SOTA by 17.8% — and it does so by "translating problems into familiar ML tasks," not through genuine scientific invention.

### Read Priority

Must-read (for those building coding agent products or agent evaluation).
Reveals the current ceiling of coding agents on "real scientific discovery"; the NatureGym pipeline's engineering design is also worth borrowing directly.

### Domain Background

The SWE-Bench series tests "fixing bugs, implementing features" — software engineering tasks. But what if the agent's goal is serving as a scientific research assistant? Past "AI for science" evaluations mostly asked agents to reproduce code, not to invent methods better than the original paper. NatureBench aims to fill this gap: given real research tasks, can the agent make better discoveries?

### Mid-level Walkthrough


#### Problem

Imagine giving an AI a Nature paper's dataset and task description, but hiding the original solution, then asking: "Can you do better than the original paper?" That's what NatureBench tests.

#### Method

NatureGym is an automated pipeline: screen papers from Nature-family journals → obtain datasets → build containerized environments with Docker → create task packages (task description + data + hidden test set + automated evaluator). The most critical design is the Information Firewall: deliberately removing the original paper's solution from the task description, forcing the agent to invent its own method. Then 10 frontier agent configurations are tested (with web search disabled), using "Surpass-SOTA rate" as the primary metric.

#### Why It Matters

The best configuration achieves 17.8% Surpass-SOTA rate (g > 0.1 threshold). Analysis reveals the agents' primary success pattern is "Methodological Translation": converting research problems into familiar supervised ML problems — relying on "framework translation" rather than "inventing new methods." This finding directly exposes the fundamental limitation of coding agents in AI-for-science scenarios.

### Deep Dive

- 90 tasks spanning 6 scientific domains, 97.1% Python codebase, Docker containerization ensures cross-machine reproducibility
- Each task includes: task description + dataset + hidden test set + automated evaluator — thorough design
- Supported agent backends: Claude Code, Codex, Gemini CLI (all 3 mainstream tools covered)
- Performance varies unevenly across six scientific domains, with some domains significantly below 17.8% (specific per-domain numbers not disclosed) **⚠️**
- Released: benchmark data, NatureGym pipeline code, public leaderboard (with official reproduction)
- Limitations: 90 tasks is a small scale, Nature journals skew toward English-language and openly available datasets **⚠️**
- "Methodological Translation" is currently a qualitative analysis, lacking rigorous quantitative validation **⚠️**
- Compared to SWE-Bench: SWE-Bench tests "fixing existing bugs," NatureBench tests "inventing better methods" — vastly different in difficulty and nature
The NatureGym pipeline engineering and Information Firewall are the biggest highlights; the 17.8% result is sobering. However, 90 tasks is on the small side, domain coverage is limited, and the "Methodological Translation" conclusion lacks quantitative support — overall solid but scale and analysis depth need expansion.

### Your Take-aways

- When designing coding agent evaluations, NatureGym's "containerized task packages + Information Firewall" combination can be borrowed directly — it reveals more about an agent's true invention ceiling than just testing pass@k
- The 17.8% tells you: if a product claims agents can "automatically do scientific research," current frontier models are still far from that, so set user expectations first

---


## Paper 3 | Rising From the Ashes: How Agentic AI is Unblocking Challenges in Cybersecurity

**Authors**: Gabriela F. Ciocarlie, Kathrin Grosse, Somesh Jha (University of Wisconsin), Daryna Oliynyk, Andrew Paverd (Microsoft Research), Christian Wressnegger · **arxiv**: 2606.23138
**Links**: [arxiv](https://arxiv.org/abs/2606.23138) · [alphaxiv](https://www.alphaxiv.org/abs/2606.23138)

### TL;DR

Six security researchers identify five bottlenecks that have long plagued defenders, mapping each to five new agentic AI capabilities. The argument: security tasks that were "too labor-intensive to ever finish" can now be handed off to agents.

### Read Priority

Skim.
This is a position paper (opinion synthesis), with no experimental data. Worth a scan for PMs/engineers building enterprise security copilots or SOC automation; those purely working on agent framework infrastructure can skip.

### Domain Background

Cybersecurity defense has long faced a staffing bottleneck: too many vulnerabilities, too many logs, too much time spent on code audits. Attackers use automated tools for mass-scale attacks, while defenders still rely on manual labor. Previous AI applications in security (malware classification, anomaly detection) were narrow tools, unable to reason across tasks or act autonomously. The emergence of agentic AI has renewed hope for defense-side automation.

### Mid-level Walkthrough


#### Problem

Why is cybersecurity defense so hard? This paper distills five fundamental challenges (C1-C5), essentially: too much data, need for cross-domain reasoning, ambiguous task boundaries, incompatible tools, and knowledge that updates too fast. These five categories make many worthwhile defensive measures "too costly to justify."

#### Method

The authors propose five agentic AI capabilities (A1-A5) to match: natural language understanding (A1), code generation and execution (A2), cross-tool invocation (A3), long-term memory (A4), and multi-step planning (A5). They then use 16 specific security scenario case studies (including supply chain analysis) to illustrate how this mapping plays out in practice.

#### Why It Matters

This paper provides a systematic framework: if you want to bring agentic AI into security defense, C1-C5 are the problems you need to solve, A1-A5 are the capabilities you need to validate. The author lineup is strong (Somesh Jha is a prominent ML security researcher, Andrew Paverd is from Microsoft Research), lending both academic and industry consensus to the framework.

### Deep Dive

- 5 challenges (C1-C5) + 5 capabilities (A1-A5) + 16 case studies — well-structured, suitable as a reference framework for product roadmaps
- Supply chain analysis is one of the case studies, and currently the most mature application direction for agentic AI in security
- Position paper: no experiments of its own, cites existing literature, no new experimental data
- Depth varies across the 16 case studies; some have only a few lines of description without in-depth analysis **⚠️**
- Insufficient discussion of agent failure modes in security scenarios (prompt injection attacks, mass-blocking from false positives) **⚠️**
- The C1-C5/A1-A5 mapping feels too neat, potentially a post-hoc framework assembly **⚠️**
- Relationship to LangGraph/AutoGen: the security scenarios described (log analysis, vulnerability auditing) can all be implemented today with existing frameworks' tool use + RAG
Strong author backgrounds, well-organized framework, but lacks experimental validation. The most serious gap is the near-absence of discussion on "agents being attacked" (prompt injection, adversarial input) and "agents causing mass blocking from false positives" — these are the biggest obstacles to deploying agents in security scenarios.

### Your Take-aways

- When planning SOC automation or enterprise security copilot product roadmaps, the C1-C5 challenge list can serve directly as a starting point for product requirements — map it against which category of problem you're trying to solve
- The supply chain analysis case study is most worth digging into: examine that specific case design in the paper and evaluate whether your agent framework can support similar multi-step reasoning


## References

- [arxiv:2606.21228](https://arxiv.org/abs/2606.21228)
- [arxiv:2606.24530](https://arxiv.org/abs/2606.24530)
- [arxiv:2606.23138](https://arxiv.org/abs/2606.23138)
