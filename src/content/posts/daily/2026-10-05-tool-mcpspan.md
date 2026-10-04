---
title: "工具推薦｜mcpspan — 幫 MCP server 裝上一支觀測儀表板"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, tool, daily, sdk]
lang: zh-TW
description: "開源自架的 MCP server 分析儀表板：一行程式碼記錄每個 tool call 的呼叫者、延遲與兩種失敗原因，8 種語言 SDK 共用同一份行為合約"
tldr: "mcpspan 是一個開源自架的 MCP server 分析儀表板。安裝：`docker compose up -d` 啟動儀表板，`npm install mcpspan` 幫 server 接線。解決了 MCP server 上線後『不知道是誰在呼叫、呼叫多久、為什麼失敗』的黑箱問題。"
series:
  name: "AI Tool of the Day"
  order: 45
---

> 🌏 [English version](/posts/daily/2026-10-05-tool-mcpspan-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcpspan |
| 類型 | 自架分析儀表板 + 多語言 instrumentation SDK |
| GitHub | [mcpspan/mcpspan](https://github.com/mcpspan/mcpspan) |
| Stars | 1（2026-10-03 剛發布） |
| 語言 | TypeScript（核心 + 儀表板），另提供 Python / Go / C# / Java / Rust / Ruby / PHP SDK |
| 授權 | MIT |
| 安裝 | `docker compose up -d`（儀表板）＋ `npm install mcpspan`（SDK） |

## 解決什麼問題

你寫了一個 MCP server 給 Agent 用，上線之後呢？自己的 log 只會告訴你「這個 tool 跑過了」，不會告訴你是 Claude、Cursor 還是某個你沒聽過的 client 在呼叫、這次呼叫跟前面九百次比起來是快是慢,也分不出「handler 真的壞了」和「tool 很有禮貌地回答『沒有航班』」這兩種完全不同的失敗。MCP server 一旦不是自己在用,這塊黑箱就會一直卡在那裡。

mcpspan 把這塊黑箱變成一支儀表板。SDK 側只要在 server 啟動前呼叫一次 `instrument()`,之後每個 tool call、resource read、prompt get 都會被記錄：誰呼叫的、花多久、成功或失敗、失敗是 handler 丟例外還是 tool 自己回報 `isError`。這些事件送到你自己架的儀表板（`docker compose up -d` 就能跑),畫出呼叫量曲線、每個 tool 的延遲分布、依版本比較前後兩次發布的差異,還能在錯誤率飆高或某個 server 斷線時推播到 Slack、Discord 或任何 webhook。

適合場景：把 MCP server 開放給多個 client 使用之後,想知道哪個 tool 常被叫錯參數、哪次發布讓延遲變差、或是哪個 client 突然不再連線。對只是自己寫一個 MCP server 本機測試用的場景就用不太到。

## 快速上手

### 安裝

```bash
# 啟動自架儀表板，需要 Docker
git clone https://github.com/mcpspan/mcpspan.git
cd mcpspan
docker compose up -d
# 打開 http://localhost:6270 建立帳號，拿到第一支 server 的 API key

# 幫 TypeScript 寫的 MCP server 接線
npm install mcpspan
```

### 基本用法

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { instrument } from 'mcpspan';

const server = new McpServer({ name: 'flights', version: '1.0.0' });

instrument(server, {
  apiKey: process.env.MCPSPAN_API_KEY,
  endpoint: 'http://localhost:6271', // 你自己架的 mcpspan
});

// tool 照原來的方式註冊，不用改
server.registerTool('search_flights', { inputSchema }, async (params) => {
  return { content: [{ type: 'text', text: 'Found 3 flights' }] };
});
```

### 進階用法

```ts
import { exclude } from 'mcpspan';

// 排除被機器輪詢的 tool（例如 health check），避免它的呼叫量和延遲蓋掉真正的使用數據
server.registerTool('health_check', {}, exclude(async () => {
  return { content: [{ type: 'text', text: 'ok' }] };
}));
```

也可以設定 `OTEL_EXPORTER_OTLP_ENDPOINT`,讓 mcpspan 把每次呼叫轉成一筆 OpenTelemetry span,直接餵進既有的 Grafana、Datadog 或 Honeycomb。

## 與現有工具的比較

| | mcpspan | 自己寫 log | 泛用 APM（接 OTel） |
|---|---|---|---|
| 認得 MCP 語意（tool/resource/prompt） | ✅ | ❌ 需自行解析 | ❌ 看不到 tool 名稱、client 類型 |
| 分辨「tool 回報錯誤」vs「handler 丟例外」 | ✅ | 需自行實作 | ❌ |
| 參數值離開 process | ❌ 永不送出 | 依你的 log 設計 | 依你的 instrumentation 設計 |
| 8 種語言同一份行為合約 | ✅ | — | 依各家 SDK |
| 零設定也能轉出 OTel | ✅ | ❌ | （本身就是） |

## 注意事項

- **剛發布,穩定性未知**：repo 建立於 2026-10-03,只有 1 顆星,還沒有正式 release。拿來測試可以,正式環境先觀察幾天。
- **預設不收參數值,但可以選擇收參數名**：`captureParameterNames: true` 會多記錄參數的名稱與型別（例如 `{ destination: 'string' }`),用來抓「Agent 寫錯參數名」這類問題,但要留意即使只是名稱和型別,也可能間接暴露你 tool 的設計細節。
- **自架不是 SaaS**：資料保留天數（預設 90 天原始事件、2 年摘要）、備份、簽章密鑰都要自己管,移除某支 server 的資料無法復原。

## 今日收穫

多數 observability 工具是從「HTTP request」或「function call」的角度切資料,mcpspan 直接切在 MCP 的協定語意上——tool/resource/prompt 各自是一個單位,client 身分來自 handshake 或請求本身。這讓它能做到一般 APM 做不到的事：把「tool 自己說沒找到航班」和「handler 真的壞了」分成兩種完全不同的訊號,而不是都算進同一條錯誤率曲線裡。

## 參考資料

- [mcpspan/mcpspan — GitHub](https://github.com/mcpspan/mcpspan)
- [mcpspan TypeScript SDK README](https://github.com/mcpspan/mcpspan/blob/main/packages/mcpspan/README.md)
- [Self-hosting 文件](https://github.com/mcpspan/mcpspan/blob/main/docs/self-hosting.md)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io)
