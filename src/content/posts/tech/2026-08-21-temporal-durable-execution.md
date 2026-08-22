---
title: "Temporal：把流程寫成程式碼，崩了也能接著走完"
date: 2026-08-21
category: tech
type: deep-dive
tags: [temporal, durable-execution, ai-agent, task-queue, python]
lang: zh-TW
tldr: "Temporal 是 durable execution 平台（Server 1.31.2、Python SDK temporalio 1.31.0，MIT，2026-08 實查）。它跟 BullMQ / Celery 那種任務佇列的差別不是規模，是保證的東西不同：佇列保證訊息被消費，Temporal 保證一段橫跨多次外部呼叫的流程走完。代價是工作流程碼必須決定性——而 LLM 呼叫天生非決定性，這篇講這個張力怎麼解、什麼時候不划算。"
description: "介紹 Temporal 的 durable execution 模型：Workflow / Activity / Event History / Worker 四個零件、它靠重放事件歷史而非還原記憶體快照復原、決定性約束具體有哪些寫法會壞、LLM 與 agent 工作負載該怎麼放進來，以及自架與 Temporal Cloud 的成本結構（2026-08 實查價格）。"
series:
  name: "AI 時代的技術選擇"
  order: 16
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-temporal-durable-execution-en)

站上已經有 [BullMQ](/posts/tech/2026-03-27-bullmq-job-queue-nodejs) 和 [Celery](/posts/tech/2026-03-27-celery-python-task-queue) 兩篇任務佇列專文，但中間漏了一整層。設想一段流程：呼叫 LLM、等人類批准三天、打第三方 API、寫回資料庫。把它塞進佇列，worker 在第三步崩掉時你不知道前兩步做過沒有。重試就是從頭再跑一次，那通 LLM 的錢和那封已經寄出的信都要再來一遍。

