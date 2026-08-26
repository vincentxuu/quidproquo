---
title: "AI Agent Arxiv Digest — 2026-05-29"
date: 2026-05-29
category: daily
tags: [ai-agent, arxiv, daily, agent-rag, agent-framework, agent-deployment]
lang: en
description: "Three papers tackle 'how to make agentic AI work better' from three angles: the first (UIUC × Intel) profiles real agent workloads and finds the bottleneck is KV-cache management, not long prompts; the second (PwC) runs controlled experiments challenging the RAG-first default, showing grep often beats vector search in agent loops"
tldr: "Three papers tackle 'how to make agentic AI work better' from three angles: the first (UIUC × Intel) profiles real agent workloads and finds the bottleneck is KV-cache management, not long prompts; the second (PwC) runs controlled experiments challenging the RAG-first default, showing grep often beats vector search in agent loops; the third (Microsoft Research) open-sources a complete agent training framework that lets the community train same-tier SOTA agents without relying on closed-source APIs."
series:
  name: "AI Agent Arxiv Digest"
  order: 5
---
> 🌏 [中文版](/posts/daily/2026-05-29-ai-agent-arxiv-digest)

[!callout icon="📌" color="blue_background"]
## Today's Overview

Three papers tackle "how to make agentic AI work better" from three angles: the first (UIUC × Intel) profiles real agent workloads and finds the bottleneck is KV-cache management, not long prompts; the second (PwC) runs controlled experiments challenging the RAG-first default, showing grep often beats vector search in agent loops; the third (Microsoft Research) open-sources a complete agent training framework that lets the community train same-tier SOTA agents without relying on closed-source APIs.

## Key Terms Before You Read


| Term | Plain-English Explanation |
|---|---|
| ReAct | Reasoning + Acting — an agent loop pattern where the LLM "thinks" then "acts," currently the most mainstream agent architecture |
| KV-Cache | Key-Value Cache — memory that stores intermediate computations during model inference; reusing it avoids redundant computation, critical for long conversations |
| SFT | Supervised Fine-Tuning — adjusting model behavior with labeled data, the starting point for training agents |
| RL | Reinforcement Learning — letting the model learn from task success/failure signals, suited for agent tasks that are hard to densely annotate |
| RAG | Retrieval-Augmented Generation — retrieving relevant content from a knowledge base before feeding it to the LLM alongside the query |


---


## Paper 1｜Agentic AI Workload Characteristics

