---
title: "AI Agent GitHub Digest — 2026-10-10"
date: 2026-10-10
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp-server]
lang: en
description: "Four of today's top five GitHub Trending repos are AI agent skills/MCP tools, pulling in anywhere from 26k to 284k stars in a single day; pydantic-ai and Claude Code each shipped a release"
tldr: "**mattpocock/skills** (283,680★) is the agent-skills collection its author actually uses day to day — now listed in Claude Code's official plugin marketplace, installable with one command in Codex, Copilot, and Gemini CLI too. **morluto/rea** (61,585★) wires an agent into Ghidra, Hopper, and IDA to reverse-engineer native binaries, JS/Electron apps, and websites. **cathrynlavery/diagram-design** (48,496★) is an agent skill for drawing diagrams — 44 types, each exported as a single self-styled HTML+SVG file. **anthropics/knowledge-work-plugins** (28,593★) is Anthropic's own open-sourced set of 11 role-specific plugins, bundling Slack/Notion/HubSpot connectors into Claude Cowork. **mksglu/context-mode** (26,062★) is an MCP server built to stop tool output from flooding an agent's context window. pydantic-ai v2.55.0 raises its minimum Python version to 3.11 and adds a `Conversation` object; Claude Code v2.1.296 fixes how plain-language hooks are evaluated."
series:
  name: "AI Agent GitHub Digest"
  order: 56
---

> 🌏 [中文版](/posts/daily/2026-10-10-ai-agent-github-digest)

## Today's Highlight

Four of today's top six GitHub Trending repos are AI agent skills/MCP tools, with single-day star counts ranging from 26k to 284k — not one repo compounding over time, but five independent skills, plugins, and MCP servers all breaking out on the same day: a skill installer (mattpocock/skills), a diagramming skill (diagram-design), a reverse-engineering skill (rea), Anthropic's own open-sourced role plugins (knowledge-work-plugins), and an MCP server built specifically to stop tool output from flooding an agent's context (context-mode). Agent Skills has stopped being a feature of one framework — it's grown into a category with its own ecosystem.

## Trending Repos

### mattpocock/skills ⭐ 283,680

