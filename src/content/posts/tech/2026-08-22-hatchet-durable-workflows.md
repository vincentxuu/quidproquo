---
title: "Hatchet：一套同時處理 task queue、DAG 與 durable task 的工作流引擎"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hatchet, durable-execution, task-queue, workflow, postgres, ai-agent]
lang: zh-TW
tldr: "Hatchet 以 Postgres-backed control plane 統一一般 task、DAG 與 durable task；durable task 在等待與 child task 邊界 checkpoint，恢復時重播 deterministic 編排碼。"
description: "介紹 Hatchet task queue、DAG、durable task、checkpoint、worker、自架架構與 AI agent 適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 35
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-hatchet-durable-workflows-en)

[Hatchet](https://github.com/hatchet-dev/hatchet) 不只是一個 durable workflow SDK。它把 durable task queue、靜態 DAG、dynamic workflow、排程、rate limit、結果保存、observability 與 dashboard 放在同一個 Postgres-backed 平台，worker 則用 Python、TypeScript 或 Go 執行你的程式。

這個廣度是它和只解 durable orchestration 的工具最不一樣之處：同一個團隊可先從背景 task 開始，再把真正需要長期協調的部分升級成 durable task。

## 一般 task 與 durable task 要分工

一般 task 負責有 side effect 的工作：查資料庫、呼叫模型、寄信、更新 SaaS。Hatchet 保存 task execution 與 output，提供 retry、timeout、priority 與 queue control，但外部 side effect 仍要 idempotent。

durable task 則是編排器。官方模型限制它只做 durable context 操作或 spawn child tasks，例如等待時間、等待事件、等待 children，再根據結果決定下一批工作。

下面是刻意省略 SDK 版本細節的概念碼：

```text
const research = hatchet.durableTask({
  name: "research-agent",
  fn: async (input, ctx) => {
    const plans = await ctx.aio.spawnMany(input.queries.map(runSearch));
    const approval = await ctx.aio.waitFor("research.approved");
    return ctx.aio.spawn(writeReport, { plans, approval });
  },
});
```

重點是邊界：search、模型與資料庫寫入應是 child task，不直接藏在 durable task 的 orchestration code。實作時再依所用 SDK 版本採用官方 signature。

## Checkpoint 不等於保存 call stack

每當 durable task 完成 sleep、收到事件或等待 child run 結束，Hatchet 會把進度寫入 durable event log。等待期間可 evict task、釋放 worker slot；條件成立後重新排隊，從 event history 建回狀態。

恢復仍會重跑抵達各 checkpoint 的程式路徑，只是不再重做已記錄的 operation。因此 checkpoint 之間的 orchestration code 必須 deterministic。不要直接讀 DB、打 API 或用未受控亂數決定分支；把這些動作下沉到 child task。

官方把這描述為 completed application logic 不會重跑並提供 exactly-once semantics，但工程上仍要縮小解讀範圍：Hatchet 能對已記錄的 task／durable operation 去重，無法和任意外部 API 共用 transaction。child task 在 side effect 完成、結果回報前 crash，依然可能重送。

## DAG 與 dynamic workflow 各有位置

已知的資料處理流程適合 DAG：預先宣告 dependencies，由引擎平行執行 ready tasks。Agent loop、遞迴 research、人工核准或 runtime fan-out 在開始前不知道形狀，適合 durable task 動態 spawn children。

不要為了「更 durable」把每個工作都寫成 durable task。普通獨立 job 用一般 task；固定依賴用 DAG；只有需要跨等待點保存編排決策時才用 durable task。這樣 side-effect boundary 最清楚，也降低 deterministic replay 的認知成本。

## 自架的核心是 control plane 加 Postgres

Hatchet Cloud 代管 control plane，worker 可留在自己的 VPC。自架包含 Hatchet engine、REST API、dashboard 與 PostgreSQL；RabbitMQ 是高吞吐即時 dispatch 的選配，也可用 Postgres-backed messaging。worker 獨立運行，透過 gRPC 連到 engine。

單機 CLI／Docker Compose 適合開發或小型部署，Kubernetes／Helm 適合正式環境。但「只依賴 Postgres」不代表零維運：資料庫 HA、backup、connection budget、event retention、engine upgrade、worker credential 與 gRPC ingress 都是 production responsibility。

## AI agent 的優勢是動態 fan-out

研究型 agent 可由 durable task 讀已保存的 child results，決定再派幾個 search／browser／model task，等待人工核准時又不占 worker slot。每個 child 都有獨立 retry 與 observability，比把整個 loop 塞進一個 queue consumer 更容易 repair。

但 permission 與成本控制不會自動出現。每個 child input 應帶 tenant、budget、tool allowlist、prompt/model version 和 idempotency key；大型 artifact 放 object storage。replay 後若程式版本改變，也要有 versioning 或 compatibility policy，避免舊 history 走出新分支。

## 什麼時候選 Hatchet

團隊想用一個平台涵蓋背景 queue、DAG、排程與動態 durable workflow，又偏好 Python／TypeScript／Go 和 Postgres 自架路徑，Hatchet 值得優先試。只要事件驅動 serverless function 與 managed flow control，Inngest 較直接；需要 keyed durable state 與 service semantics，Restate 更鮮明；成熟的大型 durable workflow 治理可比較 Temporal。

PoC 不要只測 happy path。請在 child side effect 後 kill worker、在 wait 中重啟 control plane、升級 workflow code，再確認 history、duplicate handling 與人工重跑是否符合團隊的 failure contract。

## 參考資料

- [Hatchet repository and platform overview](https://github.com/hatchet-dev/hatchet)
- [Hatchet durable tasks](https://github.com/hatchet-dev/hatchet/blob/main/frontend/docs/pages/v1/durable-tasks.mdx)
- [Hatchet durable execution](https://hatchet.run/platform/durable-execution)
- [Hatchet core concepts](https://docs.hatchet.run/home/concepts)
- [Hatchet self-hosting overview](https://docs.hatchet.run/self-hosting/overview)
- [Hatchet: How to think about durable execution](https://hatchet.run/blog/durable-execution)
