---
title: "框架更新｜Haystack v3.4.0"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, framework, daily, haystack]
lang: zh-TW
description: "Haystack 3.4 新增實驗性的 ToolResultOffloadCompactor，讓長程 agent 做 context compaction 時把舊的工具呼叫結果卸載到外部儲存而不是丟掉或摘要；同版也把預設 embedding model 換掉、砍了 Python 3.10"
tldr: "Haystack v3.4.0 三個重點：(1) 新功能——實驗性 `ToolResultOffloadCompactor` 讓 `CompactionHook` 觸發時把舊工具呼叫結果寫進 `ToolResultStore` 只留參照，agent 可用專屬 read tool 隨需讀回完整內容，不是真的丟掉；(2) Breaking——`OpenAITextEmbedder` 等元件的預設 embedding model 從 `text-embedding-ada-002` 換成 `text-embedding-3-small`，舊語料的向量不相容，需要重新索引或手動指定舊模型；(3) Breaking——`ChatMessage.from_openai_dict_format` 現在對圖片 URL 參照、`file_id` 檔案參照等轉換不了的 content part 直接丟 `ValueError`，不再悄悄塞成一段文字；同版正式支援 Python 3.15、砍掉已到 EOL 的 Python 3.10。"
series:
  name: "AI Framework Changelog"
  order: 43
---

