---
title: "OpenClaw Tools (Part 1): Browser Control and Web Search"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, browser, web-search, deep-research, browserless, browserbase]
lang: en
tldr: "OpenClaw's browser uses managed profiles for isolation, supports remote CDP (Browserless/Browserbase), and Deep Research combines search and browsing for multi-step research."
description: "OpenClaw's browser control system (managed profiles, remote CDP, sandboxed browsers) and web search tools."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-browser-search)

OpenClaw's agent can control browsers and search the web. This post covers browser management, remote CDP providers, and the Deep Research feature.

## Browser Control

### Two Profile Types

| Profile | Description |
|---|---|
| `openclaw` (default) | Managed profile — a clean environment managed by OpenClaw |
| `user` | Your own Chrome profile, with login state and cookies |

The managed profile is isolated — it won't touch your personal browsing data. It's suitable for most agent use cases.

### Configuration

```json5
{
  browser: {
    enabled: true,
    profile: "openclaw",       // openclaw | user
    headless: false,           // whether to show the window
    viewport: { width: 1280, height: 800 }
  }
}
```

### Multiple Profile Support

You can configure multiple managed profiles simultaneously for different agents or tasks:

```json5
{
  browser: {
    profiles: {
      research: { /* ... */ },
      testing: { /* ... */ }
    }
  }
}
```

### Remote CDP Providers

Don't want to run Chrome locally? You can use remote CDP (Chrome DevTools Protocol):

**Browserless:**
```json5
{
  browser: {
    provider: "browserless",
    browserless: {
      endpoint: "wss://chrome.browserless.io",
      token: "your-token"
    }
  }
}
```

**Browserbase:**
```json5
{
  browser: {
    provider: "browserbase",
    browserbase: {
      apiKey: "your-key",
      projectId: "your-project"
    }
  }
}
```

### Sandboxed Browser

The Docker backend supports standalone browser sandbox containers:

- Uses a dedicated Docker network (`openclaw-sandbox-browser`)
- noVNC observation access is password-protected
- CDP source range can be restricted
- `allowHostControl` can let sandbox sessions control the host browser

```bash
scripts/sandbox-browser-setup.sh
```

### Snapshots and Refs

The browser supports page snapshots (screenshots), which can be referenced by other tools.

### CLI Commands

```bash
openclaw browser status          # Check browser status
openclaw browser profiles list   # List profiles
```

## Web Search

The agent can use the built-in web search tool to search the internet. Multiple search providers are supported.

### Configuration

```json5
{
  tools: {
    web: {
      search: {
        provider: "google",    // or other providers
        enabled: true
      }
    }
  }
}
```

When the provider selection is in auto mode, it checks available API keys in priority order and automatically selects the first usable provider.

## Deep Research

A multi-step research mode that combines search and browsing. The agent can:

1. Search for relevant information
2. Browse search result pages
3. Extract key content
4. Synthesize and analyze

This is a skill-level feature, not a single tool — it combines web search + browser + document analysis capabilities.

## Summary

Browser and search are the primary ways OpenClaw agents interact with the outside world. Managed profiles ensure isolation, remote CDP avoids local resource consumption, and sandboxed browsers provide security boundaries.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/tools/browser.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/browser.md) — Browser control
- [docs/tools/web-search.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/web-search.md) — Web search
- [docs/tools/deep-research.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/deep-research.md) — Deep Research
