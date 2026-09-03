---
title: "框架更新｜Mastra @mastra/core 1.59.0"
date: 2026-08-16
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.59.0 把 CostGuard 升級成可分層預算的 TokenCostControl，並把 Factory 的自動跑 Agent 行為改成預設關閉，是一次帶 breaking changes 的營運強化版"
tldr: "Mastra 1.59.0 三個重點：(1) CostGuardProcessor 更名並升級為 TokenCostControl，支援 user/organization/session 分層預算與 warnAtPercent 預警；(2) Breaking：Factory 的自動跑 Agent 行為 autoRunEnabled 預設改為關閉，規則建議的執行會先變成 proposed 狀態等人核准；(3) 新增 listActiveThreadRuns() 可低成本查詢正在執行中的 run，方便做狀態輪詢 UI。"
series:
  name: "AI Framework Changelog"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-16-framework-mastra-1.59.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.59.0 |
| 前一版 | @mastra/core@1.58.0 |
| 發布日 | 2026-08-16 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.2k |

## 這個版本為什麼重要

這版的主軸是「把 Mastra 從單機開發工具往多租戶營運工具再推一步」。CostGuard 升級成 TokenCostControl 之後，成本控管不再只是一個全域開關，而是能按 user / organization / session 分層設預算，這對把 Mastra 部署成多租戶 SaaS 後端的團隊是實際會用到的能力。另一邊，Factory 的自動跑 Agent 行為預設關閉，等於官方把「規則自動觸發 Agent 執行」的預設姿態從激進改成保守——規則現在只會提案（`proposed`），要人核准才真的跑。這反映了一個訊號：當 Agent 系統開始接手正式營運場景，「預設安全、明確授權」比「開箱即用、自動執行」更被看重。

## 重要變更

- **TokenCostControl（原 CostGuardProcessor）分層預算**：新增 `warnAtPercent` 預警閾值、per-request `maxCost` function、以及 `user`/`organization`/`session` 三種成本範圍，並可選擇性拆分 per-model/provider 的成本明細 → 多租戶部署可以直接在框架層擋超支，不用自己另外包一層計費邏輯
- **Active run 低成本查詢**：`Agent.listActiveThreadRuns()` / `AgentController.listActiveThreadRuns()` 及對應的 Server + JS client API，直接讀記憶體中的執行狀態 → 可以做「目前有哪些 run 在跑」的輪詢 UI，不需要額外建 session 才能查
- **Observability：外部 parent trace 正確顯示為 trace root**：OTel 和 Datadog 的 tracing bridge 現在會標記 span 的 parent 是外部系統還是 Mastra → 修掉了「從外部系統發起的 run，在 Mastra Studio 裡看不到完整 trace root」的問題
- **SensitiveDataFilter 新增 indexed 遮罩模式**：`redactionStyle: 'indexed'` 讓每個被遮罩的值變成穩定、可分辨的 token（例如 `[APIKEY_1]`），而不是全部塌縮成同一個 `[REDACTED]` → debug 時能分清楚是不是同一個敏感值,同時仍然不洩漏原始內容
- **Observational Memory 的 recall 支援續傳**：新增 `nextCharOffset`，超大訊息片段可以分多次呼叫取完整內容 → 解決了大訊息一直被截斷、重複拿到相同開頭片段的問題

## Breaking Changes

- `autoRunEnabled` 預設關閉：
  - 升級前：Factory 的規則會自動觸發 Agent 執行
  - 升級後：規則建議的執行會先變成 `proposed` 決策，需要人工核准才會真正跑；要恢復舊行為需手動把 `autoRunEnabled` 設回 `true`
  - 影響範圍：所有用 Factory 讓規則自動跑 Agent 的專案，升級後這些流程會停在「待核准」而不是自動執行
- `CostGuardProcessor` → `TokenCostControl`：
  - `import { CostGuardProcessor } from '@mastra/core'` → `import { TokenCostControl } from '@mastra/core'`
  - 影響範圍：使用成本控管 processor 的專案；官方保留了 deprecated alias，但未來大版本會移除，建議儘早換名字

## 遷移指南

### 從 1.58.x 升級到 1.59.0

```bash
# Step 1: 更新依賴
npm install @mastra/core@1.59.0
```

```typescript
// 舊寫法（1.58.x）
import { CostGuardProcessor } from '@mastra/core'
const guard = new CostGuardProcessor({ maxCost: 5 })

// 新寫法（1.59.0）
import { TokenCostControl } from '@mastra/core'
const control = new TokenCostControl({
  maxCost: 5,
  warnAtPercent: 80,
  scope: 'organization',
})
```

```typescript
// 如果依賴 Factory 規則「自動」跑 Agent，升級後需明確打開，
// 否則規則只會產生待核准的 proposed 決策
const factory = new Factory({
  autoRunEnabled: true, // 1.59.0 起預設為 false，需手動設回
})
```

## 與其他框架的對比觀察

TokenCostControl 的分層預算（user/organization/session）補上了 Mastra 在「多租戶成本治理」上和 LangGraph 的差距——LangGraph 目前多半仍靠外接計費中介層處理這件事。而 Factory 自動執行預設轉為保守，某種程度呼應了 CrewAI role-based 流程裡「重要決策需要 human-in-the-loop」的設計哲學，顯示 Agent 框架在往正式營運場景靠攏時，普遍往「預設需要人核准」收斂。

## 今日收穫

之前以為 framework 的 changelog 裡「rename + deprecated alias」多半只是命名整理，這次才注意到 Mastra 把 CostGuardProcessor 重新命名成 TokenCostControl 的同時，一併把成本範圍從單一全域開關拆成 user/organization/session 三層——命名變更背後其實是資料模型的擴充，不能只看 diff 裡的 import 路徑，要連著看它新增的參數才知道這是不是「真的多了能力」還是單純改名。

## 參考資料

- [Mastra @mastra/core@1.59.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
