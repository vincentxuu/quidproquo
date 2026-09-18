---
title: "Where Agent Memory Is Heading in 2026: Files Beat Vectors, Forgetting Just Started"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, trends, context-engineering, dreaming, benchmark, procedural-memory]
series:
  name: "AI Agent 記憶工程"
  order: 9
lang: en
tldr: "In H1 2026, OpenAI, Anthropic, Letta, and LangChain independently chose Markdown files + indexes over vector databases; write permissions shifted back to humans; forgetting mechanisms appeared but nobody implemented Ebbinghaus; Penfield Labs caught 6.4% wrong answers in LoCoMo; three vendors simultaneously adopted 'Dreaming' for offline memory consolidation. Five trends, one conclusion: memory is not a feature — it is an architecture decision."
description: "Five trends shaping agent memory systems in 2026 — from the design-philosophy spectrum and write-permission shifts to forgetting mechanisms, benchmark failures, and the Dreaming convergence — plus practical advice on where to place your bets."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-agent-memory-2026-trends)

This is the tenth post (order 9) in the [AI Agent Memory Engineering series](/posts/ai/2026-09-19-agent-memory-engineering-series-intro), and its finale. The previous nine posts dissected [short-term context management](/posts/ai/2026-08-21-context-full-seven-answers-en), coding-agent and cloud-platform memory designs, open-source framework selection, deep dives into [Mem0](/posts/ai/2026-08-22-mem0-agent-memory-en) and [OpenViking](/posts/ai/2026-08-22-openviking-agent-memory-en), and the attack surface. This post introduces no new systems. Instead, it steps back to survey the field: what is actually happening in 2026, and where should you place your bets.

## Trend 1: Shifting left — files beat vectors

The dominant narrative of 2024–2025 was "vector databases + knowledge graphs will replace the context window." By H1 2026, product decisions went the opposite direction.

