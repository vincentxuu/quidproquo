---
title: "How prompt caching shapes Claude Code's speed and bill: prefix matching, invalidation triggers, and hit rate"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, prompt-caching, context, cost]
lang: en
tldr: "Claude Code's prompt caching works by exact prefix matching: a cache read bills at roughly 10% of the standard input rate, but switching models, changing effort, enabling fast mode, toggling MCP servers, or denying an entire tool forces the next turn to reprocess everything. The TTL defaults to five minutes; the main conversation and a few helper requests on a subscription get one hour."
description: "A breakdown of how Claude Code's prompt caching works: the layered prefix structure, which actions invalidate the cache, why CLAUDE.md edits don't apply mid-session, what /compact actually costs, and how to check your own cache hit rate."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 11
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching)

After using [Claude Code](https://code.claude.com/docs/en/prompt-caching) for a while, you've probably noticed a few things: responses get faster as a session goes on without the bill growing proportionally; one day you run `/model` and that single turn takes noticeably longer; you edit CLAUDE.md mid-session and Claude acts like it never saw it. All of these have the same answer — prompt caching. This post maps each confusion onto the mechanism, following the official documentation.

## Why sessions get faster and cheaper the longer they run

Every turn in Claude Code re-sends the full context: the system prompt, your project context, every prior message and tool result, with new content appended at the end. The model itself remembers nothing between requests. If everything were reprocessed from scratch each turn, long sessions would be unusably slow.

The API's answer is **prefix matching**: it compares the start of each request against content it recently processed. Anything exactly identical is read from cache — the re-read is billed at the cached token rate, roughly 10% of the standard input rate — and only the appended tail is fully processed. Since most of each request matches the previous one, the hit rate naturally climbs while you keep working. That's the "faster the longer you use it" effect.

Claude Code deliberately orders each request into three layers, least-changed first:

| Layer | Content | Changes when |
|-------|---------|--------------|
| System prompt | Core instructions, tool definitions, output style | The tool set changes, or Claude Code is upgraded |
| Project context | CLAUDE.md, auto memory, unscoped rules | Session starts, or after `/clear` / `/compact` |
| Conversation | Your messages, responses, tool results | Every turn |

Matching requires an exact match, so a change anywhere in the prefix recomputes everything after it. There is no per-file or per-segment caching.

## Why the turn after switching models is so slow

**The model is part of the cache key**: each model has its own cache. The first request after `/model` reads the entire conversation history with no cache hits — even though the content is identical. That's the slow turn. Afterward the new prefix is written to cache and things return to normal.

Effort level and fast mode's request header are part of the cache key too. Also note that the `opusplan` setting resolves to Opus during plan mode and Sonnet during execution, so every toggle in and out of plan mode is a model switch that starts a fresh cache.

## Why CLAUDE.md edits don't apply mid-session

CLAUDE.md files are **read once at session start** and held in memory. Editing them mid-session doesn't invalidate the cache, but the edit also doesn't apply — Claude keeps working with the version loaded at startup. New content loads on the next `/clear`, `/compact`, or restart.

This isn't a bug; it's a direct consequence of the cache structure. CLAUDE.md sits in the project-context layer. If it were re-read every turn, the prefix would keep shifting and the entire conversation's cache would be invalidated. Loading it once at the start trades delayed updates for a stable cache across the whole session.

One exception: nested CLAUDE.md files in subdirectories and rules with `paths:` frontmatter load later, when Claude first reads a matching file — editing them before that happens does take effect.

## What /compact actually costs

[Compaction](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management) replaces your message history with a summary, so the conversation layer necessarily invalidates — the new history shares no prefix with the old one. The system prompt layer survives, and project context is reloaded from disk, hitting the cache only if CLAUDE.md and memory are unchanged since the session started.

Producing the summary is itself an API request. While the cache is warm, that request reads your cached prefix, so a mid-session `/compact` costs far less than the context size suggests. But if you step away longer than the cache lifetime before compacting, the full history gets reprocessed as uncached input — which is why running `/compact` right after resuming an old session costs the most.

For comparison, `/rewind` is much friendlier: it truncates back to a prefix that was already cached, so the next request hits the earlier cache entry instead of building a new one.

## How to check your own cache hit rate

The API reports two token counts on every response:

| Field | Meaning |
|-------|---------|
| `cache_creation_input_tokens` | Tokens written to cache this turn, billed at the write rate |
| `cache_read_input_tokens` | Tokens served from cache this turn, at roughly 10% of the standard input rate |

The most direct way to watch them live is a [statusline script](https://code.claude.com/docs/en/statusline) reading the `current_usage` object. A high read-to-creation ratio means caching is working well; if creation stays high turn after turn, something keeps changing your prefix. For organization-wide visibility, the OpenTelemetry exporter reports both counts per user and session.

On cache lifetime: there are two TTLs, five minutes and one hour, and every cache hit resets the timer. By default the main conversation gets one hour on a subscription within included usage, and a small set of Anthropic-controlled server-side helper requests also gets one hour; everything else gets five minutes. Past your usage limit, the main conversation drops back to five minutes. From v2.1.242 onward you can control it with the `promptCacheTtl` setting or the `CLAUDE_CODE_PROMPT_CACHE_TTL` environment variable.

## What breaks the cache, and what doesn't

Actions that make the next turn partially or fully reprocess: switching models, changing effort level, turning on fast mode, connecting or disconnecting an MCP server (when its tools aren't deferred), enabling or disabling plugins that provide MCP servers or code intelligence, adding a deny rule for a bare tool name, and upgrading Claude Code. Some MCP disconnects aren't even your doing — a stdio process exiting, an HTTP session expiring, or an automatic reconnection all trigger it.

Actions that keep the cache: editing files in your repo (file contents enter context only when read; changes append a system-reminder), invoking skills and slash commands (instructions append as messages), changing permission modes, and running `/recap`.

One easily missed scope limit: the cache is effectively scoped to one machine and directory. The system prompt embeds the working directory, platform, shell, and more, so two worktrees of the same repository build different prefixes and never share cache.

## Takeaways

Condensed into one operating principle: **pick your model and effort at the start of a session, save `/compact` for natural breaks between tasks, and avoid touching settings that shift the prefix mid-task** — the hit rate takes care of itself. For how the context window itself is managed, see [the earlier post in this series](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management); for the full CLAUDE.md and memory rules, see [the .claude directory guide](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory).

## References

- [How Claude Code uses prompt caching — Claude Code Docs](https://code.claude.com/docs/en/prompt-caching.md) — official documentation for the layered prefix structure, the invalidation list, deferred behavior of CLAUDE.md and output styles, the TTL table, and statusline-based monitoring
- [Prompt caching — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching.md) — official API-level documentation for prefix matching, TTLs, pricing multipliers, usage fields, and cache storage / sharing
- [Statusline — Claude Code Docs](https://code.claude.com/docs/en/statusline.md) — official source for the `current_usage` object used by statusline scripts
- [Monitor usage — Claude Code Docs](https://code.claude.com/docs/en/monitoring-usage.md) — official metric and event attribute reference for OpenTelemetry usage reporting

## Changelog

- 2026-08-26: Initial version, based on the official prompt caching documentation as of August 2026.
