---
title: "@modelcontextprotocol/server-puppeteer: The Official Puppeteer MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [puppeteer, mcp, browser-automation, ai-agent, developer-tools, chrome]
lang: en
tldr: "server-puppeteer is the Puppeteer wrapper in the official MCP servers monorepo — seven lean tools built around screenshots and evaluate. Token cost is significantly higher than @playwright/mcp per interaction, but it fits well when the screenshot itself is the deliverable or custom JS execution is the core need."
description: "A deep-dive into @modelcontextprotocol/server-puppeteer: setup, the seven core tools, practical uses of evaluate, the trade-offs of screenshot-based page state, and how it compares to @playwright/mcp."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-06-20-puppeteer-mcp)

[@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) is the [Puppeteer](https://pptr.dev/) wrapper in Anthropic's official MCP servers monorepo. It exposes seven tools for AI agents to control Chrome: navigate, screenshot, click, fill, select, hover, and evaluate. The tool set is intentionally minimal — screenshots are the primary page-state signal, and `puppeteer_evaluate` serves as the flexible escape hatch for anything else.

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
| Page state delivery | Screenshot (base64) | Accessibility tree (default) |
| Token cost | High | Low |
| Auto-wait | ❌ | ✅ |
| Tool count | 7 | 20+ |
| Multi-tab support | Limited | ✅ |
| Browser support | Chromium only | Chromium / Firefox / WebKit |
| Custom JS execution | ✅ evaluate | ✅ evaluate |
| Maintainer | Anthropic MCP official | Microsoft / Playwright official |

Fewer tools doesn't mean less capable — `puppeteer_evaluate` is essentially a universal escape hatch. But for agents that need reliable interaction (waits, multi-tab, rich locators), Playwright MCP's tool set is more complete.

## When to Use It

**Good reasons to choose server-puppeteer:**
- The task output is a screenshot (rendering quality check, visual UI verification)
- `evaluate` is central to the workflow — you need to run complex JS and existing Puppeteer code is being ported to MCP
- The page has very poor ARIA structure and accessibility tree mode won't give useful information
- Sessions are short enough that screenshot token costs are acceptable

**When it's the wrong choice:**
- Long-running agent workflows (screenshot token costs accumulate)
- Cross-browser scenarios
- Operations that need complex wait logic (no auto-wait)

## In Summary

server-puppeteer is a straightforward, quick-to-start option with `evaluate` providing meaningful flexibility. But in AI agent contexts, the screenshot-based design makes token costs a long-term constraint. For most situations, @playwright/mcp's accessibility tree mode is the more economical starting point. server-puppeteer has the edge when screenshots are the actual goal, or when the work is fundamentally about Puppeteer API interactions.

## References

- [@modelcontextprotocol/server-puppeteer — GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Puppeteer Documentation](https://pptr.dev/)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
- [@playwright/mcp Introduction](/posts/tech/2026-06-20-playwright-mcp-en)
