---
title: "@modelcontextprotocol/server-puppeteer: The Official Puppeteer MCP Server"
date: 2026-06-20
updated: 2026-08-19
category: tech
type: deep-dive
tags: [puppeteer, mcp, browser-automation, ai-agent, developer-tools, chrome]
lang: en
tldr: "server-puppeteer is the Puppeteer wrapper in the official MCP servers monorepo — seven lean tools built around screenshots and evaluate. It has since been archived (moved to servers-archived, no longer published), so it is not a choice for new projects; if you want Puppeteer lineage in an MCP server today, look at the Chrome team's chrome-devtools-mcp."
description: "The design of @modelcontextprotocol/server-puppeteer, the trade-offs of screenshot-driven page state, and where to migrate now that it has been archived."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 2
---

> 🌏 [中文版](/posts/tech/2026-06-20-puppeteer-mcp)

> ⚠️ **This server has been archived. Don't use it in new projects.**
> `@modelcontextprotocol/server-puppeteer` was moved out of the official MCP servers monorepo into [`servers-archived`](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer); the last npm release is `2025.5.12` and there have been none since. The package still installs, but it receives no bug fixes and won't track changes to the MCP spec.
>
> Two migration targets: if you want Puppeteer under the hood plus screenshot and debugging capability, move to the Chrome team's [chrome-devtools-mcp](/posts/tech/2026-06-20-chrome-devtools-mcp-en) — it is itself built on Puppeteer. For general web automation, move to [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en).
>
> The rest of this post stays up because the design trade-off it embodies — a tiny tool set, screenshot feedback, and `evaluate` as the escape hatch — keeps recurring. You will weigh the same axes against every other browser MCP.

