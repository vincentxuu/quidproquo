---
title: "AI Agent GitHub Digest — 2026-08-29"
date: 2026-08-29
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-skills, agent-memory]
lang: en
description: "OpenMontage packages an entire video-production pipeline as 700+ agent skills, claude-plugins-official rounds out the official plugin marketplace, and coding-agent memory and observability are getting foundational work at the same time"
tldr: "calesthio/OpenMontage turns a general-purpose coding agent into a full video-production studio with 12 pipelines and 700+ skill files, jumping to 50k stars this week; Anthropic's own official plugin marketplace claude-plugins-official gained +292 stars in a single day; rohitg00/agentmemory gives coding agents cross-session memory via BM25 + vector + knowledge graph retrieval, claiming 95.2% R@5 on its own LongMemEval-S benchmark; sodiumsun/agenttrail builds a local, real-time task map for Claude Code, Codex, and Cursor. No major framework releases today."
series:
  name: "AI Agent GitHub Digest"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-08-29-ai-agent-github-digest)

## Today's Highlights

Today's projects happen to sit at opposite ends of the agent capability stack. OpenMontage shows just how thick the "application layer" can get: 700-plus skill files turn a general-purpose coding agent into a full video-production studio. agentmemory and agenttrail, meanwhile, are patching two thin spots in the underlying infrastructure — one keeps memory alive across sessions, the other lets you actually see what an agent is doing. Anthropic's own official plugin marketplace is still growing too, a sign that the ecosystem's "trust layer" is catching up in parallel.

## Trending Repos

### calesthio/OpenMontage ⭐ 50,000+ (+1,000 this week)

