---
title: "AI Agent GitHub Digest — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, security]
lang: en
description: "Claude-BugHunter turns 681 bug-bounty reports into a skill bundle and tops the trending charts, while the official MCP reference servers patch eight vulnerabilities at once"
tldr: "Claude-BugHunter packages 681 public HackerOne reports into 85 skills and gained 1,597 stars in a day, topping the charts; obra/superpowers, a cross-tool development methodology, gained 854 the same day. The official modelcontextprotocol/servers v2.6.0 fixes eight security vulnerabilities at once, and Pydantic AI v2.76.0 tightens realtime tool updates and conversation-history compaction behavior."
series:
  name: "AI Agent GitHub Digest"
  order: 105
---

> :globe: [中文版](/posts/daily/2026-11-28-ai-agent-github-digest)

## Today's Highlight

Two threads ran today. One is the continued boom in Agent Skills: Claude-BugHunter turned 681 public HackerOne reports into a skill bundle and shot to the top of the trending charts in a single day. The other is patching: the official MCP reference servers fixed eight security vulnerabilities at once, and Pydantic AI tightened several easy-to-miss behaviors in the same release. Put together, the agent ecosystem is moving from "usable" toward "safe to trust."

## Trending Repos

### obra/superpowers ★ 327,792 (+854)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: A software-development methodology packaged as a skill bundle for coding agents — spec interviews, task breakdown, enforced red/green TDD, and subagents reviewing each other's work, as one continuous workflow. It works across a dozen-plus agent interfaces: Claude Code, Codex, Cursor, Gemini CLI, Antigravity and more.
- **Why it matters**: Most skills teach a single trick — writing tests, looking up docs. Superpowers is a rarer case: it turns the whole question of "how do you run an agent through an entire project" into a methodology, and deliberately makes it portable across tools. Gaining 854 stars in one day suggests demand for this kind of process-level skill runs deeper than expected.
- **Tech stack**: Shell plus Markdown skill definitions, installed through each agent's own plugin/marketplace mechanism.
- **Getting started**: Easy — pick one of the listed interfaces (Claude Code / Codex / Cursor…) and install it; no code changes needed.

---

### elementalsouls/Claude-BugHunter ★ 25,147 (+1,597)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　Open source (with sponsor terms)

- **What it is**: A Claude Code plugin that breaks down 681 public HackerOne reports into 85 skills and 16 slash commands, covering 24 core vulnerability classes plus enterprise identity/infrastructure attack chains (M365, Okta, vCenter, SharePoint).
- **Why it matters**: This isn't "teach the AI to run a scanner" — it's real bug-bounty techniques, bypass tables and CVE chains turned into skills that trigger automatically from a plain-English description, with built-in Burp MCP integration and pre-delivery review gates. It effectively packages a senior red-team operator's working habits into a plugin, and today's +1,597 stars put it at the top of the entire trending chart.
- **Tech stack**: Claude Code Skills plus a plugin system, with an optional HackerOne MCP for reading your own private programs and reports.
- **Getting started**: Easy — `/plugin install claude-bughunter@elementalsouls` installs everything in one line; a HackerOne account is optional.

---

### google-labs-code/stitch-skills ★ 13,406 (+309)

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Open source

