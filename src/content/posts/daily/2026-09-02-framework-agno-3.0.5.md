---
title: "框架更新｜Agno 3.0.5"
date: 2026-09-02
category: daily
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.0.5 讓 Knowledge 的向量嵌入失敗從『默默回報成功』改成『誠實回報失敗』，是一次修正資料完整性契約的版本"
tldr: "Agno 3.0.5 三個重點：(1) Knowledge ingestion 的嵌入失敗不再被吞掉——completed 狀態新增 partial 分支，embedder 直接拋 EmbeddingError 而不是回傳空向量；(2) Breaking：捕捉 ModelProviderError 攔截 Bedrock 嵌入失敗的舊程式碼會失效，要改抓 EmbeddingError，content status API 對不存在的內容改回 404；(3) 新增 embedding 重試開關、GandrTools 語音工具與 llmman model provider，並用 embed_before_replace 防止重新嵌入失敗時把舊資料一起刪光。"
series:
  name: "AI Framework Changelog"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-09-02-framework-agno-3.0.5-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.0.5 |
| 前一版 | v3.0.4 |
| 發布日 | 2026-09-01 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.5) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.0k |

## 這個版本為什麼重要

[上一篇（3.0.2）](/posts/daily/2026-08-31-framework-agno-3.0.2)講的是 Agno 怎麼把自己的 Agent／Team／Toolkit 發佈成 MCP tool，這次 3.0.5 回頭修的是更底層的東西：Knowledge（RAG）的資料完整性契約。過去 Agno 的 ingestion 有個危險的預設行為——某個 chunk 嵌入失敗，整份內容照樣可能被標成 `completed`，你要等到查詢時發現漏答案，才會意識到當初的索引根本沒做完。3.0.5 把這件事攤開：嵌入失敗會被誠實回報，`ContentStatus` 多一個 `partial` 狀態代表「部分索引、可搜尋但不完整」，embedder 失敗時直接拋例外而不是悄悄回傳空結果。對任何把 Knowledge 的 `completed` 狀態當作「這份資料已經可以信任」的下游邏輯來說，這版之前的行為其實一直是在說謊。

## 重要變更

- **`partial` 內容狀態**：新增 `ContentStatus.PARTIAL`，代表一份內容裡有些 chunk 嵌入成功、有些失敗——這種內容可搜尋，但不完整，不再被硬塞進 `completed` 或 `failed` 兩個極端 → 下游邏輯可以針對「部分索引」單獨處理，例如提示使用者重跑或標記待補
- **選用的嵌入重試**（預設關閉）：`Knowledge(max_embedding_retries=3, embedding_retry_backoff=1.0)` 可以在單一 chunk 嵌入失敗時自動重試 → 認證失敗會忽略重試設定直接判定失敗（同一組憑證重試也不會過），且每次重試會整份文件重新嵌入，不是只重跑失敗的 chunk，需要評估成本
- **`GandrTools` 文字轉語音工具**：新增對 Gandr TTS API 的整合 → 多一個內建語音輸出選項，不用自己包 API wrapper
- **`llmman` model provider**：新增模型供應商整合 → 多一個可選的推論後端
- **可執行的失敗訊息**：嵌入失敗訊息現在會列出 chunk 數量、用的 embedder、失敗原因和建議的修復步驟，取代過去籠統的「Could not insert embedding」→ 排查失敗不用再自己反推是哪個環節掛掉
- **`embed_before_replace` 防呆機制**：重新 ingestion 時，新內容會先完成嵌入才刪除舊內容，失敗會在刪除發生前中止 → 修掉一個潛在資料災難：過去若重新嵌入失敗，文件可能被清空成零 chunk，現在失敗至少不會比原本更糟
- **`MCPTools` 支援直接傳靜態 `headers=`**：連線時的驗證 header 可以直接掛在 `url=` 路徑上，不用再另外組 `StreamableHTTPClientParams` → Streamable HTTP／SSE 的驗證設定寫起來更短

## Breaking Changes

