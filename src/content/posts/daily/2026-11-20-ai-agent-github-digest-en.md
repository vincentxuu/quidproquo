---
title: "AI Agent GitHub Digest — 2026-11-20"
date: 2026-11-20
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mastra, claude-code]
lang: en
description: "obra/superpowers rockets past 320,000 stars in a single day as the Agent Skills open standard goes mainstream, and Cursor turns its plugin spec into a first-class feature"
tldr: "obra/superpowers gained +2,029 stars in a day to approach 320,000 total; Cursor's official plugin spec cursor/plugins gained +383. Mastra shipped Storage Version 2 to sharply cut workflow storage costs, and Claude Code v2.1.328 extended Auto mode to enterprise cloud gateways."
series:
  name: "AI Agent GitHub Digest"
  order: 97
---

> 🌏 [中文版](/posts/daily/2026-11-20-ai-agent-github-digest)

## Today's Highlight

Today's GitHub trending page is dominated by one story: the Agent Skills open standard going mainstream. `obra/superpowers` gained 2,029 stars in a single day, pushing its total past 320,000 — one of the fastest-growing agent-related repos ever. Cursor turned its own plugin spec, `cursor/plugins`, into a first-class feature compatible with the Agent Skills standard, and HKUDS extended the same idea further: making any piece of software callable by an agent through a command line. On the tooling side, Mastra and Claude Code both shipped solid updates this week too.

## Trending Repos

### obra/superpowers ⭐ 321,913 (+2,029)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: A complete software-development methodology packaged as skills for coding agents — not a single trick, but the full workflow from gathering requirements, to writing a plan, to breaking it into tasks, to TDD implementation, to code review and merging. It supports more than a dozen agent tools, including Claude Code, Codex, Cursor, Antigravity, Gemini CLI, Devin CLI, and Factory Droid.
- **Why it matters**: The core mechanism is automatic triggering — you never invoke a skill by name. The agent sees you planning a feature and loads the brainstorming skill on its own, then hands off to writing-plans, subagent-driven-development, and test-driven-development as implementation proceeds. About a month after the Agent Skills open standard launched, this repo's growth curve shows skills have moved past being one-off tricks and into a shared methodology that spans tools.
- **Tech stack**: Agent Skills open standard (the `SKILL.md` format) + a compatibility layer across harnesses (install commands for the Claude Code marketplace, Antigravity, Codex, Cursor, Gemini CLI, and more)
- **Getting started**: Easy — one line, `/plugin install superpowers@claude-plugins-official`, in Claude Code; other agents have their own equivalent install command

---

### cursor/plugins ⭐ 17,489 (+383)