[Temporal](https://docs.temporal.io/) 解的就是這件事，它是 MIT 授權的 durable execution 平台。以下版本皆 2026-08 實查：Server 最新穩定版 1.31.2（[Docker Hub `temporalio/server`](https://hub.docker.com/r/temporalio/server/tags) 標記日期 2026-07-08）、Python SDK [`temporalio` 1.31.0](https://pypi.org/project/temporalio/)、TypeScript [`@temporalio/worker` 1.22.0](https://www.npmjs.com/package/@temporalio/worker)。

## 先分清楚：佇列、串流、durable execution

這三者常被當成同義詞，但保證的東西不同。

| 類別 | 代表 | 保證什麼 |
|---|---|---|
| 任務佇列 | [BullMQ](https://docs.bullmq.io/)、[Celery](https://docs.celeryq.dev/) | 一則訊息會被某個 worker 消費（可重試、可延遲、可排優先級） |
| 事件串流 | [Kafka](https://kafka.apache.org/documentation/)、[NATS](https://docs.nats.io/) | 事件有序、可保留、可被多個消費者重播 |
| durable execution | Temporal、[Restate](https://docs.restate.dev/)、[DBOS](https://docs.dbos.dev/) | 一段橫跨多次外部呼叫的**流程**，中途崩了也會接著走完 |

差別在單位。佇列的單位是一則訊息，串流的單位是一筆事件，durable execution 的單位是**整段流程的執行狀態**。[Hatchet 的文件](https://docs.hatchet.run/home/durable-execution)把這件事講得直白：durable execution 給你的是「一般任務佇列給不了的保證」。它的價值集中在那些「不可能做成冪等所以無法重播」的流程上。

用佇列硬做流程當然可以，代價是你要自己維護一張狀態表、自己寫每一步的冪等鍵、自己處理「第三步失敗但第二步已經送出」的補償。Temporal 的賣點就是把這些搬進平台。

## Temporal 的四個零件

**Workflow** 是你的流程碼，用一般程式語言寫（.NET / Go / Java / PHP / Python / Ruby / TypeScript 七種 SDK）。**Activity** 是流程裡每一個跟外界打交道的動作——寄信、打 API、查資料庫、呼叫 LLM——失敗會依你設定的 Retry Policy 自動重試。**Temporal Service** 是那個記帳的服務，把每個步驟寫進 **Event History**。**Worker** 是你自己啟動的行程，實際跑你的程式碼。

最後這點常被誤解。Temporal 文件自己強調：「A common misconception is that the Temporal Service runs your code.」實際跑你的程式碼、直接碰你的資料的是 Worker。流程碼跑在你的基礎設施裡，Service 只負責排程與記錄。

## 它靠 replay 復原，不是靠快照

這是理解 Temporal 一切約束的關鍵，而 Temporal 文件講得比任何轉述都清楚：

> When it's time to continue the Workflow, Temporal doesn't restore memory from a snapshot. It starts the Workflow code from the beginning, replays the Event History step by step, and uses that history to guide the code back to the exact state as before.
>
> —— [Temporal Workflow 文件](https://docs.temporal.io/workflows)

也就是說，worker 崩掉重啟時，你的 workflow 函式是**從第一行重新跑一次**的。跑到「呼叫 activity X」時，平台不會真的再打一次 API，而是從 Event History 把上次記錄的結果塞回來。跑到歷史用完的那一點，才是真正繼續往下的地方。

這帶來兩個實際好處：完整的稽核軌跡（每個步驟、每次重試、誰觸發的都在歷史裡），以及可以拿正式環境的歷史在本機重放來除錯。代價寫在下一節。

歷史不是無限的。[Event History 文件](https://docs.temporal.io/workflow-execution/event)給了硬上限：超過 10,240 個 event 會開始警告，**超過 51,200 個 event、2,000 次 Update 或 10,000 次 Signal 會直接終止該次執行**。長流程要定期用 Continue-As-New 把歷史截斷、開一個新的執行接下去。

## 決定性約束具體是什麼

「工作流程碼要有決定性」這句話太抽象，實際要記的是：**任何在重跑時可能給出不同答案的東西，都不能直接寫在 workflow 裡。**

會壞的寫法與正確做法：

| 不要在 workflow 裡寫 | 改成 |
|---|---|
| `datetime.now()` / `Date.now()` | `workflow.now()`（時間從 workflow context 讀，重放時得到同一個值） |
| `random.random()` / `uuid.uuid4()` | `workflow.random().random()` / `workflow.uuid4()`（PRNG 種子記在歷史裡） |
| `requests.get(...)`、資料庫查詢、LLM 呼叫 | 包成 Activity，用 `workflow.execute_activity()` 呼叫 |
| `time.sleep(60)` | `await asyncio.sleep(60)`（Python SDK 會轉成 Temporal Timer，重放時不會真的再等） |
| 讀環境變數或全域可變狀態來分支 | 當成 workflow 參數傳進來，或包成 Activity |

還有一類更隱蔽的：**改動已在執行中的 workflow 程式碼**。Temporal 的[決定性約束文件](https://docs.temporal.io/workflow-definition)列出哪些呼叫會產生 Command。這些**不能重排、不能增刪**：啟動或取消 Timer、排定或取消 Activity、啟動或取消 Child Workflow、送 Signal、Nexus 操作、以及結束流程本身。

舉文件裡的例子。一個「先 sleep 再跑 activity」的流程正在等 timer，你這時把程式碼改成「先跑 activity 再 sleep」。timer 一到、流程重放時，第一個 Command 變成 `ScheduleActivityTask`，對不上歷史裡的 `TimerStarted`。這次執行直接失敗並報 non-determinism error。

相對地，這些改動是安全的：改 Timer 長度（Java / Python / Go 改成 0 除外）、改 Activity Options 或 Child Workflow Options、改送給外部 workflow 的 Signal 參數、加一個沒收過訊息的 Signal Type handler。要做真正的破壞性改動，得走 Worker Versioning 或 patching。注意 2025 年之前那套實驗性 Worker Versioning 會在 2026 年 3 月從 Server 移除。

**怎麼做**：Python SDK 有個安全網。它預設把 workflow 碼跑在 sandbox 裡，用 `exec` 做全域狀態隔離，並用 proxy 物件擋掉已知的非決定性標準庫呼叫。踩到就丟例外、worker task 失敗、流程停在原地等你修。

今晚可以做的事：把 workflow 檔案裡的第三方 import 包進 `with workflow.unsafe.imports_passed_through():`，然後跑一次現有的 workflow，看 sandbox 報什麼。但別把它當保證——文件明講 sandbox「不是完全隔離」，有些函式庫會在內部改狀態而繞過檢查。

## LLM 天生非決定性，agent 要怎麼放進來

到這裡答案其實已經寫在約束裡了。Temporal 文件在決定性那一節直接點名：

> Workflow code must be deterministic to support replay. To handle non-deterministic operations like API calls, LLM/AI invocations, database queries, and other external interactions, put them in Activities.
>
> —— [Temporal Workflow Definition 文件](https://docs.temporal.io/workflow-definition)

分界線是：**agent 的「編排」跑在 workflow 裡，agent 的「模型呼叫」跑在 activity 裡**。迴圈怎麼轉、選哪個工具、要不要交棒給另一個 agent，這些是決定性的控制流；真正打出去的那一發 HTTP 請求不是。

實際寫法不必自己拆。[OpenAI Agents SDK 的 Temporal 整合](https://docs.temporal.io/develop/python/integrations/openai-agents)裝上 `OpenAIAgentsPlugin` 之後會把 `Runner.run` 重新導向，讓每次模型呼叫自動變成 Activity。你在 workflow 裡寫的還是一般的 Agents SDK 程式碼。模型 activity 的排程參數由 `ModelActivityParameters` 控制，`start_to_close_timeout` 預設 60 秒。[LangGraph 整合](https://docs.temporal.io/develop/python/integrations/langgraph)（Public Preview，需要 `temporalio` 1.27.0 以上）則把選擇權攤開。每個 node 都要在 metadata 標 `execute_in: "activity"`，或不標而跑在 workflow 內。跑在 workflow 內的那些，就得自己保證決定性。

這是本篇最值得記的一句：**Temporal 沒有讓非決定性消失，它逼你把非決定性標記出來。** 對 agent 來說這既是稅也是紅利。稅是你得把每個外部呼叫拆成 activity；紅利是拆完之後，每次 LLM 呼叫都自動有重試、逾時、以及一筆可查的歷史紀錄。

## 「replay 還是快照」這條軸線

durable execution 內部確實有架構分歧，但分歧不在「checkpoint」這個詞上——**用 checkpoint 詞彙的引擎，有一半仍然要求決定性**。實際的分界線是：**復原時要不要重跑你的編排碼？**

| 引擎 | 復原方式 | 編排碼要決定性嗎 |
|---|---|---|
| [Temporal](https://docs.temporal.io/workflows) | 從頭重跑 workflow，重放 Event History | 要 |
| [Restate](https://docs.restate.dev/develop/python/durable-steps) | 從頭重跑 handler，重放 journal，跳過已完成的步驟 | 要（提供 `ctx.run` / `ctx.uuid()` / `ctx.random()` / `ctx.time()`） |
| [DBOS](https://docs.dbos.dev/architecture) | 用 checkpoint 過的輸入重新呼叫 workflow，每個 step 先查 Postgres 有沒有 checkpoint | 要（文件明列 workflow function must be deterministic） |
| [Hatchet](https://docs.hatchet.run/home/durable-execution) | 從 durable event log 的最後一個 checkpoint 重放 | 要（durable task 只能 wait 或 spawn child） |
| [Trigger.dev](https://trigger.dev/docs/how-it-works) | 用 CRIU 對整個行程做記憶體快照，還原後從中斷處續跑 | 不要 |
| [LangGraph](https://langchain-ai.github.io/langgraph/concepts/persistence/) | checkpointer 存 graph state 快照，從 thread 的 checkpoint 續跑 | 不要 |

注意 DBOS。它整份文件都用 checkpoint 這個字，機制卻是「重新呼叫 workflow，逐步比對 checkpoint，遇到沒 checkpoint 的 step 才真的執行」。這跟 Temporal 的 replay 是同一套邏輯，只是把事件歷史換成 Postgres 資料列。

真正站在另一邊的是 Trigger.dev。CRIU 是作業系統層級的 checkpoint/restore，連 CPU 暫存器和開啟的檔案描述子都一起存下來。還原時不重跑任何一行你的程式碼，所以它不需要你的 task 有決定性。「replay」這個詞在兩邊因此意思相反：在 Temporal 是「重跑程式碼重建狀態」，在 [Trigger.dev 的詞彙](https://trigger.dev/docs/replaying)裡是「用同樣的 input、跑最新版的程式碼再來一次」。

對 agent 工作負載的意義很直接。**沒有決定性要求的那一邊，門檻低但拿不到完整事件歷史。** 有決定性要求的那一邊，你付出把 LLM 呼叫外推成 activity 的功夫，換到的是每一步都可查、可重放、可時光旅行除錯。

## 自架與 Temporal Cloud 的帳

Server 是 MIT 授權，`temporal server start-dev` 一個 binary 就能在本機跑起完整服務加 Web UI，沒有外部依賴。正式環境自架要自己扛 Persistence 與 Visibility 儲存、監控與升級。Visibility 目前支援 Elasticsearch v7/v8、OpenSearch 2+、MySQL 8.0.17+、PostgreSQL 12+、SQLite 3.31+；[Cassandra 的 Visibility 支援](https://docs.temporal.io/self-hosted-guide/visibility)在 Server 1.21 標為過時、1.24 移除。

[Temporal Cloud 的定價](https://temporal.io/pricing)（2026-08 實查）分四層，Essentials 與 Business 可自助開通：

| 方案 | 月費起 | 含 Actions | Active / Retained 儲存 | P0 回應 |
|---|---|---|---|---|
| Essentials | $100 | 1M | 1 GB / 40 GB | 1 個工作天 |
| Business | $500 | 2.5M | 2.5 GB / 100 GB | 2 個工作小時 |
| Enterprise | 洽談 | 10M | 10 GB / 400 GB | 24/7、30 分鐘內 |
| Mission Critical | 洽談 | 10M | 10 GB / 400 GB | 24/7、15 分鐘內 |

超量的 Action 從每百萬 $50 起算，隨當月用量遞減到 $25（超過 2 億筆再談）。儲存 Active $0.042/GBh、Retained $0.00105/GBh。方案費取「月費」與「用量的 5%（Essentials）／10%（Business）」的較大者——文件給的例子是 Essentials 帳號當月用掉 $3,000，方案費就是 max($100, $150) = $150。新帳號有 $1,000 額度、90 天到期；募資未滿 3,000 萬美元的新創另有 $6,000 額度的方案。

一個對成本模型很重要的細節：**replay 產生的 Action 不計費**。Temporal 的說法是重放只在 worker 端重建狀態，不產生新的伺服器端操作。所以 workflow 崩了重放一百次也不會多算錢，會算錢的是每次 activity 的啟動與重試、每個 timer、每次 signal / update / query。

## 什麼時候不要用 Temporal

**流程只有一步。** 「收到請求 → 丟進背景跑 → 寫回資料庫」不需要 durable execution，BullMQ 或 Celery 就夠了，而且少一個要維運的服務。Temporal 自己也給了折衷路徑：單一動作可以用 Standalone Activity，不必包 workflow。

**團隊沒有能力吃下決定性約束。** 這個約束不會只在寫的時候咬你，它會在每次改動已上線的流程時咬你。如果你的部署節奏是一天好幾次、流程執行時間又長到跨越多個版本，你買的其實是一套版本管理紀律，而不只是一個函式庫。

**工作負載本質上就是非決定性的編排。** 一個每輪都由模型決定下一步、連步驟數量都不固定的 agent 迴圈，硬塞進決定性 workflow 會變成一場跟 sandbox 的拉鋸。這種情況下先確認：模型呼叫外推成 activity 之後，剩下的控制流是不是真的可重放？不是的話，選擇 checkpoint 型的引擎誠實得多。

**只是要 cron。** 排程本身不值得一個 Temporal 叢集。

反過來說，只要流程滿足「多步、跨外部系統、失敗代價高、需要人類介入或長時間等待」這四項裡的三項，Temporal 幾乎一定划算——因為那些你原本要自己寫的狀態表、冪等鍵與補償邏輯，加起來比學會決定性約束貴得多。

## 參考資料

- [Temporal Workflow（含 replay 機制說明）](https://docs.temporal.io/workflows)
- [Temporal Workflow Definition：決定性約束與版本管理](https://docs.temporal.io/workflow-definition)
- [Temporal Events and Event History（含歷史上限）](https://docs.temporal.io/workflow-execution/event)
- [Understanding Temporal（Workflow / Activity / Worker 概念）](https://docs.temporal.io/evaluate/understanding-temporal)
- [Temporal Python SDK sandbox environment](https://docs.temporal.io/develop/python/best-practices/python-sdk-sandbox)
- [Temporal Workflow Basics - Python SDK](https://docs.temporal.io/develop/python/workflows/basics)
- [Temporal Durable AI（agent 使用情境與整合清單）](https://docs.temporal.io/ai)
- [Temporal × OpenAI Agents SDK 整合](https://docs.temporal.io/develop/python/integrations/openai-agents)
- [Temporal × LangGraph 整合](https://docs.temporal.io/develop/python/integrations/langgraph)
- [Temporal Cloud 定價（2026-08 實查）](https://temporal.io/pricing)
- [Temporal 自架指南](https://docs.temporal.io/self-hosted-guide)
- [Temporal Visibility 儲存支援矩陣](https://docs.temporal.io/self-hosted-guide/visibility)
- [Restate Key Concepts（journal 與 replay）](https://docs.restate.dev/foundations/key-concepts)
- [Restate Durable Steps - Python（`ctx.run` 與決定性輔助）](https://docs.restate.dev/develop/python/durable-steps)
- [DBOS Architecture（checkpoint 與復原流程）](https://docs.dbos.dev/architecture)
- [Hatchet Durable Execution](https://docs.hatchet.run/home/durable-execution)
- [Trigger.dev How it works（CRIU checkpoint-resume）](https://trigger.dev/docs/how-it-works)
- [Trigger.dev Versioning](https://trigger.dev/docs/versioning)
- [LangGraph Persistence（checkpointer 與 store）](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- 站內相關：[BullMQ：Node.js 最成熟的 Redis-backed 任務佇列](/posts/tech/2026-03-27-bullmq-job-queue-nodejs)、[Celery：Python 生態裡分散式任務佇列的標準解法](/posts/tech/2026-03-27-celery-python-task-queue)
