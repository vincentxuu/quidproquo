---
title: "框架更新｜Mastra @mastra/core@1.63.0"
date: 2026-08-29
category: daily
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.63 把 trace 和原生 log 綁在同一筆記錄上、補上 worker /health endpoint 讓部署平台能判斷 rollout 就緒，同時帶了一個 playground-ui breaking change"
tldr: "Mastra @mastra/core@1.63.0 三個重點：(1) 新的 `AdaptableLogger` contract 把 trace_id／span_id 直接寫進原生 log record，取代舊的 dual-write wrapper，`@mastra/loggers` 的 PinoLogger 率先支援；(2) `@mastra/deployer` 新增獨立 worker entry 與 `/health` endpoint（啟動中回 503、就緒回 200），讓部署平台能判斷 rollout 是否安全；(3) breaking change：`@mastra/playground-ui` 的 DataList 拿掉 `variant=\"lined\"`／`flushLeft`／`flushRight`／`MonoCell`，改用 `DataList.TextCell font=\"mono\"`。"
series:
  name: "AI Framework Changelog"
  order: 9
---

> 🌏 [English version](/en/posts/daily/2026-08-29-framework-mastra-1.63.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.63.0` |
| 前一版 | `@mastra/core@1.62.0` |
| 發布日 | 2026-08-28 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.63.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.5k |

## 這個版本為什麼重要

Mastra 1.63 解決的是一個很多團隊上生產後才會踩到的問題：trace 系統和應用程式自己的 log 是兩條平行線。以前 Mastra 用 dual-write wrapper，同一件事要往 trace 系統寫一次、往 log 系統再寫一次，兩邊靠約定對齊，一旦哪邊漏寫或格式對不上，Studio 裡的 trace 就沒辦法點進去看對應的原生 log。1.63 引入 `AdaptableLogger` contract，把 `trace_id`／`span_id` 直接注入到原生 log record 裡，再從同一筆記錄反推出 observability 的 `LogEvent`——本質上是把「兩份輸出、事後對齊」改成「一份輸出、自然帶欄位」。`@mastra/loggers` 的 `PinoLogger` 是第一個實作這個 contract 的 logger，透過 pino 的 mixin 機制把 trace 欄位掛進去，同時保留使用者自訂的 mixin 欄位。同一版還補了一個部署面的缺口：`@mastra/deployer` 現在會產生獨立的 worker entry，帶 `/health` endpoint，啟動中回 503、初始化完成回 200，讓 Kubernetes 或其他部署平台可以拿這個訊號做 rollout gating，不必用「process 有沒有掛掉」這種粗糙的存活判斷。

## 重要變更

- **Logger adapter contract（`AdaptableLogger`）**：`@mastra/core/logger` 新增標準化 contract，讓 logger 在 traced operation 期間把 `trace_id`／`span_id` 寫進原生 log record，並從同一筆記錄推導 observability `LogEvent` → 內建的 `ConsoleLogger` 已實作；`Mastra` 新增 `loggerOptions` 設定，用 `correlation`（注入 trace 欄位，預設開）和 `export`（把 log record 轉送到 observability storage，預設開）兩個開關分別控制；沒實作 adapter 的既有 `IMastraLogger` 仍走舊的 dual-write wrapper，但該路徑已標記 deprecated，下一個 major 版本會拿掉
- **PinoLogger 支援 trace context**：`@mastra/loggers` 的 `PinoLogger` 實作了 adapter contract，透過 pino mixin 把 trace 欄位加進 stdout、檔案、自訂 transport，同時保留使用者原本的 mixin 欄位 → 原生應用程式 log 和 Mastra observability 對齊，不用自己接 middleware
- **非匯出 span 的 trace/log 連結修正**：內部或被排除的 span 裡發出的 log／metric，現在會連到「最近一個會被匯出的祖先 span」，找不到就省略 `spanId` → 修掉 Studio 裡點進去卻連不到對應 trace 的問題
- **部署就緒探測**：`@mastra/deployer` 在標準 build artifact 裡加入獨立 worker entry，並提供 `/health` endpoint（啟動中 503、就緒後 200）→ 部署平台可以用這個訊號判斷 rollout 是否安全，不必猜
- **Scheduler／resume 穩健性修正**：worker 現在能發現並執行「啟動後才建立」的排程，不必重啟；resume 邏輯修正成支援 falsy 的 resume payload（`false`／`0`／`""`），避免 suspended 的 background task 被誤判成沒有 payload 而重複啟動 → 對長時間跑排程和背景任務的部署更可靠

## Breaking Changes

- `@mastra/playground-ui` 的 `DataList` API 清理，拿掉 `variant="lined"`、`flushLeft`／`flushRight`、per-cell `height`、以及 `DataList.MonoCell`
  - 影響範圍：直接嵌入 `@mastra/playground-ui` `DataList` 元件、使用上述 props 或 `MonoCell` 的專案；改用 `DataList.TextCell font="mono"` 取代 `MonoCell`

## 遷移指南

### 從 1.62.x 升級到 1.63.0

```bash
# Step 1: 更新依賴
pnpm add @mastra/core@1.63.0
```

```tsx
// Step 2: 若直接使用 @mastra/playground-ui 的 DataList
// 舊寫法（1.62.x）
<DataList variant="lined" flushLeft>
  <DataList.MonoCell>{value}</DataList.MonoCell>
</DataList>

// 新寫法（1.63.0）
<DataList>
  <DataList.TextCell font="mono">{value}</DataList.TextCell>
</DataList>
```

只呼叫 `@mastra/core` API（不直接嵌入 `@mastra/playground-ui` 元件）的專案，這版沒有 breaking change，直接升級即可。想用新的 trace-correlated logging，把 logger 換成 `@mastra/loggers` 的 `PinoLogger`，或視需要用 `loggerOptions` 調整 `correlation`／`export` 行為。

## 與其他框架的對比觀察

Trace 和原生 log 對不齊，是 agent framework 補 observability 時常見的第二階段問題——第一階段大家先做出 trace／span，第二階段才發現使用者真正想要的是「點一個 trace 就能看到那段時間所有相關的 log」，而不是兩套系統各自為政。Mastra 這次用 adapter contract 把兩者在 record 層級綁死，跟直接要求全站接 OpenTelemetry Logs API 的做法比，門檻更低（先支援 Pino 一個 logger），但也代表其他 logger 要等各自實作 adapter 才能吃到這個好處。搭配這版新增的 worker `/health` endpoint，這版整體不是新增 agent 能力，而是把「部署到生產環境」這條路上的兩個常見痛點（trace 和 log 對不上、rollout 沒有健康探測）補齊，對已經在用 Mastra 跑正式服務的團隊比對還在 POC 階段的團隊更有感。

## 今日收穫

之前以為 trace 系統和應用程式 log 分開設計是常態，各自最佳化各自的格式，靠 `trace_id` 這種共享欄位手動對齊就好。這次看到 Mastra 把兩者收斂成「同一筆 log record，衍生出兩種讀法」才意識到，dual-write 這種「事後對齊」的模式本質上有一個隱藏假設：兩條寫入路徑永遠不會漏拍或不同步——但只要有一次程式碼路徑忘記其中一條，兩邊資料就會悄悄分岔而不會報錯。把資料來源收斂成一份，再從同一份推導出不同視圖，是比「兩份資料事後對帳」更難壞掉的設計。

## 參考資料

- [Mastra @mastra/core@1.63.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.63.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.62.0 — GitHub Release（前一版）](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0)