**Authors**: Yichao Yuan, Nishil Talati (UIUC), Ankita Nayak (Gimlet Labs), Souvik Kundu (Intel)　·　**arxiv**: 2605.26297
**Links**: [arxiv](https://arxiv.org/abs/2605.26297) · [alphaxiv](https://www.alphaxiv.org/abs/2605.26297)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

You thought the agent performance bottleneck was "prompts are too long" — wrong. The real bottleneck is token generation speed and KV-cache management; serving systems need to be redesigned accordingly.
[!callout icon="⭐" color="green_background"]

### Read Priority

Must-read
Any engineer working on LLM serving or agent runtimes should read this: it's the first quantitative characterization report for agentic workloads, with conclusions that directly impact infrastructure choices.
[!callout icon="🧭" color="gray_background"]

### Domain Background

LLM serving systems (e.g., vLLM, SGLang) have long focused on "optimizing prefill (processing long prompts)." But agents are multi-turn — they repeatedly call the model, insert tool results, and the context grows with each iteration. What pressure does this pattern put on serving systems? Before this paper, almost no one had systematically measured it.

### Mid-Level Walkthrough


#### Problem

Traditional LLM call: one long prompt goes in, answer comes out, done in one shot. Agent version: the same task might call the model 20 times, each time carrying all previous conversation. What are the computational characteristics of these 20 calls? How different are they from one long call?

#### Method

The authors used end-to-end tracing infrastructure to record the token composition, cache hit rate, and tool-call patterns at each turn as a ReAct-style agent ran tasks across 5 benchmarks. They tested both reasoning (with chain-of-thought) and non-reasoning variants of Gemma and Qwen models.

#### Why It Matters

- **Agentic ≠ long-prompt**: With effective context caching, most input tokens are reused from the previous turn — overall execution is dominated by decode (generating new tokens), not prefill (processing input)
- **Tool calls have temporal structure**: Agent tasks skew toward "read/explore" early and "execute/write" later — meaning serving systems' KV-cache policies need to be task-phase-aware
- **Long-lived KV-cache is a hard requirement**: As context grows, KV-cache cannot be casually evicted, or repeated prefill becomes extremely wasteful

### Deep Dive

- Tested on 5 agentic benchmarks across reasoning/non-reasoning models (Gemma, Qwen); the paper does not fully list all benchmark names and task counts ⚠️
- The "decode-dominated" conclusion assumes effective context caching is in place; without KV-cache reuse in the serving stack, prefill can still be expensive ⚠️
- The "read-early, write-late" temporal pattern of tool calls has direct implications for cache eviction policy design (don't evict KV built during early task phases)
- Framework connection: LangGraph / AutoGen message history accumulation is the real-world source of long-lived KV-cache; vLLM prefix caching and SGLang RadixAttention are the corresponding technical solutions
- Adoption barrier: the paper gives directional conclusions but no open-source tracer — engineers need to validate on their own serving stack
- Related work this week: 2605.26289 (Stateful Inference for Low-Latency Multi-Agent Tool Calling) is worth reading alongside
[!callout icon="🧐" color="purple_background"]

### Reviewer's One-Liner

The right question asked, a valuable direction, but the current results are high-level and lack details for direct reproduction or quantitative comparison — more of a signpost than a complete systems paper; directional conclusions are strong, but specific numbers should be interpreted cautiously.
[!callout icon="🎬" color="orange_background"]

### Your Take-Away

- When choosing an LLM serving framework, first check whether it has prefix caching / KV-cache reuse — this paper tells you it's not an "optional feature" but a necessity for agentic scenarios
- When designing your agent's context truncation / summarization strategy, consider that "early-task content is more worth keeping in cache than late-task content" — a temporal structure insight

---


## Paper 2｜Is Grep All You Need? How Agent Harnesses Reshape Agentic Search

**Authors**: Sahil Sen, Akhil Kasturi, Elias Lumer, Anmol Gulati, Vamse Kumar Subbiah (PricewaterhouseCoopers US)　·　**arxiv**: 2605.15184
**Links**: [arxiv](https://arxiv.org/abs/2605.15184) · [alphaxiv](https://www.alphaxiv.org/abs/2605.15184)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

When searching for information inside an agent loop, plain grep (string matching) often outperforms vector search (semantic search) — but what really determines the outcome is which harness you use, not just the search method.
[!callout icon="⭐" color="green_background"]

### Read Priority

Must-read
For any engineer adding RAG to an agent, this is a direct challenge: your vector database may not be the best solution, and this paper has quantitative evidence.
[!callout icon="🧭" color="gray_background"]

### Domain Background

RAG (Retrieval-Augmented Generation) is the current mainstream agent memory approach: chunk documents, embed them as vectors, search by semantic similarity. But queries in agent loops are often precise fact lookups, not semantically fuzzy questions — in such scenarios, does "fuzzy semantic matching" actually beat "exact string search (grep)"? This paper tests it head-on.

### Mid-Level Walkthrough


#### Problem

Imagine an agent reviewing long-term conversation logs, looking for "the contract amount the client mentioned last Friday." Should it use vector search (find semantically similar passages) or grep (search for keywords directly)? Does the answer change across different agent runtime environments (Claude Code, Gemini CLI, custom harness)?

#### Method

The authors took 116 questions from LongMemEval (a benchmark testing agent memory in long conversations), paired them with grep and vector search as tools, and tested across four harness environments: their custom Chronos, Claude Code, OpenAI Codex CLI, and Gemini CLI. They also compared "inline results (fed directly to the LLM)" vs. "file-based results (written to a file for the LLM to read)."

#### Why It Matters

1. **Grep wins in most scenarios**: Across all harness × model combinations, inline grep accuracy was higher than inline vector search, sometimes by a significant margin
1. **The harness itself sets the accuracy ceiling**: Even with the same search method, Claude Code vs. Gemini CLI vs. Chronos can perform very differently, showing that the harness's tool output format has substantial impact
1. **Counterexamples exist**: On Gemini CLI Pro, vector search performed better, showing the conclusion is harness-dependent — you can't make a blanket rule

### Deep Dive

- Experiment sample: 116 questions from a LongMemEval subset — a small sample size, so conclusions should be interpreted cautiously ⚠️
- Codex experiment data is incomplete; the paper acknowledges "scaling-related conclusions are conditional" ⚠️
- The four harnesses each use different LLMs, making model effects and harness effects hard to fully disentangle ⚠️
- Why grep wins: LongMemEval is dominated by factual questions (exact numbers, names), which is lexical search's sweet spot; semantically complex questions might yield different conclusions
- Inline vs. file-based presentation matters significantly: how tool output is "shown to the LLM" is itself a critical design decision
- Challenge to the LangChain / LangGraph ecosystem: the current default is a vector store, and this paper provides a systematic counterexample
- The Chronos harness is described in the paper; Claude Code, Codex CLI, and Gemini CLI are third-party tools
[!callout icon="🧐" color="purple_background"]

### Reviewer's One-Liner

An interesting question that challenges industry defaults, but the 116-question sample is too small, Codex data is missing, and models aren't uniformly controlled — the generalizability of conclusions remains in question. A valuable negative result worth paying attention to, but not grounds to "stop using vector search."
[!callout icon="🎬" color="orange_background"]

### Your Take-Away

- If your agent primarily queries precise facts (contract amounts, specific dates, names), try adding a grep/BM25 path alongside your RAG pipeline — A/B test before deciding whether to replace
- When designing agent tools, don't just optimize the search algorithm — how tool results are "presented to the LLM" (inlined into context vs. written to a file) is itself an accuracy-affecting design decision

---


## Paper 3｜Orchard: An Open-Source Agentic Modeling Framework

**Authors**: Microsoft Research (multiple authors)　·　**arxiv**: 2605.15040
**Links**: [arxiv](https://arxiv.org/abs/2605.15040) · [alphaxiv](https://www.alphaxiv.org/abs/2605.15040)
[!callout icon="🎯" color="yellow_background"]

### TL;DR

Microsoft open-sources a complete agent model training framework that enables small models to reach same-tier open-source SOTA on SWE / GUI / assistant tasks through data distillation + custom RL, without depending on GPT-4o API.
[!callout icon="⭐" color="green_background"]

### Read Priority

Must-read
One of the most complete open-source agent training solutions the community can use today — solid benchmark numbers and framework design worth referencing directly.
[!callout icon="🧭" color="gray_background"]

### Domain Background

To train a model that can actually run agent tasks (rather than just prompting a large API), you face three walls: high-quality trajectory data is hard to obtain, sandbox-capable training environments must be self-built, and RL algorithm design for sparse rewards (knowing only final success/failure) is difficult. Most existing open-source frameworks only handle orchestration (coordinating model tool use), not model training; the best-performing agents (Devin, GitHub Copilot) are all closed-source. Orchard aims to break this status quo.

### Mid-Level Walkthrough


#### Problem

You want to run a coding agent on your own cloud without calling GPT-4o API every time. But where does the training data come from? How do you set up the training environment? When the model "almost solves a task but gets stuck on the last step," how do you still learn from the failed trajectory?

#### Method

Orchard has three layers:
1. **Orchard Env**: A lightweight sandbox lifecycle management service that provides reusable environment primitives across task domains
1. **Data distillation pipeline**: Distills 107K trajectories from MiniMax-M2.5 and Qwen3.5-397B, introducing credit-assignment SFT — even when a full trajectory doesn't solve the task, the model still learns from "effective segments"
1. **Balanced Adaptive Rollout RL**: An RL algorithm designed for sparse rewards (only final success/failure), ensuring training stability

#### Why It Matters

All three recipes use small models (30B, 4B) with limited distilled data to produce convincing benchmark numbers, demonstrating that training strategy design matters more than model scale — and the entire stack is open-source.

### Deep Dive

- **Orchard-SWE** (software engineering agent): Qwen3-30B-A3B-Thinking, SWE-bench Verified SFT 64.3% → SFT+RL 67.5%, same-tier open-source SOTA
- **Orchard-GUI** (browser GUI agent): 4B VLM, 0.4K distilled trajectories, WebVoyager 74.1% / Online-Mind2Web 67.0% / DeepShop 64.0% ⚠️ (very few trajectories — overfitting risk)
- **Orchard-Claw** (personal assistant agent): 0.2K synthetic tasks, Claw-Eval pass@3 59.6%; with ZeroClaw harness rises to 73.9% pass@3
- Distillation source models (MiniMax-M2.5, Qwen3.5-397B) are not open-source, making the data distillation stage hard to fully reproduce ⚠️
- Credit-assignment SFT is the most technically significant contribution: it solves the "partial credit" training problem in long-horizon tasks, distinct from the traditional filter-then-SFT approach
- The 0.4K / 0.2K ultra-small data numbers are impressive, but these are results from fine-tuning on specific benchmarks — generalization ability remains to be validated ⚠️
- Orchard Env's sandbox lifecycle primitives design offers direct architectural reference for teams building their own agent training infrastructure
- Open-source repository: [github.com/microsoft/Orchard](http://github.com/microsoft/Orchard)
[!callout icon="🧐" color="purple_background"]

### Reviewer's One-Liner

A solid engineering contribution: benchmark numbers are convincing, credit-assignment SFT is a genuinely novel idea, and the framework design is pragmatic. The closed distillation source models dock points on "fully reproducible" — but in a landscape where open-source agent training frameworks are scarce, this is still the most bookmark-worthy paper of the week.
[!callout icon="🎬" color="orange_background"]

### Your Take-Away

- If your team wants to self-train a coding agent to break free from API dependency: Orchard-SWE's pipeline (distillation → credit-assignment SFT → sparse RL) is the most complete open-source blueprint available — go directly to [github.com/microsoft/Orchard](http://github.com/microsoft/Orchard)
- If you're designing agent training infrastructure: Orchard Env's sandbox lifecycle primitives architecture is worth studying — the "reusable sandbox management across task domains" problem it solves is one of the most painful engineering challenges in building training infrastructure


## References

- [arxiv:2605.26297](https://arxiv.org/abs/2605.26297)
- [arxiv:2605.26289](https://arxiv.org/abs/2605.26289)
- [arxiv:2605.15184](https://arxiv.org/abs/2605.15184)
- [arxiv:2605.15040](https://arxiv.org/abs/2605.15040)
