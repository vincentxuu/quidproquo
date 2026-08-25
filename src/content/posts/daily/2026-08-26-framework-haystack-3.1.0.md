---
title: "框架更新｜Haystack 3.1.0"
date: 2026-08-26
category: daily
tags: [ai-agent, framework, daily, haystack]
lang: zh-TW
description: "Haystack 3.1 補齊了兩個生產必需品：用 Hook + Compactor 組合出的 context compaction，以及能把整個 Agent 包成一個 Tool 的 AgentTool，同時關掉了好幾個反序列化 RCE 洞"
tldr: "Haystack 3.1.0 三個重點：(1) 新增實驗性 `CompactionHook`，搭配 `SlidingWindowCompactor`（砍舊回合）和 `ToolResultPruningCompactor`（舊工具結果換成佔位符）處理長對話的 context 爆量問題；(2) 新增 `AgentTool`，可以把一個完整 Agent 包成另一個 Agent 的工具，呼叫端只看得到最終回覆、看不到中間步驟；(3) 同時修了多個 pipeline 反序列化、Jinja sandbox 相關的 RCE 漏洞，且多處行為變更需要照遷移指南檢查（如 `Agent.state_schema` 語意改變、`custom_filters` 現在要求 `unsafe=True`）。"
series:
  name: "AI Framework Changelog"
  order: 6
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Haystack |
| 版本 | v3.1.0 |
| 前一版 | v3.0.0 |
| 發布日 | 2026-08-24 |
| Release Notes | [GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.3k |

## 這個版本為什麼重要

Haystack 3.1 補的是兩塊「線上跑 Agent 一定會撞到」的洞。第一塊是 context 爆量：長對話或多輪工具呼叫下，訊息歷史會一直長大，直接把整段丟給 LLM 遲早爆 context window 或拉高成本。3.1 用 `CompactionHook` 把裁剪邏輯抽成可插拔的 Hook，底下配兩種 `Compactor`——`SlidingWindowCompactor` 直接砍掉舊回合，`ToolResultPruningCompactor` 則是把舊的工具呼叫結果換成精簡佔位符、只留最近幾步的完整內容。第二塊是多 Agent 協作：新增的 `AgentTool` 可以把一整個 Haystack Agent 包裝成另一個 Agent 能呼叫的 Tool，呼叫端只看得到被包裝 Agent 的最終回覆，中間步驟不會污染主 Agent 的 context——這是目前多 Agent 框架常見的「委派但隱藏細節」設計。除了新功能，這版也關掉了好幾個 pipeline 反序列化和 Jinja sandbox 相關的 RCE 漏洞，對把 Haystack pipeline 定義存成 YAML 再載入執行的生產環境來說，這部分安全修補比新功能更該優先看。

## 重要變更

- **Context Compaction（`CompactionHook`）**：新增實驗性的 Hook 機制管理對話長度 → 不必再自己手寫「超過幾則訊息就砍歷史」的邏輯，框架原生支援可插拔的裁剪策略
- **`SlidingWindowCompactor`**：滑動視窗式裁剪，移除較舊的歷史回合 → 適合單純「越舊越不重要」的長對話場景
- **`ToolResultPruningCompactor`**：把較舊的工具呼叫結果換成佔位符、保留最近步驟的完整內容 → 適合工具結果本身很肥大（例如整份搜尋結果、整個檔案內容）的 Agent
- **Token 計數工具（`haystack.token_counters`）**：新增 `ApproximateTokenCounter`（無外部依賴）、`TiktokenCounter`（本地、OpenAI 導向）、`OpenAITokenCounter`（呼叫 OpenAI API 取得精確計數）三種計數器 → 裁剪策略終於有精確的量化依據，不用再用字數估
- **`AgentTool`**：把整個 Agent 包裝成另一個 Agent 可呼叫的 Tool → 呼叫端只看得到被包裝 Agent 的最終回覆，中間步驟不會混進主 Agent 的 context，是原生的 Agent 委派機制
- **`Agent.clone()`**：複製一份 Agent 設定變體 → 方便對同一套 Agent 做 A/B 設定實驗，不用重新組裝所有元件
- **`exit_reason` 輸出欄位**：Agent 執行結果新增標示終止原因的欄位 → 可以直接判斷是正常結束、達到步數上限還是被中斷
- **文件儲存元件新增 `close`/`close_async`**：document store 元件現在有明確的資源釋放方法 → 長時間執行的服務可以正確關閉連線，避免資源洩漏
- **反序列化安全修補**：關閉多個 pipeline 反序列化、Jinja sandbox 執行相關的 RCE 漏洞 → 若你的服務會載入外部來源的 pipeline YAML，這是這版最該優先套用的部分

## Breaking Changes

- `exit_reason` 現在是 Agent `state_schema` 的保留欄位：
  - 若你原本自訂的 state schema 裡剛好也用了 `exit_reason` 這個 key，升級後會衝突
  - 影響範圍：在 `state_schema` 裡自訂過 `exit_reason` 欄位的專案
- `Agent.state_schema` 語意改變，現在只回傳使用者自訂的 schema，不再包含完整合併後的 schema：
  - 想拿完整 schema（使用者自訂 + 框架內建）要改用 `Agent.resolved_state_schema`
  - 影響範圍：任何讀取 `Agent.state_schema` 來檢查完整欄位清單的程式碼
- `OutputAdapter` / `ConditionalRouter` 若使用 Jinja `custom_filters`，現在必須明確傳入 `unsafe=True`：
  - 影響範圍：用自訂 Jinja filter 的 pipeline，升級後若沒加這個參數會直接噴錯
- `DocumentMAPEvaluator` 的評分演算法有調整，數值可能和舊版不同
- `PipelineSnapshot.pipeline_state.inputs` 的結構改變，直接讀這個欄位做序列化/快照比對的程式碼需要跟著調整
- `SentenceWindowRetriever` 現在會對 `window_size=0` 丟出驗證錯誤，不再靜默套用預設值

## 遷移指南

### 從 3.0.x 升級到 3.1.0

```bash
# Step 1: 更新依賴
pip install --upgrade haystack-ai==3.1.0
```

```python
# Step 2a: state_schema 語意改變 — 要拿完整 schema 改用 resolved_state_schema
# 舊寫法（3.0.x）
full_schema = agent.state_schema  # 內含使用者自訂 + 框架內建欄位

# 新寫法（3.1.0）
user_schema = agent.state_schema           # 現在只有使用者自訂的部分
full_schema = agent.resolved_state_schema  # 完整合併後的 schema
```

```python
# Step 2b: 用了 custom_filters 的 OutputAdapter / ConditionalRouter 要補 unsafe=True
# 舊寫法（3.0.x）
adapter = OutputAdapter(
    template="{{ value | my_custom_filter }}",
    output_type=str,
    custom_filters={"my_custom_filter": my_custom_filter},
)

# 新寫法（3.1.0）
adapter = OutputAdapter(
    template="{{ value | my_custom_filter }}",
    output_type=str,
    custom_filters={"my_custom_filter": my_custom_filter},
    unsafe=True,
)
```

若你的 `state_schema` 裡自訂過 `exit_reason` 欄位，升級前先改名，避免和框架保留欄位衝突。其餘變更（`DocumentMAPEvaluator` 評分、`PipelineSnapshot` 結構、`SentenceWindowRetriever` 驗證）只在你直接依賴這些行為時才需要調整，一般 pipeline 使用者可以直接升級。

## 與其他框架的對比觀察

`AgentTool`「把 Agent 包成 Tool、只暴露最終回覆」的設計，和 CrewAI 的階層式委派、LangGraph 把子圖包成節點的做法方向一致——都是想解決「多 Agent 協作時中間過程會污染主 context」的問題，只是介面選擇不同：Haystack 選擇讓 Agent 直接實作 Tool 介面，對已經用 Haystack pipeline 思維組系統的團隊來說接線成本最低。而這版同時修 RCE、同時加 context compaction，也反映一個趨勢：能載入外部 pipeline 定義（YAML/JSON）的框架，安全性和記憶體管理正在變成和「功能好不好用」同等重要的評估項目。

## 今日收穫

之前以為 context compaction 就是「訊息太多就砍舊的」這麼單純，這次看到 Haystack 把它拆成 Hook + 兩種 Compactor 才意識到，裁剪策略其實對應到不同的失敗模式：砍整段舊回合（`SlidingWindowCompactor`）適合「舊資訊真的不重要」的場景，但如果舊的工具呼叫結果裡藏著後面步驟還要引用的關鍵資料，砍整段反而會讓 Agent 忘記關鍵上下文——這時候該用的是保留摘要、只清空內容的 `ToolResultPruningCompactor`。裁剪策略選錯，不是效能問題，是正確性問題。

## 參考資料

- [Haystack v3.1.0 — GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.0.0 — GitHub Release（前一個穩定版）](https://github.com/deepset-ai/haystack/releases/tag/v3.0.0)
