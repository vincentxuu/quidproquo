---
title: "@playwright/mcp: Microsoft's Official Browser Automation MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [playwright, mcp, browser-automation, ai-agent, e2e-testing, developer-tools]
lang: en
tldr: "@playwright/mcp defaults to an accessibility tree (browser_snapshot) instead of screenshots, cutting token consumption by 90%+. Combined with Playwright's native auto-wait, it's the best starting point for AI agents doing web automation."
description: "A deep-dive into @playwright/mcp: installation, the full tool list, the token advantages of accessibility tree mode, multi-tab management, and when to switch to screenshot mode."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-06-20-playwright-mcp)

[@playwright/mcp](https://github.com/microsoft/playwright-mcp) is the official Playwright MCP server maintained by Microsoft, letting AI agents control a browser through the [Model Context Protocol](https://modelcontextprotocol.io/). Its defining design choice: **no screenshots by default**. Instead it returns an ARIA accessibility tree to describe page state, dramatically cutting token consumption.

## Installation and Configuration

Start it directly with `npx` — no global install required:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Launches headless Chromium by default. For headed mode (visible browser window):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headed"]
    }
  }
}
```

Attach to an existing Chrome instance:

```json
{
  "args": ["@playwright/mcp@latest", "--cdp-endpoint", "ws://localhost:9222"]
}
```

## Tool List

@playwright/mcp organises its tools into several categories:

**Navigation**
- `browser_navigate` — go to URL
- `browser_go_back` / `browser_go_forward` — history navigation
- `browser_reload` — refresh the page

**Page State**
- `browser_snapshot` — get ARIA accessibility tree (default mode, no image)
- `browser_screenshot` — screenshot (base64 PNG, requires a vision model)

**Interaction**
- `browser_click` — click element (by ARIA label / role / text)
- `browser_type` — type text into an input
- `browser_press_key` — press key (Enter, Tab, Escape, etc.)
- `browser_hover` — mouse hover
- `browser_drag` — drag and drop

**Forms**
- `browser_select_option` — pick a dropdown value
- `browser_file_upload` — upload a file
- `browser_handle_dialog` — handle alert / confirm / prompt

**Network and Dev**
- `browser_network_requests` — list page network requests
- `browser_console_messages` — retrieve console output
- `browser_evaluate` — execute JS in the page context

**Tab Management**
- `browser_tab_list` — list all open tabs
- `browser_tab_new` — open a new tab
- `browser_tab_select` — switch to a tab
- `browser_tab_close` — close a tab

**Export**
- `browser_pdf_save` — save page as PDF

## Accessibility Tree Mode vs Screenshot Mode

`browser_snapshot` is @playwright/mcp's most important differentiator. It returns the ARIA tree as structured text, something like this:

```
- heading "Product List" [level=1]
- list
  - listitem
    - link "MacBook Pro 16-inch" [href="/products/macbook-pro"]
    - text "$2,499"
    - button "Add to Cart"
  - listitem
    - link "iPad Pro" [href="/products/ipad-pro"]
    - text "$1,099"
    - button "Add to Cart"
```

A 1920×1080 screenshot base64-encoded is roughly 100–300 KB, translating to tens of thousands of tokens; the accessibility tree for the same page is typically 2–10 KB and can be processed by any text model without vision capability.

When to switch to screenshot mode (`browser_screenshot`):
- The page is image-heavy (galleries, maps, Canvas-rendered content)
- You need to verify visual styling (colours, layout correctness)
- The accessibility tree carries insufficient information to determine page state

## What Auto-wait Actually Means

Playwright's auto-wait applies to every interaction: click waits for the element to be visible + enabled + stable (not mid-animation); `browser_type` waits for the input to be focused. 

For AI agents this means: no need to sprinkle "wait for the page to load" or "wait for the button to appear" into your prompts, and no sleep calls between tool invocations. Playwright handles the timing in the background, so the agent can issue "click Submit" without knowing the current page state.

## Multi-tab Management

@playwright/mcp supports a full multi-tab workflow:

```
browser_tab_new → (work in new tab) → browser_tab_select(original tab) → browser_tab_close
```

Each tab has its own page context. `browser_snapshot` and `browser_screenshot` target the currently active tab. Cross-tab data transfer requires `browser_evaluate` or the agent tracking the state itself.

## Limitations

**No access to raw CDP Domains**: HeapProfiler, Profiler, Security, and other Domains not wrapped by Playwright are unavailable in @playwright/mcp.

**Firefox / WebKit require extra config**: Chromium is the default. Switching browsers requires a startup flag, and some tools (such as `browser_cdp_send`) only work with Chromium.

**Accessibility tree coverage**: Pages with poor ARIA attributes may produce incomplete snapshots. In those cases, switch to screenshot mode or use `browser_evaluate` to query the DOM directly.

**Sessions are not persistent**: Restarting the MCP server clears the session — cookies and localStorage are lost. For persistent sessions, manage a browser profile via `--user-data-dir`.

## In Summary

@playwright/mcp is currently the most AI-agent-friendly browser MCP option available. Accessibility tree mode cuts token costs and removes the dependency on vision-capable models; auto-wait brings interaction reliability close to a full E2E test framework. It's the sensible default starting point unless you have a specific reason to need screenshot feedback or low-level CDP control.

## References

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright Documentation](https://playwright.dev/)
- [ARIA Accessibility Tree — MDN](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
