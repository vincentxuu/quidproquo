---
title: "框架更新｜Pydantic AI v2.65.0"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.65.0 新增 ConversationStore 把對話存成只寫一次的訊息日誌、加上 WebSocket transport 給 OpenAI Responses，並讓 ModelFallback 開始接住模型拒答的情況"
tldr: "Pydantic AI v2.65.0 三個重點：(1) 新增 `ConversationStore`，把對話存成只寫一次的訊息日誌,並用 `Conversation.revision` 擋掉衝突寫入；(2) `ModelFallback` 的 `fallback_on` 現在能接住模型拒答（refusal），自動換下一個模型；(3) Breaking：Z.ai 額度／方案 429 改丟 `ModelQuotaExceededError`、`BrowserUse` 的模型呼叫改計入 usage 與 `UsageLimits`、Temporal 預設不再重試「重試也救不回來」的模型錯誤。"
series:
  name: "AI Framework Changelog"
  order: 61
---

> 🌏 [English version](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.65.0 |
| 前一版 | v2.64.0 |
| 發布日 | 2026-11-02 |
| Release Notes | [v2.65.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## 這個版本為什麼重要

上一版（v2.64.0）補的是「模型掉線怎麼辦」，這版補的是「對話記錄存在哪、誰寫贏」。以前要做 agent 對話的持久化，通常是自己接一個資料庫，把整段訊息歷史序列化寫進去，並發寫入時誰蓋過誰全靠運氣。`ConversationStore` 把這件事收進框架：對話存成一份「只寫一次」的訊息日誌，之後只追加新訊息，不重寫整段歷史；`Conversation.revision` 則讓並發寫入時能偵測衝突，而不是讓後寫的直接覆蓋前面的內容。同一版也讓 `ModelFallback`（v2.64.0 新增的容錯 capability）更聰明一步：模型明確拒答時,現在也能觸發換模型,不必只靠逾時或錯誤才切換。

## 重要變更

- **ConversationStore 對話持久化**：新增 `ConversationStore`，把一段對話存成只寫一次的訊息日誌，之後都是追加而非整段重寫 → 長跑 agent 的對話歷史不用自己接資料庫序列化，框架原生就有一份可持久化的紀錄
- **Conversation.revision 擋衝突寫入**：新增 `revision`，並發寫入同一段對話時能偵測衝突 → 多個行程或 worker 同時寫同一個對話時，不會有「後寫的悄悄蓋掉前面內容」的情況
- **ModelFallback 接住模型拒答**：`fallback_on` 現在能讓 `ContentFilterError` 匹配模型拒答（refusal），觸發換下一個模型 → 模型因為內容政策拒答時,不用額外寫邏輯判斷,直接走既有的 fallback 機制
- **OpenAI Responses 加 WebSocket transport**：新增 WebSocket 傳輸方式給 OpenAI Responses API → 多了一個比 HTTP 串流更低延遲的雙向傳輸選項
- **12h prompt cache retention**：OpenAI Responses API 對 GPT-5.6 及之後的模型支援 `'12h'` 的 prompt cache 保留時間 → 長時間不活躍的對話也能保留 cache，省掉重新建立 cache 的成本
- **anthropic_web_tools_allowed_callers**：新增此設定，可以限制誰能呼叫 Anthropic 的 web tools → 多 agent 共用一個模型設定時，能收斂哪些呼叫方可以觸發網路存取

```diagram
title: ConversationStore 用 revision 擋併發寫入衝突
desc: 兩個 worker 同時對同一個對話 append 訊息：Worker A 先寫入成功，revision 從 r1 進到 r2；Worker B 還拿著舊的 r1 送出同一個 append，被 Store 以 409 拒絕；Worker B 重新讀取最新 revision 後再送一次才成功。
step: Worker A 以 revision=r1 送出 append
step: Store 寫入成功，revision 進到 r2
step: Worker B 以舊的 revision=r1 送出 append
step: Store 偵測到 revision 衝突，回 409
step: Worker B 拿到最新 revision=r2 後重送 append
step: Store 寫入成功，revision 進到 r3
---
<svg viewBox="0 0 640 416">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="400"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="400"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="400"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="206" y="108" text-anchor="middle" dominant-baseline="central">append(revision=r1)</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 168H100" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="156" text-anchor="middle" dominant-baseline="central">200, revision=r2</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M540 216H324" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="432" y="204" text-anchor="middle" dominant-baseline="central">append(revision=r1)</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M324 264H540" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-mono dg-text--warn" x="432" y="252" text-anchor="middle" dominant-baseline="central">409 revision 衝突</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M540 312H324" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="432" y="300" text-anchor="middle" dominant-baseline="central">append(revision=r2)</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 360H540" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-mono" x="432" y="348" text-anchor="middle" dominant-baseline="central">200, revision=r3</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="72" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="204" width="8" height="72" rx="2" data-step="3 4"/>
  <rect class="dg-box" x="316" y="300" width="8" height="72" rx="2" data-step="5 6"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Worker A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">ConversationStore</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Worker B</text>
</svg>
```

## Breaking Changes

- Z.ai 額度／方案限制的 429，改丟 `ModelQuotaExceededError`，不再是 `ModelRateLimitError`：
  - 影響範圍：原本專門抓 `ModelRateLimitError` 來處理 Z.ai 429 的程式碼，需要改成抓 `ModelQuotaExceededError`
- `BrowserUse` 的模型呼叫改計入 host run 的 usage 與 `UsageLimits`：
  - 影響範圍：原本沒把 `BrowserUse` 內部模型呼叫算進用量上限的場景，升級後總用量會變高，接近 `UsageLimits` 上限的 run 可能因此被提早擋下
- Temporal 預設不再重試「重試也救不回來」的模型錯誤，可用 `non_retryable_model_errors` 調整：
  - 影響範圍：依賴「所有模型錯誤都會被 Temporal 自動重試」這個舊行為的流程，升級後特定錯誤類型會直接失敗，需要確認是否要把它們加回可重試清單

## 遷移指南

### 從 2.64.0 升級到 2.65.0

```bash
pip install --upgrade pydantic-ai==2.65.0
```

```python
# 原本抓 ModelRateLimitError 處理 Z.ai 429，改抓 ModelQuotaExceededError
from pydantic_ai.exceptions import ModelQuotaExceededError

try:
    result = await agent.run(prompt)
except ModelQuotaExceededError:
    ...  # 原本寫 except ModelRateLimitError 的地方

# 若流程依賴「模型錯誤一律被 Temporal 重試」的舊行為，明確指定哪些錯誤仍可重試
from pydantic_ai.durable_exec.temporal import TemporalAgent

agent = TemporalAgent(my_agent, non_retryable_model_errors=())  # 空集合 = 維持舊的「全部重試」行為

# 新增的 ConversationStore 用法
store = ConversationStore(...)
conversation = await store.load(conversation_id)
```

其餘功能為新增能力，沒有踩到上述三個情境的程式碼不升級也能照常運作。

## 與其他框架的對比觀察

前一天（2026-11-03）Composio CLI 0.6.0 把「中斷執行時發生什麼」與「多帳號選誰」兩件隱性假設變成明確契約，處理的是 agent 呼叫外部工具時的整合層邊界。Pydantic AI 這版往的是另一個方向——補「對話本身要存在哪裡、誰寫贏」的持久化層缺口。兩者合起來看，框架生態這幾天補的都是 agent 長跑時容易被忽略的邊界：一個是跨帳號、跨工具呼叫的身份邊界，一個是跨 worker、跨行程寫同一段對話的衝突邊界。

## 今日收穫

之前以為「對話持久化」就是把訊息陣列整個序列化存進資料庫，升級時重寫整段就好；看到 `Conversation.revision` 才意識到這個假設在單一 worker、單一寫入者的情況下才成立。只要有兩個 worker 同時處理同一個對話（例如重試或水平擴展），「整段重寫」就會變成「後寫的直接蓋掉前面」的競態問題。`ConversationStore` 把寫入模式從「整段覆蓋」改成「只追加」，再用 `revision` 擋衝突，才是真正適合並發環境的持久化設計。

## 參考資料

- [Pydantic AI v2.65.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.64.0...v2.65.0](https://github.com/pydantic/pydantic-ai/compare/v2.64.0...v2.65.0)
- [Composio CLI 0.6.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0)
