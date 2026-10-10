---
title: "Reading NTU ML 2026: Context Engineering — Compression, Filtering, On-Demand Loading, and Whether to Hand the Context to the LLM"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-agent, context-engineering]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 3
tldr: "A language model's input is finite, but an agent keeps piling up tool outputs. In week two of ML 2026, Hung-yi Lee splits Context Engineering into three moves: compression (summaries, hard clearing, offloading to files, plus ACON, SUPO, and AgentFold, which make compression smarter), filtering (read only the lines you need, load tools on demand as in MCP-Zero), and finally Agentic Context Engineering, where the LLM decides the next context itself — from Dynamic Cheatsheet and ACE to Recursive Language Models. The most useful idea to take away: a subagent is a form of self-directed compression."
description: "A guide to the first part of the AI Agent unit in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on pages 1–33 of agent_era.pdf: the formal view of Context Engineering, LLM summary vs. Hard Clear, memory offloading, ACON, SUPO, AgentFold, Context-Folding and subagents, SWE-Pruner, Memory Recall, MCP-Zero, Dynamic Cheatsheet, ACE, and Recursive Language Models."
draft: false
glossary:
  - term: "Hard Clear"
    aliases: ["observation masking"]
    definition: "Instead of summarizing, replace older tool outputs with a one-line placeholder (e.g. \"a tool output used to be here\") and keep only the most recent ones."
    context: "The slides contrast it with LLM summary; the cited study finds similar solve rates on SWE-bench at lower cost."
  - term: "Agentic Context Engineering"
    aliases: ["ACE"]
    definition: "Letting the LLM itself generate, reflect on, and curate what goes into the next round's context, instead of fixed human-written rules."
    context: "The slides write it as C(t+1) ← F(C(t), I(t), O(t)) and hand F to the LLM."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-context-engineering)

**This post follows the 3/13 week of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 3 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous post covered [HW1: defending against malicious instructions](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en). Part 1, [Dissecting the Lobster](/posts/ai/2026-09-30-ntu-ml2026-openclaw-anatomy-en), showed that OpenClaw stuffs SOUL.md and MEMORY.md into the system prompt and compresses and prunes conversations. This post takes the next question: **when the context doesn't fit, what stays, what goes, and who decides?**

