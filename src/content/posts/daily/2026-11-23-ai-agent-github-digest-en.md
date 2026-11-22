---
title: "AI Agent GitHub Digest — 2026-11-23"
date: 2026-11-23
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, firecrawl]
lang: en
description: "CLI-Anything and last30days-skill are both gaining stars noticeably slower than a few days ago, but firecrawl/firecrawl — pure data infrastructure — is gaining faster. The heat is shifting from packaging formats to what agents can actually query"
tldr: "HKUDS/CLI-Anything and mvanhorn/last30days-skill are both gaining 30-40% fewer stars per day than a few days ago. google-labs-code/stitch-skills keeps growing steadily. firecrawl/firecrawl's daily gain is actually higher than it was a few days ago. No framework release cleared the bar today."
series:
  name: "AI Agent GitHub Digest"
  order: 100
---

> :globe: [中文版](/posts/daily/2026-11-23-ai-agent-github-digest)

## Today's Highlight

Lining up today's candidates against the same repos from a few days ago turns up a split: the projects riding "skill-bundle packaging" for their heat (CLI-Anything, last30days-skill) are both gaining 30-40% fewer stars per day than before — not falling off the list, just cooling off. Meanwhile firecrawl, which is purely "infrastructure agents use to look things up," is gaining faster today than it was a few days ago. The novelty of the packaging format itself is wearing off, but the more fundamental question — what can an agent actually find — hasn't cooled at all.

```diagram
title: Daily star gains for three repos, a few days ago vs. today
desc: CLI-Anything and last30days-skill are both gaining fewer stars per day; firecrawl is gaining more.
caption: Source: same-day GitHub Trending snapshots (CLI-Anything, last30days-skill: 11/20 vs 11/23; firecrawl: 11/21 vs 11/23). Conversion: x = 200 + daily stars x 0.4.
---
<svg viewBox="0 0 640 330">
  <line class="dg-axis" x1="475" y1="90" x2="560" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="560" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="475" cy="90" r="6"/>
  <text class="dg-sub" x="463" y="90" text-anchor="end" dominant-baseline="central">687</text>
  <text class="dg-sub" x="572" y="90" dominant-baseline="central">899</text>
  <text class="dg-label" x="190" y="90" text-anchor="end" dominant-baseline="central">CLI-Anything</text>

  <line class="dg-axis" x1="469" y1="170" x2="581" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="581" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="469" cy="170" r="6"/>
  <text class="dg-sub" x="457" y="170" text-anchor="end" dominant-baseline="central">673</text>
  <text class="dg-sub" x="593" y="170" dominant-baseline="central">952</text>
  <text class="dg-label" x="190" y="170" text-anchor="end" dominant-baseline="central">last30days-skill</text>

  <line class="dg-axis" x1="530" y1="250" x2="564" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="530" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="564" cy="250" r="6"/>
  <text class="dg-sub" x="518" y="250" text-anchor="end" dominant-baseline="central">825</text>
  <text class="dg-sub" x="576" y="250" dominant-baseline="central">910</text>
  <text class="dg-label" x="190" y="250" text-anchor="end" dominant-baseline="central">firecrawl</text>

  <line class="dg-rule" x1="20" y1="296" x2="620" y2="296"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="40" cy="314" r="6"/>
  <text class="dg-small" x="54" y="314" dominant-baseline="central">a few days ago</text>
  <circle class="dg-point dg-c-accent" cx="160" cy="314" r="6"/>
  <text class="dg-small" x="174" y="314" dominant-baseline="central">today</text>
</svg>
```

## Trending Repos

### HKUDS/CLI-Anything ★62,637 (+687/day)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Apache-2.0

- **What it is**: Automatically wraps any software that has source code into a CLI an agent can call directly. The team also runs CLI-Hub, an index site (`pip install cli-anything-hub` then `cli-hub install <name>`) that collects community-generated wrappers.
- **Why it's worth watching**: Three days ago (11/20) it gained 899 stars in a day; today that's down to 687, a roughly 24% drop. At the same time it picked up a "GitHub Trending Repository of the Day" badge and an arXiv tech report (2606.03854) — the project is moving from "just went viral" to "formally indexed, backed by a paper." Growth is slowing, but the project's formal standing keeps rising.
- **Tech stack**: Python + Click + source-analysis/codegen pipeline + the CLI-Hub web index
- **Learning curve**: Medium — it needs to scan the target software's source to generate a matching CLI; commercial software without source code gets wrapped through its official SDK instead.

---

