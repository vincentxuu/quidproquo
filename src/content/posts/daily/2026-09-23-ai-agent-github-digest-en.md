---
title: "AI Agent GitHub Digest — 2026-09-23"
date: 2026-09-23
category: daily
tags: [ai-agent, github, open-source, daily, agent-tools, coding-ai, office-automation]
lang: en
description: "None of today's four fastest-growing projects is a new framework — all of them let agents borrow infrastructure humans already built: editing software, an office rendering engine, someone else's paid account"
tldr: "browser-use/video-use lets Claude Code edit video directly, using ElevenLabs transcripts to find cut points, at 25,702 stars; dream-num/univer repositions its office SDK as an 'Office Harness for AI Agents' and tops today's TypeScript trending; superdesigndev/treg is 'OpenRouter for agent tools,' letting agents call 3,000+ metered tool endpoints with no contract required; davila7/claude-code-templates crosses 30K stars by replacing hand-rolled config with one-line agent/command/MCP template installs; pydantic-ai v2.47.0 tightens type validation so a bad UserPromptPart.content type no longer silently degrades."
series:
  name: "AI Agent GitHub Digest"
  order: 39
---

## Today's Highlights

None of today's four fastest-growing projects is a new framework — all four are solving the same problem: agents can already plan and issue commands, but they're missing capability. Editing video needs a transcription service to understand timing. Office documents need an existing canvas rendering engine. A paid tool needs someone else's account already under contract. The ceiling on what an agent can do isn't reasoning — it's what infrastructure it can borrow.

## Trending Repos

### browser-use/video-use ⭐ 25,702 (+155)

[GitHub](https://github.com/browser-use/video-use)　·　Python　·　MIT

- **What it is**: Drop raw footage in a folder, chat with Claude Code, and get a finished `final.mp4` back — filler words and dead air cut, color graded, subtitles burned in, animated transitions generated, all handled by the agent.
- **Why it matters**: The LLM never watches the footage. It reads a transcript from ElevenLabs Scribe — word-level timestamps, speaker diarization, even laughter and applause tags — and only pulls a composite filmstrip-plus-waveform image when it needs to double-check a cut visually. Transcribing first and editing second uses fewer tokens than feeding raw frames to the model, and it's more precise.
- **Tech stack**: Claude Code / Codex skill + ElevenLabs Scribe API + ffmpeg + Remotion/Manim (sub-agents render the animation layer)
- **Getting started**: Medium — you need ffmpeg installed and an ElevenLabs API key, but the agent walks through setup itself

---

### dream-num/univer ⭐ 15,214

[GitHub](https://github.com/dream-num/univer)　·　TypeScript　·　Apache-2.0

Today's #1 on GitHub's TypeScript trending page.

- **What it is**: Formerly an embeddable Office SDK for adding spreadsheet, document, and presentation features to a SaaS product, now repositioned as the "Office Harness for AI Agents" — the same headless runtime runs in the browser or on Node.js, so people and agents can edit the same file.
- **Why it matters**: Most "Office plus AI" approaches have an agent call an existing application's API. Univer goes the other way: it turns the spreadsheet formula engine and canvas renderer into embeddable, headless components, so an agent can run spreadsheet logic server-side without ever opening a real copy of Excel.
- **Tech stack**: TypeScript + canvas rendering engine + custom formula engine + Facade API shared across browser and Node.js
- **Getting started**: Medium — the plugin architecture is flexible, but you need to understand how plugins and presets compose before customizing it

---

### superdesigndev/treg ⭐ 2,113 (+197)

[GitHub](https://github.com/superdesigndev/treg)　·　Python　·　Custom (source-available)

- **What it is**: "OpenRouter, but for agent tools instead of models" — one base URL, one token, and an agent can call 3,000+ catalogued endpoints across 60+ providers (backlink data, social trends, contact enrichment, ads, scraping, image and video generation), billed per call with no vendor signup required.
- **Why it matters**: What actually blocks an agent usually isn't a missing tool — it's the tool sitting behind a contract, a monthly fee, or an enterprise review (Semrush at $139/month, Crunchbase at $99/month, or no public API at all). Treg holds those accounts centrally and lets the agent search by task instead of needing to know which vendor sells the data. That's the real difference from Composio: this is a metered marketplace, not an OAuth integration platform.
- **Tech stack**: Python CLI + proxy gateway with server-side credential injection (keys never reach the caller)
- **Getting started**: Low — `curl -fsSL https://treg.to/install.sh | sh` installs the CLI, then `treg login` gets you searching tools

---

### davila7/claude-code-templates ⭐ 31,028 (+113)

[GitHub](https://github.com/davila7/claude-code-templates)　·　Python　·　MIT

- **What it is**: A configuration and monitoring CLI for Claude Code — hundreds of ready-made agents, slash commands, MCP integrations, hooks, and settings, installable with one command like `npx claude-code-templates@latest --mcp development/github-integration --yes` instead of hand-editing files under `.claude/`.
- **Why it matters**: Claude Code's customization surface is large, which also means a newcomer spends real time just wiring up agent roles, hooks, and MCP servers. This project turns common community setups into a browsable, installable catalog, plus health checks, live analytics, and mobile-remote conversation monitoring — turning "how do I configure this" knowledge into something you just install.
- **Tech stack**: Node.js CLI (published via npx) + a static template catalog (aitmpl.com) + Cloudflare Tunnel for remote monitoring
- **Getting started**: Low — run it with npx and pick components from the interactive menu

## Notable Releases

### pydantic-ai v2.47.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.47.0)

- **Key changes**: `TypeSafeModel` now answers three more field types; a `tuple` output field with a self-contained model no longer crashes; a `Choices` set can now correctly describe itself as a `TypeSafeModel` route.
- **Breaking changes**: The `None` output route is now named `None` instead of `NoneType`. `UserPromptPart.content` now raises when it isn't a `str` or a sequence, instead of silently sending a dict's keys as content — meaning calls that used to "accidentally work" after passing the wrong type will now fail outright.
- **What it means for you**: If your code has ever passed a non-string, non-sequence object into `UserPromptPart.content` — intentionally or not — check before upgrading. The old behavior silently sent `dict.keys()`; the new one raises, and if your tests don't cover that path, you'll find out in CI.

## Today's Takeaway

I expected the next step for the agent ecosystem to be more framework abstraction. Instead, none of today's four fastest-growing projects is a new framework — they're all helping agents borrow something humans already built: a transcription service's ears to edit video, an office rendering engine's hands to edit documents, someone else's already-signed contract to call a tool. A large part of an agent's capability ceiling turns out to be about what it can borrow, not what it understands.

## References

- [browser-use/video-use](https://github.com/browser-use/video-use)
- [dream-num/univer](https://github.com/dream-num/univer)
- [superdesigndev/treg](https://github.com/superdesigndev/treg)
- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
- [pydantic-ai v2.47.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.47.0)
