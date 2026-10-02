---
title: "框架更新｜Pydantic AI v2.53.0"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.53 修補一個高風險（high）資安漏洞：ConcurrencyLimitedModel 的併發槽位在跨 task 釋放時可能卡死不放，重複串流會把共用同一限流器的所有請求全部卡住；同時新增 ToolCallJudge 讓工具呼叫執行前先過一道審查"
tldr: "Pydantic AI v2.53.0 三個重點：(1) 資安——GHSA-6fqq-452j-qhrp（high）：透過 ConcurrencyLimitedModel 或 limit_model_concurrency 發出的串流請求，若消費端提早離開（中止疊代、丟例外、被取消）或把 stream_text() 完整跑完（預設有 debounce），併發槽位可能卡在「已釋放但未真正釋放」的狀態，重複觸發會讓共用同一限流器的所有請求全部卡住；(2) 連帶調整限流器語意——model wrapper 若與發出請求的 agent 或外層 wrapper 共用同一限流器，現在會丟出 UserError，`ConcurrencyLimiter.acquire()` 改成每次呼叫都佔一個槽位（即使同一個 task 也一樣），自訂的 `AbstractConcurrencyLimiter` 必須允許從別的 task 呼叫 `release()`；(3) 新增 `ToolCallJudge`，讓工具呼叫在真正執行前先經過一層審查，`repair_messages` 訊息修復流程也從內部工具正式開放成公開 API。"
series:
  name: "AI Framework Changelog"
  order: 32
---

