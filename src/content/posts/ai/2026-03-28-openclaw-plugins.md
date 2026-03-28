---
title: "OpenClaw Plugin 系統：架構與開發指南"
date: 2026-03-28
category: ai
tags: [openclaw, plugins, sdk, clawhub, channel-plugin, provider-plugin, typescript]
lang: zh-TW
tldr: "Plugin 用 TypeScript ESM 開發，支援 12 種能力註冊（頻道/模型/工具/TTS/圖片等），發布到 ClawHub 或 npm。"
description: "OpenClaw Plugin SDK 架構、12 種能力註冊、開發流程、以及 Channel/Provider Plugin 的建置指南。"
draft: false
---

OpenClaw 的功能可以用 Plugin 無限擴展——從新的聊天頻道到模型供應商、從自訂工具到語音引擎。這篇講 Plugin 的架構和開發方式。

## Plugin 能做什麼

一個 Plugin 可以註冊任意數量的能力：

| 能力 | 註冊方法 | 說明 |
|---|---|---|
| Text inference (LLM) | `api.registerProvider()` | 模型供應商 |
| CLI inference backend | `api.registerCliBackend()` | CLI 後端 |
| Channel / messaging | `api.registerChannel()` | 聊天頻道 |
| Speech (TTS/STT) | `api.registerSpeechProvider()` | 語音合成/辨識 |
| Media understanding | `api.registerMediaUnderstandingProvider()` | 媒體理解 |
| Image generation | `api.registerImageGenerationProvider()` | 圖片生成 |
| Web search | `api.registerWebSearchProvider()` | 網路搜尋 |
| Agent tools | `api.registerTool()` | Agent 工具 |
| Custom commands | `api.registerCommand()` | 自訂指令 |
| Event hooks | `api.registerHook()` | 事件 hook |
| HTTP routes | `api.registerHttpRoute()` | HTTP 路由 |
| CLI subcommands | `api.registerCli()` | CLI 子指令 |

## Quick Start：工具 Plugin

### 1. 建立套件和 manifest

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

### 2. 寫進入點

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

### 3. 發布和安裝

```bash
# 外部 plugin：發布到 ClawHub 或 npm
openclaw plugins install @myorg/openclaw-my-plugin

# In-repo plugin：放到 extensions/ 目錄，自動發現
pnpm test -- extensions/my-plugin/
```

OpenClaw 先查 ClawHub，找不到再 fallback 到 npm。

## Plugin 類型

### Channel Plugin

用 `defineChannelPluginEntry` 連接新的聊天平台：

```typescript
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default defineChannelPluginEntry({
  id: "my-channel",
  // ...channel-specific registration
});
```

### Provider Plugin

加入新的模型供應商。可以同時註冊 LLM、TTS、圖片生成、網路搜尋等能力。

### Tool Plugin

註冊 agent 可以呼叫的工具：

```typescript
// 必要工具——永遠可用
api.registerTool({
  name: "my_tool",
  // ...
});

// 選配工具——使用者需要加到 allowlist
api.registerTool(
  { name: "workflow_tool", /* ... */ },
  { optional: true }
);
```

使用者啟用：
```json5
{ tools: { allow: ["workflow_tool"] } }
```

## Hook Guard

Plugin 可以用 hook 攔截事件：

| Hook | Guard | 行為 |
|---|---|---|
| `before_tool_call` | `{ block: true }` | 終止，阻止後續 handler |
| `message_sending` | `{ cancel: true }` | 終止，阻止後續 handler |

## Import 慣例

永遠從聚焦的子路徑 import：

```typescript
// 正確
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";

// 錯誤（deprecated，會被移除）
import { ... } from "openclaw/plugin-sdk";
```

## 前提需求

- Node >= 22
- TypeScript (ESM)
- `pnpm install`（in-repo plugin）

## Plugin 管理

```bash
openclaw plugins install <package>    # 安裝
openclaw plugins list                 # 列出已安裝
openclaw plugins status               # 狀態
/plugins                               # 聊天指令（需啟用 commands.plugins）
```

## Beta Release 測試

1. 訂閱 GitHub release tag
2. Beta tag（`v2026.3.N-beta.1`）出現時立即測試
3. 在 Discord `plugin-forum` 頻道回報
4. 有問題開 issue（`Beta blocker: <plugin-name>` + `beta-blocker` label）
5. 開 PR（`fix(<plugin-id>): beta blocker - <summary>`）

## 整體來說

OpenClaw 的 Plugin 系統覆蓋了幾乎所有擴展需求——12 種能力註冊、TypeScript SDK、ClawHub 市場發布。不需要改 OpenClaw 原始碼就能加入新頻道、新模型、新工具。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/plugins/building-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/building-plugins.md) — Plugin 開發入門
- [docs/plugins/index.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/index.md) — Plugin 總覽
- [docs/plugins/sdk-overview.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-overview.md) — SDK 總覽
- [docs/plugins/sdk-channel-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-channel-plugins.md) — Channel Plugin
- [docs/plugins/sdk-provider-plugins.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-provider-plugins.md) — Provider Plugin
- [docs/plugins/sdk-entrypoints.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-entrypoints.md) — Entry Points
- [docs/plugins/manifest.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/manifest.md) — Plugin Manifest
- [docs/plugins/sdk-testing.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/sdk-testing.md) — Plugin 測試
- [docs/plugins/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/plugins/architecture.md) — Plugin 架構