- **嵌入失敗從『回傳空結果』改成『拋例外』**：`ContentStatus` API（`/openapi.json`）從 `["processing","completed","failed"]` 變成 `["processing","completed","partial","failed"]`；直接呼叫向量 DB 的 `search()` 現在失敗會拋錯而不是回傳 `[]`（`Knowledge.search()` 本身行為不變，仍回傳無結果）
  - 影響範圍：任何把「空搜尋結果」和「後端出錯」當同一件事處理的程式碼，需要另外接住例外；資料庫層不需要 schema migration（status 欄位本來就是 `varchar`）
- **AWS Bedrock 嵌入失敗改拋 `EmbeddingError`，不再是 `ModelProviderError`**：舊的 `except ModelProviderError` 攔截區塊會直接失效，錯誤會穿透上去
  - 影響範圍：任何圍著 Bedrock 嵌入呼叫寫 `except ModelProviderError` 的專案，需要改成 `except EmbeddingError`
- **`GET /knowledge/content/{id}/status` 對不存在或非本人擁有的內容改回 404**：過去回傳 200 加 `status: "failed"`，容易被誤判成「這筆內容存在但嵌入失敗」
  - 影響範圍：依賴這支 API 判斷內容是否存在的前端或整合程式碼，需要把 404 視為「內容不存在」而不是「嵌入失敗」
- **`skip_if_exists=True` 不再跳過 `failed`／`partial` 狀態的內容**：只有真正 `completed` 的內容才會被跳過，`failed` 或 `partial` 會被重新嵌入
  - 影響範圍：依賴 `skip_if_exists` 做冪等 ingestion 的批次流程，重跑時間可能變長（但正確性提升——過去半途而廢的內容不會再被誤判為已完成）

## 遷移指南

### 從 3.0.4 升級到 3.0.5

```bash
pip install --upgrade agno==3.0.5
```

Bedrock 嵌入的例外處理需要改型別：

```python
# 舊寫法（3.0.4 及之前）
from agno.exceptions import ModelProviderError

try:
    embedder.get_embedding(text)
except ModelProviderError:
    handle_embedding_failure()

# 新寫法（3.0.5，Bedrock 嵌入失敗）
from agno.exceptions import EmbeddingError

try:
    embedder.get_embedding(text)
except EmbeddingError:
    handle_embedding_failure()
```

處理新的 `partial` 狀態：

```python
from agno.knowledge.types import ContentStatus

content = knowledge.get_content(content_id)
if content.status == ContentStatus.PARTIAL:
    # 部分 chunk 索引失敗，可搜尋但不完整
    notify_incomplete_ingestion(content_id)
elif content.status == ContentStatus.COMPLETED:
    mark_ready(content_id)
```

需要自動重試的 ingestion，開啟重試但注意成本（每次重試是整份文件重新嵌入）：

```python
knowledge = Knowledge(
    max_embedding_retries=3,
    embedding_retry_backoff=1.0,
)
```

## 與其他框架的對比觀察

同系列前一篇提到的 Haystack v3.1.0 解的是 Agent 對話「上下文太長」的問題（CompactionHook），Agno 3.0.5 解的是 Knowledge ingestion「資料看起來完整、其實不完整」的問題——兩者都屬於「Agent 系統裡不會馬上噴錯、卻會悄悄侵蝕正確性」的一類 bug。比起加新功能，這類「讓失敗誠實」的修正在框架成熟度上更關鍵：一個 RAG pipeline 值不值得信任，不是看它平常跑得順不順，而是看它出錯的時候會不會老實告訴你。

## 今日收穫

之前以為 RAG 系統的正確性問題主要出在檢索排序或 chunk 切分策略，看到 Agno 這次修的「嵌入失敗被吞掉、狀態卻顯示 completed」才意識到，更根本的風險其實在管線更前面：如果 ingestion 階段的失敗狀態本身不可信，後面所有基於「這份知識庫已完整索引」的假設都會建立在錯誤的地基上。評估一個 Agent 框架的 Knowledge／RAG 模組，除了看檢索品質，也該先確認它的失敗狀態是不是誠實的。

## 參考資料

- [Agno v3.0.5 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.5)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.4 — GitHub Release（前一版）](https://github.com/agno-agi/agno/releases/tag/v3.0.4)
- [Agno 3.0.2 — 上一篇框架更新](/posts/daily/2026-08-31-framework-agno-3.0.2)