OpenAI's Codex Memories and [Agents SDK sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/) store memories as `memories/memory_summary.md`, a `MEMORY.md` index, and `rollout_summaries/` — all Markdown files. Anthropic's [Claude Code auto memory](https://code.claude.com/docs/en/memory) uses `~/.claude/projects/<project>/memory/` plus a `MEMORY.md` index. [Managed Agents memory stores](https://platform.claude.com/docs/en/managed-agents/memory) are collections of text files mounted at `/mnt/memory/<slug>/`. Letta moved from memory tools to git-backed [Context Repositories / MemFS](https://www.letta.com/blog). LangChain's Fleet (formerly LangSmith Agent Builder) uses a `memories/` folder where every update requires user approval.

Four different companies, converging on the same storage format. The reasons are consistent:

1. **Human-readable, human-auditable** — Markdown needs no special tooling to open, understand, or edit
2. **Git-compatible** — version control, code review, diff, revert all work out of the box
3. **Prompt-cache-friendly** — memories sit in the cache prefix; not mutating them mid-session preserves the cache. Per [Anthropic's docs](https://code.claude.com/docs/en/prompt-caching), "dynamically injecting memories every turn breaks the cache" is a design choice they deliberately avoid
4. **Zero additional infra** — no vector database to run, no embedding-model version compatibility to manage

Vector and graph memory haven't disappeared, but they've retreated to "pluggable backend" status. Mem0 survives by integrating into AWS AgentCore, Microsoft Agent Framework, and LlamaIndex. Zep / Graphiti retains a niche thanks to its unique bi-temporal knowledge graph. But if you're building a memory system from scratch today, the industry default is no longer vectors — it's files.

This trend is most visible on the [design-philosophy spectrum](/posts/ai/2026-09-19-agent-memory-engineering-series-intro) — from the far left (CLAUDE.md, human-written git files) to the far right (Cognee, fully automated knowledge graphs), 2026's center of gravity has clearly shifted left.

## Trend 2: Write permissions are returning to humans

The most sensitive operation in a memory system is not retrieval — it's writing. What gets written determines what the agent will "remember" next time, and a wrong memory is more dangerous than no memory — it persistently biases every subsequent inference.

Five independent product decisions in 2026 point the same direction: returning the final step of memory writes to humans.

- **Gemini CLI Auto Memory** ([docs](https://geminicli.com/docs/cli/auto-memory)): the agent drafts memory patches and SKILL.md candidates, places them in a review inbox, and they take effect only after user approval
- **LangSmith Fleet** (2026-01-13 GA): memories are files in a `memories/` folder; every update requires user approval
- **Devin Knowledge Suggestions** ([docs](https://docs.devin.ai/product-guides/knowledge)): auto-suggests Knowledge entries from conversation feedback; user approves before they're written
- **Cursor 1.2** ([changelog](https://cursor.com/changelog/1-2)): added an approval flow for background-generated memories (later, 2.1.17 removed the Memories feature entirely)
- **GitHub Copilot Memory** ([engineering blog](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)): every memory comes with a citation; at read time, JIT validation checks whether the cited code still exists — if not, the memory is skipped

The driver behind all these decisions is the same: memory is a persistent prompt-injection attack surface. The MINJA paper ([2503.03704](https://arxiv.org/abs/2503.03704), NeurIPS 2025) demonstrated that conversation alone can inject memories with >95% success rate. Johann Rehberger's SpAIware attack in September 2024 planted persistent data-exfiltration instructions into ChatGPT's macOS app memory. Automatic writes without a gate give attackers a permanent backdoor.

The industry's current defenses split into two camps:
- **Approval camp**: Gemini CLI inbox, LangSmith Fleet, Devin Knowledge Suggestions — the agent proposes, a human clicks
- **Validation camp**: Copilot's citation + JIT verification — writes aren't blocked, but reads verify whether the source is still valid

Each camp has costs. The approval camp increases cognitive load on humans (inboxes pile up and get ignored). The validation camp depends on citation quality (imprecise citations can't be verified). But both camps agree on one thing: **fully automatic writes are no longer an acceptable default in 2026**.

## Trend 3: Forgetting mechanisms have appeared, but remain crude

In 2025, nearly every memory system could only forget via manual deletion. In 2026, automatic forgetting finally arrived:

| System | Forgetting mechanism | Granularity |
|---|---|---|
| GitHub Copilot | Deleted after 28 days without JIT validation | Per entry |
| OpenAI Codex | `max_unused_days` 30 (configurable 0–365) | Per entry |
| Zep / Graphiti | Bi-temporal expiration (edges have `expired_at`) | Per edge |
| Mem0 | `expiration_date` + ranking decay | Per entry + ranking |
| Anthropic Managed Agents | Versions retained 30 days | Per version |

Progress is clear. But no system has implemented the Ebbinghaus-style decay proposed by the MemoryBank paper ([2305.10250](https://arxiv.org/abs/2305.10250), AAAI 2024) — dynamically adjusting memory strength based on access frequency and spacing. Current forgetting is either "delete after N days" or "delete manually." Nobody has achieved "important things persist longer, unimportant things naturally fade."

This gap is likely the next competitive frontier. Cognitive science has long known that forgetting is a feature, not a bug — appropriate forgetting reduces interference and improves retrieval precision. But engineering it requires tracking access history per memory and applying some decay function to update weights. Under the file-based storage paradigm from Trend 1, that's awkward — filesystems don't natively track access frequency.

## Trend 4: Benchmarks have been gamed to irrelevance

LoCoMo ([2402.17753](https://arxiv.org/abs/2402.17753), ACL 2024) and LongMemEval ([2410.10813](https://arxiv.org/abs/2410.10813), ICLR 2025) are the two most cited benchmarks in agent memory. By 2026, vendor-reported numbers have lost their informational value.

Problem one: **score inflation**. SOTA on LoCoMo in 2025 was 60–70. By 2026, Mem0 self-reports 92.5, Zep self-reports 94.7, EverMemOS self-reports 93.05, and Hindsight self-reports 89.61. Swap the judge model, prompt, or backbone, and scores can shift by 40 points.

Problem two: **the benchmarks themselves are flawed**. A Penfield Labs audit in April 2026 (B-tier source) found that 6.4% of LoCoMo's ground-truth answers are wrong, and LLM judges accepted 63% of incorrect answers. LongMemEval-S's entire evaluation corpus fits within a modern 1M context window, meaning it tests long-context comprehension rather than memory capability.

Problem three: **real-world tasks are harder**. ICLR 2026's MemoryAgentBench ([2507.05257](https://arxiv.org/abs/2507.05257)) evaluates four memory capabilities (fact recall, preference tracking, event reasoning, conversation summarization) with sequences up to 1.44M tokens — no system masters all four. MemoryArena ([2602.16313](https://arxiv.org/abs/2602.16313)) tests interdependent multi-session tasks, and systems that saturate LoCoMo drop to 40–60% in this setting.

Conclusion: **treat any vendor-reported LoCoMo / LongMemEval numbers with deep skepticism**. If you need to evaluate memory systems, use MemoryAgentBench or design your own end-to-end tasks. Do not rely on a single benchmark.

## Trend 5: Dreaming and procedural memory are converging

In H1 2026, three companies independently adopted the word "Dreaming" to describe the same thing: **offline background consolidation of memories**.

- **OpenAI ChatGPT Dreaming** ([2026-06-04 announcement](https://openai.com/index/chatgpt-memory-dreaming)): background cross-conversation consolidation, producing a user-editable memory summary page. Internal metrics: fact recall 67.9% → 82.8%, preference adherence 55.3% → 71.3%, temporal consistency 52.2% → 75.1%
- **Anthropic Managed Agents Dreaming** ([2026-05-19 research preview](https://claude.com/blog/new-in-claude-managed-agents)): scheduled review of sessions and memory stores, producing consolidated new stores that can be auto-applied or human-reviewed
- **Letta Dreaming subagents**: productization of sleep-time compute ([2504.13171](https://arxiv.org/abs/2504.13171)), pre-reasoning to organize memories during idle time

This isn't a new idea — Generative Agents ([2304.03442](https://arxiv.org/abs/2304.03442), UIST 2023) had reflection, and Letta's sleep-time compute paper preceded these products. But "Dreaming" in 2026 became a product feature, not just a research paper.

Simultaneously, **procedural memory (how to do things) is merging with Skills**:

- Gemini CLI Auto Memory directly produces SKILL.md candidates
- OpenAI sandbox memory includes a `skills/` directory
- Letta replaced some memory tools with skills
- Microsoft Foundry shipped a `procedural_memory_enabled` flag

"Learning how to do something" is now treated as equally important a memory type as "remembering what happened." And the carrier format, once again, is the versioned file from Trend 1.

The ACE paper ([2510.04618](https://arxiv.org/abs/2510.04618), ICLR 2026, Stanford / SambaNova / Berkeley) uses a Generator–Reflector–Curator triad to automatically evolve playbooks, claiming it can replace fine-tuning. This may be the next step for procedural memory: not humans writing skill files, not agents writing them directly, but a dedicated evolutionary process that continuously improves them.

## Side observation: model generations matter more than memory strategies

Anthropic's BrowseComp numbers [published 2026-04-02](https://claude.com/blog/harnessing-claudes-intelligence) deserve separate attention:

| Model | BrowseComp (under compaction) |
|---|---|
| Sonnet 4.5 | 43% |
| Opus 4.5 | 68% |
| Opus 4.6 | 84% |

Same compaction strategy, one model generation later, and the score jumps from 43% to 84%. This means memory and compaction strategy effectiveness is heavily dependent on the model's own tolerance for "context anxiety." Spending three months polishing your memory pipeline may be less effective than waiting for the next model upgrade.

The OpenAI [cookbook (2026-05-01)](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction) summarized the division of labor in one sentence: "Compaction keeps the current run going, memory gives the next run a starting point, and human-reviewed memos are the source of truth."

## Where to bet, where not to chase

Based on these five trends, if you're adding memory to your agent today, here's my advice:

**Do these**:
1. **Start with Markdown files + an index**, not a vector database. Files cover 80% of use cases, and you can always add a vector layer later
2. **Gate your writes** — at minimum, let admins see and delete memories; ideally, add an approval or validation mechanism
3. **Compaction is table stakes** — if your agent runs more than 10 conversation turns, skipping compaction wastes money and quality
4. **Prioritize model upgrades over memory-pipeline optimization** — dollar for dollar, upgrading the model has higher ROI than refining memory strategies

**Don't chase these**:
1. **Don't chase LoCoMo / LongMemEval scores** — these benchmarks can no longer distinguish good from bad; use end-to-end tasks instead
2. **Don't build your own vector / graph memory layer** — unless you have Zep-level temporal requirements, use off-the-shelf options (Mem0 / AgentCore / Memory Bank) as pluggable backends
3. **Don't chase Dreaming as a feature selling point** — offline consolidation works, but all three implementations are still in preview / research; APIs and behaviors may change
4. **Don't ignore security** — memory injection is not a theoretical attack; it's a validated, practical risk. At minimum, implement the basic defenses covered in this series' attack-surface post

Memory is not a feature you bolt on. It's an architecture decision — one that determines your agent's cross-session behavioral consistency, user trust, security boundary, and operational complexity. The good news in 2026 is that the industry is finally converging on these dimensions. The bad news is that nobody has gotten all of them right yet.

## References

- [Anthropic — Claude Code Memory docs](https://code.claude.com/docs/en/memory)
- [Anthropic — Claude Code Prompt caching docs](https://code.claude.com/docs/en/prompt-caching)
- [Anthropic — Managed Agents Memory docs](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic — Harnessing Claude's intelligence (2026-04-02)](https://claude.com/blog/harnessing-claudes-intelligence)
- [Anthropic — New in Claude Managed Agents (Dreaming, 2026-05-19)](https://claude.com/blog/new-in-claude-managed-agents)
- [OpenAI — Agents SDK Sandbox Memory docs](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [OpenAI — Dreaming: Better memory for ChatGPT (2026-06-04)](https://openai.com/index/chatgpt-memory-dreaming)
- [OpenAI — Building reliable agents: memory & compaction (cookbook, 2026-05-01)](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [Google — Gemini CLI Auto Memory docs](https://geminicli.com/docs/cli/auto-memory)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Cursor — 1.2 Changelog](https://cursor.com/changelog/1-2)
- [Cognition — Devin Knowledge docs](https://docs.devin.ai/product-guides/knowledge)
- [Letta — Sleep-time Compute paper (2504.13171)](https://arxiv.org/abs/2504.13171)
- [Letta — Context Repositories / Next Phase blog](https://www.letta.com/blog)
- [LoCoMo — ACL 2024 (2402.17753)](https://arxiv.org/abs/2402.17753)
- [LongMemEval — ICLR 2025 (2410.10813)](https://arxiv.org/abs/2410.10813)
- [MemoryAgentBench — ICLR 2026 (2507.05257)](https://arxiv.org/abs/2507.05257)
- [MemoryArena (2602.16313)](https://arxiv.org/abs/2602.16313)
- [MemoryBank — AAAI 2024 (2305.10250)](https://arxiv.org/abs/2305.10250)
- [MINJA — NeurIPS 2025 (2503.03704)](https://arxiv.org/abs/2503.03704)
- [CoALA — TMLR 2024 (2309.02427)](https://arxiv.org/abs/2309.02427)
- [Generative Agents — UIST 2023 (2304.03442)](https://arxiv.org/abs/2304.03442)
- [ACE: Agentic Context Engineering — ICLR 2026 (2510.04618)](https://arxiv.org/abs/2510.04618)
- [SpAIware — Johann Rehberger (2024-09)](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [Series: Seven Answers to a Full Context Window](/posts/ai/2026-08-21-context-full-seven-answers-en)
- [Series: Mem0 Complete Guide](/posts/ai/2026-08-22-mem0-agent-memory-en)
- [Series: OpenViking — Agent Memory as a Virtual Filesystem](/posts/ai/2026-08-22-openviking-agent-memory-en)
