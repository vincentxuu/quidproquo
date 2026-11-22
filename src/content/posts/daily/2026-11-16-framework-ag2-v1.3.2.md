---
title: "框架更新｜AG2 v1.3.2"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: zh-TW
description: "AG2 v1.3.2 把跨 provider 的 token 用量算法統一成一條規則，修正 Anthropic／Bedrock 之前低估 prompt_tokens 的問題，同時讓一個 decision agent 能一次問完多個問題"
tldr: "AG2 v1.3.2 三個重點：(1) Breaking：prompt_tokens 現在固定代表整段輸入（含 cache 讀寫），修正 Anthropic／Bedrock 之前把快取命中的部分算漏的問題，用量數字會變大；(2) response_schema 可以是扁平的 dataclass/Pydantic model，一次 request 問完多個決策問題，不用為每個問題各開一個 agent；(3) Breaking：ACP 升級到官方 1.0 協定，`agent-client-protocol` 要求 >=1.0.0。"
series:
  name: "AI Framework Changelog"
  order: 67
---

> :globe: [English version](/posts/daily/2026-11-16-framework-ag2-v1.3.2-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | AG2（前身為 AutoGen） |
| 版本 | v1.3.2 |
| 前一版 | v.1.3.1 |
| 發布日 | 2026-11-15 |
| Release Notes | [v1.3.2](https://github.com/ag2ai/ag2/releases/tag/v1.3.2) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.1k |

## 這個版本為什麼重要

多代理框架為了支援多個 LLM provider，通常會把各家回傳的用量欄位硬塞進同一組欄位名稱——`prompt_tokens`、`completion_tokens`、`total_tokens`。問題是，provider 之間對「prompt_tokens 算不算進快取命中的部分」沒有共識：OpenAI 和 Gemini 把快取讀寫也算進 prompt_tokens，Anthropic 和 Bedrock 過去只回報沒命中快取的那一小段。結果同一個欄位名稱，在不同 provider 底下代表不同數字，任何跨 provider 的用量儀表板、`TokenMonitor` 門檻、委派樹的用量彙總，都可能悄悄算錯而不會報錯——沒有 crash，只是數字不對。1.3.2 把規則定死在 provider mapper 這一層：`prompt_tokens` 永遠是整段輸入，快取讀寫只是其中的子集,不是額外加總。另一個值得注意的變更是 decision agent 的使用方式——以前一個 agent 只能回答一個分類問題,現在可以用扁平 schema 一次問完多個問題,同一段輸入不用重複送、重複算費用。

```diagram
title: AG2 v1.3.2：Anthropic／Bedrock 的 prompt_tokens 怎麼變
desc: 1.3.2 之前 Anthropic／Bedrock 的 prompt_tokens 只算沒命中快取的那一小段，快取讀寫的 token 數不計入；1.3.2 之後 prompt_tokens 固定代表整段輸入，cache_read_input_tokens／cache_creation_input_tokens 變成它的子集而不是額外加總。
caption: 範例數字取自 release notes：同一次呼叫，之前回報 prompt_tokens=3，之後回報 prompt_tokens=8,630。
---
<svg viewBox="0 0 640 320">
  <text class="dg-sub" x="160" y="30" text-anchor="middle" dominant-baseline="central">之前</text>
  <rect class="dg-box dg-box--ghost" x="20" y="48" width="280" height="64" rx="6"/>
  <text class="dg-label" x="160" y="70" text-anchor="middle" dominant-baseline="central">prompt_tokens = 3</text>
  <text class="dg-sub" x="160" y="92" text-anchor="middle" dominant-baseline="central">只算沒命中快取的部分</text>

  <rect class="dg-box dg-box--ghost" x="20" y="132" width="280" height="64" rx="6"/>
  <text class="dg-label" x="160" y="154" text-anchor="middle" dominant-baseline="central">cache_read_input_tokens</text>
  <text class="dg-sub" x="160" y="176" text-anchor="middle" dominant-baseline="central">8,627（不計入 prompt_tokens）</text>

  <text class="dg-edge" x="160" y="226" text-anchor="middle" dominant-baseline="central">TokenMonitor／telemetry 看到的輸入量被低估</text>

  <text class="dg-sub" x="480" y="30" text-anchor="middle" dominant-baseline="central">1.3.2 之後</text>
  <rect class="dg-box" x="340" y="48" width="280" height="64" rx="6"/>
  <text class="dg-label" x="480" y="70" text-anchor="middle" dominant-baseline="central">prompt_tokens = 8,630</text>
  <text class="dg-sub" x="480" y="92" text-anchor="middle" dominant-baseline="central">固定代表整段輸入</text>

  <rect class="dg-box" x="340" y="132" width="280" height="64" rx="6"/>
  <text class="dg-label" x="480" y="154" text-anchor="middle" dominant-baseline="central">cache_read_input_tokens</text>
  <text class="dg-sub" x="480" y="176" text-anchor="middle" dominant-baseline="central">8,627（是 prompt_tokens 的子集）</text>

  <text class="dg-edge" x="480" y="226" text-anchor="middle" dominant-baseline="central">跨 provider 的用量數字可以直接比較</text>
</svg>
```

## 重要變更

- **跨 provider 的 token 用量統一規則**：`prompt_tokens` 固定代表整段輸入，包含 cache 讀寫；`cache_read_input_tokens`、`cache_creation_input_tokens` 是其中的子集，不是額外加總；`total_tokens >= prompt_tokens + completion_tokens` → 修正 Anthropic／Bedrock 之前把快取命中的部分漏算的問題，跨 provider 的用量數字從現在起可以直接比較
- **Gemini Live 的 thinking token 併入 completion_tokens**：跟 batch Gemini、xAI 的算法一致，不再被排除在用量統計外 → 用 Gemini Live 做 reasoning 的流程，用量數字從現在起才算完整
- **一次問多個決策問題**：`response_schema` 可以是扁平的 dataclass／`TypedDict`／Pydantic model，每個欄位對應一個決策問題，`OpenAIDecisionsConfig` 和 `TypeSafeConfig` 都支援，一次 request 全部送出 → 不用為「是不是垃圾信、該分哪個部門、多緊急」各開一個 agent 各打一次 request，同一段輸入只傳一次、只計費一次；本地先擋掉 decision API 答不了的 schema（巢狀欄位、`Optional`、缺 Question 的欄位），不用等到打出去才發現設錯
- **ACP 1.0**：訊息不再被黏成一條字串——每個訊息 chunk 變成獨立的 `ModelMessage` 事件，`reply.body` 是代理最後一則訊息而不是全部內容合併；文字／blob resource、resource link、工具結果的結構不再被丟棄；session 結束不用再包在 `async with` 才能乾淨關閉；`cwd`／`additional_directories` 在 session 開始時就先解析成絕對路徑
- **Python 3.15 支援**：CI 和型別檢查都已覆蓋到 3.15，但 PyYAML 還沒發 3.15 的 wheel，`pip install ag2` 在 3.15 上會從原始碼編譯 PyYAML，需要 C compiler

## Breaking Changes

- Anthropic、Bedrock 上的 `prompt_tokens`、`total_tokens`、telemetry 的 `gen_ai.usage.input_tokens` 會變大（現在把快取讀寫算進去）：
  - 影響範圍：設了 token 預算或 `TokenMonitor` 門檻的專案，這些門檻會比以前更快被打到；舊版本存的用量資料不會回溯改寫
- Gemini Live thinking 模型的 `completion_tokens`、`total_tokens` 會變大（thinking token 併入）：
  - 影響範圍：用 Gemini Live thinking 模型且有設用量門檻的流程
- `acp` extra 現在要求 `agent-client-protocol>=1.0.0,<2`，不再支援 0.12.x：
  - 影響範圍：自己 pin 了 `agent-client-protocol` 版本的專案，升級 AG2 前要先改這個 pin
- `ag2.acp.AuthMethod` 拿掉 SDK 已移除的環境變數認證方式；`BridgeState.turn_text` 改成 `turn_messages`：
  - 影響範圍：直接引用這兩個名稱的程式碼

## 遷移指南

### 從 v.1.3.1 升級到 v1.3.2

```bash
pip install --upgrade ag2==1.3.2
```

```python
# 舊寫法：一個 decision agent 只能回答一個問題，三個問題要開三個 agent
is_spam_agent = Agent("is_spam", config=OpenAIDecisionsConfig(), response_schema=bool)
department_agent = Agent("department", config=OpenAIDecisionsConfig(), response_schema=Department)
urgency_agent = Agent("urgency", config=OpenAIDecisionsConfig(), response_schema=Urgency)
# 同一張工單的文字被送三次、算三次費用

# 新寫法：扁平 schema 一次問完
@dataclass
class TicketTriage:
    is_spam: Annotated[bool, Question("Is this message spam?")]
    department: Annotated[Department, Question("Which team should handle this ticket?")]
    urgency: Annotated[Urgency, Question("How urgent is this ticket?")]

triage = Agent("triage", config=OpenAIDecisionsConfig(), response_schema=TicketTriage)
reply = await triage.ask("I was charged twice this month.")
```

升級前先確認 `agent-client-protocol` 的 pin 是不是已經是 `>=1.0.0,<2`，不是的話先改版本限制再升級 AG2；若自己設了 token 預算或 `TokenMonitor` 門檻，升級後重新檢視門檻數字，尤其是跑在 Anthropic／Bedrock 或 Gemini Live thinking 模型上的流程——同一套門檻設定在升級後可能提早觸發。沒有用到 ACP、沒有自訂 token 門檻的專案可以直接升級。

## 與其他框架的對比觀察

deepset Haystack 這週（11/10 的 v3.5.0）也加了基於 OpenAI Decisions API 的 router／classifier 元件（`OpenAIDecisionsTextRouter`、`OpenAIDecisionsImageRouter`、`OpenAIDecisionsDocumentClassifier`），但每個元件處理的是單一分類軸——文字該送去哪個分支、圖片該走哪個路徑。AG2 這版的扁平 schema 做的是另一個維度：把多個獨立問題（是不是垃圾信、分哪個部門、多緊急）打包進同一次 request，省的是「同一段輸入要不要重複送」這個問題，兩者解決的其實是不同層次的重複。至於跨 provider 的 token 用量規則，多數框架通常只是把各家 SDK 回傳的用量欄位原樣轉傳,很少有人把「prompt_tokens 該不該算進快取部分」寫成一條明確規則並強制在 provider mapper 層套用——這部分 AG2 補得比同類框架更仔細。

## 今日收穫

之前以為多 provider 框架裡的 `prompt_tokens` 是一個標準化欄位,既然欄位名稱統一,代表的意義也該是統一的。看到 release notes 裡那個對照才意識到：同一次呼叫，Anthropic 之前回報 `prompt_tokens=3`，但模型實際讀了 8,630 個 token——不是 bug，是這個欄位從一開始就沒有跨 provider 的共同定義。這代表任何用「標準化欄位名稱」拼起來的跨 provider 用量儀表板,在沒有人特別去對齊語義之前,數字可能已經悄悄錯了一個數量級,而且因為沒有報錯,根本不會被發現。

## 參考資料

- [AG2 v1.3.2 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.3.2)
- [ag2ai/ag2 GitHub](https://github.com/ag2ai/ag2)
- [Full Changelog: v.1.3.1...v1.3.2](https://github.com/ag2ai/ag2/compare/v.1.3.1...v1.3.2)
- [AG2 Documentation: Several Decision Questions at Once](https://docs.ag2.ai/docs/user-guide/decision_models/#several-questions-at-once)
- [AG2 Documentation: Telemetry](https://docs.ag2.ai/docs/user-guide/telemetry/agent/)
- [AG2 Documentation: ACP Client](https://docs.ag2.ai/docs/user-guide/acp/client/)
- [框架更新｜Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0)