> 🌏 [English version](/en/posts/daily/2026-10-03-framework-pydantic-ai-2.53.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.53.0 |
| 前一版 | v2.52.0 |
| 發布日 | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.53.0) |
| Security Advisory | [GHSA-6fqq-452j-qhrp](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.4k |

## 這個版本為什麼重要

這次的資安問題比上一版（2.52.0 修的 `web_fetch` 巢狀 HTML DoS）更隱蔽，因為它不需要攻擊者輸入任何惡意內容就能觸發。`ConcurrencyLimitedModel` 和 `limit_model_concurrency` 讓多個 agent 呼叫共用同一個併發上限，正常情況下一個請求做完就該把槽位還回去。但如果消費端提早離開串流（疊代中止、拋出例外、被取消），或是用預設 debounce 把 `stream_text()` 完整跑完，槽位的釋放可能發生在跟原本取得它的 task 不同的 task 上——這種「跨 task 釋放」在目前實作裡會讓槽位卡在「以為放了但沒真的放」的狀態。只要重複觸發這個模式幾次，所有共用同一限流器的請求都會被卡住，等於自己把自己的併發控制變成了阻塞點。GHSA 等級是 high，agent 層級的 `max_concurrency` 和非串流請求不受影響，但凡是認真用 `ConcurrencyLimitedModel` 做生產環境流量管控的團隊都該立刻升級。另一個值得注意的訊號是 `ToolCallJudge` 正式加入——工具呼叫執行前先經過一層審查邏輯，這是 agent 安全機制往「執行前攔截」方向補強的具體動作，跟這次併發修補背後「槽位該不該被釋放」的判斷邏輯算是同一條線上的思路：框架開始把「允不允許這個動作發生」這件事當成第一等公民來處理。

## 重要變更

- **`ConcurrencyLimiter` 語意調整**：`acquire()` 改成每次呼叫都佔用一個新槽位（即使在同一個 task 裡呼叫也一樣），自訂的 `AbstractConcurrencyLimiter` 現在必須允許 `release()` 從別的 task 呼叫 → 修正跨 task 釋放導致槽位卡死的根因
- **共用限流器直接報錯**：model wrapper 如果和發出請求的 agent，或外層另一個 wrapper，共用同一個限流器，會直接丟出 `UserError` → 把「共用限流器可能導致死鎖」的隱性風險變成顯性錯誤，逼開發者在設計時就想清楚槽位歸屬
- **`ToolCallJudge`（#9041）**：在工具呼叫真正執行前插入一層審查，可以用來擋掉不該執行的工具呼叫 → 是繼 guardrails 之後，agent 安全機制往「執行前攔截」補強的具體功能
- **`repair_messages` 正式開放（#8370）**：原本內部用的訊息歷史修復流程，現在開放成公開 API → 自己手動組 message history 的團隊可以直接重用框架內建的修復邏輯，不用重新發明一套
- **`AbsurdDurability`（#8946）**：加進 harness，取代原本獨立的 `pydantic-ai-absurd` → durable execution 的其中一種後端選項收回主 repo 維護
- **`SystemOneModel`（#8942）**：讓 CLM、Laya 這類「決策模型」可以透過 `/v1/systemone` API 執行 → 補上快速決策／分類模型這一類跟一般對話模型不同形狀的呼叫介面
- **`pydantic-clai2` 外掛生態持續擴張**：這版新增 posthog、grain、linear、herdr 等內建外掛，加上 Logfire 遙測設定選單、`/update` 支援 stable／bleeding 雙頻道、managed subagents（內建 Claude／Codex agent 定義）→ 延續上一版「CLI 產品化」的方向，外掛數量和涵蓋範圍持續在加

## Breaking Changes

- `ConcurrencyLimiter.acquire()` 行為變更：
  - 舊：同一個 task 內多次呼叫 `acquire()` 可能共用或疊加同一槽位的計數方式
  - 新：每次呼叫都佔用一個新槽位，自訂 `AbstractConcurrencyLimiter` 必須支援跨 task `release()`
  - 影響範圍：自己實作過 `AbstractConcurrencyLimiter` 子類別，或依賴舊版槽位計數細節的專案
- model wrapper 與發出請求的 agent／外層 wrapper 共用限流器時，從原本的靜默風險變成直接丟出 `UserError`：
  - 影響範圍：架構上把同一個 `ConcurrencyLimiter` 實例同時塞進 agent 本身與某個 model wrapper 的用法，升級後會立刻在啟動或執行期看到錯誤，需要拆成各自獨立的限流器實例

## 遷移指南

### 從 2.52.0 升級到 2.53.0

```bash
pip install --upgrade pydantic-ai==2.53.0
```

```python
# 舊寫法（2.52.0 及之前，agent 與 wrapper 共用同一限流器實例）
limiter = ConcurrencyLimiter(max_concurrency=5)
model = ConcurrencyLimitedModel(base_model, limiter=limiter)
agent = Agent(model, model_settings=ModelSettings(concurrency_limiter=limiter))  # 共用同一個 limiter

# 新寫法（2.53.0，agent 與 wrapper 各自持有獨立限流器）
agent_limiter = ConcurrencyLimiter(max_concurrency=5)
wrapper_limiter = ConcurrencyLimiter(max_concurrency=5)
model = ConcurrencyLimitedModel(base_model, limiter=wrapper_limiter)
agent = Agent(model, model_settings=ModelSettings(concurrency_limiter=agent_limiter))
```

沒有自訂 `AbstractConcurrencyLimiter` 子類別、也沒有把同一個限流器實例同時塞進 agent 和 model wrapper 的專案，升級後沒有程式碼層的 breaking change；`ConcurrencyLimitedModel` 的資安修補本身不需要改程式碼，升級即修補。

## 與其他框架的對比觀察

這是 Pydantic AI 連續第二版修補跟「資源耗盡」相關的資安問題——上一版是 HTML 巢狀解析可被餵到 CPU／記憶體耗盡，這一版是併發槽位可被卡到整條限流器堵死。同樣的模式也出現在 crewAI 最近幾版：9 月同時為 `pypdf`（CVE）和 `nltk`（CVE）升版，8 月也修過一輪串流回應相關的邊界案例。這指向一個共同的壓力點——agent 框架為了支援長時間執行、併發呼叫、外部內容擷取，必然要在框架內部維護越來越多「共用資源」（連線池、限流器、解析器狀態），而這些共用資源一旦在例外路徑（提早取消、跨 task 釋放、惡意輸入）上沒處理乾淨，就會變成可被觸發的 DoS 面。對正在評估 agent 框架的團隊來說，「多久修一次這類資源耗盡問題、修補速度多快」本身就是一個值得納入選型的訊號，不是只看功能多寡。

## 今日收穫

之前覺得「併發限流器」是一個單純的計數器問題：拿槽位、做事、還槽位。看完這次的 GHSA 細節才意識到，一旦牽涉到串流（消費者可能半途離開）和 async task（釋放可能發生在不同的執行脈絡），「還槽位」這個動作本身就不是原子的——槽位的生命週期被拆成了「取得」和「釋放」兩個可能發生在不同 task、不同時間點的事件，中間任何一個環節被提早中斷，狀態就可能卡住。這跟資料庫連線池、檔案鎖這類資源管理的經典陷阱其實是同一類問題，只是披著「AI agent 併發控制」的外衣出現。

## 參考資料

- [Pydantic AI v2.53.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.53.0)
- [Security Advisory GHSA-6fqq-452j-qhrp](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.52.0 — 上一篇框架更新](/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0)
- [PR #9478：修補 ConcurrencyLimitedModel 跨 task 釋放漏洞](https://github.com/pydantic/pydantic-ai/pull/9478)
- [PR #9041：新增 ToolCallJudge](https://github.com/pydantic/pydantic-ai/pull/9041)
- [PR #8370：開放 repair_messages 為公開 API](https://github.com/pydantic/pydantic-ai/pull/8370)
- [PR #8946：新增 AbsurdDurability](https://github.com/pydantic/pydantic-ai/pull/8946)
- [PR #8942：新增 SystemOneModel](https://github.com/pydantic/pydantic-ai/pull/8942)
- [Full Changelog: v2.52.0...v2.53.0](https://github.com/pydantic/pydantic-ai/compare/v2.52.0...v2.53.0)
