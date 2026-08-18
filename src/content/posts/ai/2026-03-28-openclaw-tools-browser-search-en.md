---
title: "OpenClaw Tools, Part 1: A Dedicated Browser, Three Ways to Attach, and Search Results Typed as Untrusted"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, browser, web-search, automation, playwright, prompt-injection]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 20
tldr: "OpenClaw's browser is a separate agent-only profile, fully isolated from your personal browser. And web_search's return shape carries an externalContent.untrusted marker — search results are typed as untrusted external content at the type level."
description: "Browser control and web search in OpenClaw: the differences between the three browser profiles, the plugin and allowlist traps that hide it, choosing among 15 search providers, and the design that marks search results as untrusted external content."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-browser-search)

This article covers how the agent sees the outside world — the browser and search. They answer the same class of problem, and **their costs differ enormously**.

## The browser is a separate profile

OpenClaw runs a **dedicated Chrome/Brave/Edge/Chromium profile** driven by a small local control service inside the Gateway (loopback only), **isolated from your personal browser**.

The docs are clear about its role: **this is not your daily driver — it is a safe, isolated surface for agent automation and verification.**

You get: a separate `openclaw` profile (orange accent by default), deterministic tab control, agent actions (click/type/drag/select), snapshots, screenshots, PDFs, and **the ability to answer questions over readable page text without returning a full snapshot**.

## Three profiles, differing on "does someone need to be at the desk"

| Profile | Attaches to | Prerequisite |
|---|---|---|
| `openclaw` | The managed, isolated browser | No extension needed |
| `user` | Your **real signed-in Chrome** (via Chrome DevTools MCP) | Chrome shows a **blocking** "Allow remote debugging?" prompt on first attach, so **someone must be at the computer** |
| `chrome` | Your real signed-in Chrome (via the OpenClaw browser extension) | **Works from a phone with nobody at the desk**, because it drives tabs through the extension rather than the remote-debugging port |

That table answers a very practical question: **"I want the agent to use my logged-in accounts while I'm away"** — the answer is the `chrome` profile, not `user`.

On macOS you can also explicitly copy **cookies** from a Chrome-family system profile into the managed one; the managed browser keeps its own user data directory, and **only the selected cookies are copied — local storage and IndexedDB stay behind**.

## Two traps when enabling it

**Trap 1: the default tool profile does not include browser.** `tools.profile: "coding"` includes `web_search` and `web_fetch` but **not the full `browser` tool**. Add it at the profile stage:

```json5
{ tools: { profile: "coding", alsoAllow: ["browser"] } }
```

And there is an ordering trap: **`tools.subagents.tools.allow: ["browser"]` alone is not enough**, because sub-agent policy is applied **after** profile filtering.

**Trap 2: `plugins.allow` can make the whole browser vanish.** If `openclaw browser` is unknown after an upgrade, `browser.request` is missing, or the agent reports the tool unavailable, the usual cause is a `plugins.allow` list omitting `browser` with no root `browser` config block:

```json5
{ plugins: { allow: ["telegram", "browser"] } }
```

Worth remembering the alternative: **an explicit root `browser` block (any `browser.*` key) also activates the bundled plugin** even under a restrictive `plugins.allow`, matching bundled channel behavior. But `plugins.entries.browser.enabled=true` and `tools.alsoAllow: ["browser"]` **do not substitute for allowlist membership**.

Also: **browser config changes require a Gateway restart** so the plugin can re-register its service.

## Two tiers of agent guidance: cheap and expensive

The browser plugin ships guidance in two tiers, and the split is worth stealing:

- **The `browser` tool description** carries the compact always-on contract: pick the right profile, keep refs on the same tab, use `tabId`/labels for targeting, load the browser skill for multi-step work
- **The bundled `browser-automation` skill** carries the longer operating loop: check status and tabs first, label task tabs, snapshot before acting, resnapshot after UI changes, recover a stale ref once, and **report login/2FA/captcha or camera/microphone blockers as manual action rather than guessing**

The key point: **plugin-bundled skills appear in the available list while their full instructions load on demand** — so routine turns do not pay that token cost. A concrete implementation of "keep the always-on part short, load the detail when needed."

## Search: 15 providers, two result shapes

`web_search` searches with your configured provider and returns normalized results, **cached per query for 15 minutes** (configurable). It also bundles `x_search` for X posts and `web_fetch` for lightweight URL fetching (**always local**).

Providers split roughly in two:

**Structured snippets**: Brave, DuckDuckGo (key-free), Exa, Firecrawl, MiniMax, Ollama, Perplexity, SearXNG (self-hosted, key-free), Tavily

**AI-synthesized answers with citations**: Codex Hosted Search (uses your Codex sign-in, no separate key), Gemini, Grok, Kimi, Parallel

Two key-free options are worth knowing: **DuckDuckGo** (an unofficial HTML integration) and **SearXNG** (self-hosted meta-search aggregating Google, Bing, DuckDuckGo). **Parallel Search also has a free tier** through its free Search MCP, with dense LLM-optimized excerpts.

The docs also position it clearly: **`web_search` is a lightweight HTTP tool, not browser automation.** JS-heavy sites and logins go through the browser.

## Search results are typed as untrusted

This is the design worth taking away. `web_search` normalizes every bundled and external provider **at the core tool boundary**, and every successful shape carries this:

```typescript
externalContent: {
  untrusted: true;
  source: "web_search";
  wrapped: true;
  provider: string;
}
```

**"This is external, untrusted, wrapped content" is written into the return type itself**, rather than left for downstream code to remember.

In a prompt-injection context the significance is obvious: search results are one of the classic injection vectors, and making "untrusted" part of the data structure forces every consumer to confront it rather than rely on convention.

The return shape is a **closed union of three**: `error`, `results` (a structured list), and `answer` (synthesized content with citations). There is no fourth case for callers to guess at.

## The big picture

Browser and search serve the same need with **inverted cost structures**: search is cheap, fast, and stateless but cannot reach anything behind a login or JS rendering; the browser is expensive, slow, and stateful but can see everything.

So the criterion is not "which is stronger" but **"does this require an identity"** — anything behind a login needs the browser, and then you choose the profile by whether someone is at the desk (`user`) or not (`chrome`).

On safety, remember that `untrusted: true`. The lesson generalizes to any agent you build: **content fetched from outside should be separated from your own data at the type level.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the three browser profiles and how they differ** (`openclaw` isolated, `user` via DevTools MCP requiring someone at the computer, `chrome` via extension usable from a phone), the macOS cookie-import limits, **the two traps when enabling the browser** (the `coding` profile excluding it, sub-agent policy applying after profile filtering, and a `plugins.allow` list without `browser` removing the CLI and tool wholesale, with a root `browser` block as the alternative activation path), the plugin's two-tier guidance design, **the 15 search providers** with key-free options, the 15-minute query cache, and **the `externalContent.untrusted` marker in the return type** plus the closed three-shape result union.

## References

This article draws on the following official OpenClaw documentation:

- [Browser](https://docs.openclaw.ai/tools/browser) — the managed browser, profiles, plugin control, agent guidance
- [Web search](https://docs.openclaw.ai/tools/web) — provider comparison, result shapes, the untrusted marker
- [Web fetch](https://docs.openclaw.ai/tools/web-fetch) — lightweight URL fetching
- [Chrome extension](https://docs.openclaw.ai/tools/chrome-extension) — the `chrome` profile path
- [Tools overview](https://docs.openclaw.ai/tools/) — tool categories and policy entry points
