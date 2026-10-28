---
title: "AI Agent GitHub Digest — 2026-10-29"
date: 2026-10-29
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, multi-agent, security]
lang: en
description: "GitHub trending today is dominated by skills that teach coding agents not to look AI-made, while crewAI quietly patched three security holes"
tldr: "**obra/superpowers** (⭐ 307,258, +1,096 today) and **Nutlope/hallmark** (⭐ 40,442, +2,109 today) both hit GitHub trending the same day, each teaching a coding agent not to produce output that reads as obviously AI-made; **nightly-labs/openbot** (⭐ 3,097) manages a fleet of agents from one desktop app, and **expo/skills** is an official framework team shipping its own skill pack. On the release side, pydantic-ai v2.63.0 ships a batch of compatibility changes, and crewAI v1.15.31 patches deserialization, SQL injection, and path traversal vulnerabilities."
series:
  name: "AI Agent GitHub Digest"
  order: 75
---

> 🌏 [中文版](/posts/daily/2026-10-29-ai-agent-github-digest)

## Today's Highlight

Today's GitHub trending list is dominated by skills that teach agents taste — obra/superpowers, Nutlope/hallmark, and pbakaus/impeccable all hit trending the same day, and all three are chasing the same problem: code a coding agent writes that looks AI-made at a glance. Meanwhile nightly-labs/openbot is solving a different problem — how one person keeps a whole fleet of agents under control — and even Expo's own team has shipped its own skill pack. On the framework side, pydantic-ai and crewAI both released new versions: one changes existing behavior, the other patches a security hole.

## Trending Repos

### obra/superpowers ⭐ 307,258 (+1,096)

