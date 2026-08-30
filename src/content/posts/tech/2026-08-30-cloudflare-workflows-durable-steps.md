---
title: "Cloudflare Workflows：把多步驟流程跑到完成"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-workflows, cloudflare-workers, durable-execution, workflow, serverless]
lang: zh-TW
tldr: "Cloudflare Workflows 把 Workers 上的多步驟流程拆成可持久化的 step：每個 step 可以 retry、sleep、waitForEvent、rollback，instance 可以查狀態、暫停、恢復或終止。Queues 適合單步背景工作；Workflows 適合要記住進度的長流程。"
description: "從 WorkflowEntrypoint、step.do、sleep、waitForEvent、retry、rollback、instance lifecycle 到 limits/pricing，拆解 Cloudflare Workflows 和 Queues 的邊界。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 9
---

> 🌏 [English version](/posts/tech/2026-08-30-cloudflare-workflows-durable-steps-en)

[Cloudflare Queues](/posts/tech/2026-08-22-cloudflare-queues) 把慢工作搬出 request path，但它處理的是「收到一件事，晚點處理」。當工作變成一串流程，問題就不一樣了：先讀 R2 檔案、產生 embedding、寫入 Vectorize、寄信、等人工審核、隔天再同步外部 API。你需要知道哪一步完成了、哪一步該重試、等人回來時要從哪裡繼續。

