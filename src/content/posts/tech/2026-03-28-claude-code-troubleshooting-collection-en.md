---
title: "Claude Code Troubleshooting Index: Orders 33-35 on Install, Runtime, and Config Diagnosis"
date: 2026-03-28
type: debug
category: tech
tags: [claude-code, troubleshooting, dx]
lang: en
tldr: "The original Claude Code troubleshooting collection has been split into orders 33-35: installation & login, runtime problems, and config diagnosis. This page is their index."
description: "Index to Claude Code Deep Dives orders 33-35: installation and login issues, runtime errors and performance problems, and diagnosing configs that don't take effect."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 36
---

🌏 [中文版](/posts/tech/2026-03-28-claude-code-troubleshooting-collection)

This page was originally planned as a single collection of every Claude Code troubleshooting scenario. While writing it became clear that the three problem classes have very different investigation paths — install failures mean reading setup logs, mid-run crashes mean network and API errors, and silent config misses mean diffing settings files across scopes. Cramming them together would only get in the way. So this troubleshooting group is now split into series orders 33-35, each expanding its symptoms, diagnostic tools, and fixes:

- **Order 33: [Installation & login troubleshooting](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en)**: `command not found`, PATH issues, authentication failures, can't reach the API — for when it doesn't work at all ([中文版](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install))
- **Order 34: [Claude Code Runtime Troubleshooting Guide: CPU/Memory, Session Hangs, Auto-Compact Thrashing, Search Failures](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en)**: interrupted responses, performance anomalies, search and context issues — for when it works but runs poorly ([中文版](/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime))
- **Order 35: [Claude Code Config Not Taking Effect: Diagnosing with /context, /doctor, and /mcp, Plus a Common Errors Reference](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en)**: CLAUDE.md ignored, hooks not firing, MCP servers missing, overridden settings — for "configured but not taking effect," including /context, /doctor, and /mcp usage plus a common-errors table ([中文版](/posts/tech/deep-dive/2026-08-26-claude-code-debug-config))

For the full series map and underlying mechanics, start from the [entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en).

## References

- [Debug your configuration — Claude Code Docs](https://code.claude.com/docs/en/debug-your-config) — Basis of the config diagnosis post: diagnostic commands, safe mode, and common configuration pitfalls
- [Error reference — Claude Code Docs](https://code.claude.com/docs/en/errors) — Source of the runtime error table: meaning and recovery steps per message
- [Troubleshooting index (Chinese version)](/posts/tech/2026-03-28-claude-code-troubleshooting-collection)

## Changelog

- 2026-08-26: Collection split into orders 33-35; this page is now an index.
