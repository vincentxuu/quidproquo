---
title: "@playwright/mcp: Microsoft's Official Browser Automation MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [playwright, mcp, browser-automation, ai-agent, e2e-testing, developer-tools]
lang: en
tldr: "@playwright/mcp defaults to an accessibility tree (browser_snapshot) instead of screenshots, cutting token consumption sharply. Combined with Playwright's native auto-wait it's a sensible starting point for AI agents doing web automation — but note it now runs headed by default, keeps a persistent profile by default, and gates advanced tool groups behind --caps."
description: "A deep-dive into @playwright/mcp: installation, tool groups and the --caps switch, the token advantages of accessibility tree mode, profile and session management, and when to switch to screenshot mode or to the Playwright CLI instead."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 1
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

**It runs headed by default** (you see the browser window) — the opposite of early versions, and the `--headed` flag older write-ups mention no longer exists. To run headless, pass `--headless`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless"]
    }
  }
}
```

Switch engines with `--browser` (`chrome` / `firefox` / `webkit` / `msedge`). There are two ways to attach to an already-running browser: point `--cdp-endpoint` at a debuggable endpoint (e.g. `http://localhost:9222`), or install the official Playwright browser extension and use `--extension` to drive your existing tabs. The full flag table lives in [the README's Configuration section](https://github.com/microsoft/playwright-mcp#configuration).

> **Decide whether you want MCP at all.** The upstream README now opens by talking you out of it: for coding agents Microsoft recommends [Playwright CLI + Skills](https://github.com/microsoft/playwright-cli) instead, because CLI invocations avoid loading large tool schemas and verbose accessibility trees into the context window. MCP's stated niche has narrowed to long-running agentic loops that genuinely benefit from persistent browser state and iterative reasoning over page structure.

## Tool Groups and `--caps`

The tool list has churned heavily over the past year, so memorising it item by item is pointless — it goes stale. Here's the structure; for **exact names and parameters, read the official [Tools section](https://github.com/microsoft/playwright-mcp#tools)**.

Loaded by default: **Core automation** (navigate, click, type, forms, snapshot, screenshot, wait, console/network, evaluate) plus **Tab management**. Everything else is **opt-in** via `--caps`:

| `--caps` value | What it unlocks |
|---|---|
| `config` | Read the running server's configuration |
| `network` | Request interception/rewriting (route), network-state emulation |
| `storage` | Cookies, localStorage, sessionStorage, storage state |
| `devtools` | Low-level CDP access |
| `vision` | Coordinate-based mouse tools (for computer-use style models) |
| `pdf` | Save the page as PDF |
| `testing` | Assertion tools, locator generation |

Renames that commonly break copied-from-old-posts calls:

- The screenshot tool is `browser_take_screenshot`, not `browser_screenshot`.
- Tab handling collapsed into a single `browser_tabs`; there is no `browser_tab_list` / `browser_tab_new` / `browser_tab_select` / `browser_tab_close`.
- Going back is `browser_navigate_back`; there is **no** forward tool and no standalone reload tool.
- `browser_pdf_save` requires `--caps=pdf` — it is not available by default.

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

When to switch to screenshot mode (`browser_take_screenshot`):
- The page is image-heavy (galleries, maps, Canvas-rendered content)
- You need to verify visual styling (colours, layout correctness)
- The accessibility tree carries insufficient information to determine page state

## What Auto-wait Actually Means

Playwright's auto-wait applies to every interaction: click waits for the element to be visible + enabled + stable (not mid-animation); `browser_type` waits for the input to be focused. 

For AI agents this means: no need to sprinkle "wait for the page to load" or "wait for the button to appear" into your prompts, and no sleep calls between tool invocations. Playwright handles the timing in the background, so the agent can issue "click Submit" without knowing the current page state.

## Multi-tab Management

Opening, closing, switching, and listing tabs all go through the single `browser_tabs` tool, distinguished by its parameters. Each tab has its own page context. `browser_snapshot` and `browser_take_screenshot` target the currently active tab. Cross-tab data transfer requires `browser_evaluate` or the agent tracking the state itself.

## Limitations

**Low-level CDP is opt-in**: you get a CDP channel only after `--caps=devtools`; without it, anything Playwright hasn't wrapped (heap snapshots, CPU profiles) is out of reach. For real performance or memory work, [Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp-en) is the more direct tool.

**Cross-browser isn't free**: Firefox / WebKit need `--browser`, and CDP-related capabilities only work on Chromium-family engines.

**Accessibility tree coverage**: Pages with poor ARIA attributes may produce incomplete snapshots. In those cases, switch to screenshot mode or use `browser_evaluate` to query the DOM directly.

**The persistent profile is a double-edged default**: a persistent profile is now the **default** (stored per MCP-client workspace root), so logins survive across sessions. The flip side is that two clients sharing a workspace fight over the same profile — to run them in parallel you need `--isolated` or distinct `--user-data-dir` values. In isolated mode all state dies when the browser closes, so preloading a login means feeding a storage state file via `--storage-state`.

## In Summary

@playwright/mcp is currently the most AI-agent-friendly browser MCP option available. Accessibility tree mode cuts token costs and removes the dependency on vision-capable models; auto-wait brings interaction reliability close to a full E2E test framework. It's the sensible default starting point unless you have a specific reason to need screenshot feedback or low-level CDP control.

## References

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [@playwright/mcp tool list (README › Tools)](https://github.com/microsoft/playwright-mcp#tools)
- [Playwright CLI + Skills — GitHub](https://github.com/microsoft/playwright-cli)
- [Playwright Documentation](https://playwright.dev/)
- [Playwright authentication and storage state docs](https://playwright.dev/docs/auth)
- [ARIA Accessibility Tree — MDN](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
- [Browser MCP Comparison](/posts/tech/2026-06-20-browser-mcp-comparison-en)
