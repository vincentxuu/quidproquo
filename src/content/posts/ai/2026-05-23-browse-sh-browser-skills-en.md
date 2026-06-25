---
title: "browse.sh: Turning What Browser Agents Learn into a Skill Catalog"
date: 2026-05-23
category: ai
type: deep-dive
tags: [browse-sh, browser-agent, agent-skills, browserbase, autobrowse]
lang: en
tldr: "browse.sh, launched by Browserbase in May 2026, is two things: a browser skill catalog and the Browse CLI. The core thesis: the bottleneck for browser agents isn't reasoning — it's amnesia. By storing learned site-specific workflows as plain-text SKILL.md files, Autobrowse cut Craigslist task costs from ~$0.22 to ~$0.12 by their own metrics. Note: this has nothing to do with the 2018 Browsh text-mode browser."
description: "A breakdown of Browserbase's browse.sh: the browser skill catalog, the Browse CLI, how Autobrowse trains skills, its relationship to the AgentSkills standard, and what 'open source and free' actually means here."
draft: false
---

🌏 [中文版](/posts/ai/2026-05-23-browse-sh-browser-skills)

If your first reaction to "browse.sh" is "oh, that terminal text browser" — pause. **That's a different thing entirely.** This post is about the browse.sh launched by Browserbase in May 2026: a browser skill catalog and CLI designed to stop AI agents from re-discovering the same website from scratch every single time. The one-line pitch is direct: the bottleneck for browser agents has never been intelligence. It's amnesia.

## Let's Clear This Up First: This Is Not the 2018 Browsh

The names are too similar to ignore. **Browsh / brow.sh** is a terminal text browser built by Thomas Buckley-Houston in 2018. It uses a headless Firefox to render web pages as TTY text — including video and WebGL — and its last release was version 1.8.3 in January 2024, under the LGPL 2.1 license. It solves the problem of "bad network connection, want to view modern websites over SSH."

The **browse.sh** in this post is a 2026 product by Browserbase, related to browser agents, and has nothing to do with viewing web pages in a terminal. The only thing the two share is the name. Everything below refers to the 2026 version.

## What browse.sh Actually Is: A Catalog Plus a CLI

According to the official description, browse.sh is two things bundled together:

> Browse.sh is two things: (1) A catalog of browser skills... (2) The Browse CLI (npm i -g browse), the open-source command-line tool your agents use to actually drive browsers, fetch pages, search the web, and load skills on demand.
> — Browserbase, *Browse.sh, a catalog of browser skills for the agentic future* (2026-05-18)

In plain terms:

