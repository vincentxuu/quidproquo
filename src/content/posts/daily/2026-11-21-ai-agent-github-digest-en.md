---
title: "AI Agent GitHub Digest — 2026-11-21"
date: 2026-11-21
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, claude-code, crewai]
lang: en
description: "mattpocock/skills overtakes obra/superpowers for 13th place on GitHub's global star leaderboard, and the skill-bundle format starts spreading into security and design"
tldr: "mattpocock/skills passed 329,000 stars to overtake obra/superpowers and claim 13th place globally; a security-focused bundle (Claude-BugHunter) and Google's own design-skill library (stitch-skills) both gained ground today too, showing skill bundles spreading well past general coding. CrewAI 1.15.44 added versioned, shareable artifacts, and Claude Code v2.1.329 added hook-failure warnings and task-panel integration."
series:
  name: "AI Agent GitHub Digest"
  order: 98
---

> :globe: [中文版](/posts/daily/2026-11-21-ai-agent-github-digest)

## Today's Highlight

Yesterday's star of the show, `obra/superpowers` (322,708 stars), got overtaken today by a rival in the same category: `mattpocock/skills` climbed to 328,726 stars, taking 13th place on the global leaderboard. Both are "skill bundles," not full frameworks — the difference comes down to whose picks fit a developer's taste better. What's more interesting is that the same packaging logic — bundle up know-how as an installable skill — is now spreading beyond general-purpose coding: a security researcher's `Claude-BugHunter` gained 1,349 stars in a single day, and Google Labs shipped `stitch-skills`, a design tool wrapped the exact same way. Skill bundles are turning into a distribution unit that spreads faster than the frameworks underneath them.

## Trending Repos

### mattpocock/skills ★328,726 (+~800/day, +5.6k this week)

[GitHub](https://github.com/mattpocock/skills)　·　Shell　·　MIT

- **What it is**: Engineer Matt Pocock open-sourced the exact skills he uses daily with Claude Code and Codex — install them with one command, `/setup-matt-pocock-skills`.
- **Why it matters**: Where `obra/superpowers` sells a full methodology, this bundle leans toward "engineering habits you can actually use" — spec alignment, deliberate scoping, decades of engineering judgment distilled into small, individually installable skills. You can cherry-pick instead of buying into an entire workflow. Overtaking superpowers in star count today suggests what wins in this space is the usefulness density of individual skills, not the overarching narrative around them.
- **Tech stack**: Shell scripts + Markdown skill definitions, compatible with Claude Code, Codex, Copilot CLI, Gemini CLI, and other agent runtimes
- **Getting started**: Easy — one install line, or pick specific skills with `npx skills@latest add`

---

### elementalsouls/Claude-BugHunter ★13,855 (+1,349/day)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **What it is**: Packages 83 bug-bounty and red-team skills, 15 slash commands, and attack patterns curated from 681 publicly disclosed reports across 24 vulnerability classes — including enterprise identity and infrastructure attack chains — into a Claude Code plugin.
- **Why it matters**: This proves the skill-bundle distribution model isn't limited to "writing code." Years of accumulated vulnerability knowledge get turned into an installable skill, and once it's in, Claude Code stops being a chatbot and starts behaving like a researcher who knows the CVE chains and the methodology — while explicitly scoping itself to authorized, legal testing only. Today's growth rate was the fastest of any candidate on this list.
- **Tech stack**: Claude Code Skills system + Burp Suite MCP integration; skills trigger automatically by topic, no manual invocation needed
- **Getting started**: Medium — installs in one step, but getting full value requires correctly scoping the engagement and setting up HackerOne API authorization

---

### google-labs-code/stitch-skills ★10,954

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **What it is**: A set of Agent Skills Google Labs built for its own design tool, Stitch, packaged to the Agent Skills open standard so Antigravity, Gemini CLI, Claude Code, and Cursor can all call Stitch's MCP server for interface design and component generation.
- **Why it matters**: This looks like the first case of a major vendor formally shipping an internal design workflow as an installable skill plugin, rather than it being an independent developer's personal practice. Combined with today's other two entries, skill bundles are turning into a packaging convention that cuts across domains, not just a coding-agent trick.
- **Tech stack**: Agent Skills open standard + Stitch MCP server + the Codex/Claude plugin marketplace mechanism
- **Getting started**: Medium — requires a Stitch account and MCP server connection set up first; the plugin install itself is one command

---

### firecrawl/firecrawl ★205,054 (+825/day)

[GitHub](https://github.com/firecrawl/firecrawl)　·　TypeScript　·　AGPL-3.0

- **What it is**: Knowledge infrastructure for agents — web scraping, search, and 550+ data sources unified behind one API, usable self-hosted (Firecrawl Local), in the cloud, or as a plain MCP server for any agent runtime.
- **Why it matters**: This repo is over two years old, not a new project — yet it's still growing fast enough to place near the top of today's candidates, showing that demand for agents to "look things up" hasn't plateaued. Firecrawl Local can run as a local MCP server out of the box, which lines up with the same "install it and it just works" expectation behind today's other two skill bundles.
- **Tech stack**: TypeScript service + MCP server interface + SDKs in Python, Node, Go, and Rust
- **Getting started**: Easy — one command (`firecrawl-local`) starts the local service; the cloud version just needs an API key

## Notable Releases

### CrewAI 1.15.44

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)

- **Key changes**: Added the ability to save files as versioned, shareable artifacts. Fixed inline agent/crew reference resolution relative to the flow file, duplicate separators surviving chunk merges, and `crewai train` exiting with the wrong status code on failure. Also stopped stamping `cache_control` on every Anthropic file block on every call.
- **Breaking changes**: None.
- **Impact**: If you rely on CrewAI's flow file storage or knowledge chunking, this release makes both more stable — no code changes needed.

---

### Claude Code v2.1.329

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)

- **Key changes**: The trust dialog now shows which folder declared a hook. Non-interactive hosts like Claude Desktop now surface a warning in the conversation when a hook in managed settings fails to load. `/tasks` now lists this session's scheduled tasks, `/loop` wakeups, and forks. Code Mode can now run with OpenTelemetry events and metrics enabled at the same time.
- **Breaking changes**: None.
- **Impact**: If your team pushes hooks through managed settings, a failed hook load is no longer silent. If you use `/loop` or scheduled tasks, `/tasks` now gives you the full picture without digging through logs.

## Today's Takeaway

I used to think the top spot in the agent-skills ecosystem was settled — `obra/superpowers` had it locked down. But watching the star leaderboard change hands this quickly made it clear: this kind of "format-first, no application code" bundle spreads faster than the frameworks underneath it. Security (Claude-BugHunter) and design (stitch-skills, straight from Google) are already using the same distribution logic — this isn't a general-coding toy anymore.

## References

- [mattpocock/skills - GitHub](https://github.com/mattpocock/skills)
- [mattpocock/skills star history](https://www.star-history.com/mattpocock/skills/)
- [obra/superpowers star history](https://www.star-history.com/obra/superpowers/)
- [elementalsouls/Claude-BugHunter - GitHub](https://github.com/elementalsouls/Claude-BugHunter)
- [google-labs-code/stitch-skills - GitHub](https://github.com/google-labs-code/stitch-skills)
- [firecrawl/firecrawl - GitHub](https://github.com/firecrawl/firecrawl)
- [AI Open Source Trends 2026-11-20 (source for today's star-gain figures)](https://github.com/duanyytop/agents-radar/issues/4383)
- [CrewAI 1.15.44 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)
- [Claude Code v2.1.329 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)