[Cloudflare Workflows](https://developers.cloudflare.com/workflows/) 就放在這裡。它讓你在 [Workers](https://developers.cloudflare.com/workers/) 平台上寫 serverless durable execution：把流程拆成 step，每個 step 的結果由平台保存；流程中途 sleep、等待 webhook、被 runtime 重啟，之後仍能接著已完成的 step 往下跑。

```txt
Worker / Queue / Cron / Durable Object
        |
        v
Workflow instance
        |
        +-- step.do("read input")
        +-- step.do("call model", retry policy)
        +-- step.waitForEvent("approval")
        +-- step.do("publish")
        +-- rollback handlers when needed
```

這篇要處理的核心分界很簡單：Queues 是工作緩衝，Workflows 是流程狀態。你可以從 Queue consumer 觸發 Workflow，但不要把 queue retry 疊成流程引擎。

## Step 是持久化單位

Workflows 的主體是一個繼承 `WorkflowEntrypoint` 的 class，實作 `run(event, step)`。`event` 是啟動 instance 時傳進來的參數；`step` 提供 `do`、`sleep`、`sleepUntil`、`waitForEvent` 等 API。

```ts
import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";

type Params = {
  uploadKey: string;
  userId: string;
};

export class DocumentWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    const document = await step.do("read document", async () => {
      const object = await this.env.BUCKET.get(event.payload.uploadKey);
      if (!object) throw new Error("document not found");
      return await object.text();
    });

    const chunks = await step.do("chunk document", async () => {
      return splitIntoChunks(document);
    });

    await step.do(
      "write embeddings",
      {
        retries: { limit: 5, delay: "10 seconds", backoff: "exponential" },
        timeout: "10 minutes",
      },
      async () => {
        await writeEmbeddings(this.env.VECTORIZE, chunks);
      },
    );

    return { chunks: chunks.length };
  }
}
```

`step.do()` 的重點是「完成後保存結果」。如果後面的 step 失敗，Workflow 不需要重新讀 R2 或重新切 chunk；它從最後成功保存的 step 往後繼續。這就是 Workflows 和單純 `async function` 最大的差別。

拆 step 時，我會問一句：如果下一段失敗，前一段要不要重跑？答案是否定的，就拆成不同 step。呼叫外部 API、寫資料庫、讀檔、產生 expensive model output，通常都值得變成獨立 step。

## State 只能信 step 回傳

Workflows 可能 hibernate。當 instance 進入 sleep、retry delay 或 waitForEvent，runtime 可以暫停，下一次醒來時不保證沿用同一個記憶體生命週期。

所以流程狀態不要塞在 step 外面的 mutable variable。像這樣的寫法很危險：

```ts
export class BadWorkflow extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    const done: string[] = [];

    await step.do("first", async () => {
      done.push("first");
    });

    await step.sleep("wait", "1 hour");

    await step.do("second", async () => {
      return done.length;
    });
  }
}
```

睡醒後 `done` 可能回到空陣列。比較穩的寫法是讓 state 來自 step 的 return：

```ts
export class GoodWorkflow extends WorkflowEntrypoint<Env> {
  async run(_event: WorkflowEvent<unknown>, step: WorkflowStep) {
    const first = await step.do("first", async () => {
      return { finished: true };
    });

    await step.sleep("wait", "1 hour");

    return await step.do("second", async () => {
      return { firstFinished: first.finished };
    });
  }
}
```

同樣道理，side effect 也應該放進 `step.do()`。放在 step 外面的 log、random、建立其他 Workflow instance、寫入外部系統，都可能因為 runtime restart 被重複執行。真的需要在 step 外建立的，通常是沒有 side effect 的 client 或 helper；像 Hyperdrive 連線這類資源，Cloudflare 文件建議在各自的 `step.do()` 裡建立並使用。

## Retry 要按步驟設計

每個 `step.do()` 都可以設定自己的 retry 和 timeout。沒有特別設定時，Workflows 有預設 retry policy；需要保護下游時，應該把 policy 寫清楚。

```ts
await step.do(
  "sync crm",
  {
    retries: {
      limit: 5,
      delay: ({ ctx, error }) => {
        if (error.message.includes("rate limit")) {
          return `${ctx.attempt * 30} seconds`;
        }
        return "10 seconds";
      },
      backoff: "linear",
    },
    timeout: "5 minutes",
  },
  async () => {
    await syncToCrm();
  },
);
```

有些錯誤不該 retry，例如 payload schema 錯、權限錯、付款被明確拒絕。這時可以在 step 裡丟 `NonRetryableError`，讓 Workflow 直接進入失敗路徑。

```ts
import { NonRetryableError } from "cloudflare:workflows";

await step.do("validate input", async () => {
  if (!event.payload.userId) {
    throw new NonRetryableError("missing userId");
  }
});
```

這裡仍然要做 idempotency。Workflows 會保存成功 step 的 output，也會重試失敗 step，但它不會讓外部 payment API、email provider 或 CRM 自動變成 transaction。會產生外部副作用的 step，要先查是否已經完成，或使用外部系統支援的 idempotency key。

## Sleep 和事件等待

Workflows 最不像 Queue 的地方，是它可以把等待寫成流程本身。

```ts
await step.sleep("wait before retrying import", "1 hour");
await step.sleepUntil("publish next week", Date.parse("2026-09-06T01:00:00Z"));
```

`step.sleep()` 用相對時間，`step.sleepUntil()` 用固定時間。官方 limits 把 sleep 上限列到 365 天。instance 在 waiting 狀態時不吃 active concurrency，也不會因為單純等待 API 或 sleep 就消耗 CPU time。

人工審核、webhook callback、外部系統通知，則用 `step.waitForEvent()`。

```ts
const approval = await step.waitForEvent<{ approved: boolean }>(
  "wait for editor approval",
  { type: "approval", timeout: "24 hours" },
);

if (!approval.payload.approved) {
  return { published: false };
}
```

另一個 Worker、webhook route 或 REST API 可以對同一個 instance `sendEvent()`。事件的 `type` 要和 `waitForEvent()` 對上；官方文件也提醒 type 目前只支援英文字母、數字、底線和 dash，不支援 `.`。

## Trigger 和 lifecycle

Workflows 可以從多個入口啟動：HTTP Worker、Queue consumer、scheduled handler、Durable Object、Wrangler CLI、REST API，或直接在 `wrangler.jsonc` 的 workflow binding 上設定 `schedules`。

```jsonc
{
  "workflows": [
    {
      "name": "document-workflow",
      "binding": "DOCUMENT_WORKFLOW",
      "class_name": "DocumentWorkflow",
      "schedules": ["0 * * * *"]
    }
  ]
}
```

從 Worker 啟動時，使用 binding 的 `create()`：

```ts
const instance = await env.DOCUMENT_WORKFLOW.create({
  id: `document-${uploadId}`,
  params: { uploadKey, userId },
});

return Response.json({ instanceId: instance.id });
```

同一個 instance 之後可以 `get(id)` 查狀態。status 會告訴你它是 queued、running、waiting、paused、errored、terminated 或 complete。需要營運操作時，也可以 pause、resume、terminate；terminate 若帶 rollback option，會先跑已註冊的 rollback handlers。restart 則會清掉中間狀態，從頭跑。

這些 lifecycle API 讓 Workflows 比「背景 job」更像一個產品功能：使用者可以看到匯入進度，客服可以終止卡住的流程，工程師可以查哪個 step 失敗。

## Rollback 是補償，不是交易

Workflows 支援在 `step.do()` 上註冊 rollback handler。當後面 step 失敗時，已註冊的 rollback 會用反向 step-start 順序執行。

```ts
await step.do(
  "reserve inventory",
  async () => {
    const reservation = await reserveInventory();
    return { reservationId: reservation.id };
  },
  {
    rollback: async ({ output }) => {
      if (output) {
        await releaseInventory(output.reservationId);
      }
    },
    rollbackConfig: {
      retries: { limit: 3, delay: "10 seconds", backoff: "linear" },
      timeout: "2 minutes",
    },
  },
);
```

這是 saga-style compensation，不是資料庫 transaction。它適合訂單保留庫存、產生暫存檔、建立外部資源後要刪掉；它不適合拿來假裝跨 D1、R2、第三方 API 都能原子提交。每個 rollback handler 也要能重試，並且自己具備 idempotency。

## 成本和限制

Workflows 可用在 Workers Free 和 Paid plan，但 2026-08-10 起，官方文件列出 step 和 storage usage 會開始計費。它沿用 Workers Standard 的 request 和 CPU time 計價，另外還看 storage 與 steps。

幾個設計上要先知道的限制：

- event payload 上限是 1 MiB。
- 非 stream 的單一 step result 上限是 1 MiB。
- 每個 instance 可保存的總 state，Free 和 Paid 上限不同。
- Free plan 每個 Workflow 最多 1,024 steps；Paid 預設 10,000 steps，可設定到 25,000。
- `step.sleep()` 最長 365 天。
- completed instance state 會保留一段時間；Free 和 Paid 保留期不同，也可以在 create instance 時縮短。
- Workflows 目前不能部署到 Workers for Platforms namespaces。

我的設計習慣是：payload 放 immutable pointer，結果放 R2/D1/Vectorize，Workflow state 放「足夠恢復流程」的摘要。不要把大型文件、模型完整輸出或長期審計資料塞成 step output；那會把 Workflows storage 當成資料湖用。

## 什麼時候選 Workflows

我會在這幾種情況選 Workflows：

- 文件匯入：上傳、解析、切 chunk、embedding、索引、通知。
- 訂單或帳務：保留資源、收款、寄信、失敗補償。
- 使用者 lifecycle：試用期、到期提醒、降級、刪除資料。
- 人工審核：AI 產生草稿，等人 approve 後發布。
- 跨系統同步：第三方 API 不穩，需要分步 retry 和查狀態。

我不會用它取代所有 background-jobs。單步寄信、寫 log、批次 flush、短任務 fan-out，用 Queues 比較輕。需要同一個 user/session/entity 的同步鎖、WebSocket、即時狀態，Durable Objects 比較直接。需要既有 Postgres/MySQL 連線，Hyperdrive 是資料庫連線層，Workflows 只管流程。

Cloudflare Workflows 的定位因此很實用：它不是另一個 queue，也不是把所有 business logic 變成 YAML。它讓你用 TypeScript 寫流程，同時把完成的 step、等待、retry、rollback 和 instance lifecycle 交給平台保管。

## 參考資料

- [Cloudflare Workflows docs](https://developers.cloudflare.com/workflows/)
- [Build your first Workflow](https://developers.cloudflare.com/workflows/get-started/guide/)
- [Rules of Workflows](https://developers.cloudflare.com/workflows/build/rules-of-workflows/)
- [Workflows Workers API](https://developers.cloudflare.com/workflows/build/workers-api/)
- [Sleeping and retrying](https://developers.cloudflare.com/workflows/build/sleeping-and-retrying/)
- [Events and parameters](https://developers.cloudflare.com/workflows/build/events-and-parameters/)
- [Trigger Workflows](https://developers.cloudflare.com/workflows/build/trigger-workflows/)
- [Workflows limits](https://developers.cloudflare.com/workflows/reference/limits/)
- [Workflows pricing](https://developers.cloudflare.com/workflows/reference/pricing/)
