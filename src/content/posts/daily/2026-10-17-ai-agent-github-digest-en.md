---
title: "AI Agent GitHub Digest — 2026-10-17"
date: 2026-10-17
category: daily
tags: [ai-agent, github, open-source, daily]
lang: en
description: "Claude Code's plugin directory tops trending as harnesses, methodologies, and even job-hunting frameworks build on top of it; Agno v3.1.4 makes agent sessions resumable across machines"
tldr: "claude-plugins-official (40,252 stars, +1,552 today) is Anthropic's official Claude Code plugin directory, setting governance rules like immutable plugin names; superpowers (300,542 stars, +973) is a software-development-methodology plugin installed through that same directory; ruflo (75,533 stars, +672) wraps Claude Code/Codex into a multi-agent swarm meta-harness; ai-job-search (48,176 stars, +879) is a job-hunting framework built by a laid-off geophysicist on Claude Code — he used it to land his own job. Release: Agno v3.1.4 lets ClaudeAgent/CodexAgent run inside isolated Docker or AWS AgentCore sandboxes, with checkpoints that let sessions resume across machines."
series:
  name: "AI Agent GitHub Digest"
  order: 63
---

> 🌏 [中文版](/posts/daily/2026-10-17-ai-agent-github-digest)

## Today's Highlight

Today's trending list circles almost entirely around Claude Code as a harness itself: Anthropic's official plugin directory gained 1,552 stars in a single day, while superpowers turns it into a development methodology, ruflo wraps it into a multi-agent swarm, and ai-job-search uses it as a full job-hunting pipeline. Claude Code is shifting from "a CLI" into the foundation other people build their houses on.

## Trending Repos

### anthropics/claude-plugins-official ⭐ 40,252 (+1,552)

[GitHub](https://github.com/anthropics/claude-plugins-official)　·　Python　·　Apache-2.0

- **What it is**: Anthropic's own, officially maintained directory of Claude Code plugins. Internal plugins (`/plugins`) and third-party ones (`/external_plugins`) are kept in separate folders, and installing one is as simple as `/plugin install {name}@claude-plugins-official`.
- **Why it matters**: There's no new technology here — what matters is the governance it establishes. A published plugin name is an immutable slug; renaming it requires adding an entry to the top-level `renames` map in `marketplace.json` so existing installs migrate automatically. In other words, this repo turns Claude Code's plugin system from "everyone rolls their own" into a versioned supply chain. +1,552 stars today is also unusually high for a repo Anthropic runs itself.
- **Tech stack**: Pure config files (`plugin.json` + `marketplace.json`) plus a review process — no runtime code involved
- **Getting started**: Easy — browse via `/plugin > Discover` or run the install command directly; the bottleneck is passing review, not the tech

---

### obra/superpowers ⭐ 300,542 (+973)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: A "software development methodology" packaged as a plugin that installs into a dozen-plus harnesses — Claude Code, Codex, Cursor, and more. It forces the agent to first nail down what you're actually trying to build, break the spec into digestible chunks, and lay out a YAGNI/DRY implementation plan before letting subagents actually write code.
- **Why it matters**: It and the official plugin directory above validate each other — superpowers itself is installed as a plugin from `claude-plugins-official`, which shows that "skill-driven development workflow" has moved from personal habit to a packaged, cross-harness-installable product, rather than something tied to Claude Code alone.
- **Tech stack**: Shell scripts plus multiple `SKILL.md` files; installation path varies by host harness (Claude Code goes through the official marketplace, others use their own plugin systems)
- **Getting started**: Easy — no extra configuration after install; skills trigger automatically based on conversation content

---

### ruvnet/ruflo ⭐ 75,533 (+672)

[GitHub](https://github.com/ruvnet/ruflo)　·　TypeScript　·　MIT

- **What it is**: A "meta-harness" wrapped around Claude Code/Codex. The author's framing is "Agent = Model + Harness," and ruflo is that harness layer — managing 100+ specialized agents, coordinating swarms, running local vector memory, and even letting agents on different machines talk to each other through federation.
- **Why it matters**: Projects that "wrap another harness around the harness" have been showing up on trending a lot lately, a sign that a single agent in a single conversation is no longer enough — developers are starting to treat multi-agent coordination as its own infrastructure problem, instead of each project rolling its own solution.
- **Tech stack**: TypeScript + an npm package (`npx ruflo`) + an MCP server, also distributed as a Claude Code plugin
- **Getting started**: Medium — `npx ruflo init` gets a minimal setup running in one line, but swarms, federation, and the 314 MCP tools need extra configuration and reading the docs

---

### MadsLorentzen/ai-job-search ⭐ 48,176 (+879)

[GitHub](https://github.com/MadsLorentzen/ai-job-search)　·　Python　·　MIT

- **What it is**: A job-hunting framework that turns Claude Code into a full-stack workflow — `/scrape` finds openings, `/apply` scores fit and drafts a tailored CV and cover letter (typeset in LaTeX), and `/interview` helps you prepare. The core pipeline is language- and country-agnostic; only the job-portal search skills are built for the Danish market.
- **Why it matters**: The author, a geophysicist laid off from his job, used this exact workflow himself — 69 tailored applications, 20 first-round interviews, and one signed contract later, he started as an AI engineer in June. It's a rare case of applying agent tooling to something as high-stakes and privacy-sensitive as a job search, with the real numbers published openly instead of just a demo.
- **Tech stack**: Claude Code CLI + Python 3.10+ + Bun (job-search CLI) + LaTeX (`lualatex`/`xelatex` for typesetting the CV and cover letter)
- **Getting started**: Medium — requires a Claude Code subscription, Bun, and a full LaTeX distribution; the job-search skills default to Danish job sites, so switching regions means editing the skill yourself

## Notable Releases

### Agno v3.1.4

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.4)

- **Key changes**: `ClaudeAgent`/`CodexAgent` gain a `sandbox=` parameter that runs the entire harness process inside an isolated, per-session computer separate from the host. Session state is kept through a lease row plus checkpoints in Postgres, so a turn can keep going even after losing the container, the host, or the replica that ran the last turn. Two sandbox providers ship: `DockerSandbox` (UID 1000, read-only filesystem, every privilege dropped) and `AgentCoreSandbox` (running on AWS Bedrock AgentCore's Firecracker microVMs), plus a "warm sandbox" that keeps a session's computer around for 300 seconds by default so back-to-back turns skip the cold start (4.6s vs. 8.2s on Docker).
- **Breaking changes**: The sandbox provider packages moved to `agno.sandbox.docker` and `agno.sandbox.agentcore`, so `DockerCheckpointTransfer` imports need updating. The new `require_native_resume`/`strict_persistence` options default to stricter behavior: what used to silently fall back to a fresh conversation when session state couldn't be restored now raises a `native_state_missing` error instead.
- **What this means for you**: If your project imports classes from `agno.sandbox`, update the import paths. If your session-recovery logic relied on the old silent fallback to a fresh conversation, confirm the new strict checks won't block a normal flow before upgrading.

## Today's Takeaway

I used to think a "sandbox" was just an isolated environment to stop an agent from breaking things. Looking at Agno's warm-sandbox and checkpoint-recovery design today made it clear the real problem being solved is harder: making a session resumable on any machine. That's the same thread running through the official plugin directory locking down plugin names and ruflo's cross-machine federation — agent infrastructure is converging on "resumable and portable," rather than each project solving its own narrow slice of the problem.

## References

- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [obra/superpowers](https://github.com/obra/superpowers)
- [ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search)
- [Agno v3.1.4 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.4)
- [GitHub Trending (2026-10-17)](https://github.com/trending?since=daily)