### mvanhorn/last30days-skill ★72,581 (+673/day)

[GitHub](https://github.com/mvanhorn/last30days-skill)　·　Python　·　MIT

- **What it is**: A research-oriented agent skill. Give it any topic and it queries Reddit, X, YouTube, Hacker News, Polymarket, and more in parallel, ranks results by real human engagement (upvotes, bet amounts, views), and synthesizes a cited brief.
- **Why it's worth watching**: It gained 952 stars a day three days ago; today that's 673, down about 29% — but the README notes the project has moved on to its "v4 pipeline," so the author isn't resting on the initial launch spike. Coverage keeps expanding (X, YouTube, TikTok, arXiv, Techmeme). Growth is slower, but feature coverage keeps growing.
- **Tech stack**: Python 3.12+ + yt-dlp + multi-platform API/browser cookie bridging + SQLite (optional persistent storage for trend tracking)
- **Learning curve**: Low — Claude Code installs it in one line with `/plugin marketplace add mvanhorn/last30days-skill`; 50+ other agent hosts can use `npx skills add mvanhorn/last30days-skill -g`.

---

### google-labs-code/stitch-skills ★11,834 (+516/day)

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **What it is**: A set of Agent Skills Google Labs built for its own design tool, Stitch, packaged to the open Agent Skills standard so Antigravity, Gemini CLI, Claude Code, and Cursor can all call Stitch's MCP server for interface design and component generation.
- **Why it's worth watching**: Two days ago (11/21) it sat at 10,954 total stars with no clear daily-gain figure; today it's at 11,834 — roughly 440 stars a day averaged over those two days. That goes a step further than the earlier observation ("first big-vendor case of skill-bundle packaging applied to a design tool"): this isn't a one-time spike from exposure. Google's own repo keeps pulling in new stars steadily, without needing a fresh news hook.
- **Tech stack**: Agent Skills open standard + Stitch MCP server + Codex/Claude plugin marketplace mechanism
- **Learning curve**: Medium — you need a Stitch account and MCP server connection set up first; the plugin install itself is one command.

---

### firecrawl/firecrawl ★206,831 (+910/day)

[GitHub](https://github.com/firecrawl/firecrawl)　·　TypeScript　·　AGPL-3.0

- **What it is**: Knowledge infrastructure for agents — web crawling, search, and 550+ data sources behind a single API. You can self-host it (Firecrawl Local), use the cloud version, or run it as a plain MCP server for any agent runtime.
- **Why it's worth watching**: It gained 825 stars a day two days ago; today that's up to 910 — growth went up, not down. This is a two-year-old repo with no fresh news hook and no major version bump; the only explanation is that the underlying need — agents need to be able to look things up — is itself growing. As it happens, while researching today's release checks across four frameworks, I pulled all of their publish dates and notes through this exact repo's Alexandria GitHub provider in one pass — a live demonstration of the "knowledge infrastructure" claim on its own README.
- **Tech stack**: TypeScript service + MCP server interface + multi-language SDKs (Python/Node/Go/Rust)
- **Learning curve**: Low — `firecrawl-local` starts a local service in one command; the cloud version just needs an API key.

## Notable Releases

No framework release cleared the bar today. Across the 13 frameworks checked (LangGraph, CrewAI, the MCP spec, Mastra, Pydantic AI, Agno, Claude Code, Composio, smolagents, LlamaIndex, DSPy, Haystack, browser-use), only Composio's CLI (0.6.2 → 0.6.3) and browser-use (1.0.7 → 1.0.8) shipped anything in the last 48 hours, and both were patch releases — CLI operational fixes and small bug fixes, no breaking changes or features worth flagging. Claude Code's latest is still v2.1.330 from 11/20, already covered in the previous article; no new version shipped today.

## Today's Takeaway

I used to assume that when a "skill bundle" repo's growth slowed, the topic itself was cooling off. Stacking today's batch together shows that's only true for the packaging layer — CLI-Anything and last30days-skill both lost close to a third of their daily growth, while firecrawl, pure data infrastructure, grew faster. A new packaging format loses its novelty eventually; whether an agent can actually find what it's looking for doesn't — there's no reason the two should cool at the same rate.

## References

- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- [HKUDS/CLI-Anything tech report (arXiv 2606.03854)](https://arxiv.org/abs/2606.03854)
- [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)
- [GitHub Trending (2026-11-23)](https://github.com/trending?since=daily)
- [LangGraph 1.2.24 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.24)
- [Claude Code v2.1.330 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)
- [browser-use 1.0.8 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.8)
