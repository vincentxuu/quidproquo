---
title: "Trigger.dev：用行程快照做持久任務，不要求你的程式碼有決定性"
date: 2026-08-21
category: tech
type: deep-dive
tags: [trigger-dev, durable-execution, criu, ai-agent, background-jobs, typescript]
lang: zh-TW
tldr: "Trigger.dev 是 Apache 2.0 的持久任務平台（v4.5.12，2026-08 實查），用 CRIU 對整個 Node.js 行程做記憶體快照來暫停與復原。跟 Temporal 的 replay 模型不同，它不重跑你的編排碼、不要求決定性——LLM 呼叫直接寫在 task 裡就行。代價是快照無法保留 TCP 連線，還原後要自己重建；而且快照是 cloud-only，自架拿不到。"
description: "介紹 Trigger.dev 的 CRIU checkpoint-resume 模型：它跟 Temporal replay 的差異、CRIU 能存什麼不能存什麼、快照對版本部署的影響、AI agent 工作負載為什麼適合這個模型，以及免費版與 Pro 的成本結構（2026-08 實查價格）。"
series:
  name: "AI 時代的技術選擇"
  order: 18
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-21-trigger-dev-durable-tasks-en)

站上已經有 [Temporal](/posts/tech/2026-08-21-temporal-durable-execution) 的專文，講的是 replay 模型的 durable execution——崩了從頭重跑 workflow 碼，用事件歷史跳過已完成的步驟。那篇最後留了一條軸線：**復原時要不要重跑你的編排碼？** [Trigger.dev](https://trigger.dev/docs/introduction) 站在另一邊。它用 [CRIU](https://criu.org/Main_Page)（Checkpoint/Restore In Userspace）對整個 Node.js 行程做記憶體快照，還原時從中斷處直接續跑，一行你的程式碼都不重跑。

以下版本皆 2026-08 實查：[`@trigger.dev/sdk` 4.5.12](https://www.npmjs.com/package/@trigger.dev/sdk)（發佈日期 2026-08-20）、[GitHub repo](https://github.com/triggerdotdev/trigger.dev) Apache 2.0 授權、16,000+ stars。語言支援以 TypeScript / Node.js 為主，Python 透過 `pythonExtension` 可用。

## 先回顧：replay 模型為什麼對 LLM 工作負載有摩擦

[Temporal 那篇](/posts/tech/2026-08-21-temporal-durable-execution)的核心約束是：workflow 碼必須有決定性，因為 worker 崩掉後要從第一行重跑，靠事件歷史把每個 activity 的結果塞回來。任何在重跑時可能給出不同答案的東西——`datetime.now()`、`random()`、HTTP 請求、LLM 呼叫——都不能直接寫在 workflow 裡，必須包成 activity。

對 AI agent 來說，這意味著每次打模型都要拆成一個 activity，編排迴圈本身必須可重放。如果 agent 的邏輯是「每輪由模型決定下一步」，連步驟數量都不固定，把控制流硬塞進決定性 workflow 會變成一場跟 sandbox 的拉鋸。

Trigger.dev 的回答是：不重跑，直接還原記憶體。

## CRIU 做了什麼

[CRIU](https://criu.org/Main_Page)（發音 kree-oo）是 Linux 的使用者空間工具。它可以把一個正在跑的行程凍結，把完整狀態寫到磁碟，之後在同一台或另一台機器上還原。「完整狀態」包括：

- 記憶體頁面（堆、堆疊、mmap 區域）
- CPU 暫存器
- 開啟的檔案描述子
- 管線（pipe）
- 訊號處理器
- 行程樹結構

CRIU 在 Linux 核心層面運作，透過 `ptrace` 凍結行程、從 `/proc` 讀取狀態、用 `parasite code` 注入來擷取行程內部資訊。它是 Docker checkpoint / Kubernetes CRIU 整合的底層機制。

### CRIU 不能存什麼

這是最關鍵的部分。依 [CRIU 的文件](https://criu.org/What_cannot_be_checkpointed)，以下東西無法 checkpoint：

| 不能存的 | 原因 |
|---|---|
| TCP / UDP / UNIX 以外的 socket 類型 | 只支援 TCP、UDP、UNIX domain、packet、netlink 五種 |
| 已建立的 TCP 連線（需特殊處理） | 還原時對端不知道你斷過，連線狀態不一致 |
| 字元裝置與區塊裝置 | 指向硬體，虛擬裝置（`/dev/null`、`/dev/zero`、TUN）除外 |
| 來自已卸載檔案系統的開啟檔案 | 檔案系統路徑不存在，無法重建 |
| 被 debugger attach 的行程 | CRIU 自己用 `ptrace`，同一個 API 不允許多個 debugger |
| 用 `O_DIRECT` 開的 pipe | packetized pipe 的狀態無法擷取 |
| 透過 UNIX socket 傳遞中的檔案描述子 | 無法追蹤跨行程傳遞的 fd |
| 有 cork 選項的 UDP socket | 應用層緩衝區狀態無法還原 |

對 Trigger.dev 的使用者來說，最重要的一條是 **TCP 連線**。資料庫連線、HTTP keep-alive、WebSocket——這些在快照時全部斷掉。還原後，你的程式碼以為連線還活著，但對端早就關了。

### Trigger.dev 怎麼處理這件事

Trigger.dev 提供 `onWait` 和 `onResume` 兩個[生命週期 hook](https://trigger.dev/docs/tasks/overview)。快照前跑 `onWait`，你在這裡斷開連線；還原後跑 `onResume`，你在這裡重建連線。官方文件給的範例就是 Prisma 的資料庫連線：在 `onWait` 呼叫 `$disconnect()`，在 `onResume` 重新初始化 client。

這不是自動的。**你必須自己管理每一條會跨越 checkpoint 的連線。** 漏掉一條，還原後就是一個看似正常但實際寫不進去的死連線。

## 什麼時候觸發快照

不是每一行程式碼都會觸發 checkpoint。Trigger.dev 在以下時機做快照：

1. **`triggerAndWait()`**：呼叫子任務並等待結果。父任務被快照、資源釋放；子任務完成後父任務還原。
2. **`wait.for()` / `wait.until()`**：暫停指定時間或等到指定時刻。**等待時間超過 60 秒才會真正做快照**；60 秒以內的等待，行程留在記憶體裡不快照，也不釋放 concurrency slot。
3. **`wait.forToken()`**：等待外部事件（人類審批、webhook 回呼）。token 完成前，行程被快照。

快照後，[Trigger.dev 文件](https://trigger.dev/docs/how-it-works)說明：checkpoint 被「高效壓縮並存到磁碟」，行程的運算資源被釋放。等到條件滿足（子任務完成、時間到、token 完成），checkpoint 被還原到一個新的執行環境，從中斷處續跑。

在 Trigger.dev Cloud 上，**等待期間不計費**。你只為 CPU 實際在跑的時間付錢。

## 版本部署：快照鎖在哪個版本

Trigger.dev 用[原子版本號](https://trigger.dev/docs/versioning)，格式是 `YYYYMMDD.N`（例如 `20260821.1`）。一個 run 啟動時，它被鎖定到當下最新的版本。即使你在它等待期間部署了新版本，**還原後跑的還是舊版的程式碼**。

這跟 Temporal 面對的版本問題不同。Temporal 的 replay 是重跑程式碼，所以改了已在執行中的 workflow 碼會產生 non-determinism error。Trigger.dev 的快照裡包含程式碼本身（整個行程映像），所以版本衝突不會發生——但你也拿不到新版的 bug fix，除非用 replay 功能重跑。

子任務的版本鎖定規則：

| 觸發方式 | 子任務用哪個版本 |
|---|---|
| `trigger()` / `batchTrigger()` | 最新版本（不鎖定） |
| `triggerAndWait()` / `batchTriggerAndWait()` | 繼承父任務的版本（鎖定） |

失敗重試用原版本；replay（重放）用最新版本加原始 input。注意這裡的「replay」跟 Temporal 的「replay」意思相反。Temporal 的 replay 是重建狀態的內部機制。Trigger.dev 的 replay 是「拿同樣的 input、跑最新版的程式碼再來一次」，用途是驗證 bug fix。

## 對 AI agent 工作負載的意義

回到開頭的問題。如果你的 agent 流程長這樣：

```
呼叫 LLM → 根據回應決定下一步 → 可能再呼叫 LLM → 等人類審批 → 打第三方 API → 寫回資料庫
```

在 Temporal 裡，每個 LLM 呼叫要包成 activity，編排迴圈本身要可重放。在 Trigger.dev 裡，你就寫一般的 async 函式：

```typescript
export const agentTask = task({
  id: "agent-loop",
  run: async (payload) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: payload.messages,
    });

    if (response.choices[0].message.content.includes("need_approval")) {
      const approval = await wait.forToken<{ approved: boolean }>({
        id: "human-review",
        timeout: "7d",
      });
      if (!approval.ok || !approval.output.approved) return;
    }

    // 繼續處理...
  },
});
```

`wait.forToken()` 觸發快照。等待期間不佔運算資源、不計費。人類批准後，行程還原、從 `wait.forToken()` 那一行繼續跑。不需要把 LLM 呼叫拆出去，不需要保證控制流可重放。

**這是 checkpoint 模型對 AI 工作負載最直接的好處：LLM 呼叫天生非決定性，但你不需要在意這件事。**

代價在兩個地方。第一，你**沒有** Temporal 那種完整的事件歷史。Temporal 的 Event History 記錄了每個 activity 的輸入、輸出、重試次數、執行時間——你可以拿正式環境的歷史在本機重放來除錯。Trigger.dev 有 run 的 log 和 dashboard，但沒有逐步可重放的歷史。

第二，快照包含的是行程在那一刻的記憶體狀態。如果你的 task 在記憶體裡累積了大量中間資料（例如一個不斷成長的對話記錄陣列），快照就會變大。Trigger.dev 的機器規格從 0.25 GB（micro）到 16 GB（large-2x）不等——快照大小受限於可用記憶體，雖然文件沒給出明確的上限數字。

## 自架 vs Cloud：快照是 cloud-only

這一點必須講清楚。依 Trigger.dev 的[自架文件](https://trigger.dev/docs/open-source-self-hosting)，自架版本**沒有 checkpoint 功能**。自架也沒有 warm start 和 auto-scaling。

也就是說，自架 Trigger.dev 拿到的是一個有 queue、retry、排程、dashboard 的背景任務平台。跟 BullMQ 或 Celery 同一個層級，只是加了 TypeScript 原生支援和比較好的 UI。真正讓 Trigger.dev 跟佇列類工具拉開差距的 checkpoint-resume，只有 Cloud 版有。

自架的架構是兩個容器：Webapp（dashboard + Redis + Postgres）和 Worker（supervisor + runner）。v4.5.0 是最後一個支援 v3 任務的版本；4.5.1 以後只跑 v4 任務。

## 成本結構

[Trigger.dev 的定價](https://trigger.dev/pricing)（2026-08 實查）分四層：

| 方案 | 月費 | 含 credit | 並行上限 | 排程數 | log 保留 |
|---|---|---|---|---|---|
| Free | $0 | $5 | 20 | 10 | 1 天 |
| Hobby | $10 | $10 | 50 | 100 | 7 天 |
| Pro | $50 | $50 | 200+ | 1,000+ | 30 天 |
| Enterprise | 洽談 | 洽談 | 洽談 | 洽談 | 洽談 |

運算按秒計費，最小規格 micro（0.25 vCPU / 0.25 GB）每秒 $0.0000169，最大規格 large-2x（8 vCPU / 16 GB）每秒 $0.0006800。每次 run 啟動另外收 $0.000025（每萬次 $0.25）。

跟 Temporal Cloud 比較：Temporal 從 $100/月起（Essentials），計費單位是 Action（activity 啟動、timer、signal 等伺服器端操作），replay 不算錢。Trigger.dev 從 $0 起，計費單位是 CPU 秒數，等待期間不算錢。兩者都在「你的程式碼沒在跑的時候不收錢」這件事上做文章，只是切的位置不同。

一個重要的成本差異：Temporal 的 replay 不計費，是因為 replay 只在 worker 端重建狀態，不產生伺服器端操作。Trigger.dev 的等待不計費，是因為行程被快照後 CPU 已經釋放。但 Trigger.dev 的快照與還原本身需要 I/O（壓縮、存儲、傳輸、解壓），這部分的成本包含在運算時間裡。

## 什麼時候選 Trigger.dev、什麼時候選 Temporal

| 考量 | 選 Trigger.dev | 選 Temporal |
|---|---|---|
| 流程裡有大量 LLM 呼叫 | 不需要拆 activity，直接寫 | 每個呼叫要包成 activity |
| 需要逐步可重放的事件歷史 | 沒有（有 run log，但不可重放） | 有完整 Event History |
| 團隊語言 | TypeScript 為主（Python 透過 extension） | .NET / Go / Java / PHP / Python / Ruby / TypeScript 七種 SDK |
| 自架需求 | 自架沒有 checkpoint——變成一般佇列 | 自架有完整功能（MIT，一個 binary 就能跑） |
| 流程需要跨月等待 | 快照存在磁碟，等多久都不佔 CPU | Event History 有 51,200 event 上限，長流程要 Continue-As-New |
| 需要稽核每一步的輸入輸出 | dashboard 有 log，但不是逐 step 的結構化歷史 | Event History 是完整稽核軌跡 |
| 預算 | Free 方案就能用 checkpoint | Cloud 從 $100/月起 |

最後一個判斷：**你的程式碼是否本質上非決定性？** agent 迴圈每輪由模型決定下一步、步驟數量不固定——這種情境選 Trigger.dev。固定步驟、需要嚴格可追蹤性的流程，Temporal 的事件歷史是 Trigger.dev 給不了的。

跟 [BullMQ](/posts/tech/2026-03-27-bullmq-job-queue-nodejs) 和 [Celery](/posts/tech/2026-03-27-celery-python-task-queue) 的分界線更簡單：如果流程只有一步（收到訊息 → 做事 → 寫回），佇列就夠了。開始有「第三步失敗但第二步已經送出」的問題時，才需要 durable execution。

## 參考資料

- [Trigger.dev 文件首頁](https://trigger.dev/docs/introduction)
- [Trigger.dev How it works（CRIU checkpoint-resume 機制）](https://trigger.dev/docs/how-it-works)
- [Trigger.dev Task Overview（生命週期 hook：onWait / onResume）](https://trigger.dev/docs/tasks/overview)
- [Trigger.dev Wait functions](https://trigger.dev/docs/wait)
- [Trigger.dev Waitpoint Tokens（人類審批與外部事件等待）](https://trigger.dev/docs/wait-for-token)
- [Trigger.dev Versioning（原子版本號與版本鎖定）](https://trigger.dev/docs/versioning)
- [Trigger.dev Replaying（用最新版重跑）](https://trigger.dev/docs/replaying)
- [Trigger.dev Machine Configuration](https://trigger.dev/docs/machines)
- [Trigger.dev Error Handling & Retrying](https://trigger.dev/docs/errors-retrying)
- [Trigger.dev Self-hosting](https://trigger.dev/docs/open-source-self-hosting)
- [Trigger.dev Pricing（2026-08 實查）](https://trigger.dev/pricing)
- [Trigger.dev Config File](https://trigger.dev/docs/config/config-file)
- [Trigger.dev AI Agent Patterns](https://trigger.dev/docs/guides/ai-agents)
- [`@trigger.dev/sdk` NPM（v4.5.12）](https://www.npmjs.com/package/@trigger.dev/sdk)
- [Trigger.dev GitHub repo（Apache 2.0）](https://github.com/triggerdotdev/trigger.dev)
- [CRIU 官方網站](https://criu.org/Main_Page)
- [CRIU: What cannot be checkpointed](https://criu.org/What_cannot_be_checkpointed)
- 站內相關：[Temporal：把流程寫成程式碼，崩了也能接著走完](/posts/tech/2026-08-21-temporal-durable-execution)
- 站內相關：[BullMQ：Node.js 最成熟的 Redis-backed 任務佇列](/posts/tech/2026-03-27-bullmq-job-queue-nodejs)
- 站內相關：[Celery：Python 生態裡分散式任務佇列的標準解法](/posts/tech/2026-03-27-celery-python-task-queue)
