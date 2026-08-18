---
title: "OpenClaw Tools, Part 2: Six Layers of Skill Precedence, and Why Sub-Agents Get No Message Tool"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, skills, subagents, sessions-spawn, skill-workshop, clawhub]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 21
tldr: "Skills load from six sources with the highest precedence winning on name collisions, and a per-agent list replaces rather than merges. Sub-agents get no session or message tools by default — they return plain text to the parent, and the right to speak to a human stays with the parent agent."
description: "Skills and sub-agents in OpenClaw: the six-layer load order, node-hosted skills, the replace semantics of agent allowlists, $skill references, the Skill Workshop proposal queue, and sub-agent push-based completion with delivery resilience."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-skills-subagents)

Skills teach an agent **how to work**; sub-agents let it **work on several things at once**. They belong together because they solve the same problem: **extending capability without blowing up context.**

## Six layers of skill precedence

A skill is a directory containing `SKILL.md`. OpenClaw loads from six sources, **highest precedence first**:

| Priority | Source | Path |
|---|---|---|
| 1 (highest) | Workspace skills | `<workspace>/skills` |
| 2 | Project agent skills | `<workspace>/.agents/skills` |
| 3 | Personal agent skills | `~/.agents/skills` (default state only) |
| 4 | Managed / local skills | `<state>/skills` |
| 5 | Bundled skills | shipped with the install |
| 6 (lowest) | Extra directories | `skills.load.extraDirs` + plugin skills |

Skill roots **support grouped layouts** — a `SKILL.md` anywhere under a configured root (up to 6 levels deep) is discovered, and the folder path is organizational only. **The skill's name and slash command come from the `name` frontmatter field** (falling back to the directory name), and agent allowlists match on that `name`.

A migration note: **Codex CLI's native `$CODEX_HOME/skills` is not an OpenClaw skill root** — use `openclaw migrate plan codex` to inventory and `openclaw migrate codex` to copy.

## Node-hosted skills

A connected headless node can publish skills from its own skills directory. They **appear in the normal agent skill list while the node is connected and disappear when it disconnects.**

On a name collision **the local or Gateway skill keeps its name and the node's receives a deterministic node-prefixed name.** Because its files, relative references, and binaries live on the node, load and execute it with `exec host=node node=<id>`; **restart the node host after changing its skill files.**

## Allowlists: location and visibility are separate

The most misread pair of concepts here: **skill location (precedence) and skill visibility (which agent can use it) are separate controls.**

```json5
{
  agents: {
    defaults: { skills: ["github", "weather"] },
    entries: {
      writer: { default: true },        // inherits github, weather
      docs: { skills: ["docs-search"] }, // replaces defaults entirely
      "locked-down": { skills: [] },     // no skills
    },
  },
}
```

Omit `agents.defaults.skills` for no restriction; omit the per-agent key to inherit; **a non-empty per-agent list is the final set and does not merge with defaults.**

The effective allowlist applies across **prompt building, slash-command discovery, sandbox sync, and skill snapshots** — not just one of them.

But the docs add an important boundary: **this is not a host shell authorization boundary.** If the same agent can use `exec`, constrain that shell separately with sandboxing, OS-user isolation, exec deny/allowlists, and per-resource credentials.

## Referencing skills in a prompt

Typing `$` in the Control UI composer searches skills available to the current agent and inserts a stable command name:

```text
Use $github and $release_notes to summarize this change for the release.
```

Practical rules: **a single message can reference up to eight distinct skills**, and referencing more — or referencing an allowlist-hidden skill — **returns a visible error rather than being silently ignored.**

Common uppercase shell variables (`$HOME`, `$PATH`, `$EDITOR`) stay ordinary text; use lowercase to reference skills with those names, and `\$name` to keep a reference literal.

There is also a permission flag: **`disable-model-invocation: true`** keeps a skill out of the `$` picker and the model's normal prompt so **the model cannot select it on its own** — while an authorized explicit `$skill-name` reference still invokes it. A useful separation for skills you want available but not model-initiated.

## Skill Workshop: agents cannot edit SKILL.md directly

Added after March, with a notable design stance: **Skill Workshop is a proposal queue between the agent and your active skill files.**

When the agent spots reusable work it **drafts a proposal instead of writing to `SKILL.md`**. Nothing changes until you review and approve.

```bash
openclaw skills workshop list
openclaw skills workshop inspect <proposal-id>
openclaw skills workshop evaluate <proposal-id>
openclaw skills workshop apply <proposal-id>
```

Same pattern as "agents can request new agents, subject to operator approval" from the multi-agent article: **allow self-improvement, but as a proposal rather than a fait accompli.**