[GitHub](https://github.com/calesthio/OpenMontage) · Python · MIT

- **What it is**: a video-production system driven entirely by instructions rather than hardcoded pipeline logic. Every step across its 12 pipelines — research, scripting, asset generation, editing, compositing — is directed by a pipeline manifest plus stage-director skill files, with your AI coding assistant (Claude Code, Cursor, and Codex all work) acting as the sole orchestrator.
- **Why it's worth a look**: most "AI video tools" amount to a Ken Burns effect over static images. OpenMontage actually cuts a video with real motion, sourced from free stock-asset and open-file libraries, with an auditable scoring trail at every decision point (scoring 14 video models, 10 image models, and 4 voice engines across 7 dimensions). Its core argument is blunt: you don't need a dedicated binary for a "video agent" — a sufficiently complete skill folder handed to a general-purpose agent is enough. That tracks with where the agent-skill ecosystem has been heading for weeks now, just scaled up to 700-plus files.
- **Tech Stack**: Python tooling plus Markdown/YAML skill definitions, with a model layer that plugs into providers like Veo, FLUX, and Kling
- **Getting Started**: Medium — `make setup` gets you running, but you still need at least one video/image/voice provider API key of your own, and the learning curve across 700+ skill files isn't small

---

### anthropics/claude-plugins-official ⭐ 55+ plugins (+292 today)

[GitHub](https://github.com/anthropics/claude-plugins-official) · JSON/Markdown · N/A

- **What it is**: Anthropic's officially maintained plugin marketplace for Claude Code, split into `/plugins` (built and maintained by Anthropic itself) and `/external_plugins` (vetted third-party plugins, including Supabase, Firebase, Discord, and Telegram integrations), installable directly via `/plugin install`.
- **Why it's worth a look**: compared with community marketplaces like `cursor/plugins` and `claude-plugins-community` we covered on 08/21, this is Anthropic's own first-party catalog. External plugins need to pass an extra round of manual quality and security review to earn an "Anthropic Verified" badge, which means Anthropic is directly underwriting trust in the plugin ecosystem instead of leaving the entire vetting process to the community. For enterprise users, this marketplace is also pre-listed in `strictKnownMarketplaces`, so admins don't need to manually approve it.
- **Tech Stack**: a single `.claude-plugin/marketplace.json` file as the registry; external plugins use `git-subdir` or `url` sources pinned to a specific commit SHA
- **Getting Started**: Low — loaded automatically when Claude Code starts; browse and install directly from `/plugin > Discover`

---

### rohitg00/agentmemory ⭐ growing fast (trending on GitHub's TypeScript chart)

[GitHub](https://github.com/rohitg00/agentmemory) · TypeScript · N/A

- **What it is**: a persistent-memory engine for any coding agent that speaks MCP or REST — Claude Code, Cursor, Codex CLI, Gemini CLI, and others. It uses 12 hooks to automatically capture what an agent has done, compresses that into searchable memory, and re-injects the relevant context the next time a session starts.
- **Why it's worth a look**: built-in memory files like CLAUDE.md or `.cursorrules` degrade once they pass around 200 lines. agentmemory instead uses hybrid retrieval — BM25 plus vector plus knowledge graph, fused with RRF — and ran its own LongMemEval-S evaluation (a 500-question long-term-memory benchmark from ICLR 2025), reporting 95.2% R@5. The project's own docs are upfront that this number comes from its own measurement and isn't directly comparable to numbers other tools like mem0 or Letta report on a different benchmark (LoCoMo) — that kind of explicit methodology disclosure is rare among similar projects.
- **Tech Stack**: SQLite plus a built-in `iii` engine, local embeddings via `all-MiniLM-L6-v2` (no API key needed), 54 MCP tools plus a REST API
- **Getting Started**: Medium — a single server can let multiple agents share one memory store, but you need to run a background server to unlock the full 54-tool set, or MCP falls back to a slimmed-down 7 tools

---

### sodiumsun/agenttrail ⭐ 194 (created 8/21, growing)

[GitHub](https://github.com/sodiumsun/agenttrail) · Node.js · MIT

- **What it is**: a local, open-source observability layer for coding agents that renders a live map of Claude Code's, OpenAI Codex's, Cursor's (or any file-editing agent's) plans, tool calls, file changes, and progress in real time.
- **Why it's worth a look**: unlike cloud-based agent monitoring platforms, agenttrail is deliberately zero-dependency — a daemon Node process plus a static HTML page, no build step, no cloud service, no account. Claude Code gets the richest live view via a local hook (task lists, streaming tool-call lines, elapsed time), while other agents stay in sync through a file watcher plus `AGENTS.md`, tested on a repo with 78,000 files. When you're running several agent sessions at once, this tool solves the very real "which agent is touching which file right now" problem.
- **Tech Stack**: Node.js daemon with SSE push and a static HTML frontend
- **Getting Started**: Low — the `init` command writes conventions into `CLAUDE.md`/`AGENTS.md` automatically and installs an extra local Claude Code hook

## Notable Releases

No major framework updates today. We already covered Agno v3.0 (8/25, 8/26), CrewAI 1.15.18's conversational Flow graduating to stable (8/28), and pydantic-ai's compatibility break from `anthropic` 1.0.0 (8/20–8/22) earlier this week — today's changes across frameworks (LangGraph `sdk==0.4.4`, Mastra `@mastra/core@1.63.0`) are routine patches not worth a separate writeup.

## Today's Takeaway

I used to assume "agent skill standardization" mainly solved general-purpose scenarios like reading/writing to Notion or querying a database. Seeing OpenMontage turn an entire video-production pipeline into 700-plus skill files made it click that the skill mechanism can absorb any vertical domain with well-defined process knowledge that nobody's bothered to turn into code — the only variable is whether you're willing to spend the time writing "how to be a good video editor" down as Markdown.

## References

- [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)
- [OpenMontage — Repository Radar](https://repositoryradar.dev/repo/calesthio/openmontage)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- [Claude Code Plugins: Anthropic's Official Plugin Ecosystem Explained — Groundy](https://groundy.com/articles/claude-code-plugins-anthropic-s-official-plugin-ecosystem/)
- [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory)
- [agentmemory Benchmark Comparison](https://github.com/rohitg00/agentmemory/blob/main/benchmark/COMPARISON.md)
- [sodiumsun/agenttrail](https://github.com/sodiumsun/agenttrail)
