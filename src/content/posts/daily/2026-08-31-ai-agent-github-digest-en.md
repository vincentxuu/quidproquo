---
title: "AI Agent GitHub Digest — 2026-08-31"
date: 2026-08-31
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, agent-coding]
lang: en
description: "agno v3.0.2 lets Agents, Teams, and Workflows publish themselves as named MCP tools; GitHub's trending charts surfaced two Agent Skills libraries for completely different audiences, plus a coding-agent fork that out-benchmarked the original it forked from"
tldr: "can1357/oh-my-pi forked the well-known coding agent 'Pi' and, by obsessing over tool-call formats, pushed Grok Code Fast 1's task success rate from 6.7% to 68.3%; K-Dense-AI/scientific-agent-skills opens 163 research skills to any agent that supports the Agent Skills standard; addyosmani/agent-skills packages a senior engineer's six-stage workflow into a skill set and hit 90k stars in a week; THU-MAIC/OpenMAIC v1.0.0 adds a conversational Pro workbench, landing multi-agent orchestration in the concrete vertical of course content production. On the framework side, agno v3.0.2 is the one release that clears the bar: it publishes Agents/Teams/Workflows as named MCP tools and ships several breaking changes along the way."
series:
  name: "AI Agent GitHub Digest"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-08-31-ai-agent-github-digest)

## Today's Highlights

Today's thread is "MCP is becoming the standard layer through which agents expose capabilities to each other" — agno v3.0.2 lets `Agent`, `Team`, and `Workflow` publish themselves as named MCP tools with one line of config. GitHub's trending charts, meanwhile, surfaced two Agent Skills libraries aimed at completely different audiences: one packages a senior engineer's standard operating procedures for coding agents, the other packages 200+ research databases for scientists. And oh-my-pi, a one-person fork, out-benchmarked the original Pi by tuning harder — a reminder that the tool-calling format underneath coding agents is still far from settled.

## Trending Repos

### can1357/oh-my-pi ⭐ 28,455

