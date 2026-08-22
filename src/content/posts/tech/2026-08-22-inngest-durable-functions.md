---
title: "Inngest：用 step 把 serverless function 變成可恢復的工作流"
date: 2026-08-22
category: tech
type: deep-dive
tags: [inngest, durable-execution, workflow, serverless, background-jobs, ai-agent]
lang: zh-TW
tldr: "Inngest 讓一般 TypeScript、Python、Go function 以 step 為持久化邊界；失敗時函式從頭執行，但已完成 step 由紀錄回填，不再重做 side effect。"
description: "介紹 Inngest durable functions 的 step memoization、重試、等待、flow control、部署模型與 AI agent 適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 33
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-inngest-durable-functions-en)

[Inngest](https://www.inngest.com/docs/learn/how-functions-are-executed) 是事件驅動的 durable execution 平台。你仍然用 TypeScript、Python 或 Go 寫一般 function，把資料庫、API 與模型呼叫放進 `step.run()`；Inngest 在每個 step 後保存結果，處理重試、sleep、事件等待與 flow control。

它的吸引力不是「永不失敗」，而是把原本散落在 queue、cron、status table 與 retry loop 的控制面收進同一個 execution history。

## 復原會從函式開頭重跑

Inngest 執行一個 step 時，會向你的 function endpoint 發出獨立請求。step 完成後結果被 memoize；下一次執行函式時，已完成 step 直接回填結果並跳過 callback。

```ts
export const summarize = inngest.createFunction(
  { id: "summarize-document", retries: 4 },
  { event: "document/uploaded" },
  async ({ event, step }) => {
    const text = await step.run("extract", () => extract(event.data.uri));
    const summary = await step.run("summarize", () => callModel(text));
    await step.run("persist", () => saveSummary(event.data.id, summary));
  }
);
```

失敗後不是恢復原本的 JavaScript call stack，而是從 handler 頂端重新執行。`extract` 已完成就取得保存結果，`summarize` 失敗則依政策重試。這也代表 DB query、HTTP request、亂數與時間等非決定性操作不能偷偷放在 step 外；否則 replay 時仍會再次發生。

這種語意不是任意 side effect 的 exactly-once。外部 API 若在成功後、回報 step 結果前斷線，仍可能被再次呼叫。付款、寄信與高價模型請求仍應帶 idempotency key。

## Sleep 與等待不佔 worker

`step.sleep()` 與 `step.waitForEvent()` 會把等待交給平台。function 不必持續佔住 process、連線或 serverless invocation，幾小時後收到事件再接續。這很適合 approval、webhook callback、agent 等人工輸入和長退避。

平台也把 concurrency、throttling、rate limiting、debounce 與 priority 做成 declarative flow control。值得注意的是，concurrency 計算 active steps；sleep 或等待事件的 run 不占 active slot。這比自己拿 Redis counter 容易觀察，但仍要按 tenant 或外部 provider key 限流，避免某個客戶耗光共享額度。

## 控制面與運算面分離

Hosted Inngest 負責 event ingestion、queue、execution state 與排程，你的 function 可部署在 serverless、container 或一般 server。HTTP serve 模式由 Inngest 呼叫 endpoint；Connect 模式由長駐 worker 建立連線。程式與憑證仍留在你的執行環境，但事件資料、step input/output 與 execution metadata 是否能送進 hosted control plane，必須納入資料分類。

Inngest 也能 self-host。官方架構包含 Event API、event stream、Runner、Queue、Executor、state store、database 與 API/UI，不是「起一個 binary 就結束」。若主要目標是少維運，先用 managed service；若合規要求自架，要把升級、備份、HA 與 execution retention 算進總成本。

## AI agent 特別適合，也特別容易燒錢

Agent loop 天生包含模型呼叫、工具呼叫、等待與動態分支。把每次模型和工具結果做成 step，重啟後可重播相同決策路徑，不必重新付前面 token 成本；approval 也可以用 event 喚醒。

但 execution history 不是完整 agent state strategy。大型 prompt、文件與輸出應放 object storage，只在 step state 保存 URI、hash、model、prompt version、tenant 與 budget。每個高成本 step 都要設定 timeout、retry class 與 idempotency key；永久性 4xx 不該用同一政策一直重試。

## 什麼時候選 Inngest

事件驅動產品、serverless 團隊、TypeScript 為主，而且想快速取得 retry、wait、observability 與 flow control，Inngest 是很短的導入路徑。只有單一步驟背景工作時，queue 更簡單；需要嚴格服務狀態模型、keyed single-writer，可看 Restate；要同時經營 task queue、DAG 與 dynamic durable task，可比較 Hatchet；已有大型跨語言 workflow 平台需求，Temporal 的生態與治理模型更成熟。

真正的選擇不是 SDK 語法，而是你是否接受「函式重跑、step 結果回填」這份 execution contract，以及 hosted control plane 的資料邊界。

## 參考資料

- [Inngest: How functions are executed](https://www.inngest.com/docs/learn/how-functions-are-executed)
- [Inngest flow control](https://www.inngest.com/docs/guides/flow-control)
- [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- [Inngest deployment options](https://www.inngest.com/docs/platform/deployment)
- [Inngest self-hosting architecture](https://www.inngest.com/docs/self-hosting)
- [Inngest durable agents](https://www.inngest.com/docs/learn/durable-agents)