1. **A skill catalog** (the browse.sh website): launched with 100+ curated skills, with over 110 browsable at time of writing — covering e-commerce (Craigslist, Zillow, eBay), food delivery (DoorDash, McDonald's), travel (flights, hotels, Airbnb), government portals (benefits, case lookups), and developer tools (GitHub).
2. **The Browse CLI** (`npm i -g browse`): the command-line tool agents use to actually open browsers, fetch pages, search the web, and load skills on demand.

## The Core Thesis: The Bottleneck Is Amnesia, Not Reasoning

This is the foundational argument behind the entire product. Today, when Claude Code, Cursor, or Codex lets a model open a browser, it does the same dumb thing every time: open the browser, click around, find buttons, parse the page, close it, **forget everything**, then repeat the next day. Browserbase calls this repeated cost the **discovery tax**.

They put it more bluntly in the Autobrowse post:

> The real bottleneck for browser agents in production is memory, in a form humans and agents can both read and trust. Reasoning has stopped being the constraint.
> — Browserbase, *Autobrowse* (2026-05-06)

The numbers: using Craigslist as a benchmark, a general-purpose agent loop searching listings costs **~$0.22 / ~71 seconds**, because it has to discover on its own that the search page is pure JS-rendered, that there's a hidden JSON API at `sapi.craigslist.org`, that `item[0]` is an offset rather than a postingId, and so on. An Autobrowse-trained skill does the same task in **~$0.12 / 27 seconds** — a ~45% reduction by their own accounting. The homepage also claims that the recommended DOM selectors and XHR patterns can "save 50x token costs" — this figure appears only on the marketing page, so treat it accordingly.

To be clear: **all of these numbers are Browserbase's own self-reported benchmarks**. Independent third-party verification is not yet available.

## What a Skill Looks Like: A Plain-Text Playbook

A skill isn't a black box — it's **a `SKILL.md` file (plain Markdown) plus any necessary helper scripts**. It deliberately avoids vector embeddings and screenshot streaming; the stated rationale is that humans can read and audit it, and agents can execute it directly. The file captures the exact steps for a given task on a given site: the gotchas, hidden APIs, selectors, and fallback strategies. Here's an excerpt from the official Craigslist skill:

```markdown
## Site-Specific Gotchas
- Snapshot returns 0 refs on `/search/`: the search page is pure JS-rendered — don't use browse snapshot.
- `item[0]` is not a postingId; it's an offset from `data.decode.minPostingId`. Using it as an ID returns 404.
- The API uses the request IP for geolocation. Override with `postal=`. No residential proxy needed.
- Rate-limit: keep it at ≤ 1 req/s.
```

This format wasn't invented by Browserbase. It follows the **AgentSkills open standard** (`agentskills.io`) — the `SKILL.md` format originally open-sourced by Anthropic, now consumed by Claude Code and OpenAI Codex alike. Its key idea is **progressive disclosure**: when an agent starts up, it only loads each skill's `name` and `description`; the full content is read only when a task matches. This means you can attach a large library of skills without blowing up your context window. In other words, browse.sh takes the "Claude Skills" standard and applies it specifically to the vertical of browser automation. (Related: [Claude Skills: Packaging Expertise into Folders](/posts/ai/2026-05-08-anthropic-claude-skills-guide))

## Autobrowse: Having AI Train Its Own Skills

The skills in the catalog aren't hand-crafted — they're trained by Browserbase's **Autobrowse** system, which they describe as "using AI to improve AI." The process is a loop:

```
Give a real task ──▶ Run to completion ──▶ Read the trace ──▶ Write into strategy.md
      ▲                                                              │
      │                                                              ▼
Converge (cost/steps stop decreasing) ◀── Iterate (cut steps that didn't help)
      │
      ▼
Write SKILL.md (graduation)
```

The key design decision: each iteration, the agent writes what worked, what broke, and what to try next into a `strategy.md` that serves as context for the next run. Improvements **accumulate** rather than resetting. The iteration cap is deliberately low (around 3–5 rounds); once it converges, it short-circuits. The first run is intentionally expensive — it's paying for every future run being cheap.

Browserbase is also honest about **when not to use Autobrowse**: they tried it on a 167-row static HTML table where the data was plainly in the markup. After 4 iterations and ~$24 in cost, it still hadn't extracted all 167 rows cleanly. A ~200-line BeautifulSoup script got the job done instantly. That lesson is baked directly into the skill documentation: **if you can `fetch` it, don't open a browser; if you can parse it deterministically, don't use Autobrowse.** Autobrowse only pays off on sites that genuinely require exploration — hidden APIs, heavy JS rendering, multi-step login flows.

## How to Use It: From Local Chromium to Cloud

The CLI is designed around "develop locally, scale to cloud" using the same commands:

```bash
npm i -g browse                                # Install the CLI
browse skills add zillow.com/extract-listings  # Install a skill
browse skills list                             # List installed skills
```

A typical in-agent prompt just treats a skill as a tool: `Use /extract-listings to find apartments under $3,000 in SF with 2+ bedrooms.` — the skill provides the playbook, the model provides the reasoning. Under the hood there are low-level primitives (click / scroll / type / hover / press, addressable by selector or accessibility reference), plus the ability to tail network and console logs for a live session. By default, everything runs on **local Chromium**; prefix any command with `cloud` to switch to a Browserbase cloud session.

## Who It's For / Who It's Not For

**Good fit**: teams running browser agents in production who are getting crushed by repeated discovery costs; people who want site-specific know-how to live as auditable, version-controlled, handoff-ready plain-text playbooks rather than opaque traces; and Claude Code / Cursor / Codex users who want their coding agents to browse with pre-loaded knowledge.

**Not a good fit**: tasks involving deterministic parsing (data is already in the HTML) — write a parser, it'll be faster and cheaper; one-off fact lookups — just fetch or search; and lightweight purely-local use cases where you don't want to touch cloud browsers or paid APIs.

## The Asterisks You Should Know About

A fair reading can't just echo the marketing page. A few things worth being honest about:

- **"Open source and free" needs qualification**: The CLI and skills are indeed open source (`browserbase/skills` repo, MIT licensed), but running a full workflow may still require model credits, Browserbase credentials, cloud sessions, residential proxies, CAPTCHA solving, and paid APIs. Open source ≠ zero cost end-to-end.
- **Branding and naming are still converging**: You'll encounter `browse` (the standalone browse.sh CLI), `bb` (the Browserbase CLI, where `bb browse` is a passthrough), `@browserbasehq/browse-cli` on npm, and two parallel catalog domains in `browse.sh` and `skills.sh/browserbase`. This is not a clean, unified product yet — the confusion is real.
- **Skill reliability depends on sites not changing**: When a website redesigns, a skill may need to be retrained; Autobrowse convergence means "good enough," not globally optimal.
- **Numbers are self-reported**: The cost figures, the 45% reduction, the 50x token savings — all come from Browserbase itself. Independent verification is still absent.

## The Bottom Line

browse.sh is betting on a specific judgment: that the future bottleneck for browser agents is **memory**, not reasoning. So the right unlock is turning what agents learn into plain-text skills that humans can read, agents can run, and teams can version-control. The official summary puts it well: "The bottleneck for browser agents was never intelligence. It was amnesia. Browse.sh is the cure."

The trade-offs are also clear: you're buying into Browserbase's Autobrowse platform ecosystem, a body of self-reported metrics, a naming situation that's still sorting itself out, and a value proposition that only holds for sites that genuinely require exploration. If you're building browser agents and drowning in repeated discovery costs, it's worth trying. If you're just parsing static pages, write a parser — don't let the "let the agent figure it out" narrative pull you in. (Related: [AI Browser Agents: How Claude, Codex, and Gemini Open Browsers](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini), [Agent Memory Systems](/posts/ai/2026-03-19-agent-memory-systems))

## References

- [browse.sh official homepage](https://browse.sh/)
- [Browse.sh, a catalog of browser skills for the agentic future (Browserbase blog)](https://www.browserbase.com/blog/browse.sh)
- [Autobrowse: The Mythos moment for Browser Agents is here (Browserbase blog)](https://www.browserbase.com/blog/autobrowse)
- [Browserbase CLI product page](https://browserbase.com/browse-cli)
- [AgentSkills open standard (agentskills.io)](https://agentskills.io/)
- [browserbase/skills (GitHub, skills repo)](https://github.com/browserbase/skills)
- [Browsh — Wikipedia (disambiguation: the 2018 text browser)](https://en.wikipedia.org/wiki/Browsh)
- Related: [Claude Skills: Packaging Expertise into Folders](/posts/ai/2026-05-08-anthropic-claude-skills-guide)
- Related: [AI Browser Agents: Claude, Codex, Gemini](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini)
- Related: [Agent Memory Systems](/posts/ai/2026-03-19-agent-memory-systems)