[GitHub](https://github.com/mattpocock/skills) · Shell · MIT

- **What it is**: Former TypeScript educator Matt Pocock's own agent skills — the ones he actually uses for real engineering work, not vibe coding — packaged straight out of his personal `.agents` directory.
- **Why it matters**: The repo is now listed in Claude Code's official plugin marketplace (`claude plugin install mattpocock-skills@claude-plugins-official`), and also installs into Codex, GitHub Copilot, Gemini CLI, and anything else that reads the Agent Skills format — write the skill once, install it everywhere. The author is explicit that these differ from process-owning approaches like GSD, BMAD, or Spec-Kit: the skills here are deliberately small, composable, and easy to adapt, so when something breaks, it's easy to debug.
- **Tech stack**: Markdown skill definitions + shell install scripts, installed via `npx skills@latest add` or each platform's native plugin marketplace
- **Getting started**: Low — `claude plugin install mattpocock-skills@claude-plugins-official` installs it in one line and keeps itself updated.

---

### morluto/rea ⭐ 61,585

[GitHub](https://github.com/morluto/rea) · TypeScript · MIT

- **What it is**: Connects an agent to Ghidra, Hopper, and IDA over MCP so it can analyze native binaries, JavaScript/Electron apps, .NET assemblies, and websites without reading source first — explaining how a feature works under the hood, with the evidence behind each conclusion, then building a similar version for your own project.
- **Why it matters**: Using an agent for reverse engineering used to mean scripting Ghidra headless mode yourself or pasting disassembly into a chat window by hand. rea packages the whole flow as MCP tools an agent can call directly, and is explicit about which conclusions are backed by actual analysis versus inference. Useful for "how does this feature work, build me something similar" competitive analysis, and for CTF work.
- **Tech stack**: TypeScript MCP server + bridges to local reverse-engineering engines (Hopper/Ghidra/IDA, each installed separately)
- **Getting started**: Medium — `npx rea-agents setup` auto-configures MCP for Claude Code, Codex, Cursor, Gemini CLI, and others, but native analysis still needs the underlying reverse-engineering tools installed first.

---

### cathrynlavery/diagram-design ⭐ 48,496

[GitHub](https://github.com/cathrynlavery/diagram-design) · HTML · MIT

- **What it is**: A diagramming skill for Claude Code, Codex, GitHub Copilot, and other agents, covering 44 diagram types (architecture diagrams, quadrant charts, sequence diagrams, and more), each rendered as a single self-contained HTML+SVG file that opens with no extra tooling.
- **Why it matters**: Most agents default to Mermaid output, which tends to look rigid and flat. This skill bakes layout rules into the skill definition itself, so the agent picks the diagram type and lays it out according to design rules — and can even pull your site's fonts and color palette so every diagram matches. The author notes that official releases come only from this repo, to guard against impersonating plugin listings.
- **Tech stack**: Agent Skill (SKILL.md + references/assets/scripts) producing plain HTML/SVG with no runtime dependencies
- **Getting started**: Low — install with `npx skills add cathrynlavery/diagram-design` or Claude Code's `/plugin marketplace add`, then just describe the diagram you want in plain language.

---

### anthropics/knowledge-work-plugins ⭐ 28,593

[GitHub](https://github.com/anthropics/knowledge-work-plugins) · Python · Apache-2.0

- **What it is**: Anthropic's own open-sourced set of 11 role-specific plugins (productivity, sales, customer-support, product-management, marketing, legal, finance, and more), each bundling the skills, connectors, slash commands, and sub-agents for that job function, built for Claude Cowork and also compatible with Claude Code.
- **Why it matters**: This is the first time Anthropic has open-sourced its own concrete approach to designing role-specific plugins — the sales plugin connects to HubSpot/Close/ZoomInfo to build competitive battlecards, the legal plugin connects to Box/Egnyte to help review contracts, and Anthropic is upfront that the real value only shows up once you customize them to your own company's tools, terminology, and processes. For teams wanting to build their own internal plugins, these 11 are a ready-made reference.
- **Tech stack**: Claude plugin format (skills + connectors + slash commands + sub-agents), with connectors spanning Slack, Notion, HubSpot, Jira, and Microsoft 365
- **Getting started**: Low to install, medium to customize — the generic version works out of the box, but Anthropic itself says it only becomes genuinely useful once adapted to your company's workflow.

---

### mksglu/context-mode ⭐ 26,062

[GitHub](https://github.com/mksglu/context-mode) · TypeScript · Elastic License 2.0

- **What it is**: An MCP server built to solve the problem of MCP tool calls dumping raw data straight into the context window — sandboxing tool output (a measured 98% reduction), and logging every file edit, git operation, task, and error to SQLite so that when context gets compacted, it's retrieved via FTS5 full-text search instead of being dumped back in whole.
- **Why it matters**: Unlike most "agent memory" tools, which focus on remembering more, this one focuses on keeping unnecessary data out of context in the first place. The author also pushes a "think in code" pattern — have the agent write a script to process data and return only the `console.log` output, instead of reading 50 files straight into context; the project's own example drops one operation from 700 KB to 3.6 KB. Supports 17 platforms plus the OpenClaw gateway.
- **Tech stack**: TypeScript MCP server + SQLite + FTS5 full-text search
- **Getting started**: Medium — registered as an MCP server in your agent's config; sandboxed script execution needs extra runtime permissions.

## Notable Releases

### pydantic-ai v2.55.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)

- **What changed**: Raises the minimum Python version to 3.11 across every package (3.10 installs now resolve to 2.54.0 and stop updating). Adds a `Conversation` object to carry and store state across multiple runs. Adds prompt-cache diagnostics, on by default for OpenAI Responses and opt-in via `anthropic_cache_diagnostics`. Each failed `FallbackModel` attempt is now recorded with its model, timing, error, and usage.
- **Breaking Changes**: Yes — Python 3.10 users get stuck on the older release; `FileUrl.media_type` now serializes as `null` for extensionless URLs instead of raising an error.
- **Impact for you**: Still on Python 3.10? Pin to `pydantic-ai==2.54.0` explicitly, since you won't get newer releases otherwise. If you use `FallbackModel` or want visibility into prompt-cache hit rates, this release is worth the upgrade.

---

### Claude Code v2.1.296

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.296)

- **What changed**: Fixed managed-settings `PreToolUse` hooks that deny a tool call with `"continue": false`, and managed `prompt` hooks that block one — both previously blocked just that call without actually ending the turn. Fixed `PostToolUse` hooks in managed settings not applying `updatedMCPToolOutput` in some sessions. Added an `allow_large` option to the Read tool so Claude can read an oversized text file in full in one call.
- **Breaking Changes**: None
- **Impact for you**: If you rely on managed-settings hooks to block dangerous operations, this closes exactly the gap where a block didn't actually end the turn — worth upgrading. If you occasionally need to read a huge file in full, `allow_large` saves the manual chunking.

## Today's Takeaway

I'd assumed "agent skills" was just a feature of Claude Code. Watching five unrelated repos break out on GitHub Trending the same day made it clear skills have grown into their own category with its own ecosystem — there's a seller of skill collections (mattpocock), skills built for a single vertical job (diagram-design, rea), and now even "context gets flooded once an agent runs long enough" has its own dedicated MCP server (context-mode).

## References

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [morluto/rea](https://github.com/morluto/rea)
- [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
- [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [mksglu/context-mode](https://github.com/mksglu/context-mode)
- [pydantic-ai v2.55.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
- [Claude Code v2.1.296 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.296)