[GitHub](https://github.com/can1357/oh-my-pi) · TypeScript + Rust · MIT

- **What it is**: a hardened fork of Mario Zechner's open-source terminal coding agent "Pi," wired up to 60+ model providers, 31 built-in tools, 14 LSP operations, and 28 DAP (debug adapter protocol) operations, with its core rewritten in Rust (roughly 80k lines).
- **Why it's worth a look**: the original Pi is already a well-known lightweight coding agent, so omp didn't try to reinvent it — instead it obsessed over the one detail most projects skip: tool-call format. The project's published benchmarks show that swapping in omp's edit/read/grep format for the same model pushes Grok Code Fast 1's task success rate from 6.7% to 68.3%, and cuts Grok 4 Fast's output tokens by 61%. Same model, and just swapping the tool interface produces an order-of-magnitude difference — a direct signal for anyone building their own agent harness.
- **Tech Stack**: TypeScript CLI/TUI + a Rust core (LSP/DAP engine) + the Bun runtime; installable via curl script, Homebrew, Nix, or Bun across all platforms.
- **Getting Started**: Low — `curl -fsSL https://omp.sh/install | sh` or `brew install can1357/tap/omp` gets you running. PRs are currently open to everyone (previously they required a maintainer vouch).

---

### K-Dense-AI/scientific-agent-skills ⭐ 38,894

[GitHub](https://github.com/K-Dense-AI/scientific-agent-skills) · Python · MIT

- **What it is**: a library of 163 ready-to-use research skills (cancer genomics, drug-target binding, molecular dynamics, time-series forecasting, and more) plus 100+ scientific databases, packaged so any agent that supports the open Agent Skills standard can install them — formerly known as the Claude-only "Claude Scientific Skills."
- **Why it's worth a look**: the rename from "Claude-only" to "works with any agent" is itself a signal — the skill ecosystem is moving from being locked to a single agent platform toward an open standard any vendor can consume. The project claims adoption by 190,000 scientists, and it pairs with an open-source, locally-runnable "AI co-scientist" (K-Dense BYOK) that demonstrates a full research workflow — a ready-made starting point for anyone wiring agents into a lab or research team instead of inventorying database APIs from scratch.
- **Tech Stack**: Markdown/YAML skill definitions plus Python tooling scripts; compatible with Cursor, Claude Code, Codex, and Google Antigravity.
- **Getting Started**: Low — install per the Agent Skills standard; individual skills can be picked separately.

---

### addyosmani/agent-skills ⭐ 90,900

[GitHub](https://github.com/addyosmani/agent-skills) · JavaScript · MIT

- **What it is**: a "senior engineer workflow" skill pack curated by Google Chrome engineer Addy Osmani, packaging best practices across six stages — Define → Plan → Build → Verify → Review → Ship (spec-driven development, TDD, a five-axis code review, and more) — into 25 auto-triggering skills and 9 slash commands.
- **Why it's worth a look**: most agent skill libraries teach "how to use a particular tool"; this one turns "how a senior engineer actually makes decisions" into a process. `/build auto`, for example, generates a plan you approve once, then runs every task automatically with tests and commits — but still pauses on failures or high-risk steps for a human call, rather than running fully unattended. Combined with the author's standing in the frontend/performance community, the repo hit 90k stars within a week, a sign that "process" skills — not just "knowledge" skills — are gaining real adoption.
- **Tech Stack**: Markdown skill definitions bound to slash commands, installed in one line into 70+ agents via the open-source `skills` CLI.
- **Getting Started**: Low — `npx skills add addyosmani/agent-skills` installs everything, or use `--skill` to pick a single one.

---

### THU-MAIC/OpenMAIC ⭐ 23,594

[GitHub](https://github.com/THU-MAIC/OpenMAIC) · TypeScript · MIT

- **What it is**: a Tsinghua University project that generates immersive multi-agent courses in one click, having just shipped v1.0.0 on August 27 with a new "Pro workbench" that lets you plan a curriculum, generate pages, and revise materials through a chat interface with an agent.
- **Why it's worth a look**: this is one of the rare open-source projects that lands multi-agent orchestration in a concrete vertical — education content production — with a complete product loop: upload documents, audio, or video as source material; an agent plans the course structure; 20 built-in skills handle slides, quizzes, and interactive elements; and the result exports as an offline classroom package. Where most multi-agent frameworks still stop at demoing "how a few agents talk to each other," OpenMAIC shows what it looks like to wire multi-agent orchestration into a real content-production pipeline.
- **Tech Stack**: TypeScript plus the `@openmaic/*` SDK family (DSL/renderer/importer), with swappable models, media, search providers, and storage backends.
- **Getting Started**: Medium — the one-click generation mode is simple, but the Pro workbench's agent planning and server-side persistence need extra setup for a storage backend (the project ships a one-command Postgres option).

## Notable Releases

### agno v3.0.2

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.2)

- **Key changes**: `MCPConfig.tools` now accepts `Agent`, `Team`, and `Workflow` instances, remote proxies, and `Toolkit` objects directly, publishing each as its own named MCP tool (an agent named `chief` becomes a tool called `chief`, instead of requiring callers to invoke `run_agent(agent_id="chief")`); `run()`'s `metadata` resolution order changes to component → session → call-site; new integrations land for the Synthorai model provider, WaveSpeed image/video generation, Serply search, and AtomicMail.
- **Breaking Changes**: `MCPConfig`/`MCPServerConfig` now raise on unrecognized keyword arguments instead of silently ignoring them; `BaseRemote.acancel_run` gains a required `auth_token` parameter, so third-party `BaseRemote` subclasses need to add it; `AgentOS(mcp=...)`, `MCPConfig`, and `default_tools` are the new spellings for `mcp_server=`, `MCPServerConfig`, and `enable_builtin_tools` — the old names still work as aliases for now but are slated for removal in 3.1.
- **What it means for you**: if you're already using agno to expose agents as a service, you can now publish an entire Agent or Team as an MCP tool directly instead of hand-rolling a `run_agent` wrapper. But check for any custom `BaseRemote` subclass or code relying on the old `MCPServerConfig` name before upgrading — go through the changelog line by line, since the new validation will raise at boot rather than fail silently.

## Today's Takeaway

I used to think the "Agent Skills ecosystem" story was mainly about how many skills a library ships. But putting K-Dense's rename from "Claude-only" to "works with any agent" next to agno turning the agent itself into an MCP tool side by side, they look like two faces of the same trend — whether it's a skill or the agent itself, everything is converging toward "wrap it behind one standard interface any host can call," rather than each project building its own plugin system.

## References

- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [oh-my-pi README](https://raw.githubusercontent.com/can1357/oh-my-pi/main/README.md)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)
- [scientific-agent-skills README](https://raw.githubusercontent.com/K-Dense-AI/scientific-agent-skills/main/README.md)
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- [agent-skills README](https://raw.githubusercontent.com/addyosmani/agent-skills/main/README.md)
- [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)
- [OpenMAIC README](https://raw.githubusercontent.com/THU-MAIC/OpenMAIC/main/README.md)
- [agno v3.0.2 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.2)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
