---
title: "Agentic OS plus System 1/2/3: Where This AI Architecture Comes From, and What It's Missing"
date: 2026-11-26
category: ai
type: deep-dive
tags: [ai-agent, agentic-os, cognitive-architecture, n8n, multi-agent]
lang: en
tldr: "The pitch goes: Agentic OS is the static architecture, System 1/2/3 is the dynamic architecture, and n8n templates are the execution layer. Each piece has a real source. AIOS and MemGPT define an operating system for agents, SOFAI defines fast and slow solvers with a metacognitive arbiter, and Sophia defines System 3 as a long-term self-supervision layer. Nobody has formally joined the three, and closing the loop requires a feedback path from execution results back to strategy that you have to build yourself."
description: "The papers and official sources behind Agentic OS, System 1/System 2/System 3, and n8n workflow templates, why System 3 has two incompatible definitions, what n8n's official categories actually look like, and the missing piece when you try to close the loop."
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-26-agentic-os-system-123-sources)

A framework has been making the rounds: use an **Agentic OS** as the static architecture for AI applications, **System 1, System 2, and System 3** as the dynamic architecture, and [n8n](https://n8n.io/) templates as the execution layer. Together, the claim goes, they form the most self-consistent, closed-loop architecture for AI applications today.

This post answers two questions. Where does each piece come from? And when you put them together, does the loop actually close? By the end you can check the framework against the original papers, and you'll know which part you have to build yourself when designing an agent system.

## TL;DR

- **The static layer** comes from [AIOS](https://arxiv.org/abs/2403.16971): scheduling, context, memory, and access control are pulled out of agent applications into a shared kernel. The earlier [MemGPT](https://arxiv.org/abs/2310.08560) first treated an LLM's context like operating-system memory.
- **The dynamic layer's** System 1/2 comes from [SOFAI](https://www.nature.com/articles/s44387-025-00027-5): a fast solver answers first, and a metacognitive module decides whether to call a slow solver.
- **System 3** means two different things. In [Sophia](https://arxiv.org/abs/2512.18202) it is a long-term self-supervision layer inside the agent; in Wharton's [Tri-System Theory](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/) it is AI cognition outside the human. Architecture discussions should use the former.
- **n8n's** official template library is organized into a handful of broad categories, not twenty. Its value is making "when to escalate to the expensive model" and "when to hand off to a human" into visible branches.
- No one has formally integrated the three. The loop closes only through a path that feeds execution results back into strategy, and so far only Sophia describes that path formally.

## What the framework says

Stack the three pieces and you get roughly the diagram below. The bottom is resource management shared by all agents, the middle is how each task gets thought through, and the top is whatever keeps the whole system improving over time. n8n is where those rules become executable flows.

```diagram
title: How the three layers fit together
desc: From bottom to top: the Agentic OS kernel, n8n workflows, the fast and slow paths of System 1 and System 2, and System 3's long-term supervision on top. The blue line on the right is execution results feeding back into System 3 to close the loop.
caption: The blue line on the right is the feedback path a closed loop needs, and the part the original sources describe least.
---
<svg viewBox="0 0 420 568">
  <line class="dg-line" x1="200" y1="96" x2="200" y2="184" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="248" x2="200" y2="300" marker-end="url(#arrow)"/>
  <line class="dg-line" x1="200" y1="372" x2="200" y2="424" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M376 336 H400 V60 H376" fill="none" marker-end="url(#arrow-link)"/>
  <rect class="dg-box dg-box--accent" x="24" y="24" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="50" text-anchor="middle" dominant-baseline="central">System 3: long-term oversight</text>
  <text class="dg-sub" x="200" y="74" text-anchor="middle" dominant-baseline="central">Self-model, long-term goals, strategy fixes (Sophia)</text>
  <rect class="dg-box" x="24" y="148" width="160" height="72" rx="6"/>
  <text class="dg-label" x="104" y="174" text-anchor="middle" dominant-baseline="central">System 1</text>
  <text class="dg-sub" x="104" y="198" text-anchor="middle" dominant-baseline="central">Fast, cheap, experience</text>
  <rect class="dg-box" x="216" y="148" width="160" height="72" rx="6"/>
  <text class="dg-label" x="296" y="174" text-anchor="middle" dominant-baseline="central">System 2</text>
  <text class="dg-sub" x="296" y="198" text-anchor="middle" dominant-baseline="central">Slow, costly, stepwise</text>
  <line class="dg-line" x1="184" y1="184" x2="216" y2="184" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="200" y="236" text-anchor="middle" dominant-baseline="central">Metacognition decides when to escalate (SOFAI)</text>
  <rect class="dg-box dg-box--link" x="24" y="300" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="326" text-anchor="middle" dominant-baseline="central">n8n workflows</text>
  <text class="dg-sub" x="200" y="350" text-anchor="middle" dominant-baseline="central">Branches, validation, approvals, model escalation</text>
  <rect class="dg-box dg-box--store" x="24" y="424" width="352" height="72" rx="6"/>
  <text class="dg-label" x="200" y="450" text-anchor="middle" dominant-baseline="central">Agentic OS kernel</text>
  <text class="dg-sub" x="200" y="474" text-anchor="middle" dominant-baseline="central">Scheduling, context, memory, access (AIOS)</text>
  <text class="dg-edge" x="200" y="528" text-anchor="middle" dominant-baseline="central">Static: shared by every agent</text>
</svg>
```

This post is for people who have used an LLM API or n8n and are starting to put several agents into one product. You don't need a background in cognitive psychology; a rough idea of Kahneman's fast and slow thinking is enough.

## The static layer: where Agentic OS comes from

"Agentic OS" is used loosely in industry writing. In research, two papers are cited most.

[MemGPT](https://arxiv.org/abs/2310.08560) (2023) borrowed the operating system's memory hierarchy: the context window is fast but small memory, external storage is slow but large, and the LLM decides what to page in and out. It solved "one agent can't remember a long conversation."

[AIOS](https://arxiv.org/abs/2403.16971) (COLM 2025) scaled the problem up to many agents. It isolates LLM and tool resources from agent applications into a kernel that provides scheduling, context management, memory and storage management, and access control; agents call these services through an SDK. In the paper's experiments, the same agents ran up to 2.1x faster when scheduled by AIOS.

Industry versions mostly keep this layering under different names. [Fluid AI](https://fluid.ai/blogs/the-architecture-of-an-agentic-os) describes it as an enterprise layer managing agents, context, tools, permissions, and decisions; [MindStudio](https://www.mindstudio.ai/blog/agentic-os-architecture-four-patterns-claude-code) splits it into context, shared memory, skill collaboration, and self-learning. [Tencent Cloud's technical write-up](https://cloud.tencent.com/developer/article/2671167) (in Chinese) puts it most plainly: today's Agentic OS is middleware built on top of traditional operating systems like Linux, not a new kernel.

So "static architecture" is an accurate label. This layer answers where resources live and who may use them, not how each task gets thought through.

## The dynamic layer: System 1, System 2, and metacognition

System 1 and System 2 come from Kahneman's *Thinking, Fast and Slow*: System 1 is fast and intuitive, System 2 is slow and effortful. The most complete translation into AI architecture is [SOFAI](https://www.nature.com/articles/s44387-025-00027-5) (Slow and Fast AI, building on [Ganapini et al., 2021](https://arxiv.org/abs/2110.01834)).

SOFAI has three roles:

- **System 1 solvers** rely only on past experience, for example an LLM or another machine-learning model
- **System 2 solvers** do multi-step reasoning, for example a symbolic planner or a search algorithm
- **A metacognitive module** checks whether System 1's answer is good enough, then decides whether to call System 2

The third role is the key. Its choice isn't "S1 or S2" but "S1 only" or "S1, then S2," based on available resources, past experience with each solver, and expected quality. Offline, it does two more things: it updates System 1 from new records, and it re-solves past problems with System 2, compares the results, and adjusts its own arbitration threshold.

That is what the dynamic layer actually looks like: an escalation rule that adapts with experience, not two models sitting side by side.

## System 3 means two different things

"System 3" now has two sources, and their meanings don't fit together.

| | Sophia (Sun et al., 2025) | Tri-System Theory (Shaw & Nave, Wharton) |
|---|---|---|
| What System 3 is | A long-term supervision layer inside the agent | AI cognition outside the human |
| What it covers | Self-model, long-term memory, intrinsic motivation, correcting its own reasoning | How people behave when they hand judgment to AI |
| Subject of study | Agent architecture | Human decision-making |
| Belongs in an architecture diagram? | Yes | No, it describes the user |

[Sophia](https://arxiv.org/abs/2512.18202) argues that current agents are good at perception (System 1) and deliberation (System 2) but lack a persistent upper layer that maintains identity, checks reasoning, and aligns short-term actions with long-term goals. Its answer is a wrapper around any System 1/2 stack, driven by four mechanisms: process-supervised thought search, narrative memory, user and self modeling, and a hybrid reward system. The paper describes itself as primarily conceptual and includes only a compact prototype; in that prototype, reasoning steps for recurring tasks dropped by 80%.

[Tri-System Theory](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/) studies people. When participants could consult an AI at any time, their accuracy rose when the AI was right. When it was wrong, their accuracy fell below that of people with no AI access, while their confidence went up. The authors call this cognitive surrender.

If you write System 3 on an architecture diagram, you mean Sophia's version. The Wharton research belongs in the discussion of how to design human approval steps: it explains why an approval step can't just be a button someone clicks.

## The execution layer: where n8n templates fit

n8n's [official template library](https://n8n.io/workflows/) is organized by use case into a handful of broad categories such as AI, Sales, IT Ops, Marketing, and Document Ops, each with thousands of community templates. The "twenty categories" that circulate come from third-party groupings; [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates), for example, groups by the services each template integrates.

A template on its own is a deterministic flow, closer to System 1's "learned routine." n8n connects to the dynamic layer through the patterns listed in its official post [Agentic AI design patterns](https://blog.n8n.io/agentic-ai-design-patterns):

- **Cost control (model cascading):** a small model handles routine tasks and escalates to a stronger model when needed. This is SOFAI's S1→S2 escalation, except the threshold is a branch condition you write
- **Validation:** when output breaks the schema, retry, have the model correct itself, or route to a human
- **Governance:** approval gates before high-impact actions, execution history for audits, role-based permissions for agents
- **Error recovery:** retries, fallback models, fallback providers, and human escalation last

A second post, [AI Agent Architecture Patterns](https://blog.n8n.io/ai-agent-architecture-patterns), maps topologies such as orchestrator, pipeline, and parallel fan-out onto n8n's sub-workflows and branching nodes.

## A worked example: one refund request

Say support receives a refund request:

1. **Agentic OS layer:** the request arrives, and the kernel determines which order data this support agent may read and whether it may call the refund API. These permissions are set in advance and don't depend on this request.
2. **System 1:** a small model classifies the request as a routine refund with high confidence.
3. **Metacognitive arbitration:** an n8n branch checks the amount and the confidence score. Low amount, high confidence: use System 1's result directly.
4. **System 2:** if the amount is over the threshold or the customer has a dispute history, a reasoning model reads the full conversation and order history and makes a recommendation.
5. **Human approval:** before refunding, send an approval request to Slack. The reviewer should see the reasoning, not just the conclusion.
6. **System 3:** every week, pull the approval outcomes and the cases humans overturned, and adjust the threshold in step 3 and the classification rules in step 2.

Steps 1 through 5 can be built with existing n8n nodes. Step 6 has no ready-made component; that's the part you design yourself.

## Limitations

- **"NCM" has no traceable source.** The framework lists NCM alongside System 1/2/3, but no published paper or article defines it in that sense. The similarly named [Next-Concept Modeling](https://arxiv.org/html/2610.14162v1) is a text-generation method unrelated to agent architecture. Before citing the framework, ask its author what NCM means.
- **The three pieces have never been formally integrated.** AIOS doesn't address fast and slow thinking, SOFAI doesn't address resource scheduling across agents, and Sophia doesn't address workflow tools. "Self-consistent" is a claim about the combination, not a finding of any paper.
- **You have to close the loop yourself.** SOFAI's offline reflection and Sophia's System 3 both include feedback paths, but only in research prototypes; neither n8n nor AIOS ships a component that feeds results back into strategy.

## How to use this

- When you draw your own system, draw the three layers separately: resources and permissions, per-task escalation rules, and long-term adjustment. Any empty layer shows up immediately.
- In n8n, write "when to escalate to the expensive model" as an explicit branch condition instead of leaving it to the agent. That is the cheapest way to put System 1→2 into production.
- Once a week, pull the cases that humans overturned and use them to tune thresholds. That is the smallest workable System 3, and it doesn't have to wait for research prototypes to mature.
- When you cite System 3 in writing or slides, say whether you mean Sophia's or Wharton's definition.

## References

- [AIOS: LLM Agent Operating System](https://arxiv.org/abs/2403.16971) (Mei et al., COLM 2025)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) (Packer et al., 2023)
- [Fast, slow, and metacognitive thinking in AI](https://www.nature.com/articles/s44387-025-00027-5) (SOFAI, npj Artificial Intelligence)
- [Thinking Fast and Slow in AI: the Role of Metacognition](https://arxiv.org/abs/2110.01834) (Ganapini et al., 2021)
- [Sophia: A Persistent Agent Framework of Artificial Life](https://arxiv.org/abs/2512.18202) (Sun et al., 2025)
- [Thinking, Fast, Slow, Artificially: AI and Your Brain](https://executiveeducation.wharton.upenn.edu/thought-leadership/wharton-at-work/2026/05/thinking-fast-slow-and-artificially/) (Wharton, on Shaw & Nave's Tri-System Theory)
- [Thinking — Fast, Slow, and Artificial (SSRN paper)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646)
- [n8n workflow templates](https://n8n.io/workflows/)
- [Agentic AI design patterns](https://blog.n8n.io/agentic-ai-design-patterns) (n8n Blog)
- [AI Agent Architecture Patterns](https://blog.n8n.io/ai-agent-architecture-patterns) (n8n Blog)
- [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates)
- [The Architecture of an Agentic OS](https://fluid.ai/blogs/the-architecture-of-an-agentic-os) (Fluid AI)
- [What Is the Agentic OS Architecture?](https://www.mindstudio.ai/blog/agentic-os-architecture-four-patterns-claude-code) (MindStudio)
- [Agentic OS technical deep dive](https://cloud.tencent.com/developer/article/2671167) (Tencent Cloud Developer Community, in Chinese)