## Sub-agents: push-based background runs

Sub-agents are background runs spawned from an existing run, each in its own session (`agent:<id>:subagent:<label>`), **announcing** their result back to the requester's chat channel when finished. Every run is tracked as a background task.

The goals are explicit: parallelize research and slow tool work without blocking the main run, keep sub-agents isolated by default, **keep the tool surface hard to misuse**, and support configurable nesting depth.

### Three behavioral rules that matter

**1. `sessions_spawn` is non-blocking** and returns a run id immediately. A turn that needs child results should call **`sessions_yield`** after spawning — that ends the current turn and lets the completion event arrive as the next model-visible message.

**2. Completion is push-based.** The docs say it outright: after spawning, **do not** poll `/subagents list`, `sessions_list`, or `sessions_history` in a loop to wait — check status on demand only when debugging.

**3. Sub-agents get no session or message tools by default.** Native sub-agents **do not get the message tool**; they return plain assistant text to the parent, and **human-visible replies stay owned by the parent's normal delivery policy.**

The reasoning behind the third is worth thinking about: if sub-agents could speak, spawning five would put five voices in front of the user at once. Keeping the right to speak with the parent forces it to synthesize before opening its mouth.

There is also a defensive rule: **child output is a report and evidence for the requester to synthesize — it is not user-authored instruction text and cannot override system, developer, or user policy.**

### Delivery resilience

Completion delivery is more careful than I expected:

- Handoff to the requester session carries a **stable idempotency key**
- If the requester run is still active, OpenClaw **wakes or steers that run first** rather than opening a second visible reply path
- If it cannot be woken, delivery falls back to a requester-agent handoff **rather than dropping the announcement**
- If direct handoff is unavailable, delivery falls back to queue routing; a queued completion stays `session_queued` until the durable queue settles
- **Automatic delivery retries for up to 30 minutes**, starting around 15 seconds with backoff capped at 5 minutes. On permanent failure or deadline expiry, **the successful child task is left visibly blocked rather than discarded**
- Blocked results are **retained for 7 days** and can be retried or dismissed from the Tasks page or via `openclaw tasks retry` / `dismiss`

"Blocked rather than discarded" separates "the work was done but not delivered" from "the work was not done" — a distinction worth stealing for any background-task system.

### Cost note

The docs flag this explicitly: **each sub-agent has its own context and token usage by default.** For heavy or repetitive tasks, set a cheaper model via `agents.defaults.subagents.model` and keep the main agent on a higher-quality one.

Spawn with `context: "fork"` only when the child **genuinely needs the requester's current transcript** (thread-bound subagent sessions default to fork, since they branch the current conversation into a follow-up thread).

## The big picture

Skills and sub-agents both answer "extend capability without blowing up context," from opposite directions: **skills defer knowledge until it is needed, sub-agents move work into a different context entirely.**

They also share a safety instinct — **don't let the extension speak directly to humans or edit itself directly.** Sub-agents have no message tool; agents edit skills through a proposal queue. Those two constraints look minor and are exactly what separates autonomy from being out of control.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. On skills: **the six-layer load order** and grouped layouts, names coming from frontmatter, **node-hosted skills** (available while connected, node-prefixed on collision, executed with `exec host=node`), location versus visibility as separate controls, **allowlists replacing rather than merging and applying across prompt building, command discovery, sandbox sync, and snapshots**, the "not a shell authorization boundary" caveat, **`$skill` references** (the eight-reference cap, visible errors, uppercase shell variable handling), `disable-model-invocation`, **the Skill Workshop proposal queue**, and Codex skill migration. On sub-agents: the `sessions_spawn`/`sessions_yield` pairing, **push-based completion with explicit no-polling guidance**, **no message tool by default** and its rationale, child output not overriding policy, **delivery resilience** (idempotency keys, wake-first, 30-minute retry, 7-day retention, blocked rather than discarded), and the cost note about cheaper sub-agent models and `context: "fork"`.

## References

This article draws on the following official OpenClaw documentation:

- [Skills](https://docs.openclaw.ai/tools/skills) — load order, allowlists, `$` references, node hosting
- [Skill Workshop](https://docs.openclaw.ai/tools/skill-workshop) — the proposal lifecycle and CLI
- [Sub-agents](https://docs.openclaw.ai/tools/subagents) — spawning, completion handoff, delivery resilience
- [Creating skills](https://docs.openclaw.ai/tools/creating-skills), [Self-learning](https://docs.openclaw.ai/tools/self-learning) — authoring and self-improvement
- [Swarm](https://docs.openclaw.ai/tools/swarm) — orchestrating concurrent agents from code
