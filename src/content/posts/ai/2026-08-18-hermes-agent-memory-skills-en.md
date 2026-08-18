---
title: "Memory and Skills in Hermes Agent: A System That Rewrites Itself, and Where You Can Intervene"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, memory, skills, self-improvement, agentskills, curator]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 6
tldr: "Hermes memory has hard caps: 2,200 characters for MEMORY.md and 1,375 for USER.md, and an over-limit write returns an error instead of auto-compacting, forcing the agent to make room itself. Skills are maintained by a curator that runs every 7 days after 2 hours of idle, marks skills stale at 30 days and archives at 90 — but never deletes. The switches actually worth flipping are `memory.write_approval` and `skills.write_approval`, which stage the background self-improvement writes for review."
description: "How memory and skills work in Hermes Agent: character caps and the frozen system-prompt snapshot, memory versus session search, write-approval staging, the curator's state machine and defaults, and the Skills Hub plus the agentskills.io standard."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-memory-skills)

Post 6 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

This is the layer Hermes bets hardest on, and the only one where things happen without you configuring anything. The clearest way to hold it is as three containers: **small memory that's always present**, **large skills loaded on demand**, and **unlimited history you have to go looking for**.

## Memory: caps smaller than you expect

| File | Purpose | Character cap |
|---|---|---|
| `MEMORY.md` | The agent's own notes — environment facts, conventions, lessons | 2,200 chars (~800 tokens) |
| `USER.md` | User profile — preferences, communication style, expectations | 1,375 chars (~500 tokens) |

Both live in `~/.hermes/memories/`, totaling about 1,300 tokens. That ceiling is a design choice, not a limitation: "Character limits keep memory focused."

Three behaviors to internalize:

**It does not auto-compact.** When a write would exceed the cap, the `memory` tool returns an error and the agent must consolidate or remove entries in the same turn before retrying. `replace` is bound by the same rule — swapping a short entry for a longer one can still overflow.

**It's a frozen snapshot.** Memory loads at session start and is injected into the system prompt, then **never changes mid-session**. Entries the agent adds are persisted to disk immediately but don't reach the system prompt until the next session. That's deliberate: it preserves the LLM prefix cache (the same economics as the one-hour prompt cache from [the providers post](/en/posts/ai/2026-08-18-hermes-agent-providers)). Tool responses always show live state.

**It's scanned before acceptance.** Entries are checked for prompt-injection, credential-exfiltration, and SSH-backdoor patterns, and anything containing invisible Unicode is blocked outright. The reason is hard-edged: these strings go into the system prompt.

One more, filed under a caution and easy to violate in practice: **don't point two agent processes at the same Hermes home.** Memory writes are automatic, so two writers compound each other's entries into state neither of them authored. Give a second agent its own profile, and use an external memory provider if they genuinely need to share.

## Memory versus session search: two different cost structures

This comparison is worth reproducing whole, because it explains why memory is kept so small:

| | Persistent memory | Session search |
|---|---|---|
| Capacity | ~1,300 tokens | Unlimited (all sessions) |
| Speed | Instant (already in the prompt) | ~20ms FTS5 query, ~1ms scroll |
| Cost | **Paid on every prompt** | Free — no LLM calls |
| Management | Curated by the agent | Automatic — everything is stored |

Every CLI and messaging session lands in `~/.hermes/state.db` with SQLite FTS5 full-text search. `session_search` returns actual messages from the database — **no LLM summarization, no truncation** — and the agent can scroll forward and backward inside any session it finds.

So the rule is clean: **facts that must always be present go in memory; "did we discuss X last week?" goes to search.** Cramming the latter into memory just evicts the things that mattered.

## Skills: procedural memory, loaded on demand

