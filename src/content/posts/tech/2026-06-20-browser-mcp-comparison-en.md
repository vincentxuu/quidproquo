---
title: "Choosing a Browser MCP: CDP, Playwright MCP, or Puppeteer MCP?"
date: 2026-06-20
category: tech
type: deep-dive
tags: [mcp, browser-automation, playwright, puppeteer, cdp, ai-agent, developer-tools]
lang: en
tldr: "@playwright/mcp uses an accessibility tree instead of screenshots, cutting token cost by 10–50x — the best default for AI agents doing web automation. Puppeteer MCP fits screenshot-heavy tasks. Direct CDP via MCP is for low-level tooling or domains that Playwright/Puppeteer don't expose."
description: "A comparison of three browser MCP approaches: direct Chrome DevTools Protocol, @playwright/mcp, and @modelcontextprotocol/server-puppeteer — covering abstraction level, token cost, browser support, and when to use each."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-06-20-browser-mcp-comparison)

When an AI agent needs to control a browser, there are three mainstream MCP server options: direct [Chrome DevTools Protocol (CDP)](/posts/tech/2026-06-20-chrome-cdp-en), Microsoft's official [@playwright/mcp](https://github.com/microsoft/playwright-mcp), and the [@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) from the MCP official repository. The three operate at very different abstraction levels, with significant differences in AI-agent friendliness.

## What Each One Is

**Direct CDP via MCP**: Wraps Chrome DevTools Protocol as an MCP server, letting agents call methods like `Network.enable` or `Page.captureScreenshot` directly. Maximum granularity, but requires familiarity with CDP's Domain/Method design.

**@playwright/mcp**: The official Playwright MCP wrapper maintained by Microsoft. Its key differentiator is that it defaults to **accessibility tree snapshots** instead of screenshots — agents receive a text-based ARIA structure rather than an image, dramatically cutting token costs.

**@modelcontextprotocol/server-puppeteer**: The Puppeteer wrapper from the official MCP servers monorepo. A lean seven-tool set built around **screenshot feedback** and `puppeteer_evaluate` for custom JS execution.

## Comparison Table

| | CDP MCP | @playwright/mcp | server-puppeteer |
|---|---|---|---|
| Abstraction level | Lowest (raw protocol) | High (locator + auto-wait) | Medium (CSS selector + evaluate) |
| Browser support | Chromium only | Chromium / Firefox / WebKit | Chromium only |
| Page state delivery | Custom (you implement it) | Accessibility tree (default) or screenshot | Screenshot (base64) |
| Token cost | Depends on implementation | Lowest (accessibility tree, no images) | Highest (screenshot per interaction) |
| Auto-wait | ❌ | ✅ built-in | ❌ |
| Multi-tab management | ✅ Target Domain | ✅ | ❌ limited |
| Access to unexposed domains | ✅ all 40+ | ❌ | ❌ |
| Attach to existing Chrome | ✅ | ✅ `--cdp-endpoint` | limited |
| Maintainer | community / self-built | Microsoft (official) | Anthropic MCP official |

## CDP MCP: Finest Grain, Highest Barrier

> **Naming note**: "CDP MCP" and "Chrome DevTools MCP" are two names for the same thing. Chrome DevTools Protocol is the full name; CDP is the abbreviation. Wrapping it as an MCP server gives you a "CDP MCP" or "Chrome DevTools MCP" — there is no difference between the two terms.

There is no single "official" CDP MCP package — it typically means wrapping `chrome-remote-interface` or a similar library as an MCP server. The advantage is access to Domains that Playwright and Puppeteer don't expose: `Profiler` (CPU profiling), `HeapProfiler` (memory analysis), `Security` (certificate management), and `Fetch` (low-level request interception).

Appropriate when you're building DevTools utilities, performance analysis pipelines, or need to attach to an existing Chrome instance. Not suitable as a first choice for AI agents navigating ordinary web pages — just knowing which Domain Method to call requires significant prompt engineering overhead.

## @playwright/mcp: The Default for AI Agents

The most important design decision in Playwright MCP is `browser_snapshot`: it returns the ARIA accessibility tree as text rather than a screenshot. A typical web page screenshot encoded in base64 is 50–300 KB, easily tens of thousands of tokens; the same page's accessibility tree is usually 2–10 KB and requires no vision capability to process.

Playwright's built-in auto-wait (waiting for elements to be interactable before acting) also simplifies agent retry logic significantly — no need to sprinkle "wait for DOM to update" instructions in your prompts.

Cross-browser support (Chromium / Firefox / WebKit) also makes it the only viable choice for QA agents that need to verify behaviour across multiple browsers.

## @modelcontextprotocol/server-puppeteer: Screenshot-Driven, Flexible JS

Puppeteer MCP's seven-tool set (navigate, screenshot, click, fill, select, hover, evaluate) is quick to get started with. `puppeteer_evaluate` lets agents execute arbitrary JavaScript in the page context, covering operations that the fixed tool list doesn't handle.

Screenshot feedback gives agents visual confirmation, at the cost of high token consumption per interaction. Best suited for tasks where the screenshot itself is the deliverable (OG image capture, visual regression checks), or where page ARIA attributes are too sparse for an accessibility tree to be useful.

## How to Choose

**General web automation / AI agent browsing** → @playwright/mcp. Auto-wait and the accessibility tree maximise reliability and minimise token cost.

**Visual confirmation or screenshots as output** → server-puppeteer.

**Low-level tooling, performance analysis, attaching to an existing Chrome, accessing Domains that Playwright/Puppeteer don't expose** → CDP MCP.

**Cross-browser testing (Firefox / WebKit)** → @playwright/mcp (the other two don't support this).

## In Summary

The core difference isn't about which one is most powerful — it's about where you sit on the abstraction spectrum. For most AI agent use cases, @playwright/mcp's accessibility tree mode currently best satisfies both "cheap tokens" and "high reliability." Puppeteer MCP fits screenshot-centric tasks. CDP MCP is a tool-builder's option, not the default path for agent applications.

## References

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [@modelcontextprotocol/server-puppeteer — GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Chrome DevTools Protocol Introduction](/posts/tech/2026-06-20-chrome-cdp-en)
- [Playwright Documentation](https://playwright.dev/)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
