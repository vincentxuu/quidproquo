---
title: "Cloudflare Queues：把 Workers request 拆成可重試、可批次的背景工作"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare-queues, cloudflare-workers, message-queue, serverless, background-jobs, edge-computing]
lang: zh-TW
tldr: "Cloudflare Queues 是 Workers 旁邊的 message queue：producer 把慢工作寫進 queue，consumer 用批次、ack/retry、delay 與 DLQ 處理失敗。它適合單步背景工作；流程需要記住多步驟狀態時，下一篇要看 Workflows。"
description: "從 producer/consumer binding、send/sendBatch、批次、ack/retry、delay、Dead Letter Queue 到 limits/pricing，拆解 Cloudflare Queues 適合放在 Workers app 哪一層。"
series:
  name: "AI 時代的技術選擇"
  order: 32
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 8
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-cloudflare-queues-en)

你把網站搬到 [Cloudflare Workers](https://developers.cloudflare.com/workers/) 後，最先撞到的通常已經不是 request 能不能回。真正麻煩的是 request 裡開始塞太多事：寫 log、寄信、產生縮圖、同步第三方 API、把事件寫進資料庫、替 AI app 存對話紀錄或產生 embedding。

這些工作放在 request path 裡，使用者要等，失敗也會直接變成 500。`ctx.waitUntil()` 可以讓 Worker 回應先出去，但它仍然跟同一次 invocation 綁在一起，適合短尾巴，不適合要重試、要批次、會塞車、會被下游限流的工作。

[Cloudflare Queues](https://developers.cloudflare.com/queues/) 解的是這一段：producer Worker 把工作描述寫進 queue，consumer Worker 從 queue 讀出來處理。它是一個放在 Workers 旁邊的 serverless message queue，目標是把慢工作、突發流量和下游不穩定從使用者 request 裡拆出去。

```txt
Client
  |
  v
Worker route
  |
  +-- fast response
  |
  +-- env.JOBS.send({ type, id, payload })
        |
        v
      Queue
        |
        v
   Consumer Worker
        |
        +-- D1 / R2 / external API / Workers AI
```

## Queue 解的是哪一層問題

Queues 最適合的工作有三個特徵。

第一，使用者不用馬上拿到結果。例如送出表單後寄通知信、把事件寫到 [R2](https://developers.cloudflare.com/r2/) 當 audit log、把 request log 批次送到外部分析服務。

第二，下游服務需要被保護。例如第三方 API 有 rate limit，或資料庫寫入想要批次化。Consumer 可以用 batch size、batch timeout 和 concurrency 控制速度，不讓前台流量直接壓到下游。

第三，失敗可以重試，而且你能寫出 idempotency。Cloudflare Queues 預設是 at-least-once delivery；訊息成功寫進 queue 後會至少投遞一次，少數情況可能投遞超過一次。所以 consumer 不能假設「只會跑一次」。實務上要在 message 裡放 job id、event id 或 idempotency key，寫入 [D1](https://developers.cloudflare.com/d1/) 時用 primary key 去重，呼叫付款或寄信 API 時用對方支援的 idempotency key。

不適合 Queues 的工作也很明確：如果你要保存一個多步驟流程的狀態、睡很久、跨多個步驟恢復，應該看 [Cloudflare Workflows](https://developers.cloudflare.com/workflows/)。如果你要同一個使用者、聊天室或文件的強一致狀態和 WebSocket 協調，應該看 [Durable Objects](https://developers.cloudflare.com/durable-objects/)。

## Producer 和 Consumer

Queue 的基本模型只有三個角色：queue、producer、consumer。

Producer 是寫入訊息的 Worker。你先建立 queue：

```bash
npx wrangler queues create app-jobs
```

再把 queue 綁進 producer Worker 的 `wrangler.jsonc`：

```jsonc
{
  "queues": {
    "producers": [
      {
        "queue": "app-jobs",
        "binding": "APP_JOBS"
      }
    ]
  }
}
```

程式裡就可以呼叫 `send()` 或 `sendBatch()`：

```ts
type JobMessage =
  | { type: "send-email"; id: string; userId: string }
  | { type: "write-audit-log"; id: string; objectKey: string };

interface Env {
  APP_JOBS: Queue<JobMessage>;
}

export default {
  async fetch(request, env) {
    const job: JobMessage = {
      type: "send-email",
      id: crypto.randomUUID(),
      userId: "user_123",
    };

    await env.APP_JOBS.send(job);

    return Response.json({ queued: true, jobId: job.id });
  },
} satisfies ExportedHandler<Env>;
```

Consumer 是處理訊息的 Worker。它用 `queue()` handler 接收批次：

```ts
type JobMessage =
  | { type: "send-email"; id: string; userId: string }
  | { type: "write-audit-log"; id: string; objectKey: string };

interface Env {
  DB: D1Database;
}

export default {
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      const job = message.body;

      await env.DB.prepare(
        "insert or ignore into processed_jobs (id, type) values (?, ?)",
      )
        .bind(job.id, job.type)
        .run();

      if (job.type === "send-email") {
        // Call your email provider here.
      }

      message.ack();
    }
  },
} satisfies ExportedHandler<Env, JobMessage>;
```

Consumer binding 也寫在 Wrangler 設定：

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "app-jobs",
        "max_batch_size": 10,
        "max_batch_timeout": 5
      }
    ]
  }
}
```

一個 queue 可以有多個 producer，但 push-based queue 只能有一個 active consumer。這個限制很重要：如果不同工作有不同重試策略、不同批次大小或不同下游瓶頸，不要全部塞同一條 queue，拆成 `email-jobs`、`audit-log-jobs`、`embedding-jobs` 會比較好調。

## 批次、重試、延遲

Queues 的設計重點不只在「背景執行」四個字，更在於你能控制背景工作怎麼被消化。

`max_batch_size` 預設 10、上限 100；`max_batch_timeout` 預設 5 秒、上限 60 秒。批次大一點，適合寫 R2 log、批次 insert 或外部 API bulk endpoint；批次小一點，適合單筆延遲敏感的工作。

失敗時要分清楚「整批失敗」和「單筆失敗」。如果 `queue()` handler 丟出 uncaught exception，整個 batch 會被重試。若只有某一筆失敗，可以對單筆呼叫 `message.retry()`，已完成的呼叫 `message.ack()`。這可以避免一筆壞資料拖著整批訊息重跑。

延遲訊息適合簡單的稍後再做：例如 10 分鐘後重新檢查第三方匯入狀態。

```ts
await env.APP_JOBS.send(
  { type: "write-audit-log", id: crypto.randomUUID(), objectKey: "logs/1.json" },
  { delaySeconds: 600 },
);
```

但延遲不是 workflow engine。你可以用 `delaySeconds` 做單次延後或 retry delay；如果流程要記得「第一步做完、等人工審核、第二天再打 API、失敗時從第三步恢復」，那是 Workflows 的題目。

## DLQ 是營運入口

[Dead Letter Queue](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/) 是 consumer 超過 retry limit 後的出口。沒有 DLQ 時，超過重試上限的訊息會被永久刪除；有 DLQ 時，訊息會被送到另一條 queue，讓你另外接 consumer、寫進 R2、通知工程師，或做人工修復。

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "app-jobs",
        "dead_letter_queue": "app-jobs-dlq"
      }
    ]
  }
}
```

DLQ 不是垃圾桶，它是你的營運入口。真正上 production 前，至少要決定三件事：

- 什麼錯誤可以 retry，什麼錯誤要直接 ack 並記錄。
- DLQ 裡的訊息要保存在哪裡，例如 R2 或 D1。
- 怎麼看 backlog、oldest message 和失敗率。

Cloudflare Queues 的 API 也提供 queue metrics，例如 backlog count、backlog bytes 和 oldest message timestamp。這些數字比單純看 log 有用，因為它們直接告訴你消化速度是否追得上產生速度。

## 成本和限制要先放進設計

Queues 以 operation 計價。官方文件把 operation 定義為每 64 KB 的 write、read 或 delete；一則小於 64 KB 的訊息正常被處理，大致會有 write、read、delete 三個 operation。retry 會再增加 read operation，寫進 DLQ 也會再算 write。

幾個限制會直接影響 schema 設計：

- message size 上限是 128 KB，超過這個大小就不要把 payload 整包塞進 queue。
- `sendBatch()` 最多 100 則訊息，整個 batch 也有大小限制。
- 單一 queue 有每秒訊息 throughput 上限；超過時 `send()` 或 `sendBatch()` 會丟出 Too Many Requests。
- Free plan 的 message retention 是 24 小時；Paid plan 預設 4 天，可設定到 14 天。
- push-based consumer 的 concurrent invocation 上限是 250，必要時也可以用 `max_concurrency` 壓低，保護下游。

我會把 message 當成「工作指標」而不是「工作資料本體」。大的 payload 放 R2，關聯狀態放 D1 或 Durable Objects，queue 裡只放 type、id、object key、必要參數和 idempotency key。這樣比較好重試，也比較不容易被 128 KB 限制卡住。

## AI app 裡 Queues 放哪裡

在 Cloudflare AI app 裡，Queues 常見的位置通常不在模型呼叫本身，而在模型呼叫旁邊的背景工作。

例如：

- 使用者上傳文件後，Worker 回傳「已收到」，Queue 觸發 consumer 做 chunking、embedding，再寫入 [Vectorize](https://developers.cloudflare.com/vectorize/)。
- Agent 對話結束後，把 trace、tool call、cost summary 丟進 Queue，consumer 批次寫到 D1 或 R2。
- 模型輸出需要後處理、寄信、通知 Slack 或同步 CRM，不讓使用者卡在 request 上等外部 API。
- Browser Run 產生截圖或 PDF 後，把 artifacts 寫進 R2，再用 Queue 觸發後續整理。

如果那個背景工作只是「收到一件事，處理完」，Queues 很合適。如果它會變成一條有狀態、有步驟、有等待時間的長流程，就該轉給 Workflows。這是 Edge Platform 系列下一篇的分界。

## 上線前檢查

我會用這份短清單檢查 Queues 是否設計對了：

- Message 有穩定 id，可以重試也不重複產生副作用。
- 大 payload 放在 R2 / D1 / Durable Objects，queue 裡只放 reference。
- 每種工作有自己的 queue，至少把不同重試策略的工作拆開。
- Consumer 用 `for...of` 搭配 `await` 或明確的 `Promise.all()`，不要在 async 處理裡用 `forEach()`。
- Consumer 有明確的 ack/retry 策略，壞資料不會拖垮整批訊息。
- DLQ 有 consumer 或保存策略。
- Backlog、oldest message、錯誤率有地方看。
- 需要流程狀態時，不硬用 Queue 拼 Workflows。

Queues 在 Cloudflare Edge Platform 裡的位置很清楚：它讓 Workers request 變短，讓慢工作被批次消化，也讓失敗有重試和 DLQ。它不是資料庫，也不是 workflow engine。把這條界線畫清楚，才不會一開始覺得很輕，三個月後變成一串很難追的背景 side effect。

## 更新紀錄

- 2026-08-30：依 Cloudflare Queues 2026 官方文件重寫 producer/consumer、batch、ack/retry、DLQ、limits/pricing 與 AI app 使用邊界，並納入 Cloudflare Edge Platform 系列。

## 參考資料

- [Cloudflare Queues docs](https://developers.cloudflare.com/queues/)
- [Cloudflare Queues: Get started](https://developers.cloudflare.com/queues/get-started/)
- [How Queues works](https://developers.cloudflare.com/queues/reference/how-queues-works/)
- [Queues JavaScript APIs](https://developers.cloudflare.com/queues/configuration/javascript-apis/)
- [Batching, retries and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- [Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)
- [Consumer concurrency](https://developers.cloudflare.com/queues/configuration/consumer-concurrency/)
- [Queues delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)
- [Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
- [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/)
