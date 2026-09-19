---
title: "How Nine Coding Agents Handle Long-Term Memory: From CLAUDE.md to MemFS"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, coding-agent, claude-code, codex, antigravity-cli, cursor, copilot, devin, hermes-agent, openclaw, letta-code]
series:
  name: "AI Agent 記憶工程"
  order: 3
lang: en
tldr: "Nine coding agents have taken at least four different paths for long-term memory: Claude Code and Codex use Markdown files (agent-written, human-readable), Antigravity CLI inherits Gemini CLI's approval inbox (agent proposes, human decides), and Copilot uses citations with JIT verification (auto-deleted after 28 days unverified). Cursor removed its Memories feature and fell back to human-written Rules. Hermes Agent, OpenClaw, and Letta Code treat memory as a core harness component, not a plugin. Their choices on write timing, forgetting, and cross-team sharing are completely different — and none has published a controlled experiment on whether their memory system actually helps."
description: "Comparing long-term memory designs across Claude Code, Codex, Antigravity CLI, Cursor, GitHub Copilot, Devin Desktop, Hermes Agent, OpenClaw, and Letta Code: instruction file hierarchies, automatic memory extraction, forgetting mechanisms, cross-session sharing, and prompt cache trade-offs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-coding-agent-memory-comparison)

[The previous post](/posts/ai/2026-08-21-context-full-seven-answers-en) covered working memory — what to do when the context window fills up. Compaction, pruning, hand-off: all of it is about surviving *this* session. But what about the next one?

Yesterday you spent three hours teaching Claude Code your API naming conventions, walked Codex through your deploy pipeline, and marked five team standards in Cursor. You close the terminal. Are those things still there?

This post compares nine coding agents on long-term memory design choices. The scope covers mechanisms with public documentation — not platform APIs ([next post](/posts/ai/2026-09-19-cloud-platform-memory-apis-en)) or open-source frameworks. Compared to the previous six-agent survey, this edition adds Hermes Agent, OpenClaw, and Letta Code — three harnesses that treat memory as a core architectural component — and reflects the fact that Gemini CLI was retired on 2026-06-18 and replaced by Antigravity CLI.

## Overview: What Each Agent Has

Nine coding agents' memory mechanisms can be split into three layers:

1. **Human-written instruction files** (CLAUDE.md, AGENTS.md, Rules) — procedural memory, committed to git and code review
2. **Agent-written memories** (auto memory, Memories, Knowledge Suggestions) — semantic/episodic memory, preserved across sessions
3. **Session memory management** (compaction, resume) — extension of working memory

Each agent's investment in these three layers varies enormously. Here's the breakdown.

## Claude Code (Anthropic)

Claude Code has the most complete memory design, and the most explicit consideration of prompt cache impact.

**Instruction files: Four-layer CLAUDE.md**

