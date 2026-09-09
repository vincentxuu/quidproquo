---
title: "AI Agent GitHub Digest — 2026-09-10"
date: 2026-09-10
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, multi-agent]
lang: en
description: "superpowers, ECC, and teamai-cli all climbed GitHub trending at once — today isn't about a new model, it's about systematizing how agent skills and memory get managed"
tldr: "obra/superpowers hardens a full development methodology into a skill installable across 8+ harnesses; affaan-m/ECC is a performance-optimization system with 68 agents + 286 skills for agent harnesses; cathrynlavery/diagram-design gained 2,286 stars in a single day, swapping Mermaid for 39 editorial diagram types; Tencent's teamai-cli lets a team distribute skill/rule/MCP config centrally; Pydantic AI v2.42.0 adds a GitHub Copilot provider"
series:
  name: "AI Agent GitHub Digest"
  order: 26
---

## Today's Highlights

None of today's fastest-climbing GitHub projects is a new model or framework — superpowers defines a development methodology, ECC is a performance-optimization system, teamai-cli handles team-wide distribution, and even the fastest riser, diagram-design, is fundamentally a skill. The agent ecosystem feels like it's shifting from "how many skills did you install" to "how do you systematize skills, memory, and process."

## Trending Repos

### obra/superpowers ⭐ 283,899 (+690)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **What it is**: A complete software development methodology for coding agents, built on a set of composable skills and starter instructions — the agent asks what you're really trying to do first, breaks it into a spec, writes a test-driven implementation plan, then runs a subagent-driven development process.
- **Why it matters**: Most skill projects solve a single task (write tests, fix a bug); superpowers positions itself as the skeleton for the entire development flow — from "what are you actually trying to do" all the way to TDD/YAGNI/DRY discipline — and installs across 8+ harnesses including Claude Code, Codex, Cursor, and Gemini CLI, so it isn't locked to one tool.
- **Tech stack**: Shell + each harness's own plugin/skill mechanism (Claude plugin marketplace, Codex plugin marketplace, Antigravity session-start hook, etc.)
- **Getting started**: Easy — one install command per harness, but landing the full methodology in practice takes team buy-in

---

### affaan-m/ECC ⭐ 254,988 (+1,151)

[GitHub](https://github.com/affaan-m/ECC)　·　JavaScript　·　MIT

- **What it is**: A performance-optimization system for agent harnesses that ships 68 agents, 286 skills, and 94 command shims in one install, plus hooks, memory, and security scanning (AgentShield).
- **Why it matters**: The core pitch is hardening the "plan → test → implement → review → verify → remember → improve" loop into a reusable skill instead of re-describing it in the prompt every new session; it supports Claude Code, Codex, Cursor, OpenCode, and more via capability-limited adapters that reconcile what each harness can actually do.
- **Tech stack**: JavaScript + npm packages (`ecc-universal`, `ecc-agentshield`) + each harness's plugin/hook mechanism
- **Getting started**: Easy — `npx ecc-universal setup` runs a guided install, though using all 68 agents well takes time to learn the layout

---

### cathrynlavery/diagram-design ⭐ 36,362 (+2,286)

[GitHub](https://github.com/cathrynlavery/diagram-design)　·　HTML　·　MIT

- **What it is**: A skill for Claude Code / Codex / Pi with 39 editorial diagram types built in (architecture, sequence, kanban, Sankey, and more), output as self-contained HTML + SVG — no Figma, no Mermaid dependency.
- **Why it matters**: The author's motivation is blunt — every time she asked an agent to draw a diagram, she got a generic rounded-box thing that clashed with her site's style, and the alternative was 30 minutes in Figma or just skipping the diagram. This skill replaces hardcoded diagram types with semantic layout descriptions and can read your site to match its palette, claiming a 60-second turnaround for on-brand diagrams. It gained 2,286 stars today alone — the fastest riser in this batch.
- **Tech stack**: Plain HTML + SVG (no build step, no JS dependency) + the Claude Code Agent Skills format
- **Getting started**: Easy — invoke it as a skill in conversation; static output opens directly in a browser

---

### Tencent/teamai-cli ⭐ 2,850 (+563)

[GitHub](https://github.com/Tencent/teamai-cli)　·　TypeScript　·　Other

- **What it is**: A CLI that lets a team manage skills, rules, MCP config, and a shared knowledge base in one place, and sync it across 11 AI agents including Claude Code, Codex, Cursor, and CodeBuddy.
- **Why it matters**: A common pain point once a team adopts several coding agents is "everyone's skills/rules drift out of sync." teamai-cli puts that config in a shared git repo and auto-pulls the latest on every session, no manual syncing; it also has built-in roles and tags so people only subscribe to the skills relevant to their function.
- **Tech stack**: TypeScript + the npm package `teamai-cli` + git-based distribution (GitHub, GitLab, or a private Git service)
- **Getting started**: Medium — you need a shared team repo with write access set up first; solo use is low-friction, but team rollout needs role/tag planning upfront

---

### TauricResearch/TradingAgents ⭐ 103,787 (+367)

[GitHub](https://github.com/TauricResearch/TradingAgents)　·　Python　·　Apache-2.0

- **What it is**: A financial trading framework where multiple LLM agents mirror how a real trading desk divides labor — fundamentals, sentiment, and technical analysts each produce a view, then a trader and risk-management team make the final call.
- **Why it matters**: It's one of the few frameworks that actually puts multi-agent deliberation to work in a scenario that demands a rigorous decision process, not just chat. v0.4.0 just fixed a look-ahead bug — data from the future leaking into a backtest — which is exactly the kind of correctness bug that can quietly invalidate quant research, and fixing it this carefully signals real maturity.
- **Tech stack**: Python + LangGraph (checkpoint resume) + multiple LLM/data providers (FRED, Polymarket, Bedrock, and more)
- **Getting started**: Medium — the framework itself is easy to install, but wiring up the right data sources and tuning the agent division of labor takes more work; the maintainers are explicit that it's for research, not investment advice

## Notable Releases

### Pydantic AI v2.42.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)

- **What changed**: Added a `GitHubCopilotProvider` so anyone with only a GitHub Copilot subscription (no separate model API key) can call models through Copilot's OpenAI-compatible API; also fixed sampling-parameter handling in `BedrockConverseModel` and resolution of nested `$ref` definitions in code-mode function signatures
- **Breaking changes**: `DeferredToolResults.approvals` now rejects invalid values outright instead of silently letting them through — if your code assembles this field and hasn't handled every edge case, you may start seeing errors after upgrading
- **Impact**: Anyone with only a GitHub Copilot subscription now has a free path to call models; if you use `DeferredToolResults.approvals`, double-check the values you pass before upgrading so the new validation doesn't reject them

## Today's Takeaway

I used to think the agent-skill ecosystem was mostly a contest over who has the biggest skill library. Watching superpowers and ECC both climb trending today changed that — what actually separates them is whether the "plan → test → review → remember" loop has been hardened into a repeatable process. Skill count alone isn't a moat; whether the agent remembers the mistake it made last time is.

## References

- [obra/superpowers — GitHub](https://github.com/obra/superpowers)
- [affaan-m/ECC — GitHub](https://github.com/affaan-m/ECC)
- [cathrynlavery/diagram-design — GitHub](https://github.com/cathrynlavery/diagram-design)
- [Tencent/teamai-cli — GitHub](https://github.com/Tencent/teamai-cli)
- [TauricResearch/TradingAgents — GitHub](https://github.com/TauricResearch/TradingAgents)
- [Pydantic AI v2.42.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)
