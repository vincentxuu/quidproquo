---
title: "OpenClaw Plugin System: Architecture and Development Guide"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, plugins, sdk, clawhub, channel-plugin, provider-plugin, typescript]
lang: en
tldr: "Plugins are built with TypeScript ESM and support 12 capability registrations (channels, models, tools, TTS, images, etc.), published to ClawHub or npm."
description: "OpenClaw Plugin SDK architecture, 12 capability registrations, development workflow, and a guide to building Channel/Provider Plugins."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-plugins)

OpenClaw's functionality can be extended infinitely through Plugins -- from new chat channels to model providers, from custom tools to speech engines. This post covers the Plugin architecture and development workflow.

## What Can a Plugin Do

A Plugin can register any number of capabilities:

| Capability | Registration Method | Description |
|---|---|---|
| Text inference (LLM) | `api.registerProvider()` | Model provider |
| CLI inference backend | `api.registerCliBackend()` | CLI backend |
| Channel / messaging | `api.registerChannel()` | Chat channel |
| Speech (TTS/STT) | `api.registerSpeechProvider()` | Speech synthesis/recognition |
| Media understanding | `api.registerMediaUnderstandingProvider()` | Media understanding |
| Image generation | `api.registerImageGenerationProvider()` | Image generation |
| Web search | `api.registerWebSearchProvider()` | Web search |
| Agent tools | `api.registerTool()` | Agent tools |
| Custom commands | `api.registerCommand()` | Custom commands |
| Event hooks | `api.registerHook()` | Event hooks |
| HTTP routes | `api.registerHttpRoute()` | HTTP routes |
| CLI subcommands | `api.registerCli()` | CLI subcommands |

## Quick Start: Tool Plugin

### 1. Create the Package and Manifest

```json
// package.json
{
  "name": "@myorg/openclaw-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"]
  }
}
```

```json
// openclaw.plugin.json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "description": "Adds a custom tool to OpenClaw",
  "configSchema": {
    "type": "object",
    "additionalProperties": false
  }
}
```

### 2. Write the Entry Point

```typescript
// index.ts
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";

export default definePluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  description: "Adds a custom tool to OpenClaw",
  register(api) {
    api.registerTool({
      name: "my_tool",
      description: "Do a thing",
      parameters: Type.Object({ input: Type.String() }),
      async execute(_id, params) {
        return { content: [{ type: "text", text: `Got: ${params.input}` }] };
      },
    });
  },
});
```

### 3. Publish and Install

```bash
# External plugin: publish to ClawHub or npm
openclaw plugins install @myorg/openclaw-my-plugin

# In-repo plugin: place in extensions/ directory, auto-discovered
pnpm test -- extensions/my-plugin/
```

OpenClaw checks ClawHub first, then falls back to npm if not found.

## Plugin Types

### Channel Plugin

Use `defineChannelPluginEntry` to connect a new chat platform:

```typescript
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default defineChannelPluginEntry({
  id: "my-channel",
  // ...channel-specific registration
});
```

### Provider Plugin

Add a new model provider. You can register LLM, TTS, image generation, web search, and other capabilities simultaneously.

### Tool Plugin

Register tools that agents can call:

```typescript
// Required tool -- always available
api.registerTool({
  name: "my_tool",
  // ...
});

// Optional tool -- users need to add it to the allowlist
api.registerTool(
  { name: "workflow_tool", /* ... */ },
  { optional: true }
);
```

Users enable it with:
```json5
{ tools: { allow: ["workflow_tool"] } }
```

## Hook Guard

Plugins can intercept events using hooks:

| Hook | Guard | Behavior |
|---|---|---|
| `before_tool_call` | `{ block: true }` | Terminates and prevents subsequent handlers |
| `message_sending` | `{ cancel: true }` | Terminates and prevents subsequent handlers |

## Import Conventions

Always import from focused sub-paths:

```typescript
// Correct
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";

// Wrong (deprecated, will be removed)
import { ... } from "openclaw/plugin-sdk";
```

## Prerequisites

- Node >= 22
- TypeScript (ESM)
- `pnpm install` (for in-repo plugins)

## Plugin Management

```bash
openclaw plugins install <package>    # Install
openclaw plugins list                 # List installed
openclaw plugins status               # Status
/plugins                               # Chat command (requires commands.plugins enabled)
```

## Beta Release Testing

1. Subscribe to the GitHub release tag
2. Test immediately when a beta tag (`v2026.3.N-beta.1`) appears
3. Report feedback in the Discord `plugin-forum` channel
4. File an issue for problems (`Beta blocker: <plugin-name>` + `beta-blocker` label)
5. Open a PR (`fix(<plugin-id>): beta blocker - <summary>`)

## Summary

OpenClaw's Plugin system covers virtually all extension needs -- 12 capability registrations, a TypeScript SDK, and ClawHub marketplace publishing. You can add new channels, models, and tools without modifying the OpenClaw source code.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/plugins/building-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/building-plugins.md) -- Plugin development guide
- [docs/plugins/index.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/index.md) -- Plugin overview
- [docs/plugins/sdk-overview.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-overview.md) -- SDK overview
- [docs/plugins/sdk-channel-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-channel-plugins.md) -- Channel Plugin
- [docs/plugins/sdk-provider-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-provider-plugins.md) -- Provider Plugin
- [docs/plugins/sdk-entrypoints.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-entrypoints.md) -- Entry Points
- [docs/plugins/manifest.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/manifest.md) -- Plugin Manifest
- [docs/plugins/sdk-testing.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-testing.md) -- Plugin testing
- [docs/plugins/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/architecture.md) -- Plugin architecture
