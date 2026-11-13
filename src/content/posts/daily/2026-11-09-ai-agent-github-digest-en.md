---
title: "AI Agent GitHub Digest — 2026-11-09"
date: 2026-11-09
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, context-management, multi-agent, mcp]
lang: en
description: "anthropics/skills admits in its own README that the Agent Skills standard isn't tied to Claude, billion-context wants to cut an agent's token bill to a fifth, and sandbox-mcp lets an agent spin up a disposable Windows box"
tldr: "anthropics/skills gained 793 stars in a single day on GitHub trending, and its README states that the full Agent Skills standard lives at agentskills.io and isn't tied to Claude — a sign that \"skills\" are moving from a Claude feature name toward a cross-platform format."
series:
  name: "AI Agent GitHub Digest"
  order: 86
---

> 🌏 [中文版](/posts/daily/2026-11-09-ai-agent-github-digest)

## Today's Highlight

anthropics/skills climbed GitHub trending today, gaining 793 stars in a single day. The Note at the top of the repo spells it out: this repo holds Anthropic's own implementation of skills for Claude, while the full Agent Skills standard lives at agentskills.io — Anthropic itself acknowledging that "skills" are no longer just a Claude feature name but a format moving toward platform independence. Three other repos filled in three unrelated gaps today: billion-context wants to compress an agent's context bill down to a fifth; OpenMausBot lets you manage several agent personas from one chat interface; and sandbox-mcp lets an agent spin up a fresh, disposable Windows box just to test on.

```diagram
title: Four infrastructure gaps today's repos are filling
desc: Standardization, cost, multi-agent coordination, and test environments — four unrelated problems, matched by today's four trending repos
caption: Illustrative: a simplified grouping used to frame these four repos, not an industry-standard taxonomy
---
<svg viewBox="0 0 480 300">
  <rect class="dg-box dg-box--accent" x="16" y="16" width="448" height="60" rx="6"/>
  <text class="dg-tag" x="32" y="36" dominant-baseline="central">Standard</text>
  <text class="dg-label" x="128" y="36" dominant-baseline="central">Agent Skills format</text>
  <text class="dg-sub" x="128" y="58" dominant-baseline="central">anthropics/skills · spec not tied to Claude</text>

  <rect class="dg-box" x="16" y="88" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="116" dominant-baseline="central">Cost</text>
  <text class="dg-label" x="128" y="116" dominant-baseline="central">Context compression</text>
  <text class="dg-sub" x="128" y="134" dominant-baseline="central">billion-context · claims 5x fewer tokens</text>

  <rect class="dg-box" x="16" y="152" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="180" dominant-baseline="central">Multi-agent</text>
  <text class="dg-label" x="128" y="180" dominant-baseline="central">Several agent personas</text>
  <text class="dg-sub" x="128" y="198" dominant-baseline="central">OpenMausBot · managed from one chat UI</text>

  <rect class="dg-box" x="16" y="216" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="244" dominant-baseline="central">Test env</text>
  <text class="dg-label" x="128" y="244" dominant-baseline="central">Throwaway machines</text>
  <text class="dg-sub" x="128" y="262" dominant-baseline="central">sandbox-mcp · clean Windows Sandbox</text>
</svg>
```

## Trending Repos

### anthropics/skills ⭐ ~189k (+793 today, 11/9)

