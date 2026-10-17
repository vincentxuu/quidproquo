---
title: "Tool Pick｜AI Slop Meter — Measuring Exactly How Much Your Site Screams \"Built by AI\""
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server + CLI that scores a site's AI-slop level across copy, template design and unfinished details using 60+ explainable checks, with every finding pointing to a file:line and a ready-to-paste fix prompt"
tldr: "AI Slop Meter is a locally-run MCP server + CLI that scores a website or project folder for \"AI slop\" and hands back fix steps. Install: `npx -y aislopmeter https://your-site.com --open` or `claude mcp add --scope user aislopmeter -- npx -y aislopmeter mcp`. It solves the problem of everyone using the same batch of AI site builders and ending up with sites that look identical — without being able to say exactly what's wrong."
series:
  name: "AI Tool of the Day"
  order: 58
---

> 🌏 [中文版](/posts/daily/2026-10-18-tool-aislopmeter)

## Tool Info

| Item | Value |
|---|---|
| Name | AI Slop Meter |
| Type | MCP server + CLI (plus a browser bookmarklet) |
| GitHub | [omergocmen/aislopmeter](https://github.com/omergocmen/aislopmeter) |
| Stars | 2 (brand new, created 2026-10-17) |
| Language | JavaScript (Node.js ≥ 20) |
| License | MIT |
| Install | `npx -y aislopmeter https://your-site.com --open` |

## What Problem It Solves

Tools like Lovable, Bolt, v0 and Replit have made shipping a site faster than ever this year, but the side effect is obvious: purple-gradient heroes, glowing cards, Tailwind's default palette, "not just X, but Y" headlines — the same look everywhere. You can feel something is off, but you can't point to the exact line or element, let alone tell an AI assistant precisely what to fix.

AI Slop Meter turns that vague "this looks off" instinct into 60+ explainable rules across five categories: whether the content has real substance (checkable facts, actual work shown), whether the copy leans on clichés, whether the design is template-shaped, whether there are unfinished details (`href="#"`, lorem ipsum), and whether there are telltale traces left by builders like Lovable, Bolt or v0. It reads the site's own CSS and JS first, and if Chrome or Edge is installed, it actually opens the page to measure contrast, rendered fonts and how much is centered — rather than guessing from class names. Every finding comes with an exact `file:line` and a fix prompt you can hand straight to your AI, and it also runs as a full loop through Claude Code's `/mcp__aislopmeter__rescue` command: scan, plan, fix, rescan, repeat until the score hits target.

Good fit for: taking over a landing page an AI builder generated and needing to know exactly what to change so it doesn't scream "AI-built"; or adding a CI gate that blocks pages that obviously shipped unfinished. It can scan a `localhost` dev server and a project folder too, not just a public URL.

## Quick Start

### Install

```bash
# Try it once, nothing installed
npx -y aislopmeter https://your-site.com --open

# Add it to Claude Code, available in every project afterward
claude mcp add --scope user aislopmeter -- npx -y aislopmeter mcp
```

### Basic Usage

```bash
# Scan a whole site (up to 30 pages by default), write a visual report and open it
npx -y aislopmeter https://example.com --open

# Scan a local dev server
npx -y aislopmeter localhost:3000 --open

# Scan a project folder; findings point to the file:line your AI can edit
cd my-app
npx -y aislopmeter . --plan
```

In MCP mode, just tell your AI:

> Scan my project for AI slop and show me what to fix.

### Advanced Usage

```json
// .aislopmeter.json: turn off a check that doesn't apply, and protect a brand color from being flagged
{
  "disable": ["purple-gradient"],
  "keep": "our logo purple and the hero photo",
  "pages": 30,
  "failAbove": 40
}
```

```yaml
# GitHub Action: check every PR automatically, block it above a threshold
- uses: omergocmen/aislopmeter@v0
  with:
    target: .
    fail-above: 40
```

## Comparison with Existing Tools

| | AI Slop Meter | Lighthouse / PageSpeed | Manual QA checklist |
|---|---|---|---|
| Scores "AI-built look" specifically | ✅ | ❌ (performance/SEO metrics only) | Depends on the reviewer |
| Gives a fix prompt ready to hand to an AI | ✅ | ❌ | ❌ |
| Can scan localhost / a project folder | ✅ | Partial | ✅, but manually |
| No API key, runs locally | ✅ | ✅ | — |
| Can gate a PR in CI | ✅ (GitHub Action) | ✅ | Needs its own process |

## Caveats

- **Not an AI-authorship detector.** The maintainer says so directly: a page made entirely by AI can still score clean, and a hand-written page can score high. It measures "looks like an unfinished template," not "was written by AI."
- **The calibration sample is still small.** It's tuned on only 34 real sites so far (AI-built pages scored a median of 25, hand-made pages about 12), and the Turkish-language checks are newer and less tested; rule coverage will keep shifting.
- **Browser measurement needs Chrome/Edge installed locally.** Without a browser it falls back to HTML/CSS only, and single-page apps (Vite, CRA) that first render an empty `<div id="root">` will score inaccurately unless the browser measurement runs.

## Today's Takeaway

I used to think "this site looks AI-made" was purely a gut feeling, but this tool shows there are clear, decomposable signals behind it — formulaic headlines, Tailwind's default colors, unfinished `href="#"` links. The research the maintainer cites is the sharper point: when LLMs themselves were asked to judge "is this slop?", they agreed with human editors at close to random (κ ≈ 0) — meaning fixed, explainable rules beat letting an AI judge freely here.

## References

- [omergocmen/aislopmeter — GitHub](https://github.com/omergocmen/aislopmeter)
- [AI Slop Meter official site](https://aislopmeter.netlify.app)
- [aislopmeter — npm](https://www.npmjs.com/package/aislopmeter)
- [CRITERIA.md — the 60+ checks and their sources](https://github.com/omergocmen/aislopmeter/blob/main/docs/CRITERIA.md)
- [CALIBRATION.md — calibration data from 34 sites](https://github.com/omergocmen/aislopmeter/blob/main/docs/CALIBRATION.md)