[GitHub](https://github.com/obra/superpowers) · Shell · MIT

- **What it is**: A complete software-development methodology for coding agents, built from a set of self-triggering "composable skills" that walk the whole pipeline — teasing out requirements, breaking them into a spec, drafting an implementation plan, then handing work to subagents that execute and review each other. It supports more than a dozen harnesses, including Claude Code, Cursor, Codex, and Gemini CLI.
- **Why it matters**: Most agent skills handle a single task — write tests, look up docs. Superpowers tries to take over the entire development process itself: the agent doesn't jump straight into code when it sees you building something — it first forces you to clarify what you actually want, gets you to sign off on a spec, lays out an implementation plan around TDD, YAGNI, and DRY, then lets subagents run for hours at a stretch without drifting from the plan. It's already on Anthropic's official plugin marketplace and offers paid enterprise support, which says the development process itself is now something that can be packaged and sold.
- **Tech stack**: Markdown skill definitions + each coding agent's own plugin/marketplace mechanism (Claude Code, Antigravity, Codex, Cursor, Devin, Gemini CLI, and more)
- **Getting started**: Easy — `/plugin install superpowers@claude-plugins-official` installs it in one line, and the skills trigger automatically without manual invocation

---

### Nutlope/hallmark ⭐ 40,442 (+2,109)

[GitHub](https://github.com/Nutlope/hallmark) · CSS · MIT

- **What it is**: A design skill for Claude Code, Codex, Cursor, and OpenCode built specifically to catch the tells that make a page read as AI-generated — the eyebrow line above a heading, tracked-capital labels on every title, exactly one colored word in a headline, a hero section with nothing but a photo. It renders the page in a real browser across 50 theme "materials," lints it against those tells, then hands the result to a fresh-context reviewer agent for a final pass.
- **Why it matters**: Compare it with pbakaus/impeccable (⭐ 92,240, +1,471 today), which hit trending the same day going the "design vocabulary plus review language" route — hallmark picks a more concrete approach: 50 theme materials each tied to real screenshots, 755 licensed photos, and a three-tier gate system (Floor hard-blocks, Reflex blocks by default but can be overridden on the record with a reason, Finish is detail notes that never block). Built by Together AI, it gained 2,109 stars in a day, a sign that "giving an agent's taste a floor" is becoming table stakes rather than a nice-to-have.
- **Tech stack**: A Claude/Codex/Cursor skill (SKILL.md plus reference files) + Node.js scripts (`theme.mjs`, `sloplint.mjs`) for theme selection and browser-rendering checks
- **Getting started**: Easy — once installed, run `/hallmark` to build a page; `/hallmark audit <path>` runs an audit only, without making changes

---

### nightly-labs/openbot ⭐ 3,097 (+1,053)

[GitHub](https://github.com/nightly-labs/openbot) · TypeScript · PolyForm Noncommercial 1.0.0

- **What it is**: A local-first desktop workspace that gives Codex, Claude Code, Grok CLI, Gemini, Cursor CLI, and Cline each their own workspace and conversation, with the ability to message each other, share files, and share one embedded browser — and a mobile view to check in on progress.
- **Why it matters**: It sits in the same lane as last week's desktop multi-agent managers (Orca, Cindy), but openbot leans harder into direct agent-to-agent communication — FIFO message queues, agent-to-agent messages, replies, and file transfers, plus shared channel chats where tasks can be explicitly assigned to an owner. It's still a development preview, and agents currently run with `danger-full-access` and no per-action confirmation, which puts the entire safety boundary on the user to manage themselves — worth noting before you point it at anything you don't fully trust.
- **Tech stack**: An Electron desktop shell + ACP (Agent Client Protocol) to connect to each CLI agent + Cloudflare Workers/D1 for the account system
- **Getting started**: Medium — installers exist for every platform, but you need at least one coding agent CLI already installed (Codex, Claude Code, Grok, Cursor, or Cline), and the current full-access mode isn't suited to running untrusted tasks

---

### expo/skills ⭐ 3,482 (+212)

[GitHub](https://github.com/expo/skills) · Shell · MIT

- **What it is**: A set of AI agent skills published directly by the Expo team, covering common Expo/React Native tasks — Expo Router, Reanimated animations, native UI, design systems, data fetching, DOM components, and SDK upgrades. Claude Code and Codex install it through the official plugin marketplace; other agents use the `skills` CLI.
- **Why it matters**: Most agent skills today come from the community or third parties. expo/skills is an early example of a framework team maintaining its own skill pack directly — the skill descriptions are kept in sync with the docs by the Expo team itself, so an agent no longer has to guess at Expo's API from stale training memory. Free framework skills and paid EAS service skills are clearly grouped, which also doubles as a demonstration of how an open-source framework maintainer can monetize in the agent era.
- **Tech stack**: SKILL.md files + Expo/EAS CLI wrappers + the general-purpose `skills.sh` install protocol
- **Getting started**: Easy — `npx skills@latest add expo/skills --skill '*'` installs everything in one line, or install it through the official plugin marketplace into Claude Code or Codex

## Notable Releases

### pydantic-ai v2.63.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)

- **Key changes**: `CodeMode` now defaults to `dynamic_catalog=True`, so a newly revealed tool is appended instead of rewriting the entire cached prompt; the Harness `LLMReminder` now defaults to reminding once every 10 requests instead of generating one every time; a deferred `CombinedCapability` now loads as a single capability while its members keep their global ordering; the Gemini Live reconnect replay argument is now keyword-only.
- **Breaking changes**: Yes — all of the above are compatibility-affecting changes to existing behavior, not purely additive features.
- **What it means for you**: If your agent customizes `CodeMode`'s tool-reveal logic, tunes the Harness reminder frequency, or relies on `CombinedCapability` for deferred loading, read through this release's Compatibility Notes before upgrading to make sure nothing depends on the old behavior.

---

### crewAI v1.15.31

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/v1.15.31)

- **Key changes**: Added conversational flow context compaction; patched a path-traversal vulnerability in `output_file` via template interpolation, a deserialization vulnerability, and a SQL injection vulnerability; promoted `AgentExecutor` out of experimental status.
- **Breaking changes**: Not stated explicitly, but the security patches may break `output_file` path patterns that happened to work before.
- **What it means for you**: If you're running crewAI in production, especially with `output_file` or any output path built from user input, this release fixes genuinely exploitable security issues — worth upgrading now rather than queuing it for the next sprint.

## Today's Takeaway

I'd assumed agent skills were mostly about adding capability — one more tool, one more workflow. Watching superpowers, hallmark, and impeccable all hit trending the same day changed that: what this wave of skills is actually doing is taste governance. It's not making the agent capable of more — it's adding a "must not look AI-made" gate on top of what the agent can already do. The battleground for agent output quality has shifted from "can it be done" to "does it look like a person did it," and that's now something you can install into any coding agent with a single command.

## References

- [obra/superpowers](https://github.com/obra/superpowers) — GitHub repo
- [Nutlope/hallmark](https://github.com/Nutlope/hallmark) — GitHub repo
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — GitHub repo (mentioned in Today's Highlight for comparison)
- [nightly-labs/openbot](https://github.com/nightly-labs/openbot) — GitHub repo
- [expo/skills](https://github.com/expo/skills) — GitHub repo
- [pydantic-ai v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
- [crewAI v1.15.31 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/v1.15.31)
- [GitHub Trending (daily snapshot, 2026-10-29)](https://github.com/trending?since=daily) — primary source for today's trending list, star counts, and daily gains