[@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) is the [Puppeteer](https://pptr.dev/) wrapper in Anthropic's official MCP servers monorepo. It exposes seven tools for AI agents to control Chrome: navigate, screenshot, click, fill, select, hover, and evaluate. The tool set is intentionally minimal — screenshots are the primary page-state signal, and `puppeteer_evaluate` serves as the flexible escape hatch for anything else.

## Installation and Configuration

Run directly via `npx`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

The server manages a Chrome process automatically. Console logs are captured and surfaced to the agent without any extra configuration.

## The Seven Core Tools

**`puppeteer_navigate`**
Go to a URL and wait for the `load` event to fire.

```
puppeteer_navigate("https://example.com")
```

**`puppeteer_screenshot`**
Screenshot the current page or a specific element, returned as base64 PNG. Specify a CSS selector to capture just one element:

```
puppeteer_screenshot(selector="#main-content")
```

**`puppeteer_click`**
Click the element matching a CSS selector. No auto-wait — the element must already be in the DOM.

```
puppeteer_click(selector="button[type='submit']")
```

**`puppeteer_fill`**
Clear and type text into an input:

```
puppeteer_fill(selector="#email", value="user@example.com")
```

**`puppeteer_select`**
Pick a value in a `<select>` element:

```
puppeteer_select(selector="#country", value="TW")
```

**`puppeteer_hover`**
Move the mouse over an element (triggers hover state, opens dropdown menus, etc.):

```
puppeteer_hover(selector=".dropdown-trigger")
```

**`puppeteer_evaluate`**
Execute JavaScript in the page context and return the result:

```javascript
// Example: extract all links on the page
puppeteer_evaluate(script=`
  Array.from(document.querySelectorAll('a'))
    .map(a => ({ text: a.textContent.trim(), href: a.href }))
`)
```

## Practical Uses of evaluate

`puppeteer_evaluate` is where server-puppeteer gains flexibility beyond its seven fixed tools. Common uses:

- Extracting complex data structures from pages with poor ARIA attributes
- Firing custom events (`element.dispatchEvent(new Event('change'))`)
- Reading from localStorage or sessionStorage
- Querying elements inside Shadow DOM (`shadowRoot.querySelector(...)`)
- Polling for non-standard async conditions (wait until a specific property changes)

This gives agents an escape hatch when the fixed tools fall short, but it does require the agent to write valid JavaScript.

## The Screenshot Trade-off

The fundamental characteristic of server-puppeteer is using `puppeteer_screenshot` as the primary way to tell the agent what the page looks like. This has clear trade-offs:

**Advantages:**
- Visual confirmation is intuitive — the agent sees exactly what the user sees
- Works even when ARIA attributes are sparse or absent
- The screenshot itself is the deliverable when that's what the task needs (OG image preview, UI regression screenshots)

**Disadvantages:**
- Each screenshot is tens of thousands of tokens; costs accumulate fast in long sessions
- Requires a vision-capable model — can't be used with text-only models
- Screenshots carry large amounts of visual information the agent doesn't need

Compared to [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en)'s accessibility tree mode, token cost per page check is typically 10–50x higher.

## How It Compares to @playwright/mcp

| | server-puppeteer | @playwright/mcp |
|---|---|---|
| Maintenance | **Archived; last release 2025.5.12** | Actively updated |
| Page state delivery | Screenshot (base64) | Accessibility tree (default) |
| Token cost | High | Low |
| Auto-wait | ❌ | ✅ |
| Tool count | 7 (fixed) | A core set, the rest behind `--caps` |
| Multi-tab support | Limited | ✅ `browser_tabs` |
| Browser support | Chromium only | Chromium / Firefox / WebKit |
| Custom JS execution | ✅ evaluate | ✅ evaluate |
| Maintainer | Anthropic MCP official (archived) | Microsoft / Playwright official |

Fewer tools doesn't mean less capable — `puppeteer_evaluate` is essentially a universal escape hatch. But for agents that need reliable interaction (waits, multi-tab, rich locators), Playwright MCP's tool set is more complete — and there is now a decisive difference on top of that: one of them is still shipping and the other isn't.

## When to Use It

Archiving settles the "should I pick it" question: no. But the jobs it used to be good at still exist — they just have new owners:

| What you wanted server-puppeteer for | What to use now |
|---|---|
| The screenshot is the deliverable (rendering quality, visual UI checks) | chrome-devtools-mcp (`take_screenshot`) or @playwright/mcp |
| Running complex JS through `evaluate` | Both have an equivalent tool |
| Page ARIA is bad, snapshots are useless | chrome-devtools-mcp, or @playwright/mcp in screenshot mode |
| Performance / memory analysis | chrome-devtools-mcp (trace and heap snapshot tools) |
| Cross-browser | @playwright/mcp |

What it was never good at is unchanged: long-running agent workflows (screenshot token costs accumulate), cross-browser scenarios, and operations that need complex wait logic (no auto-wait).

## In Summary

server-puppeteer is a straightforward, quick-to-start option with `evaluate` providing meaningful flexibility. But in AI agent contexts, the screenshot-based design makes token costs a long-term constraint — and it no longer even clears the bar of being maintained.

What's worth keeping is the spectrum it illustrates: the smaller the tool set, the more the agent has to write its own JS through `evaluate`; the more page state rides on screenshots, the harder token cost is to contain. You can measure any browser MCP against those two axes. For what to actually install: general web automation → [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp-en); deep Chrome debugging and performance work → [chrome-devtools-mcp](/posts/tech/2026-06-20-chrome-devtools-mcp-en).

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Browser Automation and MCP" series.

## References

- [@modelcontextprotocol/server-puppeteer — GitHub (archived)](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)
- [Archived list in the official MCP servers repo](https://github.com/modelcontextprotocol/servers#archived)
- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Puppeteer Documentation](https://pptr.dev/)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
- [@playwright/mcp Introduction](/posts/tech/2026-06-20-playwright-mcp-en)
- [Chrome DevTools MCP Introduction](/posts/tech/2026-06-20-chrome-devtools-mcp-en)