Skills are SKILL.md documents under `~/.hermes/skills/`, using **progressive disclosure** — only names and short descriptions sit in context until one is loaded in full. The format follows the [agentskills.io](https://agentskills.io/specification) open standard. Every installed skill becomes a slash command (`/plan`, `/github-pr-workflow`), and you can stack up to five in one message.

The agent manages skills through the `skill_manage` tool: `create`, `patch` (preferred, since only changed text travels in the tool call), `edit`, `delete`, `write_file`, `remove_file`. The system prompt asks it to record a workflow when it solved a repeatable multi-step task, when it hit dead ends and found the working path, or when you corrected its approach.

Want a clean profile? `bash -s -- --no-skills` at install, `hermes profile create research --no-skills` for a named profile, or `hermes skills opt-out` afterward. That writes a `.no-bundled-skills` marker so the installer and every `hermes update` skip bundled-skill seeding. The optional `--remove` deletes **only unmodified** bundled skills — anything you edited, installed from the hub, or wrote yourself is kept.

The Skills Hub (`hermes skills browse` / `search` / `inspect` / `install`) pulls from online registries, `skills.sh`, and the official optional catalog, and **runs a security scan on install**.

## Two switches worth turning on deliberately

By default the agent writes both memory and skills freely — **including from the background self-improvement review that runs after each turn.** That is precisely where "the agent rewrites itself" lives.

```yaml
memory:
  write_approval: true
skills:
  write_approval: true
```

The behaviors differ once on. Memory writes prompt **inline** in the interactive CLI (entries are small enough to read in full), while everywhere else — messaging platforms, scripts, the background review — they're **staged**. Skill writes are always staged, because a SKILL.md is too large to review inline; staged writes live in `~/.hermes/pending/skills/` and survive restarts.

The review flow is symmetric:

```
/memory pending | /memory approve <id> | /memory reject <id>
/skills pending | /skills diff <id> | /skills approve <id> | /skills reject <id>
```

The docs frame `memory.write_approval` as the answer to "the agent saved a wrong assumption about me." I'd add: **if you plan to run Hermes resident and attached to messaging platforms, both switches should be on from the start**, because in those contexts nobody is watching for an inline prompt.

Don't confuse `skills.guard_agent_created` with approval either: **that's a content scanner (dangerous-pattern heuristics), not a gate**, and the two are independent.

Visibility of the background review is controlled by `display.memory_notifications`: `off` (still writes, just doesn't tell you), `on` (default, shows `💾 Memory updated`), or `verbose` (with a preview of the change). Note that `off` is not a disable — **it silences the notification while writes continue**.

## The curator: why the skill library doesn't grow forever

Auto-created skills inevitably pile up. The curator is the background maintenance pass for exactly that: it tracks how often each skill is viewed, used, and patched, walks unused ones through `active → stale → archived`, and periodically runs an auxiliary-model review proposing consolidations.

It isn't cron-driven but idle-driven — it forks a background AIAgent only when **more than `interval_hours` (default 7 days) has passed and the agent has been idle for `min_idle_hours` (default 2 hours)**. The fork runs in its own prompt cache and never touches your live conversation.

A run has two phases:

1. **Deterministic transitions, no LLM**: unused for 30 days → `stale`; unused for 90 days → moved to `~/.hermes/skills/.archive/`.
2. **LLM consolidation**: **off by default**. With `curator.consolidate: true` it builds umbrellas and merges overlapping skills; the docs note a full sweep typically takes 50–100 API calls.

Several protections here are worth stealing for your own systems:

- **It never auto-deletes.** The worst case is archival into `.archive/`, which is recoverable.
- **Pinned skills and any skill referenced by a cron job — including paused ones — are skipped entirely**, so a slow schedule can't have its skill archived out from under it.
- **Never-used skills get a grace floor**: `use_count == 0` skills aren't archived until they're at least `stale_after_days` old. Upstream's reasoning fits in one line — zero uses is absence of evidence, not proof the skill is disposable.
- **It doesn't run on a fresh install.** The first observation just seeds `last_run_at` to now and defers the first real pass by a full interval, giving you time to review or opt out. Preview with `hermes curator run --dry-run`.

To see what the agent has actually learned, `hermes journey` (or `/journey`) plots skills and memory entries on a timeline and supports `list` / `delete` / `edit` — where **deleting a skill archives it recoverably, but deleting a memory chunk removes it for real**.

## The judgment call

Self-improvement isn't one switch; it's four or five separately tunable mechanisms whose defaults all lean toward "automatic." That's the right default for exploratory use on a personal laptop. The moment this agent starts answering messaging platforms, running schedules, and touching your files, **turn `write_approval` on and run the curator's dry-run once** — that's how you find out what it learned this week.

Next: [tools, MCP, and plugins](/en/posts/ai/2026-08-18-hermes-agent-tools-plugins), including how they keep 3,300 MCP tools from eating the context window.

## References

- [Hermes Agent — Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Hermes Agent — Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Agent — Memory Providers](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [agentskills.io specification](https://agentskills.io/specification)
- [Honcho](https://honcho.dev/)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
