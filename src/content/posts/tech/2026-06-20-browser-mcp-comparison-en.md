---
title: "Choosing a Browser MCP: CDP, Playwright MCP, or Puppeteer MCP?"
date: 2026-06-20
category: tech
type: deep-dive
tags: [mcp, browser-automation, playwright, puppeteer, cdp, ai-agent, developer-tools]
lang: en
tldr: "It's really a two-way choice now: @playwright/mcp (cross-browser, accessibility tree, token-cheap) versus chrome-devtools-mcp (Chrome's official server, performance and memory diagnostics). @modelcontextprotocol/server-puppeteer has been archived and is no longer a candidate. The dividing line is no longer abstraction level — it's 'drive the page' versus 'diagnose Chrome'."
description: "A comparison of three browser MCP approaches: Chrome's official chrome-devtools-mcp, Microsoft's @playwright/mcp, and the archived @modelcontextprotocol/server-puppeteer — covering maintenance status, page-state delivery, browser support, and when to use each."
draft: false
series:
  name: "Browser Automation and MCP"
  order: 4
---

> 🌏 [中文版](/posts/tech/2026-06-20-browser-mcp-comparison)

The three routes usually compared for giving an AI agent a browser are [Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp-en), Microsoft's [@playwright/mcp](https://github.com/microsoft/playwright-mcp), and the MCP repo's [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp-en).

**Their relative positions have shifted since that framing was set.** Two things to establish first:

1. **server-puppeteer has been archived**, moved to [servers-archived](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer), with the last npm release at `2025.5.12`. It is now a historical reference point, not a candidate.
2. **Chrome DevTools MCP has an official package**: [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), maintained by the Chrome team. It runs on Puppeteer and waits for action results, so it is **no longer the "raw protocol, implement your own auto-wait" route**.

So there are really two to compare — and the axis of comparison has changed.

## Why the Old Axis Stopped Working

The old ordering was abstraction level: CDP lowest, Puppeteer middle, Playwright highest. That axis no longer measures anything. chrome-devtools-mcp and @playwright/mcp are both high-level wrappers, both auto-wait, both return structured page snapshots, and both install with one line of `npx`.

What actually separates them now is **purpose**:

- **@playwright/mcp exists to let an agent operate a web page.** Every trade-off follows from that: accessibility tree instead of screenshots to save tokens, three browser engines, assertions and a locator generator for testing.
- **chrome-devtools-mcp exists to let an agent diagnose Chrome.** Performance traces and insights, Lighthouse, heap snapshots, extension management — @playwright/mcp has no equivalent tools, and none of these are for clicking around a page.

## Comparison Table

| | chrome-devtools-mcp | @playwright/mcp | server-puppeteer |
|---|---|---|---|
| Maintenance | Chrome team, active | Microsoft, active | **Archived (nothing since 2025.5.12)** |
| Primary purpose | Diagnosis, debugging, performance | General web automation, E2E testing | — |
| Built on | Puppeteer | Playwright | Puppeteer |
| Auto-wait | ✅ | ✅ | ❌ |
| Page state delivery | Snapshot (`take_snapshot`) or screenshot | Accessibility tree (default) or screenshot | Screenshot (base64) |
| Browser support | Chrome / Chrome for Testing | Chromium / Firefox / WebKit | Chromium only |
| Attach to running browser | ✅ `--browser-url` / `--ws-endpoint` / `--auto-connect` | ✅ `--cdp-endpoint` / `--extension` | Limited |
| Performance trace / Lighthouse | ✅ | ❌ | ❌ |
| Heap snapshots | ✅ (`--memoryDebugging`) | ❌ | ❌ |
| Extension / PWA management | ✅ | ❌ | ❌ |
| Request interception | ✅ | ✅ (`--caps=network`) | Roll your own via evaluate |
| Assertions / locator generation | ❌ | ✅ (`--caps=testing`) | ❌ |
| Context-size control | `--slim` | Per-group `--caps` | Only 7 tools to begin with |
| Usage statistics by default | ✅ (disable with `--no-usage-statistics`) | ❌ | ❌ |

## Untangling the Word "CDP"

Comparison posts routinely blur "CDP MCP" and "Chrome DevTools MCP". Worth separating:

- **Chrome DevTools**: the developer tools panel built into the browser — the UI you get with F12.
- **Chrome DevTools Protocol (CDP)**: the WebSocket protocol that panel uses *behind the scenes* to talk to the browser engine.
- **chrome-devtools-mcp**: the Chrome team's packaging of DevTools capability as an MCP server. It drives the browser engine, not the DevTools panel UI.