Official materials used: pages 1–33 of the slide deck [agent_era.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf) (61 pages in total; the second half belongs to the next post), and the lecture video [AI Agent (1/3): Context Engineering basics](https://youtu.be/urwDLyNa9FU) (in Mandarin). Access level is **A3**: slides (pdf/pptx) and the recording are public. This lecture has no quiz or leaderboard attached.

## Course video sources

Video sources were checked against the official course page. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=urwDLyNa9FU
title: Video: AI Agent (1/3): Context Engineering basics
```

Original videos: [Video: AI Agent (1/3): Context Engineering basics](https://www.youtube.com/watch?v=urwDLyNa9FU)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Why Context Engineering

The picture on slide 2 is simple. A human says something, the model calls tool 1, gets tool 1's output, calls tool 2, and so on. Every round, the whole history is fed back in. The model "lives in the present", and **its input length is finite**.

Slide 3 defines Context Engineering as a layer between the world and the model. It chooses what the model gets to see: **not too long, and not too short**.

Slide 4 gives a formal version. The rest of the lecture rewrites these two lines:

- Default: `O_t = LLM(I_t, C_t)`, then `C_{t+1} ← C_t | I_t | O_t`. This round's input and output are simply appended.
- Context Engineering: replace "append" with a function, `C_{t+1} ← F(C_t, I_t, O_t)`.

The three parts of the lecture are three ways to write F: compress, filter, and hand it to the LLM.

## Compression: three basic moves

Slides 5–8 list three basic approaches:

| Approach | How | Cost |
|---|---|---|
| LLM summary | Ask an LLM to summarize a tool output and replace the original with the summary | An extra LLM call; details may be lost |
| Hard Clear | Replace old tool outputs with "[a tool output used to be here]" | Almost free, but the information is gone |
| Offload memory | Write the tool output to `log1.txt`, leave "[see log1.txt]" in the context, and `Read(log1.txt)` when needed | Information survives, but the model must know when to read it |

Slide 6 cites [The Complexity Trap](https://arxiv.org/abs/2508.21433). On SWE-agent with SWE-bench Verified, simply masking old observations costs about half as much as the raw agent. Its solve rate matches LLM summarization and sometimes slightly beats it. The slide also flags a side effect of summarization: trajectory elongation. Slide 7 combines the two. The offloading approach on slide 8 cites [Manus's post on context engineering](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) and [Solving Context Window Overflow in AI Agents](https://arxiv.org/abs/2511.22729).

Slide 10 connects this to memory: when and how to save to the file system, when to load back, and optionally adding graph structure and time. It lists three papers: [A-MEM](https://arxiv.org/abs/2502.12110), [Mem0](https://arxiv.org/abs/2504.19413), and [Memory OS](https://arxiv.org/abs/2506.06326).

**Try this**: open the coding agent you use and see what it does with old tool outputs in a long session. Does it summarize, clear, or write them to a file? Identify which one before you decide whether to tune it.

## Smarter compression: ACON, SUPO, AgentFold

The basic moves are rigid rules. The slides then introduce three methods that optimize compression itself.

**[ACON](https://arxiv.org/abs/2510.00615) (slides 12–14)**: the same task succeeds with the full context but fails with the summarized one. The slides call this Context Collapse. ACON has an LLM compare the two trajectories and write feedback. The feedback updates the guideline for what a summary must keep. Slide 13's example: the summary should preserve credential variables, token state, authentication requirements, and guardrails for protected APIs. The optimization happens in natural-language space, without touching model weights. On slide 14's AppWorld chart, average peak tokens for gpt-4.1 drop by 26%.

**[SUPO](https://arxiv.org/abs/2510.06727) (slide 15)**: put summarization inside RL training. The model writes a summary mid-task and keeps working on the summarized context. The final reward trains both tool use and summarization.

**When to compress (slides 16–17)**: slide 16's headline is blunt: **language models don't like compression (it erases their memory)**. It cites a failure case from [the AgentDiet paper](https://arxiv.org/abs/2509.23586). The system prompt says that on #reflection the model may only call the erase tool. The model keeps digging through Django source instead. [AgentFold](https://arxiv.org/abs/2510.24699) on slide 17 has the model emit `Fold(step 3–4, "web search: Taiwan's highest mountain is Yushan")` at the right moment, folding two steps into one line. The slide notes: **this requires fine-tuning the model**.

## A subagent is self-directed compression

To me this is the most useful idea in the lecture (slides 18–20).

The main agent issues `spawn`. The subagent runs a chain of tool calls in its own context and returns a single `Return: ……`. From the main agent's point of view, the subagent's whole trajectory is **effectively deleted automatically**, leaving only the return value. That is compression, and the agent chose when and what to compress.

The slides cite [Context-Folding](https://arxiv.org/abs/2510.11967). It trains this branch-then-fold behavior with RL, and slide 20 marks two penalties: an overly long main trunk is penalized, and a subagent doing things outside its scope is penalized. The note beside them is worth remembering: **checking only whether the final answer is right is not enough**. If the reward is only the final answer, the model has no reason to learn good delegation.

The site's [Multi-Agent Context Management: Fork vs. Fresh](/posts/ai/2026-09-18-multi-agent-context-isolation-en) covers the same idea from an engineering angle.

## Filtering: read only what you need

Slide 21 starts with two pie charts. In The Complexity Trap's raw agent, observations make up 83.9% of tokens. [SWE-Pruner](https://arxiv.org/abs/2601.16746) counts a coding agent's tool calls and finds Read dominating. In short, **most of the context is eaten by things the agent reads in**.

Slide 22's fix: instead of `Read(log)` dumping the entire log, call `Read(log, "bug fixing")`. A small model trained for this task filters out lines unrelated to the goal first.

Slide 23 returns to OpenClaw. Its system prompt has a Memory Recall rule: before answering, run `memory_search` over MEMORY.md and `memory/*.md`, then use `memory_get` to pull only the needed lines. The slide asks: **why does reading memory need a special tool?** The answer is in the description of `memory_get`: it takes a starting line and a line count. It is a Read with filtering built in.

## Filtering: load tools on demand

Tool descriptions take up context too. Slide 24's example: the GitHub tool set alone needs more than 4,600 tokens.

[MCP-Zero](https://arxiv.org/abs/2506.01056) is presented in two steps (slides 25–26):

1. Don't put every tool in the system prompt; use a search engine to find tools for the task. The catch: the user's query is often too vague to search well.
2. So **let the AI say what it needs**. The model first writes "I need a tool that can…", and that description goes to the search engine.

The slide adds that OpenClaw's SKILLs are also loaded on demand. The site's [OpenClaw documentation guide](/posts/ai/2026-03-28-openclaw-overview-en) has the product details.

## Hand everything to the LLM: Agentic Context Engineering

Slides 27–28 push the formal view one step further. The context `C` splits into `{P, M}`: `P` is what goes into the LLM this round, and `M` is stored outside. Then F itself is handed to the LLM.

The slides walk through three examples:

- **[Dynamic Cheatsheet](https://arxiv.org/abs/2504.07952) (slide 29)**: after each problem, the LLM updates a cheatsheet. The core idea is to **save what will be useful later**: effective strategies, reusable code, key findings.
- **[ACE](https://arxiv.org/abs/2510.04618) (slide 30)**: splits "update the cheatsheet" into three LLM roles, Generator, Reflector, and Curator, producing a Playbook. The Curator outputs **edit instructions** rather than a full rewrite, so repeated rewriting doesn't wear details away.
- **[Recursive Language Models](https://arxiv.org/abs/2512.24601) (slides 31–32)**: most of the context sits on a "hard disk". The LLM sees only metadata and **can write programs** to search and split it, then recursively call itself on pieces. Slide 32 compares GPT-5 and RLM(GPT-5) at input lengths from 8K to 1M. GPT-5 drops as inputs grow on the OOLONG tasks; the RLM curves stay much flatter.

Slide 33 closes with a question mark: **hand everything to the LLM?** The slides don't answer it. My reading: ACON needs paired success and failure trajectories, AgentFold needs fine-tuning, and Context-Folding needs process rewards. Handing F to the LLM doesn't mean humans step away. The human job becomes designing the training signal that teaches the LLM to manage context.

## What this post can and cannot confirm

Confirmed: the structure of slides 1–33, chart titles, and cited sources, plus the title and abstract of every paper above (all checked on arXiv). Video titles and uploaders were checked via YouTube oEmbed.

Not confirmed: I did not transcribe the video, so examples, numbers, and commentary given only verbally are not included. Chart numbers are read from the papers' original figures as shown on the slides; check the papers for experimental conditions.

**Try this**: pick one agent workflow you use most. Estimate how one long task's context splits across system prompt, tool descriptions, tool outputs, and conversation. If tool outputs dominate, try Hard Clear or file offloading first. If tool descriptions dominate, consider on-demand loading.

Further reading on this site: the [Context Engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en), [context compaction in coding agents](/posts/ai/2026-08-25-coding-agent-context-compaction-en), CMU 11-768's [Context Management guide](/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en), and Stanford CS146S's [Context Engineering guide](/posts/ai/2026-08-16-cs146s-context-engineering-en).

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW1: defending against malicious instructions](/posts/ai/2026-09-30-ntu-ml2026-hw1-malicious-instruction-defense-en) | Next: [Interaction between AI agents and their impact on work](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [agent_era.pdf (Core technique of AI agents: Context Engineering)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/agent_era.pdf) (in Mandarin)
- [Video: AI Agent (1/3): Context Engineering basics](https://youtu.be/urwDLyNa9FU) (in Mandarin)
- [The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management (arXiv 2508.21433)](https://arxiv.org/abs/2508.21433)
- [Manus: Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
- [Solving Context Window Overflow in AI Agents (arXiv 2511.22729)](https://arxiv.org/abs/2511.22729)
- [ACON: Optimizing Context Compression for Long-horizon LLM Agents (arXiv 2510.00615)](https://arxiv.org/abs/2510.00615)
- [SUPO: Scaling LLM Multi-turn RL with End-to-end Summarization-based Context Management (arXiv 2510.06727)](https://arxiv.org/abs/2510.06727)
- [Reducing Cost of LLM Agents with Trajectory Reduction (AgentDiet, arXiv 2509.23586)](https://arxiv.org/abs/2509.23586)
- [AgentFold: Long-Horizon Web Agents with Proactive Context Management (arXiv 2510.24699)](https://arxiv.org/abs/2510.24699)
- [Scaling Long-Horizon LLM Agent via Context-Folding (arXiv 2510.11967)](https://arxiv.org/abs/2510.11967)
- [SWE-Pruner: Self-Adaptive Context Pruning for Coding Agents (arXiv 2601.16746)](https://arxiv.org/abs/2601.16746)
- [MCP-Zero: Active Tool Discovery for Autonomous LLM Agents (arXiv 2506.01056)](https://arxiv.org/abs/2506.01056)
- [Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory (arXiv 2504.07952)](https://arxiv.org/abs/2504.07952)
- [Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models (arXiv 2510.04618)](https://arxiv.org/abs/2510.04618)
- [Recursive Language Models (arXiv 2512.24601)](https://arxiv.org/abs/2512.24601)
- [A-MEM (arXiv 2502.12110)](https://arxiv.org/abs/2502.12110), [Mem0 (arXiv 2504.19413)](https://arxiv.org/abs/2504.19413), [Memory OS (arXiv 2506.06326)](https://arxiv.org/abs/2506.06326)