[GitHub](https://github.com/anthropics/skills)　·　Python　·　mostly Apache-2.0

- **What it is**: Anthropic's official public Agent Skills repo — a set of example skill folders (Creative, Development, Enterprise, document-related), plus a standalone Agent Skills spec (`spec/`) and a skill template. Each skill ships a `SKILL.md` with instructions and metadata.
- **Why it matters**: the Note at the top of the repo is explicit — this is just Anthropic's own implementation of skills for Claude, and the full Agent Skills standard lives at agentskills.io. That's Anthropic itself acknowledging that "skills" are moving toward a format not tied to one platform. The repo also open-sources the actual docx, pdf, pptx, and xlsx skills that power Claude's document-creation feature, as reference examples for more complex skills. Gaining 793 stars in one day is unusual for a repo that already had over a hundred thousand — it's an established project still accelerating.
- **Tech stack**: skill folders + `SKILL.md` metadata + a standalone `spec/` (the Agent Skills specification) + `template/`
- **How hard to adopt**: Low — run `/plugin marketplace add anthropics/skills` in Claude Code and pick the skills you want.

---

### ranxianglei/billion-context ⭐ ~5,027 (+460 today, 11/9)

[GitHub](https://github.com/ranxianglei/billion-context)　·　TypeScript　·　MIT

- **What it is**: a context-compression plugin aimed at making a 100K context window hold up through month-long, billion-token single sessions, claiming up to 5x fewer tokens used.
- **Why it matters**: instead of building a new agent CLI, it plugs into a dozen-plus existing ones — the README lists Claude Code, Codex, OpenCode, pi, Gemini CLI, Kimi, Qwen Code, GitHub Copilot CLI, TRAE, and CodeBuddy among its supported clients. If the compression quality holds up, that's a direct hit on the bill for long-running coding agents, without switching tools.
- **Tech stack**: an npm package that plugs into each agent CLI's context pipeline
- **How hard to adopt**: Low — `npm install -g billion-context --prefix=~/.local`

---

### milind-soni/OpenMausBot ⭐ ~18k (+1,437 today, 11/9)

[GitHub](https://github.com/milind-soni/OpenMausBot)　·　TypeScript　·　Apache-2.0

- **What it is**: an open-source Grok Bot alternative — every contact in the chat sidebar is a real running agent (Claude or Codex underneath), each with its own personality, model, cloud machine, and connected apps. You talk to them like contacts, watch them work, and approve what they want to do.
- **Why it matters**: Grok Bot, Meta Muse, OpenAI dots, and Manus Cue already offer this kind of multi-agent chat interface, but all as closed platforms. OpenMausBot is the open-source, bring-your-own-agent, local-first version, running directly on the Claude or Codex access you already have rather than locking you into one model vendor. Gaining 1,437 stars on its first day shows real demand for an interface that lets you run several agent personas at once.
- **Tech stack**: TypeScript + React + Electron, wired to Claude/Codex agents underneath
- **How hard to adopt**: Medium — you need your own Claude or Codex access, and each bot spins up its own cloud machine.

---

### shanselman/sandbox-mcp ⭐ 322 (3 days old)

[GitHub](https://github.com/shanselman/sandbox-mcp)　·　JavaScript　·　MIT

- **What it is**: wraps Windows Sandbox (Windows's built-in disposable VM) as a CLI and MCP server, so an agent can spin up a fresh, network-off Windows 11, deploy an app, drive the UI, capture a crash, keep the evidence, and then throw the whole machine away.
- **Why it matters**: the author is well-known developer Scott Hanselman. Unlike a container pretending to be Windows, this is a genuinely clean Windows machine — measured GUI test runs take roughly 40-50 seconds end to end, boot to teardown. The CLI works standalone; the MCP adapter is an optional agent-facing interface on the same engine. The docs' own worked example catches a bug that only reproduces on a truly clean machine: a dev box had the VC++ redistributable installed, and a clean customer PC didn't.
- **Tech stack**: a Node.js CLI (`sbx`) + optional MCP adapter + Windows Sandbox + UIA (UI Automation)
- **How hard to adopt**: Medium — requires Windows 11 with Sandbox support, and a first-run system check plus a verified download.

## Notable Releases

None of the frameworks checked today had a release inside the 48-hour window that clears the bar: LangGraph only shipped two patches, `sdk==0.4.14` and `cli==0.4.42`; pydantic-ai's security release v2.66.0 went out on 11/4, already outside the 48-hour window; and CrewAI 1.15.37 was [already covered in yesterday's digest](/posts/daily/2026-11-08-ai-agent-github-digest-en), so it isn't repeated here. No notable framework release today.

## What I Learned Today

I used to think "Agent Skills" was just a feature name inside Claude, but seeing anthropics/skills state in its own README that "the full standard lives at agentskills.io, not tied to Claude" made it click — this is following the same path MCP already walked: one company's own protocol first, then something the whole ecosystem converges on.

## References

- [anthropics/skills — GitHub repo](https://github.com/anthropics/skills)
- [Agent Skills standard — agentskills.io](https://agentskills.io/)
- [ranxianglei/billion-context — GitHub repo](https://github.com/ranxianglei/billion-context)
- [milind-soni/OpenMausBot — GitHub repo](https://github.com/milind-soni/OpenMausBot)
- [OpenMausBot official site](https://www.openmausbot.com/)
- [shanselman/sandbox-mcp — GitHub repo](https://github.com/shanselman/sandbox-mcp)
- [sandbox-mcp official site](https://shanselman.github.io/sandbox-mcp/)
- [CrewAI 1.15.37 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)
