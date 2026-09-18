---
title: "How Six Coding Agents Handle Long-Term Memory: From CLAUDE.md to JIT Verification"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, coding-agent, claude-code, codex, gemini-cli, cursor, copilot, devin]
series:
  name: "AI Agent 記憶工程"
  order: 3
lang: en
tldr: "Six coding agents have taken three different paths for long-term memory: Claude Code and Codex use Markdown files (agent-written, human-readable), Gemini CLI uses an approval inbox (agent proposes, human decides), and Copilot uses citations with JIT verification (auto-deleted after 28 days unverified). Cursor removed its Memories feature entirely and fell back to human-written Rules. The six disagree on write timing, forgetting, and cross-team sharing — and none has published a controlled experiment on whether their memory system actually helps."
description: "Comparing long-term memory designs across Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, and Devin Desktop: instruction file hierarchies, automatic memory extraction, forgetting mechanisms, cross-session sharing, and prompt cache trade-offs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-coding-agent-memory-comparison)

The [previous post](/posts/ai/2026-08-21-context-full-seven-answers-en) covered working memory — what to do when the context window fills up. Compaction, pruning, hand-off: all of it is about surviving *this* session. But what about the next one?

Yesterday you spent three hours teaching Claude Code your API naming conventions, walked Codex through your deploy pipeline, and marked five team standards in Cursor. You close the terminal. Are those things still there?