> 🌏 [English version](/posts/daily/2026-10-16-framework-haystack-3.4.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Haystack |
| 版本 | `v3.4.0` |
| 前一版 | `v3.3.0` |
| 發布日 | 2026-10-15 |
| Release Notes | [GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.7k |

## 這個版本為什麼重要

上一版 Haystack 3.3 在修 bug 和效能，這版補回一個真正的新能力：長程 agent 的 context compaction 不再只有「丟掉」或「摘要」兩個選項。`ToolResultOffloadCompactor` 觸發時把舊的工具呼叫結果整份寫進外部的 `ToolResultStore`，對話裡只留一個參照；agent 需要回頭看細節時，用一支讀取同一個 store 的 tool 就能把完整內容叫回來。等於把工具結果當成可以換頁的記憶體，而不是壓縮後就回不去的摘要——這對需要長時間跑、又得保留早期搜尋或檔案讀取完整結果以備查核的 agent（例如 deep research、程式碼審查）是直接可用的能力。同一版也動了兩個容易被忽略但影響面很廣的預設值：embedding model 從 `text-embedding-ada-002` 換成更便宜、分數更高的 `text-embedding-3-small`，以及 `ChatMessage.from_openai_dict_format` 對轉換不了的內容不再悄悄丟進文字裡而是直接報錯。兩者都是「之前意外能動，現在明確地不能動」的修正，已經在生產環境跑 Haystack 的團隊升級前得先盤點這兩個行為。

## 重要變更

- **`ToolResultOffloadCompactor`（實驗性）**：`CompactionHook` 的新策略，觸發 compaction 時把舊工具結果寫入 `ToolResultStore`（例如 `FileSystemToolResultStore`）並留下參照，agent 可用一支讀回工具按需取得完整內容 → 新跑的對話在 compaction 前不用付任何額外成本，只有真的觸發壓縮才卸載，長程 agent 不再被迫在「省 context」和「保留完整工具輸出」之間二選一
- **Agent 工具生命週期管理**：`Agent` 新增 `close()`／`close_async()` 釋放工具資源，並支援 `warm_up_async()` 非同步準備；直接呼叫 `tool.invoke()`／`invoke_async()` 時會自動觸發 warm-up → 自己寫工具或 `MCPToolset` 這類需要準備階段的 lazy toolset 時，不用再手動排 warm-up 時機
- **工具失敗可觀測性**：agent 呼叫工具失敗時，`haystack.agent.step.tool` tracing span 現在帶 `haystack.tool.error=True` 標籤（即使關掉 content tracing 也會設） → 失敗呼叫和正常回傳 `{"error": ...}` 的呼叫在 trace 裡不再混在一起，方便做告警規則
- **Python 3.15 支援／3.10 淘汰**：正式支援 Python 3.15，因 Python 3.10 已到 EOL 砍掉支援，最低版本升到 3.11
- **效能**：移除 `Sockets.__getattribute__` 的多餘 override 後，存取 `component.__haystack_input__.query` 這類 socket 屬性快了約 14 倍（原本的 override 每次都先丟一次又接住 `AttributeError`，從沒真的發揮作用）

## Breaking Changes

- `OpenAITextEmbedder`／`OpenAIDocumentEmbedder`／`AzureOpenAITextEmbedder`／`AzureOpenAIDocumentEmbedder` 預設 embedding model：
  - `text-embedding-ada-002` → `text-embedding-3-small`
  - 新模型每 token 成本約舊模型的五分之一，MTEB 分數也更高，但兩者產生的向量不相容
  - 影響範圍：已有向量庫的專案升級後若沿用預設值，新舊向量無法混用，需要重新索引既有語料，或明確傳 `model="text-embedding-ada-002"`（Azure 版對應 `azure_deployment`）維持舊行為
- `ChatMessage.from_openai_dict_format` 收緊內容轉換：
  - 圖片用 URL 參照（如 `https://example.com/image.png`，只有 base64 data URL 才支援）、用 `file_id` 參照的檔案、`input_audio` 等轉換不了的 content part，現在直接丟 `ValueError`
  - 舊版會把整個 content part 列表當成單一文字字串存起來，`to_openai_dict_format` 再原封不動送回去，所以轉送給 OpenAI 意外地能動
  - 影響範圍：用這條路徑轉送圖片 URL 或檔案參照給 OpenAI 的程式碼會直接噴錯；要繼續用 URL 傳圖片得自己下載後用 `ImageContent.from_url` 組訊息，檔案則改成 inline base64 `file_data`
- `FilterPolicy.MERGE` 行為修正：
  - 初始化與執行期的邏輯 filter 都用 `OR` 或 `NOT` 時，過去是把兩邊條件直接串接（等於取聯集，初始化設的限制形同虛設），現在改成用 `AND` 合併，兩邊限制都會生效
  - 影響範圍：依賴舊版「合併後範圍更寬」的呼叫者，需要自己建一個包含所有選項的單一 `OR` filter，搭配 `FilterPolicy.REPLACE` 傳入
- `Tool.warm_up()`／`Toolset.warm_up()` 的 base method 移除：
  - OpenAI／Azure Chat Generator 不再自動 warm up 工具；透過 `Agent` 使用工具不受影響
  - 影響範圍：手動準備工具（尤其是 `MCPToolset` 這類 lazy toolset）要改用 `warm_up_tools`／`warm_up_tools_async`
- Splitter 的 `page_number` 語意統一為「chunk 文字開始的那一頁」：
  - `RecursiveDocumentSplitter` 原本回報結束頁，現在跟 `DocumentSplitter`／`MarkdownHeaderSplitter` 一致回報起始頁；含分頁符號（`\f`）的語料，`page_number` 數值會跟舊版不同
  - 影響範圍：把 `page_number` 顯示給使用者或存進向量庫的專案，含分頁符號的文件需要重新索引才能拿到修正後的數值

## 遷移指南

### 從 3.3.x 升級到 3.4.0

```bash
pip install --upgrade haystack-ai==3.4.0
```

```python
# 若不想讓既有向量庫的向量失效，明確指定舊的 embedding model
from haystack.components.embedders import OpenAIDocumentEmbedder

# 舊版（3.3.x 之前）預設行為
embedder = OpenAIDocumentEmbedder()  # 3.4.0 起預設改用 text-embedding-3-small

# 維持舊行為：明確指定模型
embedder = OpenAIDocumentEmbedder(model="text-embedding-ada-002")
# 若要換成新模型享受更低成本與更高分數，語料需要全部重新 embedding 並重建索引
```

```python
# 用 URL 傳圖片給 OpenAI 的程式碼，升級後要改成自己下載再組訊息
from haystack.dataclasses import ChatMessage, ImageContent

# 舊寫法——content part 列表裡塞圖片 URL，舊版悄悄接受
# （新版 ChatMessage.from_openai_dict_format 會對這種 part 丟 ValueError）

# 新寫法——自己下載圖片組成 ImageContent（仍走 base64）
image = ImageContent.from_url("https://example.com/image.png")
message = ChatMessage.from_user(content_parts=["Describe this image", image])
```

含分頁符號語料若顯示或儲存 `page_number`，建議重新跑一次索引確認數值符合預期；其餘 bug fix（`SentenceWindowRetriever` 排序、`FilterError` 取代 `TypeError` 等）只在直接依賴這些元件既有行為時才需要調整。

## 與其他框架的對比觀察

同期的 Pydantic AI 在 v2.56.0 推出 `PGTaskDurability`，走的是「整個 agent session 可中斷重跑」的 durable execution 路線；Haystack 這版的 `ToolResultOffloadCompactor` 範圍窄得多，只處理單一 pipeline 裡「工具呼叫結果要不要留」的問題，不處理整個 agent 執行狀態的持久化。兩者加起來反映一個共同方向：context 管理正在從「要嘛全留、要嘛摘要後丟掉」演化成「分層決定哪些東西值得完整保留、哪些只要能隨需取回就好」，只是 Pydantic AI 做在 session 層，Haystack 做在工具結果層。

## 今日收穫

之前以為 context compaction 只有摘要和截斷兩種做法，摘要保留語意但失真、截斷乾脆丟資訊。看到 `ToolResultOffloadCompactor` 才意識到還有第三條路：把壓縮當成分頁（paging）問題而不是壓縮問題——舊內容不是被壓縮得更短，而是整份搬到別處、留一個隨時能換回來的參照。這跟作業系統的虛擬記憶體是同一個想法，只是換了個場景。

## 參考資料

- [Haystack v3.4.0 — GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.3.0 — 上一篇框架更新](/posts/daily/2026-10-02-framework-haystack-3.3.0)
- [Pydantic AI v2.56.0 — PGTaskDurability 對照](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0)
