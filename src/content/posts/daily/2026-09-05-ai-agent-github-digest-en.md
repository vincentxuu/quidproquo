---
title: "AI Agent GitHub Digest — 2026-09-05"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, coding-agent]
lang: en
description: "GitHub Trending is almost entirely the Claude Code / Codex skills ecosystem today, while MCP server reverify makes the case with hard benchmark numbers that skills alone don't fix an agent's tendency to make things up"
tldr: "mattpocock/skills gained 2,757 stars in a single day — the fastest-growing repo on GitHub today. Anthropic's own anthropics/skills and the open-source coding agent anomalyco/opencode are trending alongside it. Meanwhile MCP server reverify ran a benchmark on 71 real Windows system files and found AI has a 97% error rate reverse-engineering binaries from memory — deterministic tools caught every single one. On the framework side, pydantic-ai, agno, and haystack all shipped routine patches today, nothing major."
series:
  name: "AI Agent GitHub Digest"
  order: 21
---

> 🌏 [中文版](/posts/daily/2026-09-05-ai-agent-github-digest)

## Today's Highlights

GitHub Trending today is almost entirely the Claude Code / Codex skills ecosystem — a skill pack maintained by a single developer, mattpocock, gained more stars in a day than Anthropic's own official skills repo, suggesting that "whose skill actually works well in practice" is starting to matter more than "who published it." On the other side of the list, MCP server reverify makes the opposite point with hard numbers: no matter how rich the skills ecosystem gets, an agent's claims about the world still need a deterministic tool checking them, or they're likely to just be made up.

## Trending Repos

### mattpocock/skills ⭐ 249,833 (+2,757)

[GitHub](https://github.com/mattpocock/skills) · Shell · MIT

- **What it is**: a collection of Claude Code / Codex skills maintained by Matt Pocock, a well-known TypeScript and AI-development educator, drawn straight from the engineering workflows he actually uses daily — things like a "grilling" Q&A flow to align an agent on requirements before it touches code, and a shared-vocabulary doc that cuts down on an agent's tendency to over-explain in its own jargon.
- **Why it's worth a look**: it gained 2,757 stars today, the fastest-growing repo on all of GitHub Trending. It ships with two install philosophies side by side — a Claude Code plugin that subscribes you to the author's updates, or `skills.sh`, which copies editable files straight into your project for you to hack on. That "maintained by one practitioner, fully forkable" model stands in contrast to some of the more all-in-one skill systems out there.
- **Tech Stack**: shell install scripts, the Claude Code Plugin marketplace, and the general-purpose `skills.sh` installer.
- **Getting Started**: Low — `npx skills@latest add mattpocock/skills`, or install the Claude Code plugin in one command.

---

### anthropics/skills ⭐ 174,029 (+512)

[GitHub](https://github.com/anthropics/skills) · Python · Apache-2.0 (document skills are source-available)

- **What it is**: Anthropic's own repository of Agent Skills examples, showing how Claude dynamically loads specialized knowledge from a folder plus a `SKILL.md` file — covering everything from creative and design work to technical tasks (testing web apps, generating MCP servers) to enterprise workflows.
- **Why it's worth a look**: it gained 512 stars today and remains the most direct official reference implementation of the Agent Skills standard — it even open-sources (well, source-available) the skills behind Claude's built-in document capabilities (docx / pdf / pptx / xlsx). If you want to understand skill design patterns, or write your own, this is the most authoritative starting point.
- **Tech Stack**: Python plus the `SKILL.md` YAML frontmatter spec, distributed through the Claude Code Plugin marketplace.
- **Getting Started**: Low — `/plugin marketplace add anthropics/skills` gets you going, or start from the included `template-skill`.

---

### anomalyco/opencode ⭐ 203,949 (+314)

[GitHub](https://github.com/anomalyco/opencode) · TypeScript · MIT

- **What it is**: an open-source coding agent that isn't tied to any one model vendor, with both a terminal TUI and a desktop app, and two switchable modes — `build` (full access) and `plan` (read-only, denies edits by default and asks permission before running commands).
- **Why it's worth a look**: it gained another 314 stars today and is closing in on 204,000 total — the largest coding agent on the "open-source, self-hostable, model-agnostic" path, a clear contrast to vendor-native offerings like Claude Code or Codex. `plan` mode's default-deny posture makes it a safer choice for exploring an unfamiliar codebase before making changes.
- **Tech Stack**: TypeScript, a terminal TUI, and a desktop app.
- **Getting Started**: Low — one-line install via `curl -fsSL https://opencode.ai/install | bash` or your package manager of choice.

---

### 2akouwu/reverify ⭐ 866

[GitHub](https://github.com/2akouwu/reverify) · Python · MIT

- **What it is**: an MCP server plus CLI built to solve AI's biggest weakness in reverse engineering — models reading binaries tend to confidently invent facts. reverify pairs the model with a set of deterministic RE tools (disassembly, byte-pattern matching, CPU emulation) that act as the judge: nothing a model claims about a binary's structure or behavior counts until it's checked against the actual bytes.
- **Why it's worth a look**: the author benchmarked it against 71 real Windows system files and found the model's textbook answer was wrong 97% of the time from memory alone — reverify caught every single one, with zero wrong claims accepted (0 of 71, reproduced on Linux, macOS, and aarch64 CI runs). It's a rare case of turning "anti-hallucination" into a reproducible benchmark instead of a marketing claim, and it ships as an MCP server so Claude Code, Cursor, and similar agents can call the verification tools directly. It's only 5 days old and already at 866 stars.
- **Tech Stack**: a pure-Python core (with optional upgrades to capstone / unicorn / lief / angr for heavier-duty analysis) plus the MCP SDK.
- **Getting Started**: Medium — `pip install reverify` gets the CLI and MCP server running, but full dynamic analysis and symbolic execution require installing the optional heavyweight backends.

## Notable Releases

No major framework updates today — pydantic-ai (v2.39.0), agno (v3.0.6), and haystack (v3.1.1) all shipped routine patches or single-feature additions, and crewAI, Mastra, and LangGraph's releases over the past 48 hours were all automated version bumps with no breaking changes or notable new features.

## Today's Takeaway

I used to assume an agent-skills ecosystem needed a big company pushing it to gain real traction. But today mattpocock's single-maintainer skill pack outgrew Anthropic's own official repo by a wide margin (2,757 stars vs. 512), which tells me that "does it actually work well for people" is starting to spread skills faster than an official stamp of approval ever could.

## References

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [anthropics/skills](https://github.com/anthropics/skills)
- [anomalyco/opencode](https://github.com/anomalyco/opencode)
- [2akouwu/reverify](https://github.com/2akouwu/reverify)
- [reverify BENCHMARK.md](https://github.com/2akouwu/reverify/blob/main/BENCHMARK.md)
- [Pydantic AI v2.39.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.39.0)
- [Haystack v3.1.1 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.1)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