This post compares how six coding agents design their long-term memory. Scope is limited to mechanisms with public documentation — no platform APIs (that's the [next post](/posts/ai/2026-09-19-cloud-platform-memory-apis-en)) and no open-source frameworks.

## The Big Picture: What Each Agent Has

Memory mechanisms across the six agents break down into three layers:

1. **Human-written instruction files** (CLAUDE.md, AGENTS.md, Rules, etc.) — procedural memory that goes into git and code review
2. **Agent-written memory** (auto memory, Memories, Knowledge Suggestions) — semantic/episodic memory that persists across sessions
3. **Session memory management** (compaction, resume) — working memory continuity

Each agent invests differently across these three layers. Here's the breakdown.

## Claude Code (Anthropic)

Claude Code has the most complete memory design, and the only one that explicitly accounts for prompt cache impact.

**Instruction files: Four-layer CLAUDE.md**

Per the [official docs](https://code.claude.com/docs/en/memory), the loading order is:

1. Managed policy (organization level)
2. `~/.claude/CLAUDE.md` (global personal)
3. `./CLAUDE.md` or `./.claude/CLAUDE.md` (project)
4. `./CLAUDE.local.md` (gitignored, personal preferences)

Ancestor directories load at session start; subdirectory CLAUDE.md files load on demand via JIT. `@path` imports go up to 4 levels deep, and `.claude/rules/*.md` files support conditional loading via frontmatter `paths`. Official recommendation: keep each file under 200 lines; files over 4 MiB are skipped entirely.

**Agent-written memory: Auto memory**

Stored at `~/.claude/projects/<project>/memory/`, structured as a `MEMORY.md` index plus topic files (frontmatter typed as `user | feedback | project | reference`).

Write timing: Claude decides during the session whether something is worth remembering, or the user can explicitly ask. Read: the first 200 lines or 25 KB of `MEMORY.md` are injected at session start; topic files are read on demand.

Key constraint: persists across sessions (scoped to the repo), but **not across users or teams** (stored locally), and subagents don't inherit it (only forks do).

**Prompt cache is a hard constraint on memory design**

Per the [official docs](https://code.claude.com/docs/en/prompt-caching), Claude Code's prompt cache has three layers:

1. System prompt + tools + output style
2. Project context = CLAUDE.md + auto memory + unscoped rules
3. The conversation itself

Layer 2 only changes at session start, `/clear`, or `/compact` — this is deliberate. Dynamically injecting new memories every turn would break the cache prefix, wasting the subscription tier's 1-hour TTL.

> Design implication: Claude Code chose "inject once at session start, hold steady within the session" specifically for prompt cache stability. This trade-off is invisible in other agents because none of them have published their cache design.

**Compaction**

`/compact [instructions]`; CLAUDE.md can include a `# Compact instructions` section to steer summarization. After compaction, the system retains the system prompt, root CLAUDE.md, unscoped rules, auto memory, and plan, then re-reads up to 5 recently modified files. `/autocompact 500k` adjusts the threshold.

## Codex (OpenAI)

The most interesting aspect of Codex's memory design is its write timing — it doesn't write during the session. It **waits 6 hours after the session goes idle**.

**Instruction files: AGENTS.md**

Per the [official docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md):

- `~/.codex/AGENTS.override.md` → `~/.codex/AGENTS.md` → project files from git root to cwd, chained layer by layer
- Closer files override more distant ones
- `project_doc_max_bytes` defaults to 32 KiB; anything larger is silently truncated (no error)

**Agent-written memory: Memories (preview)**

Per the [April 16, 2026 announcement](https://openai.com/index/codex-for-almost-everything) and [official docs](https://learn.chatgpt.com/docs/customization/memories), Memories are off by default (requires `[features] memories = true` in config).

Writing is a two-stage background job:

1. After a rollout idles for `min_rollout_idle_hours` (default 6, configurable 1–48), per-thread extraction of raw memories
2. Global consolidation (`max_raw_memories_for_consolidation` default 256)

Stored locally at `~/.codex/memories/`, with file layout per the [codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md): `raw_memories.md`, `rollout_summaries/` (one file per rollout), `MEMORY.md` and `memory_summary.md` (consolidation output), and `skills/`.

**Forgetting**

Per the [config reference](https://learn.chatgpt.com/docs/config-file/config-reference): `max_unused_days` defaults to 30 (range 0–365); `max_rollout_age_days` defaults to 30 (0–90). This is the only agent among the six with explicit time-based forgetting (Copilot also has it, but with a different mechanism).

> Design philosophy: Codex chose "think after you're done" for write timing, avoiding memory extraction during active reasoning. The cost is immediacy — the earliest something you taught it can be remembered is one hour later.

**Relationship to Agents SDK sandbox memory**

Codex Memories' file layout is identical to the OpenAI Agents SDK's [sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/). OpenAI pushed "files as memory" from its consumer product all the way to the developer SDK.

## Gemini CLI (Google)

Gemini CLI takes the "agent proposes, human approves" route — the strictest write-permission control among the six.

**Instruction files: GEMINI.md**

Per the [official docs](https://geminicli.com/docs/cli/gemini-md/):

- Global → workspace → ancestor directories → touched directories via JIT loading
- `@./file.md` imports
- `discoveryMaxDirs` 200

Unlike other agents, GEMINI.md is **injected as a system instruction every turn**, not just read once at session start.

**Auto Memory (experimental)**

Per the [official docs](https://geminicli.com/docs/cli/auto-memory), `experimental.autoMemory` defaults to false. When enabled:

1. Background scan of sessions with 10+ user messages that have been idle 3+ hours
2. Draft memory patches and SKILL.md candidates
3. Sent to an **approval inbox** — only takes effect after user approval

Constraints: cannot directly modify active memory, settings, credentials, or project GEMINI.md.

> Gemini CLI's Auto Memory has a unique trait: it doesn't just learn facts (semantic memory) — it also learns procedures. The SKILL.md candidates it produces are essentially procedural memory. No other agent in this comparison does this.

**Compaction and sessions**

`/compress`, `model.compressionThreshold` defaults to 0.5, `sessionRetention` 30 days.

Note: the free tier of Gemini CLI was replaced by Antigravity CLI on 2026-06-18.

## Cursor (Anysphere)

Cursor has the most turbulent memory story among the six — it once had a Memories feature, then **removed it entirely**.

**Instruction files: Rules**

Per the [official docs](https://cursor.com/docs/rules):

- `.cursor/rules/*.mdc` (with `alwaysApply` / `globs` / `description` modes)
- `~/.cursor/rules` (global, from 2.1 onward)
- User Rules, Team Rules (dashboard-managed, enforceable)
- Also reads AGENTS.md
- Each rule ≤ 500 lines

**Memories: From launch to removal**

Timeline:
- June 2025: Cursor 1.0 beta ships Memories (per-project, per-user)
- Late 2025: 1.2 GA adds an approval flow for background-generated memories ([changelog](https://cursor.com/changelog/1-2))
- November 2025: **removed starting from 2.1.17**

A [staff reply on the official forum](https://forum.cursor.com/t/memories-not-showing/143820): "The Memories feature was removed starting from version 2.1.17," recommending users export to `.mdc` via `Cmd+Shift+P` and merge into Rules. The 2.1 changelog didn't mention this; current docs have no Memories page.

> Cursor's choice is worth noting: it's not that nobody used Memories — the team decided to let Rules carry the long-term memory role. This hands write permission entirely back to humans.

**Automations memory**

Per the [official docs](https://cursor.com/docs/cloud-agents/automations), Cursor's cloud Automations have their own memory mechanism: a named file (default `MEMORIES.md`) stored outside the working filesystem, readable and writable across runs, enabled by default, editable via UI. The docs explicitly include a prompt injection warning.

## GitHub Copilot (GitHub / Microsoft)

Copilot's most distinctive design choice: **every memory carries a citation, and citations are JIT-verified at read time**.

**Instruction files**

Per the [official docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions):

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md` (with `applyTo` and `excludeAgent`)
- Also reads AGENTS.md / CLAUDE.md / GEMINI.md
- Priority: personal > repo > organization

**Copilot Memory (public preview)**

Per the [January 15, 2026 announcement](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview) and [concept docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory):

- Two types: **repository-level facts** (shared among those with repo access) and **user-level preferences**
- GitHub-hosted (not local), with a citation attached to each memory
- Write: via tool call during agent execution; repo memories can only be created by contributors with write access
- Read: recent repo memories injected at session start, with **JIT verification** — if the code a memory cites no longer exists, the memory is skipped (per the [engineering blog](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot))

**Forgetting: Auto-deleted after 28 days unverified**

Usage (JIT verification confirming the memory is still valid) resets the timer. This is the only agent among the six that ties forgetting to whether the memory is still useful.

**Published data**

Per the engineering blog, enabling Memory increased PR merge rate from 83% to 90% and review approval rate from 75% to 77% (p < 0.00001). This is the only agent in the group that has published A/B test results.

**Cross-team sharing**

Copilot Memory is the only one with built-in repo-level sharing. Repo memories are visible to all authorized contributors; personal preferences are private. Manageable via personal settings → Memory, repo Settings > Copilot > Memory, and organization policy toggles.

## Devin Desktop (Cognition)

On June 2, 2026, Cognition [announced](https://cognition.com/blog/introducing-devin-desktop) "Devin Desktop — the next generation of Windsurf," merging Windsurf docs into docs.devin.ai.

Devin has three independent memory systems — broader coverage than any other agent, but with the least disclosed internals.

**Memories (Cascade layer)**

Per the [official docs](https://docs.devin.ai/desktop/cascade/memories): auto-created by Cascade + explicitly created by users + manually edited. Stored locally at `~/.codeium/windsurf/memories/`, workspace-specific, no cross-workspace or cross-team sharing. Auto memories don't consume credits. Retrieval mechanism is undisclosed. Forgetting is manual only.

**Knowledge (organization layer)**

Per the [official docs](https://docs.devin.ai/product-guides/knowledge): each Knowledge item = Trigger Description + Content (with optional `!macro`), scoped to organization or enterprise, pinnable to specific repos or all repos.

Two write paths: manual creation, or **Knowledge Suggestions** — Devin automatically suggests items from conversation feedback, requiring user approval. Additionally, Repo Knowledge auto-imports from README, `.rules`, `.mdc`, `.cursorrules`, `.windsurf`, `CLAUDE.md`, and `AGENTS.md`.

Retrieval is trigger-based (mechanism undisclosed); pinned Knowledge is always injected. No automatic decay — the official recommendation is weekly cleanup.

**Playbooks (procedural memory)**

Reusable organization prompts in `.devin.md` format, divided into Procedure / Specifications / Advice / Forbidden / Required from User. Devin can auto-generate Playbook candidates from past sessions — essentially automatic procedural memory creation.

**DeepWiki (semantic memory)**

Auto-generated repo documentation at `.devin/wiki.json` (repo_notes ≤ 10,000 characters, page limit 30 / enterprise 80). Update cycle undisclosed.

**Rules**

Global `global_rules.md` (6,000 character limit); `.devin/rules/*.md` or `.windsurf/rules/*.md` (12,000 characters each). Four modes: always_on / model_decision / glob / manual. AGENTS.md at the repo root acts as always-on; in subdirectories it acts as glob-scoped.

## Side-by-Side Comparison

| | Claude Code | Codex | Gemini CLI | Cursor | Copilot | Devin Desktop |
|---|---|---|---|---|---|---|
| **Storage** | Local Markdown | Local Markdown | Local Markdown | Rules files | GitHub-hosted KV | Local + cloud |
| **Write timing** | Auto during session | Background after 6h idle | After 3h+ idle → inbox | Human writes Rules | Tool call during session | Auto + manual |
| **Approval required** | No | No | **Yes (inbox)** | N/A (human-written) | No | Partial (Suggestions) |
| **Forgetting** | None | 30 days unused | None | N/A | 28 days unverified | Manual |
| **Cross-session** | ✓ | ✓ | ✓ | ✓ (Rules) | ✓ | ✓ |
| **Cross-team sharing** | ✗ | ✗ | ✗ | Team Rules | **Repo-level** | Org Knowledge |
| **Procedural memory** | CLAUDE.md | AGENTS.md | GEMINI.md + SKILL.md | Rules | Instruction files | **Playbooks** |
| **Cache considerations** | Explicit (3-layer cache) | Undisclosed | Undisclosed | Undisclosed | Undisclosed | Undisclosed |
| **Published A/B data** | None | None | None | None | **Yes** | None |

## Three Approaches, Three Bets

The comparison reveals three distinct design philosophies:

**Approach 1: Agent writes autonomously (Claude Code, Codex)**

The agent automatically saves what it deems worth remembering as Markdown — during the session (Claude Code) or after it (Codex). Humans can read and edit, but writing doesn't require approval.

The bet: LLM memory extraction is accurate enough not to remember wrong things or too many things. The risk: memories become persistent prompt injection vectors (expanded in [post 8 of this series](/posts/ai/2026-09-19-agent-memory-attack-surface-en)).

**Approach 2: Agent proposes, human approves (Gemini CLI, Devin Knowledge Suggestions)**

The agent produces memory candidates, but the final step belongs to humans. Gemini CLI's inbox is the most thorough — both memory patches and SKILL.md candidates require approval.

The bet: humans will invest time reviewing memories. The risk: the inbox piles up and gets ignored, making the feature effectively dead.

**Approach 3: Don't trust agent memory, fall back to human-written (Cursor)**

Cursor once had automatic memory and removed it. Long-term knowledge now rests entirely on human-written Rules.

The bet: human curation quality beats LLM extraction. The risk: all maintenance cost falls on the human.

**Copilot took a fourth path**: citations plus verification. Every memory carries a citation; at read time, JIT checks whether the cited source still exists. This isn't a bet on "how accurate the memory is" but rather building self-correction into the memory layer — stale memories get naturally culled. It's also the only design that ties memory to code versioning.

## An Experiment Nobody Has Run

All six claim their memory design helps, but only Copilot has published A/B data (PR merge rate +7 points). None of them has run this controlled experiment:

> The same set of tasks, executed with and without memory, controlling for model version, prompt, and tools, measuring pass rate, token consumption, and human correction count.

Codex's 30-day forgetting and Copilot's 28-day decay are sensible designs, but where does "30 days" come from? No published experimental basis. Claude Code's auto memory has no forgetting mechanism at all — is that because memories don't go stale, or because the problem hasn't been addressed yet?

In a year when memory benchmarks are [under serious scrutiny](https://arxiv.org/abs/2507.05257) (LoCoMo has 6.4% wrong ground-truth answers, and the LLM judge accepted 63% of incorrect answers), coding agent memory evaluation is a complete blank.

## Next Post

Coding agent memory is designed for *tool users* — local, personal, session-scoped. If you're *building* an agent, the cloud platforms' memory APIs are a different world: managed storage, multi-tenant isolation, asynchronous extraction pipelines. The [next post](/posts/ai/2026-09-19-cloud-platform-memory-apis-en) breaks down memory APIs from OpenAI, Anthropic, Google, AWS, and Microsoft.

## References

- [Claude Code — Memory docs](https://code.claude.com/docs/en/memory)
- [Claude Code — Prompt caching docs](https://code.claude.com/docs/en/prompt-caching)
- [Claude Code — Model configuration docs](https://code.claude.com/docs/en/model-config)
- [Codex — AGENTS.md docs](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex — Memories docs](https://learn.chatgpt.com/docs/customization/memories)
- [Codex — Config reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex — codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)
- [OpenAI — Codex for almost everything (2026-04-16)](https://openai.com/index/codex-for-almost-everything)
- [OpenAI — Agents SDK Sandbox Memory docs](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [Gemini CLI — GEMINI.md docs](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI — Auto Memory docs](https://geminicli.com/docs/cli/auto-memory)
- [Cursor — Rules docs](https://cursor.com/docs/rules)
- [Cursor — Automations docs](https://cursor.com/docs/cloud-agents/automations)
- [Cursor 1.2 Changelog](https://cursor.com/changelog/1-2)
- [Cursor forum staff reply — Memories removed starting from 2.1.17](https://forum.cursor.com/t/memories-not-showing/143820)
- [GitHub Copilot — Repository instructions docs](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [GitHub Copilot — Memory concept docs](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [GitHub — Agentic memory for GitHub Copilot public preview (2026-01-15)](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Cognition — Introducing Devin Desktop (2026-06-02)](https://cognition.com/blog/introducing-devin-desktop)
- [Devin Desktop — Memories docs](https://docs.devin.ai/desktop/cascade/memories)
- [Devin — Knowledge docs](https://docs.devin.ai/product-guides/knowledge)
- [Coding agent session persistence and crash recovery](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery-en)
- [Seven answers to a full context window](/posts/ai/2026-08-21-context-full-seven-answers-en)