Per [official docs](https://code.claude.com/docs/en/memory), the loading order:

1. Managed policy (organization level)
2. `~/.claude/CLAUDE.md` (global personal)
3. `./CLAUDE.md` or `./.claude/CLAUDE.md` (project)
4. `./CLAUDE.local.md` (gitignored, personal preferences)

Ancestor directories load at session start; subdirectory CLAUDE.md loads JIT when encountered. `@path` imports go up to 4 levels, `.claude/rules/*.md` can use frontmatter `paths` for conditional loading. Official recommendation: < 200 lines per file, > 4 MiB skipped entirely.

2026 added **Managed Memory** (account-level): memory is no longer tied to a single project but can retain project architecture and team coding standards across projects.

**Agent-written memory: Auto memory**

Located at `~/.claude/projects/<project>/memory/`, structured as a `MEMORY.md` index plus topic files (frontmatter tagged `type: user | feedback | project | reference`).

Write timing: Claude decides during the session, or can be explicitly told "remember this." Read: `MEMORY.md`'s first 200 lines or 25 KB injected at session start, topic files loaded on demand.

Key limitation: cross-session (repo-scoped), but **not cross-user or cross-team** (local storage), and subagents don't inherit (only forks do).

**Memory unified across Chat and Cowork (2026-08-25)**

Anthropic unified Claude's memory across chat and Claude Cowork on 2026-08-25:

- Memory changed from daily summaries to **individual categorized entries**
- Entries are read and updated by Claude during conversations
- Opus 4.7 improved file-system memory reliability for long multi-session work
- `claude /memory` command to review and manage all memory
- Legacy memory export window closed 2026-09-09

**Prompt cache is a hard constraint on memory design**

Per [official docs](https://code.claude.com/docs/en/prompt-caching), Claude Code's prompt cache has three layers:

1. System prompt + tools + output style
2. Project context = CLAUDE.md + auto memory + unscoped rules
3. The conversation itself

Layer 2 only changes at session start, `/clear`, or `/compact` — this is deliberate. If new memory were dynamically injected every turn, it would break the cache prefix, wasting the subscription's 1-hour TTL.

> Design implication: Claude Code's choice to "inject once at session start, unchanged mid-session" is driven by prompt cache stability. This trade-off isn't visible in other agents because they haven't published their cache design.

**Compaction**

`/compact [instructions]`, CLAUDE.md can contain `# Compact instructions` for custom summary direction. After compaction, system prompt, root CLAUDE.md, unscoped rules, auto memory, and plan are preserved, plus up to 5 recently modified files are re-read. `/autocompact 500k` adjusts the threshold.

## Codex (OpenAI)

Codex's memory design's most interesting aspect is write timing — not during the session, but **waiting 6 hours after it ends**.

**Instruction files: AGENTS.md**

Per [official docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md):

- `~/.codex/AGENTS.override.md` → `~/.codex/AGENTS.md` → project from git root down to cwd
- Closer overrides farther
- `project_doc_max_bytes` defaults to 32 KiB, silently truncated if exceeded

**Agent-written memory: Memories (GA)**

Memories graduated from preview to GA. Per the [2026-04-16 announcement](https://openai.com/index/codex-for-almost-everything) and [official docs](https://learn.chatgpt.com/docs/customization/memories), off by default (set `[features] memories = true` in config).

Two-phase background write process:

1. After rollout idle `min_rollout_idle_hours` (default 6 hours, configurable 1–48), extract raw memories thread by thread
2. Global consolidation (`max_raw_memories_for_consolidation` defaults to 256)

Stored at `~/.codex/memories/`, file layout per [codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md): `raw_memories.md`, `rollout_summaries/`, `MEMORY.md` and `memory_summary.md`, `skills/`.

**2026 major overhaul**

The April 16 "Codex for almost everything" update brought computer use (macOS), built-in browser, gpt-image-1.5, persistent memory, scheduled agents, 90+ plugins. September 10 brought further upgrades — memory more stable and ChatGPT data plugin integration. Community also has a [memory unification request](https://community.openai.com/t/features-request-memory-unification-between-codex-and-chatgpt/1380684) (944 views) to share memory between ChatGPT and Codex.

**Forgetting mechanism**

Per [config reference](https://learn.chatgpt.com/docs/config-file/config-reference): `max_unused_days` defaults to 30 (0–365 configurable), `max_rollout_age_days` defaults to 30 (0–90).

> Design philosophy: Codex chose "think after you're done" write timing to avoid memory extraction interfering with reasoning during the session. The cost is immediacy — what you teach it takes up to an hour to be remembered.

**Relationship with Agents SDK sandbox memory**

Codex Memories' file layout matches OpenAI Agents SDK's [sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/). OpenAI pushed "file-as-memory" from consumer product to developer SDK.

## Antigravity CLI (Google)

Gemini CLI was officially retired on 2026-06-18, replaced by **Antigravity CLI**. This is Google's consolidation announced at I/O 2026 (May 19), bringing the Antigravity 2.0 platform's core agent harness to the terminal.

**Memory mechanism: Inherits Gemini CLI's inbox approval route**

Antigravity CLI preserves the core developer experience constructs from Gemini CLI, including skills and hooks. The memory system follows the same design philosophy:

- **Config migration**: Global skills path moved from `~/.gemini/skills/` to `~/.gemini/antigravity-cli/skills/`, project from `.gemini/skills/` to `.agents/skills/`
- **MCP config separated**: MCP servers pulled out of preferences into dedicated lightweight JSON profiles
- **Write approval**: Same as Gemini CLI — agent proposes → inbox → human approval required
- **Auto onboarding conversion**: Migration command sequences and first-launch onboarding automatically convert legacy settings

Antigravity CLI is a Go-compiled multi-agent tool supporting Agent Manager for parallel agent execution, sharing the same harness as the Antigravity 2.0 IDE (VS Code fork).

> Design implication: Google chose "agent proposes, human approves" and carried it to the CLI. Among nine agents, this remains one of the strictest write-access controls. The risk: inbox piles up and gets ignored.

## Cursor (Anysphere)

Cursor's memory story is the most convoluted of the nine — it once had Memories, then **removed them entirely**.

**Instruction files: Rules**

Per [official docs](https://cursor.com/docs/rules):

- `.cursor/rules/*.mdc` (three modes: `alwaysApply`, `globs`, `description`)
- `~/.cursor/rules` (global support since 2.1)
- User Rules, Team Rules (dashboard-managed, enforceable)
- Also reads AGENTS.md
- Each rule ≤ 500 lines

**Memories: From launch to removal**

Timeline:

- 2025-06: Cursor 1.0 beta launched Memories (per-project, per-user)
- 2025 H2: 1.2 GA, added approval process for background memory generation
- 2025-11: **Removed starting from 2.1.17**

[Official forum staff reply](https://forum.cursor.com/t/memories-not-showing/143820): "The Memories feature was removed starting from version 2.1.17," recommending exporting to `.mdc` files to merge into Rules. The 2.1 changelog didn't mention this, and current docs have no Memories page.

> Cursor's choice is revealing: it's not that memory wasn't useful, but a decision to let Rules carry long-term memory. This puts memory write access entirely back in human hands.

**Automations memory**

Per [official docs](https://cursor.com/docs/cloud-agents/automations), Cursor's cloud Automations have their own memory mechanism: named files (default `MEMORIES.md`) outside the workspace file system, read/written across executions, on by default, editable in UI. The docs explicitly carry a prompt injection warning.

## GitHub Copilot (GitHub / Microsoft)

Copilot's memory design is most distinctive for **every memory having a citation, with JIT verification at read time**.

**Instruction files**

Per [official docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions):

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md` (with `applyTo` and `excludeAgent`)
- Also reads AGENTS.md / CLAUDE.md / GEMINI.md
- Priority: personal > repo > organization

**Copilot Memory (GA)**

Per [2026-01-15 announcement](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview) and [concept docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory):

- Two memory types: **repository-level facts** (shared by anyone with repo access) and **user-level preferences**
- GitHub-hosted (not local), every memory has a citation
- Write: via tool call during agent execution; repo memory only producible by contributors with write access
- Read: injected at session start with **JIT verification** — if cited code no longer exists, the memory is discarded

**2026 major updates**

- **May 15**: Copilot Memory expanded to **user-level preferences** — no longer just repo-level. Personal preferences follow you across all repos
- **June 1**: Usage-based billing went live, Copilot code review consumes GitHub Actions minutes
- **September 2026**: Multiple models deprecated October 19 (Gemini 3.7 Flash, GPT-5.5, GPT-5.4, GPT-5 mini, Grok 4.5). GPT-5.2-Codex GA across VS Code, Copilot Chat, Coding Agent, CLI
- Copilot SDK entered technical preview (Node.js/TypeScript, Python, Go, .NET)

**Forgetting: 28 days unverified = deleted**

Being used (JIT-verified as still valid) resets the timer. Among nine agents, this is the only design tying forgetting to "is the memory still useful."

**Public data**

Per the engineering blog, enabling Memory improved PR merge rate 83% → 90%, review positivity 75% → 77% (p < 0.00001). This is the only publicly released A/B data among nine agents.

**Cross-team sharing**

Copilot Memory is the only one with built-in repo-level sharing among nine agents. Repo memory is visible to all authorized contributors; personal preferences are private only to the user. Manageable at: Personal Settings → Memory; repo Settings > Copilot > Memory; organization policy controls the switch.

## Devin Desktop (Cognition)

On 2026-06-02 Cognition announced [Devin Desktop](https://cognition.com/blog/introducing-devin-desktop) — "the next generation of Windsurf," with Windsurf docs merged into docs.devin.ai.

Devin's memory spans three independent systems — broader coverage than other agents but the least mechanism disclosure.

**Memories (Cascade layer)**

Per [official docs](https://docs.devin.ai/desktop/cascade/memories): Cascade auto-generated + user-created + manually edited. Stored at `~/.codeium/windsurf/memories/`, workspace-specific, not cross-workspace or cross-team. Auto memory doesn't consume credits. Retrieval mechanism undisclosed. Forgetting is manual.

**Knowledge (Organization layer)**

Per [official docs](https://docs.devin.ai/product-guides/knowledge): Each Knowledge = Trigger Description + Content (can include `!macro`), scoped to organization or enterprise, pin-able to specific repos or all.

Two write paths: manual creation, or **Knowledge Suggestions** — Devin auto-suggests from conversation feedback, requiring user approval. Repo Knowledge also auto-imports from README, `.rules`, `.mdc`, `.cursorrules`, `.windsurf`, `CLAUDE.md`, `AGENTS.md`.

Retrieval is trigger-based (undisclosed), pinned Knowledge is always injected. No automatic decay; weekly manual cleanup recommended.

**Playbooks (procedural memory)**

Reusable organization prompts in `.devin.md` format, categorized as Procedure / Specifications / Advice / Forbidden / Required from User. Devin can auto-generate Playbook candidates from past sessions — essentially automated procedural memory creation.

**DeepWiki (semantic memory)**

Auto-generated repo documentation, `.devin/wiki.json` (repo_notes ≤ 10,000 chars, 30 pages / 80 enterprise). Update cycle undisclosed.

**Rules**

Global `global_rules.md` (6,000 char limit), `.devin/rules/*.md` or `.windsurf/rules/*.md` (12,000 chars each). Four modes: always_on / model_decision / glob / manual. AGENTS.md in root = always-on, in subdirectory = glob-scoped.

## Hermes Agent (Nous Research)

Hermes Agent is an open-source coding agent from Nous Research, released February 25, 2026, positioned as a "self-improving agent." Its memory system isn't a plugin — it's a core harness component.

**Memory architecture: Three layers + Multi-Provider**

Hermes uses **three memory types**:

1. **Persistent Memory** (`~/.hermes/memories/MEMORY.md`, ~2,200 char cap): notes about the world
2. **USER.md** (~1,375 char cap): notes about the user
3. **Skills** (procedural memory): skill files auto-written after completing complex tasks

Core memory (MEMORY.md + USER.md) totals ~1,300 tokens, permanently in the system prompt, with fixed cost per session. Session Search (FTS5 full-text over all past sessions, SQLite-backed) is on-demand at ~20ms query time.

**Write timing: Active learning loop**

Hermes has a consent-aware learning loop:

1. After each turn, a background self-improvement review decides whether to save memory or update a skill
2. Repeated corrections and durable workflow lessons become memory entries or procedural skills
3. `write_approval` can stage writes for human review before affecting future sessions
4. Defaults to showing `💾 Memory updated` in chat

**Honcho user modeling**

Hermes supports Honcho dialectic user modeling — AI-native cross-session user modeling through dialectical reasoning that builds progressively deeper understanding. Tiered loading: L0 (~100 tokens) → L1 (~2k) → L2 (full).

**Multi-Provider architecture**

Hermes's memory system supports plug-in external providers:

| Provider | Features |
|---|---|
| **Honcho** | Cross-session user modeling, dialectical reasoning |
| **Byterover** | Pre-compression extraction (save insights before compression discards them), knowledge tree |
| **Supermemory** | Knowledge graph, temporal & multi-session reasoning, automatic forgetting |
| **Mem0** | Vector + graph search |

All providers are native integrations (not bolt-on scripts), sharing the agent's lifecycle hooks.

**Automatic skill creation**

When an agent completes a complex task (5+ tool calls) with good results, Hermes automatically writes the workflow as a skill file. Ships with 85 built-in skills across 22 categories, and periodically grades and prunes underperforming skills.

> Design philosophy: Hermes treats memory as a first-class citizen of the harness, not a plug-and-play plugin. Memory, skills, schedules, plugins, and settings can be packaged into a portable profile that moves between environments.

## OpenClaw

OpenClaw is an open-source terminal coding agent known for its modular architecture and memory system. By 2026, it had undergone major evolution — the April 29 4.7 update brought TaskFlow orchestration and provenance-rich memory, and the August 31 2.0 release (v2026.8.1) had 16,000+ merged PRs from 933 contributors, the largest update in the project's history.

**Memory architecture: File-based + Provenance labels**

OpenClaw's memory system is built on files (Markdown/YAML), with a core feature of **provenance tracking**: every memory is labeled with "who, when, from where." This makes memory portable across models — when you switch providers, the memory remains, because it's not bound to any specific model.

**Memory Wiki**

OpenClaw 2.0 introduced **Memory Wiki** — a plugin that compiles durable knowledge into a provenance-rich wiki vault:

- Structured claims with evidence
- Obsidian-friendly workflows
- Dashboards and machine-readable digests
- Bridge mode for exporting artifacts to other systems
- Can import memory from Codex, Claude Code, and Hermes

**Hybrid Search**

Supports hybrid retrieval (semantic + keyword), with per-agent configurable search settings. `rememberAcrossConversations` is on by default for personal installs, pulling relevant context from other private conversations.

**Memory Sub-Agent**

OpenClaw has a dedicated memory sub-agent for interactive session memory management, plus background dreaming processes that promote short-term recall into long-term memory.

**Brain-Swappable Design**

OpenClaw's provider manifest allows runtime model swapping without rebuilding workflows. The design philosophy: memory should exist independently of the model. This matters in a 2026 environment where model switching is increasingly frequent.

> Design philosophy: OpenClaw treats memory as a "portable operating system," not an accessory of any specific agent. Provenance labels let any model understand the origin and trustworthiness of memory.

## Letta Code (formerly MemGPT)

Letta Code evolved from MemGPT, founded by UC Berkeley researchers. It has an explicit positioning: "Memory is not a plugin — context and state management are core responsibilities of the agent harness."

**Memory architecture: Three-tier OS-level design**

Letta's memory system mimics OS memory hierarchy:

1. **Core Memory**: Editable in-context memory blocks that the agent itself can read and write via tools like `memory_replace`. Focused on specific topics (user preferences, persona, current task)
2. **Recall Memory**: Message buffer holding the most recent messages
3. **Archival Memory**: Queryable long-term storage

**MemFS (Git-backed Memory)**

Launched February 2026, Context Repositories (MemFS) is Letta's signature innovation: memory is version-controlled with Git, so every memory edit by the agent is tracked. This provides:

- **Replayability**: Can return to any point's memory state
- **Auditability**: Who changed what and when
- **Mergeability**: Multi-agent memories can be merged

**Agent-managed memory**

Letta's philosophy is that "agents should decide what's worth remembering." Agents update their own memory blocks through tool calls rather than relying on external systems. This creates an explicit, trackable learning process — every memory update is logged.

**Product evolution**

- 2026-02: Context Repositories (git-backed memory)
- 2026-03: Building Draft, Remote Environments
- 2026-04: **Letta Code App** launched — desktop interface for memory-first agent interaction
- 2026-06: **Mods** — harness-level self-adaptation mechanism
- 2026-08: Letta Agents SDK — SDK for stateful agents

**Sleep-time Compute**

Letta pioneered "dream agents" that reflect, consolidate, and improve while idle. Background workflows organize experiences accumulated during active use.

**Model-Agnostic**

Letta Code is model-agnostic (OpenAI, Anthropic, Mistral, etc.) — the memory system isn't tied to any specific model provider. It's the #1 model-agnostic OSS harness on TerminalBench.

> Design philosophy: Memory is not a bolt-on plugin. Context and state management are core harness responsibilities. Letting agents decide what to remember and what to forget is true continual learning.

## Nine-Agent Comparison

| | Claude Code | Codex | Antigravity CLI | Cursor | Copilot | Devin Desktop | Hermes Agent | OpenClaw | Letta Code |
|---|---|---|---|---|---|---|---|---|---|
| **Storage** | Local Markdown | Local Markdown | Local Markdown | Rules files | GitHub-hosted KV | Local + Cloud | Local Markdown + SQLite | Files + Wiki | Git-backed MemFS |
| **Write timing** | In-session auto | 6h idle background | Idle → inbox | Human-written Rules | In-session tool call | Auto + manual | Background nudge + auto | Background + provenance | Agent tool calls |
| **Requires approval** | No | No | **Yes (inbox)** | N/A (human) | No | Partial | write_approval | Partial | No |
| **Forgetting** | None | 30 days unused | None | N/A | 28 days unverified | Manual | Periodic grading | None (manual) | Manual |
| **Cross-session** | ✓ | ✓ | ✓ | ✓ (Rules) | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Cross-team** | ✗ | ✗ | ✗ | Team Rules | **Repo-level** | Org Knowledge | ✗ | ✗ | ✗ |
| **Procedural** | CLAUDE.md | AGENTS.md | GEMINI.md + SKILL.md | Rules | Instructions | **Playbooks** | **Skills** | **Memory Wiki** | **Skills + Mods** |
| **Cache consideration** | Explicit (3-layer) | Undisclosed | Undisclosed | Undisclosed | Undisclosed | Undisclosed | Cache-aware | Undisclosed | Undisclosed |
| **Public A/B data** | None | None | None | None | **Yes** | None | None | None | None |
| **Replaceable memory provider** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** | ✗ | ✗ |
| **Git versioning of memory** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |

## The Landscape: Four Routes, Three Bets

From the comparison, four distinct design routes emerge:

**Route 1: Agent remembers for itself (Claude Code, Codex)**

The agent automatically writes memorable things as Markdown — during the session (Claude Code) or after it ends (Codex). Humans can read and edit, but approval isn't required to write.

*Bet*: LLM memory extraction is accurate enough to not misrecord or over-record. *Risk*: Memory becomes a persistent prompt injection vector.

**Route 2: Agent proposes, human approves (Antigravity CLI)**

The agent produces candidate memories, but the final step is human approval. Antigravity CLI inherits Gemini CLI's inbox mechanism — Auto Memory patch and SKILL.md candidates require human sign-off.

*Bet*: Humans are willing to spend time reviewing memories. *Risk*: Inbox piles up and gets ignored, making the feature effectively off.

**Route 3: Don't trust agent memory, fall back to human writing (Cursor)**

Cursor once had auto memory, but removed it. Long-term knowledge relies entirely on human-written Rules.

*Bet*: Human-written quality beats agent extraction. *Risk*: Maintenance cost of memory falls entirely on humans.

**Route 4: Citations + verification (Copilot)**

Every memory has a citation, and JIT verification checks if the cited source still exists at read time. Instead of betting on "remembering accurately," the memory layer has built-in self-correction — expired memories are naturally eliminated. Also the only design tying memory to code versioning.

**Route 5: Memory as core harness component (Hermes, OpenClaw, Letta)**

These three don't follow the "add a memory feature" approach — they build the memory system as the core architectural element of the harness:

- **Hermes**: Replaceable memory providers (Honcho, Byterover, Supermemory, Mem0), core memory permanently in context window, FTS5 full-text search across all sessions
- **OpenClaw**: Provenance labels make memory cross-model portable, Memory Wiki compiles into a knowledge base
- **Letta Code**: MemFS versions memory with Git, agent self-manages core/recall/archival layers

*Bet*: Memory shouldn't be a plugin — it should be a first-class citizen of the harness. *Risk*: These systems are more complex and have a higher barrier for general developers.

## An Experiment Nobody Has Run

All nine agents claim their memory design helps, but only Copilot has published A/B data (PR merge rate +7pt). No one has run this controlled experiment:

> The same tasks, executed with and without memory, controlling for model version, prompt, and tools, measuring pass rate, token consumption, and human correction count.

Codex's 30-day forgetting and Copilot's 28-day decay are reasonable designs, but where did the "30 days" number come from? No public experimental basis exists. Claude Code's auto memory has no forgetting mechanism — is it because memory doesn't go stale, or because the problem hasn't been addressed yet?

In 2026, when memory benchmarks themselves are [seriously questioned](https://arxiv.org/abs/2507.05257) (LoCoMo has 6.4% wrong answers that LLM judges accepted 63% of the time), coding agent memory evaluation is even more of a blank slate.

Letta's Context Repositories offer an interesting direction: using Git's replayability and auditability as the engineering substrate for memory — not accuracy improvement, but replayability, auditability, and mergeability. But this direction hasn't been validated by rigorous controlled experiments yet.

## Next Post

Coding agent memory is designed for "people using tools" — local, personal, following the session. But if you're **building** agents, the cloud platforms' memory APIs are a different world: hosted storage, multi-tenant isolation, asynchronous extraction pipelines. [Next post](/posts/ai/2026-09-19-cloud-platform-memory-apis-en) breaks down OpenAI, Anthropic, Google, AWS, and Microsoft's five clouds' memory APIs.

## References

- [Claude Code — Memory official docs](https://code.claude.com/docs/en/memory)
- [Claude Code — Prompt caching official docs](https://code.claude.com/docs/en/prompt-caching)
- [Claude Code — Release notes](https://support.claude.com/en/articles/12138966-release-notes)
- [Claude — Memory Now Spans Chat and Cowork (2026-08-25)](https://www.memorylake.ai/en/blogs/claude-memory-chat-and-cowork)
- [Codex — AGENTS.md official docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex — Memories official docs](https://learn.chatgpt.com/docs/customization/memories)
- [Codex — Config reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex — codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)
- [OpenAI — Codex for almost everything (2026-04-16)](https://openai.com/index/codex-for-almost-everything)
- [OpenAI — Introducing upgrades to Codex (2026-09-10)](https://openai.com/index/introducing-upgrades-to-codex)
- [OpenAI — Agents SDK Sandbox Memory official docs](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [Google — An important update: Transitioning Gemini CLI to Antigravity CLI (2026-05-19)](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli)
- [Google Antigravity Docs — Migrating from Gemini CLI](https://antigravity.google/docs/cli/gcli-migration)
- [Cursor — Rules official docs](https://cursor.com/docs/rules)
- [Cursor — Automations official docs](https://cursor.com/docs/cloud-agents/automations)
- [Cursor forum official reply — Memories removed starting from 2.1.17](https://forum.cursor.com/t/memories-not-showing/143820)
- [GitHub Copilot — Repository instructions official docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [GitHub Copilot — Memory concept docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [GitHub — Agentic memory for GitHub Copilot public preview (2026-01-15)](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [GitHub — Copilot Memory supports user preferences (2026-05-15)](https://github.blog/changelog/2026-05-15-copilot-memory-supports-user-preferences-for-pro-pro-users)
- [Cognition — Introducing Devin Desktop (2026-06-02)](https://cognition.com/blog/introducing-devin-desktop)
- [Devin Desktop — Memories official docs](https://docs.devin.ai/desktop/cascade/memories)
- [Devin — Knowledge official docs](https://docs.devin.ai/product-guides/knowledge)
- [Hermes Agent — Persistent Memory official docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Hermes Agent — Memory Providers official docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [Letta — Memory Models: Towards Agents That Learn (2026-06-25)](https://www.letta.com/blog/towards-agents-that-learn)
- [Letta — Agent Memory: How to Build Agents That Learn and Remember](https://www.letta.com/blog/agent-memory)
- [Letta — Letta Code: A Memory-First Coding Agent](https://www.letta.com/blog/letta-code)
- [OpenClaw — Memory overview](https://docs.openclaw.ai/concepts/memory)
- [OpenClaw — Memory Wiki](https://docs.openclaw.ai/plugins/memory-wiki)
- [OpenClaw — v2026.9.3 Release](https://docs.openclaw.ai/releases/2026.9.3)
- [OpenClaw 2.0 explained (2026-08-31)](https://cellcog.ai/blog/openclaw-2-0)
- [OpenBrain — Memory Provenance for OpenClaw](https://www.mindstudio.ai/blog/openbrain-memory-provenance-openclaw-labels)
- [Coding agent session persistence and crash recovery](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)
- [Context overflow: seven answers, none of them consensus](/posts/ai/2026-08-21-context-full-seven-answers)

[Previous: 'The difference of writing a single "Write a script" — How Skill Instructions determine LLM success or failure'](https://quidproquo.cc/posts/ai/2026-09-19-docx-skill-instructions-stream-stall)
[Next: Five clouds' memory APIs: How OpenAI, Anthropic, Google, AWS, Microsoft make agents remember](https://quidproquo.cc/posts/ai/2026-09-19-cloud-platform-memory-apis)

### Related posts

[Series intro: AI Agent Memory Engineering](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)
[Four types of memory and six design axes: Agent memory system design space](/posts/ai/2026-09-19-agent-memory-taxonomy)
[Where AI memory systems go in 2026: Files won over vectors, forgetting has only just begun](/posts/ai/2026-09-19-agent-memory-2026-trends)