[GitHub](https://github.com/cursor/plugins)　·　TypeScript　·　MIT (each plugin carries its own license)

- **What it is**: Cursor's own plugin specification plus its official plugins — defining what a plugin marketplace manifest (`.cursor-plugin/marketplace.json`) should look like, alongside sample plugins the Cursor team ships itself.
- **Why it matters**: Following Claude Code's plugin marketplace, another major coding IDE has turned "plugin/skill marketplace" into a first-class, officially supported feature — and the spec is compatible with the Agent Skills open standard, which means some plugins may eventually be shared across Cursor and Claude Code instead of being written separately for each. The +383 stars in a day suggests developers are watching closely to see whether this native, IDE-backed plugin ecosystem proves more stable and maintainable than scattered community skill packs.
- **Tech stack**: TypeScript + the `.cursor-plugin/marketplace.json` plugin-manifest spec
- **Getting started**: Easy — run `/add-plugin <name>` in Cursor's Agent chat, or search the plugin marketplace directly

---

### HKUDS/CLI-Anything ⭐ 60,393 (+899)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Apache-2.0

- **What it is**: Automatically wraps any software with available source code — regardless of language or architecture — into a CLI an agent can call directly. The team also runs an index site, CLI-Hub (clianything.cc), that catalogs the generated wrappers.
- **Why it matters**: HKUDS previously built well-known open-source projects like LightRAG and GraphRAG. This time they're tackling a very real gap in the agent ecosystem: a lot of enterprise software — even commercial desktop GIS tools like ArcGIS Pro — has no public API and no MCP server, so agents simply can't reach it. CLI-Anything analyzes source code to generate a wrapper CLI, letting an agent operate software that used to require clicking through a GUI, without waiting for the vendor to build its own integration.
- **Tech stack**: Python + a source-analysis/codegen pipeline + the CLI-Hub index site
- **Getting started**: Medium — it needs to scan the target software's source code first to generate a matching CLI; closed-source commercial software (like ArcGIS Pro) is wrapped via the vendor's official SDK instead of pure code generation

---

### mvanhorn/last30days-skill ⭐ 70,670 (+952)

[GitHub](https://github.com/mvanhorn/last30days-skill)　·　Python　·　MIT

- **What it is**: A research-oriented agent skill — give it any topic, and it searches Reddit, X, YouTube, Hacker News, Polymarket, and more than a dozen other sources at once, ranks what it finds by real human engagement, and synthesizes a cited brief.
- **Why it matters**: Most "research" skills are just a thin wrapper around web search. This one's difference is that it explicitly ranks by signals of real human investment instead of SEO relevance — Reddit upvote counts, actual money wagered on Polymarket, full YouTube transcripts — and it even pulls a company's careers page and patent filings as "signals of what hasn't been announced yet." It's held the top spot on GitHub's trending page for several days running since launch.
- **Tech stack**: Python 3.12+ + yt-dlp + API/browser-cookie bridges across platforms + optional SQLite persistence for trend monitoring
- **Getting started**: Easy — one line, `/plugin marketplace add mvanhorn/last30days-skill`, in Claude Code; more than 50 other agent hosts can install it with `npx skills add mvanhorn/last30days-skill -g`

## Notable Releases

### Mastra @mastra/core@1.84.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.84.0)

- **Key changes**: Added experimental `storageVersion: 2` — agents (`createDurableAgent`/`createEventedAgent`) and evented workflows can now store runs as a header plus per-step delta rows instead of one big blob; the official example shows payloads shrinking from 98 MB to 11 MB and from 75 MB to 3.1 MB. Added an automatic workflow crash-recovery loop, and made recovery broker-aware — on Redis/Valkey Streams and Google Cloud Pub/Sub, instances now let the broker redeliver unacked messages instead of restarting every run on boot. Knowledge gained two operational APIs, `movePage()` and `reembed()`. Also introduced `@mastra/platform`, a hosted Platform Memory/Knowledge client, and MCP Apps, which embeds Studio observability views directly inside chat clients.
- **Breaking changes**: None — `storageVersion: 2` is opt-in and experimental, and doesn't change the default behavior of existing deployments.
- **Impact**: If your Mastra workflows run long and produce bloated run records, it's worth evaluating `storageVersion: 2` to cut storage costs substantially. If you use Redis/Valkey or GCP Pub/Sub as your broker, crash-recovery behavior changes after upgrading — it no longer blindly restarts every run on boot.

---

### Claude Code v2.1.328

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.328)

- **Key changes**: Extended Auto mode to Opus 4.6 and Sonnet 4.6 on four third-party/enterprise gateways — Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and the Claude apps gateway — so interactive sessions with no permission mode set now start in Auto mode by default. Added `"onFailure": "block"` for `mcp_tool` hooks, bringing them in line with command and HTTP hooks: a hook call that fails now blocks the action instead of letting it through. Also fixed a string of edge cases in Code Mode (background script execution) under auto and bypass-permissions modes.
- **Breaking changes**: None significant — mostly behavior extensions and bug fixes.
- **Impact**: If you run Claude Code through an enterprise gateway (Bedrock/Foundry/Agent Platform) without explicitly setting a permission mode, interactive sessions will now default into Auto mode after upgrading; set `disableAutoMode` yourself if you want to keep the old behavior.

## Today's Takeaway

I used to think of agent skills as little prompt wrappers, but seeing `superpowers` gain 2,029 stars in a day and pass 320,000 total, while Cursor turns its plugin spec into an officially supported feature, made it click: skills have moved from being one-off tricks to a shared methodology layer that spans agent hosts. What decides whether a skill takes off isn't how clever it is on its own anymore — it's whether it drops cleanly into Claude Code, Cursor, Codex, and Gemini CLI alike.

## References

- [obra/superpowers - GitHub](https://github.com/obra/superpowers)
- [obra/superpowers Gains 1,905 Stars in 24 Hours on GitHub Trending - Blockchain.News](https://blockchain.news/news/obra-superpowers-github-trending)
- [GitHub Trending (daily)](https://github.com/trending?since=daily)
- [cursor/plugins - GitHub](https://github.com/cursor/plugins)
- [HKUDS/CLI-Anything - GitHub](https://github.com/HKUDS/CLI-Anything)
- [mvanhorn/last30days-skill - GitHub](https://github.com/mvanhorn/last30days-skill)
- [Mastra @mastra/core@1.84.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.84.0)
- [Claude Code v2.1.328 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.328)