- **What it is**: An official Google Labs library of Agent Skills for the Stitch (Google's AI UI design tool) MCP server, written to the Agent Skills open standard and compatible with Codex, Antigravity, Gemini CLI, Claude Code, Cursor and OpenCode.
- **Why it matters**: A major vendor writing its own "how to correctly call our MCP server" as a portable skill, rather than leaving every agent to figure it out from an API doc, lines up with Anthropic's own move this week to let MCP servers ship skills — a sign that tool providers are starting to write usage instructions in an agent-native format.
- **Tech stack**: TypeScript, built on the Agent Skills open standard plus the Stitch MCP server; each agent has its own plugin/marketplace install path.
- **Getting started**: Medium — first set up the Stitch MCP connection, then install through whichever agent you use (Codex via its CLI marketplace, Claude Code/Cursor via `npx plugins add`, OpenCode by manually copying the skill folders).

---

### HKUDS/CLI-Anything ★ 66,612 (+746)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Open source

- **What it is**: A project from HKUDS (a data-science research group at the University of Hong Kong) aiming to wrap any piece of software in a CLI layer so agents — Pi, OpenClaw, nanobot, Cursor, Claude Code and others — can operate it directly, plus a CLI-Hub where the community contributes and installs each other's wrappers.
- **Why it matters**: Most agent tools solve "let an agent use this one specific piece of software." CLI-Anything goes after the more basic problem underneath it — turning any software into something an agent can operate at all. The community has already contributed dozens of CLIs for Obsidian, Joplin, Rekordbox, Calibre, ArcGIS Pro and more; gaining 746 stars in a day suggests this "universal interface layer" idea resonates.
- **Tech stack**: Python — the `cli-anything-hub` package plus a growing set of community-contributed CLI wrappers.
- **Getting started**: Medium — `pip install cli-anything-hub`, then `cli-hub install <name>` for each piece of software you want to control; you'll need to check whether a wrapper already exists.

---

### zhouxiaoka/autoclip ★ 17,266 (+774)

[GitHub](https://github.com/zhouxiaoka/autoclip)　·　Local desktop app　·　MIT

- **What it is**: An open-source OpusClip alternative — drop in a link, a video file or a livestream replay, and it finds the highlights, adds captions and covers, and exports clips ready for TikTok, Xiaohongshu, Reels and YouTube Shorts, all running locally with a built-in MCP server so agents can call it too.
- **Why it matters**: Running locally with no subscription is its biggest difference from SaaS tools like OpusClip — it can run fully offline with Ollama/LM Studio plus Whisper/SenseVoice, and v1.6 added OBS/Twitch/YouTube/Kick livestream-replay sources. Shipping a built-in MCP server shows that even consumer-grade tools are starting to assume agents will call them.
- **Tech stack**: A local desktop app with a built-in MCP server; optionally Ollama/LM Studio (LLM) and Whisper/SenseVoice (speech recognition) for fully offline use.
- **Getting started**: Easy — download the desktop app and bring your own API key; running fully offline takes an extra Ollama/LM Studio setup.

## Notable Releases

### Pydantic AI v2.76.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)

- **Key changes**: Realtime sessions gain `UpdateTools`, letting supported models "reveal" new tools mid-session via `RealtimeModelProfile.supports_tool_updates`; requests to `gemini-2.5-pro`/`gemini-2.5-flash` now emit a `DeprecatedModelWarning`; `SummarizingCompaction`/`RelevanceCompaction` behavior changed so every run now re-summarizes the full history instead of carrying forward the last summary.
- **Breaking changes**: Yes — an exhaustive `assert_never` match over `RealtimeInput` will fail to type-check once `UpdateTools` is added; projects that turn warnings into errors will break on the new Gemini 2.5 deprecation warning.
- **Impact**: If you have an exhaustive match over `RealtimeInput`, add the new branch. If your CI sets `filterwarnings = error`, filter out this warning before upgrading. Apps that carry `message_history` forward with a compaction capability may see higher token costs on every run; pass `result.all_messages()` instead to keep the already-compacted history.

---

### modelcontextprotocol/servers v2.6.0

[Release Notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.6.0)

- **Key changes**: Eight security vulnerabilities fixed at once, concentrated in `mcp-server-git` (Git LFS could be made to run arbitrary programs, the `--repository` root could be pointed at another repository, `git_remote` could leak credentials, `repo_path` could be used to read environment variables, and `objects/info/alternates` could read objects from another repository), a permissions issue in `@modelcontextprotocol/server-memory`'s `saveGraph`, a fix in `mcp-server-fetch`, and a Windows fix in `server-filesystem`.
- **Breaking changes**: No functional breaking changes, but several behaviors were tightened (Git LFS downloads are now off by default, `repo_path` no longer expands environment variables) — anyone relying on the old behavior should take note.
- **Impact**: Anyone running these official MCP reference servers should upgrade now: `mcp-server-git` → 2026.11.27, `@modelcontextprotocol/server-memory` → 2.2.2, `mcp-server-fetch` → 2026.11.27, and on Windows, `@modelcontextprotocol/server-filesystem` → 2.4.1.

## Today's Takeaway

I used to think a skill was just a packaged prompt template. But Claude-BugHunter breaking 681 public vulnerability reports into 85 context-triggered skills, stacked into a four-layer "think → hunt → hit the perimeter → ship" workflow, shows that skills are becoming a new unit for turning an entire domain methodology into an executable process — not just a way to save typing. Google Labs' stitch-skills makes the same point from another angle: even a major vendor's own MCP server now ships skills instead of an API doc to tell agents how to use it.

## References

- [obra/superpowers](https://github.com/obra/superpowers)
- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip)
- [GitHub Trending Intelligence Archive — 2026-11-27](https://raw.githubusercontent.com/jastfan/github-trending/main/archives/2026-11/2026-11-27.md)
- [Pydantic AI v2.76.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)
- [modelcontextprotocol/servers v2.6.0 Release Notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.6.0)