One clarification worth adding: **chrome-devtools-mcp is not the only thing using CDP.** Puppeteer, Playwright's Chromium backend, and Lighthouse all sit on top of it. "Uses CDP" isn't a distinguishing feature of any one route — all three do. The difference is which Domains they surface to the agent.

## @playwright/mcp: The Default for Driving Pages

Playwright MCP's key design decision is `browser_snapshot`: return page state as an ARIA accessibility tree rather than a screenshot. For the same page, the tree is one to two orders of magnitude smaller than a screenshot, and any text-only model can process it.

Playwright's own auto-wait logic (act only when the element is interactable) simplifies agent retry logic — no "wait for the DOM to update" instructions in the prompt. Cross-browser support (Chromium / Firefox / WebKit) also makes it suitable for QA agents that need to verify multi-browser behaviour.

Two defaults that trip people up: **it now runs headed, not headless** (add `--headless`), and **it uses a persistent profile by default** (logins survive; running multiple clients in parallel needs `--isolated`). Details in the [dedicated post](/posts/tech/2026-06-20-playwright-mcp-en).

Note also that the upstream README now nudges you toward [Playwright CLI + Skills](https://github.com/microsoft/playwright-cli) first: for coding agents, a CLI avoids loading tool schemas and full accessibility trees into context. MCP's niche has narrowed to long-running agentic loops that need persistent browser state.

## chrome-devtools-mcp: Finding Out What Chrome Is Doing

Its differentiator isn't clicking pages — it's moving DevTools' diagnostic capability into a tool interface: record a performance trace and extract insights through the same DevTools analysis engine, run Lighthouse, take heap snapshots and diff them to find retainers, manage extensions and PWAs, get source-mapped console stack traces.

The costs are equally clear: Google Chrome and Chrome for Testing only; the project states outright that the server exposes any data in the browser to the MCP client; usage statistics are on by default. Details in the [dedicated post](/posts/tech/2026-06-20-chrome-devtools-mcp-en).

## server-puppeteer: Kept for Contrast

A minimal tool set (navigate, screenshot, click, fill, select, hover, evaluate), screenshots for page state, and `puppeteer_evaluate` as the universal escape hatch. The spectrum it illustrates still has value — the smaller the tool set, the more JS the agent has to write itself; the more page state rides on screenshots, the harder token cost is to contain — but it is no longer updated, and new projects shouldn't pick it.

## How to Choose

**General web automation / letting an agent operate pages** → @playwright/mcp.

**Cross-browser testing (Firefox / WebKit)** → @playwright/mcp (the other one doesn't support it).

**Performance analysis, memory leak hunting, Lighthouse, Chrome extension / PWA development** → chrome-devtools-mcp.

**Driving the browser you're already logged into** → both can attach to a running instance. For Chrome, chrome-devtools-mcp's `--browser-url` / `--auto-connect` is the most direct; to stay in the Playwright ecosystem, use `--extension`.

**Both jobs** → running both together is fine, but watch your context: give chrome-devtools-mcp `--slim` and open only the `--caps` you need on Playwright, otherwise the two tool schemas add up fast.

## In Summary

This question went from "pick one of three abstraction levels" to "pick one of two purposes". @playwright/mcp makes the agent get page operations right; chrome-devtools-mcp lets the agent explain why a page is slow or leaking. And server-puppeteer demonstrates a third thing: **MCP servers have shorter lifespans than you'd assume** — putting "is anyone still maintaining this" on the evaluation sheet is more useful than counting tools.

## References

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [@modelcontextprotocol/server-puppeteer — GitHub (archived)](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)
- [Playwright CLI + Skills — GitHub](https://github.com/microsoft/playwright-cli)
- [Chrome DevTools Protocol — Official Docs](https://chromedevtools.github.io/devtools-protocol/)
- [Playwright Documentation](https://playwright.dev/)
- [Model Context Protocol — Official Docs](https://modelcontextprotocol.io/)
- [Chrome DevTools MCP Introduction](/posts/tech/2026-06-20-chrome-devtools-mcp-en)
- [@playwright/mcp Introduction](/posts/tech/2026-06-20-playwright-mcp-en)
- [@modelcontextprotocol/server-puppeteer Introduction](/posts/tech/2026-06-20-puppeteer-mcp-en)
