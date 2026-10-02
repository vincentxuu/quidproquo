---
title: "框架更新｜Haystack v3.3.0"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, framework, daily, haystack]
lang: zh-TW
description: "Haystack 3.3 修掉一個 anyio CVE、讓 SentenceWindowRetriever 查詢次數從每文件一次降到每次 run 一次，同時收緊 BM25 檢索與 top_k 驗證的行為——但既有語料重新索引後的切塊邊界會跟著變"
tldr: "Haystack v3.3.0 三個重點：(1) 資安——`anyio` 升級到 `>=4.14.2` 修補 CVE-2026-63374（GHSA-82r6-8w77-94w6），這個套件透過 `httpx`／`openai` 間接安裝，舊版有洞；(2) 效能——`SentenceWindowRetriever` 改成每次 `run`／`run_async` 只查一次 Document Store，不再每個檢索到的文件各查一次；(3) Breaking：BM25L／BM25Plus（預設）現在只回傳至少命中一個查詢詞的文件，可能讓檢索筆數變少；`top_k` 傳負數改成直接丟 `ValueError`；修掉引號句尾遺失空白的 bug 連帶讓含引號句子的語料重新索引後切塊邊界改變。"
series:
  name: "AI Framework Changelog"
  order: 31
---

> 🌏 [English version](/en/posts/daily/2026-10-02-framework-haystack-3.3.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Haystack |
| 版本 | `v3.3.0` |
| 前一版 | `v3.2.0` |
| 發布日 | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.6k |

## 這個版本為什麼重要

這版沒有新的 Agent 原語或記憶模組，重心全放在既有元件的正確性、效能和資安上。效能面，`SentenceWindowRetriever` 以前是每個檢索到的文件各查一次 Document Store，現在改成整次 `run` 只查一次，延遲和 Document Store 負載直接下降，輸出不變，等於免費升級。正確性面，BM25 檢索收緊到「至少命中一個查詢詞才算數」，之前完全不相關的文件也可能拿到正分數、擠進 `top_k`；`top_k` 傳負數以前會被當成負數切片悄悄砍掉最後幾筆結果，現在直接丟錯讓你知道傳錯了。資安面則是補了一個透過 `httpx`／`openai` 間接安裝進來的 `anyio` CVE。這些都不是會讓人興奮的新功能，但對已經在生產環境跑 Haystack pipeline 的團隊來說，是那種「這版該優先升級」的維護版本——尤其是用分數門檻過濾檢索結果、或對含引號句子的語料做過索引的專案，升級後行為會不一樣。

## 重要變更

- **`SentenceWindowRetriever` 查詢次數下降**：每次 `run`／`run_async` 改成只查一次 Document Store，不再每個檢索到的文件各查一次 → 輸出不變，但延遲和 Document Store 負載都降低，不用改程式碼就吃到效能提升
- **`anyio` CVE 修補（資安）**：要求 `anyio>=4.14.2`，修補 CVE-2026-63374（GHSA-82r6-8w77-94w6），這個套件是透過 `httpx`／`openai` 間接安裝進來的 → 多數專案不會直接依賴 `anyio`，但升級 Haystack 會順便把這條間接依賴鏈的漏洞堵上
- **CJK 分詞修正**：`InMemoryDocumentStore` 的 BM25 分詞現在把中日韓字元切成單字元 token，並在分詞前做 NFC normalization → 查單一詞彙時能正確匹配長串無空格文字裡的字詞，組合式與分解式拼寫（如全形／半形、不同編碼正規化形式）也會產生相同 token，對中文語料的檢索準度是直接的改善
- **`TextCleaner` 輸入驗證**：`texts` 不是 list 或其中元素不是 `str` 時，現在丟出明確的 `TypeError`，不會等到更後面才失敗或產生意外結果 → 排查 pipeline 設定錯誤更快
- **多項 Hook／Pipeline bug fix**：`ChatPromptBuilder` 不再因為 template 是 `ChatMessage` 列表而遺失除了第一個 `TextContent` 以外的內容；`CompactionHook.close()`／`close_async()` 現在會釋放 token counter（例如 `OpenAITokenCounter` 的 HTTP client）的資源；`ConfirmationHook` 改寫對話歷史時不再遺失最後一則使用者／工具訊息之後的訊息

## Breaking Changes

- BM25 檢索行為收緊：
  - `InMemoryDocumentStore.bm25_retrieval` 與 `InMemoryBM25Retriever` 搭配預設的 `BM25L`（或 `BM25Plus`）現在只回傳至少命中一個查詢詞的文件
  - 舊版完全不含查詢詞的文件也可能拿到正分數並填滿 `top_k`；新版這些文件不會再出現，檢索筆數可能變少，甚至回傳 0 筆
  - `delta` 下界現在只套用在文件實際包含的查詢詞上（符合 BM25L／BM25+ 原始定義），分數整體會比舊版低
  - 影響範圍：用固定分數門檻過濾檢索結果的 pipeline，升級後門檻需要重新檢查；`BM25Okapi` 不受影響
- `top_k` 驗證收緊：
  - `InMemoryBM25Retriever`／`InMemoryEmbeddingRetriever`／`MultiRetriever`（`top_k`、`top_k_per_retriever`）執行期傳入負數現在直接丟 `ValueError`
  - 舊版會把負數當成負數切片套用，悄悄砍掉最後幾筆文件而不報錯；`MultiRetriever` 初始化時現在也會驗證這兩個參數必須 `>0`
  - 影響範圍：依賴舊版「負數 top_k 靜默生效」行為的程式碼會直接噴錯
- `SentenceSplitter` 遺失空白字元的 bug 修正：
  - 句子以引號結尾時（如 `He said "Hi." Bye.`），舊版會弄丟句子之間的空白，並讓後續每個 chunk 的 `split_idx_start` offset 跟著位移，導致 chunk 對不回原文
  - 影響範圍：`DocumentSplitter`、`RecursiveDocumentSplitter`、`MarkdownHeaderSplitter`、`EmbeddingBasedDocumentSplitter` 等所有走句子切分的元件；含引號句子的語料重新索引後，chunk 邊界會跟舊版不同

## 遷移指南

### 從 3.2.x 升級到 3.3.0

```bash
pip install --upgrade haystack-ai==3.3.0
```

```python
# 用分數門檻過濾 BM25 檢索結果的話，升級後重新檢查門檻數值
# 舊版：不含查詢詞的文件也可能有正分數，門檻可能設得比較寬鬆
results = retriever.run(query="...", filters={"score_threshold": 0.3})
# 新版分數整體偏低（不相關文件不再被計分），門檻可能要往下調，
# 否則符合條件的文件反而會被篩掉
```

```python
# 若程式碼依賴負數 top_k 的舊行為（悄悄丟棄最後幾筆），改成正確表達意圖
# 舊寫法 —— top_k=-2 曾經被當成切片用（丟掉最後 2 筆）
retriever.run(query="...", top_k=-2)

# 新寫法 —— 明確算出想要的筆數，負數會直接丟 ValueError
desired = max(len(all_docs) - 2, 0)
retriever.run(query="...", top_k=desired)
```

含引號句尾的語料如果用句子切分器且有既有索引比對流程，升級後建議重新跑一次索引，確認 chunk 邊界符合預期。其餘 bug fix（`ChatPromptBuilder`、`CompactionHook`、`ConfirmationHook` 等）只在你直接依賴這些元件的既有行為時才需要調整。

## 與其他框架的對比觀察

同一天發布的 Agno 3.1 走的是「加新的平台層能力」（RBAC、原生檔案系統），Haystack 3.3 則完全相反——沒有新 Agent 原語，純粹在既有 pipeline 元件上修正確性、效能和資安。這呼應 Haystack 一貫的定位：把自己當成「模組化管線框架」而不是「開箱即用的 Agent 平台」，穩健性和可預測性優先於功能堆疊速度。對已經把 Haystack pipeline 跑在生產環境、語料又以中文為主的團隊來說，這次的 CJK 分詞修正價值不亞於效能或資安項目。

## 今日收穫

之前以為中日韓文字的分詞問題早就該被解決了，畢竟 Haystack 已經是成熟的生產框架；看到這版還在修「CJK 字元沒有逐字切 token」、「組合式與分解式拼寫產生不同 token」這類問題才意識到，多語言檢索的分詞正確性不是寫一次就完工的功能，而是會隨著語料和使用場景持續冒出邊界案例的工程債——尤其容易被以英文為主要測試語料的框架忽略。

## 參考資料

- [Haystack v3.3.0 — GitHub Release](https://github.com/deepset-ai/haystack/releases/tag/v3.3.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.1.0 — 上一篇框架更新](/posts/daily/2026-08-26-framework-haystack-3.1.0)
- [CVE-2026-63374 / GHSA-82r6-8w77-94w6 — anyio security advisory](https://github.com/advisories/GHSA-82r6-8w77-94w6)
