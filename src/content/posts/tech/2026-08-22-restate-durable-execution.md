---
title: "Restate：把 journal、durable state 與服務呼叫放進同一個執行模型"
date: 2026-08-22
category: tech
type: deep-dive
tags: [restate, durable-execution, workflow, distributed-systems, backend, ai-agent]
lang: zh-TW
tldr: "Restate 以 journal 記錄操作與結果，失敗後重跑 handler 並跳過已完成操作；Virtual Object 與 Workflow 再提供 keyed state、single-writer 與長期協調。"
description: "介紹 Restate journal replay、durable steps、Services、Virtual Objects、Workflows、部署方式與 AI agent 適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 34
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-restate-durable-execution-en)

[Restate](https://docs.restate.dev/foundations/key-concepts) 把 durable execution 做成服務層：application handler 照常部署在 Node.js、Bun、Deno、Cloudflare Workers、Lambda 或其他環境，Restate Server 位在前方，接收 invocation、保存 journal、安排 retry，並提供 durable state、message 與 service call。

它不是把 process memory snapshot 下來。失敗後 handler 仍會重跑，只是先前操作的結果由 journal 重播。

## `ctx.run` 是 side effect 邊界

資料庫、HTTP API、檔案 I/O 與非決定性 computation 應包在 `ctx.run`。操作完成後結果寫入 journal；重試時 Restate 回傳紀錄結果，不再執行 callback。

```ts
const agent = restate.service({
  name: "Agent",
  handlers: {
    answer: async (ctx, req: Request) => {
      const source = await ctx.run("load-source", () => load(req.uri));
      const answer = await ctx.run("call-model", () => ask(source));
      await ctx.run("save-answer", () => save(req.id, answer));
      return answer;
    },
  },
});
```

handler 在 crash 後從頂端執行，依 journal 跳過 `load-source` 等已完成操作。`Math.random()`、`Date.now()` 或普通 fetch 若直接影響 control flow，replay 可能走不同分支；應使用 `ctx.rand`、`ctx.date` 等 deterministic helper，或放進 `ctx.run`。

和所有跨系統 orchestration 一樣，journal 無法與任意外部 side effect 共用一筆 transaction。外部服務成功但 journal 尚未提交時仍可能重試，因此 payment、email、LLM request 仍需 idempotency key。

## 三種 service primitive 不只換名字

Basic Service 適合 stateless handler。Virtual Object 由 key 定址，為每個 key 提供 durable state，且同一 key 的 exclusive handler 具 single-writer 語意；購物車、device、tenant budget 與 agent session 因而不必自行用 distributed lock 串行化。

Workflow 則由 workflow ID 定址，主 run handler 每個 ID 只執行一次，並可搭配 signal 與 query 管理長流程。它適合 onboarding、訂單 saga、人工審核與 agent run。外部 callback 可透過 awakeable 或 durable promise 喚醒，不必輪詢一張 status table。

「只執行一次」指 Restate 對 workflow invocation 的協調語意，不代表所有外部 API 天生 exactly-once。這個區分應寫進設計文件與 incident runbook。

## 一個 server，應用可放很多地方

Restate Server 是 Rust 寫成的獨立 runtime，位在 client 和 service deployment 中間。開發或單節點部署可用 single binary；正式高可用需要規劃 cluster、持久儲存、備份、journal retention 與版本相容。service code 不必和 server 同機，也不必採同一種 compute 平台。

這個分離讓 Cloudflare Workers、Lambda 與 container 可以共享 execution model，但也引入額外 network hop 和 control plane。敏感 input/output 是否進 journal、保存多久、能否刪除，以及 upgrade 時舊 execution 如何相容，都是上線前問題。

## Agent 的狀態應該分層

Virtual Object 很適合用 agent ID 或 conversation ID 當 key，串行修改短小的控制狀態；Workflow 適合一次長期 run；`ctx.run` 包模型與工具 side effect。大型 transcript、文件和 embedding 不應全塞進 journal state，應存 object store 或資料庫並以 hash／URI 引用。

另外要把 token budget、tool permission、model version 與 prompt version 固定在 invocation state。durability 能保證流程恢復，不能阻止 agent 在重試後拿到更高權限，也不會替你判斷舊 prompt 配新程式是否仍安全。

## 什麼時候選 Restate

若問題同時包含可靠呼叫、keyed state、每 key 串行化與長期 workflow，Restate 的 primitives 很有辨識度。單純把 webhook 丟到背景，一個 queue 較小；偏事件驅動 serverless DX 與大量 flow-control policy，可看 Inngest；需要通用 task queue、DAG 與動態 child task，可看 Hatchet。

選用前先做 crash test：在外部 side effect 完成後刻意 kill worker，確認 idempotency、journal replay、版本升級與人工 repair 流程。durable execution 的價值，最終是在最難看的失敗點仍能解釋發生了什麼。

## 參考資料

- [Restate key concepts](https://docs.restate.dev/foundations/key-concepts)
- [Restate durable steps for TypeScript](https://docs.restate.dev/develop/ts/durable-steps)
- [Restate services, virtual objects, and workflows](https://docs.restate.dev/develop/ts/services)
- [Restate service communication model](https://docs.restate.dev/foundations/services)
- [Restate external events](https://docs.restate.dev/develop/ts/external-events)
- [Serving Restate TypeScript services](https://docs.restate.dev/develop/ts/serving)
