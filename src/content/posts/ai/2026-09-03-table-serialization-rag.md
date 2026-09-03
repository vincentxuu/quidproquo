---
title: "Table Serialization：表格該怎麼轉成文字才能讓 RAG 找到"
date: 2026-09-03
type: deep-dive
category: ai
tags: [table-serialization, rag, structured-data, table-retrieval, embedding, chunking]
lang: zh-TW
tldr: "Markdown-KV 格式在 LLM 理解準確度上達 60.7%，比 CSV 的 44.3% 高出 16 個百分點。但檢索用途的最佳格式不同於 LLM 理解用途——metadata prepend + row-wise key-value 是目前表格 RAG 的最佳組合。"
description: "比較 Markdown Table、CSV、JSON、Key-Value、自然語言等表格序列化格式對 RAG 檢索和 LLM 理解的影響，整理 benchmark 數據和實務建議。"
draft: false
series:
  name: "RAG 技法大全"
  order: 52
---

> 🌏 [English version](/en/posts/ai/2026-09-03-table-serialization-rag-en)

表格是結構化資料，但 embedding model 吃的是文字。同一張表格用 Markdown、CSV、JSON、key-value 四種格式序列化，產出的向量會完全不同——而哪種格式讓 RAG 更容易找到正確的 row，目前已經有 benchmark 數據可以參考。

## 問題：格式選錯，embedding 就偏了

RAG pipeline 處理表格時，序列化格式至少影響三件事：

1. **embedding 品質**：格式決定 embedding model「看到」的文字。CSV 的 `100,200,300` 和 key-value 的 `價格: 100, 數量: 200, 總計: 300` 產出的向量差距很大——後者帶有語意，前者只是數字。
2. **token 消耗**：同樣的表格，HTML 用掉的 token 是 CSV 的 3 倍以上。在 chunk size 固定的情況下，格式越胖，能塞進一個 chunk 的 row 越少。
3. **LLM 理解能力**：即使 embedding 找到了正確的 chunk，LLM 讀 chunk 內容時，格式也會影響它能不能正確對應 header 和 value。

## 五種主要格式

### Markdown Table

```
| 產品 | 價格 | 庫存 |
|------|------|------|
| A    | 100  | 50   |
| B    | 200  | 30   |
```

最常見的格式，保留視覺結構。token 效率高（依 Improving Agents 的 benchmark，25,140 tokens 處理整個測試集），LLM 準確度 51.9%。缺點是 row 多的時候，模型容易把值對錯欄位——因為 header 只出現一次，距離遠的 row 需要模型「數格子」。

### CSV / TSV

```
產品,價格,庫存
A,100,50
B,200,30
```

最省 token，工具生態成熟。但缺點跟 Markdown Table 類似：header 只出現一次。依 Improving Agents 的測試，CSV 準確度 44.3%——在所有格式中墊底。Simon Willison 在 Hacker News 上的評論點出核心原因：「CSV 和普通 Markdown table 的問題是模型太容易把某一 row 的值對到錯誤的 header。」

### JSON / Key-Value

```json
{"產品": "A", "價格": 100, "庫存": 50}
{"產品": "B", "價格": 200, "庫存": 30}
```

每一 row 都帶完整的 key，不會有 header 對錯的問題。缺點是 token 消耗高——JSON 格式在測試中用了 66,396 tokens，是 Markdown Table 的 2.6 倍。JSON 準確度 52.3%。

### Markdown Key-Value（Markdown-KV）

```
## Record 1
產品: A
價格: 100
庫存: 50

## Record 2
產品: B
價格: 200
庫存: 30
```

每 row 獨立、key 重複出現、用 `##` 標題分隔記錄。依 Improving Agents 在 GPT-4.1-nano 上的 benchmark，**Markdown-KV 以 60.7% 準確度位居所有格式之首**，95% 信賴區間 57.6%–63.7%。token 用量 52,104——約為 JSON 的 78%。Simon Willison 認為這個結果合理：「顯式 key/value 格式加上 header 分隔，讓模型更不容易把值對錯欄位。」

### 自然語言

```
產品 A 的價格為 100 元，庫存有 50 件。
產品 B 的價格為 200 元，庫存有 30 件。
```

embedding 品質理論上最好（embedding model 本來就是為自然語言設計的），但 LLM 準確度只有 49.6%——比 Markdown Table 還低。原因是自然語言引入了歧義：「庫存有 50 件」可能被理解為「至少 50 件」還是「剛好 50 件」。token 消耗 43,411，介於中間。

## Benchmark 數據

### LLM 理解準確度（Improving Agents，GPT-4.1-nano）

| 格式 | 準確度 | 95% CI | Token 用量 |
|------|--------|--------|-----------|
| **Markdown-KV** | **60.7%** | 57.6%–63.7% | 52,104 |
| XML | 56.0% | 52.9%–59.0% | 76,114 |
| INI | 55.7% | 52.6%–58.8% | 48,100 |
| YAML | 54.7% | 51.6%–57.8% | 55,395 |
| HTML | 53.6% | 50.5%–56.7% | 75,204 |
| JSON | 52.3% | 49.2%–55.4% | 66,396 |
| Markdown Table | 51.9% | 48.8%–55.0% | 25,140 |
| 自然語言 | 49.6% | 46.5%–52.7% | 43,411 |
| CSV | 44.3% | — | — |

結論清楚：**key 重複出現的格式（Markdown-KV、XML、INI）普遍優於 header 只出現一次的格式（CSV、Markdown Table）**。

但這個 benchmark 測的是 LLM 理解準確度，不是 embedding 檢索品質。兩者的最佳格式不一定相同。

### 檢索品質（Table Serialization Kitchen + TARGET benchmark）

Gomm & Hulsebos（2025）在 ELLIS workshop 發表的研究「Metadata Matters in Dense Table Retrieval」用 TARGET benchmark 系統性測試了序列化參數對 dense retrieval 的影響。核心發現：

- **metadata（表格標題、來源）比序列化格式本身更重要**——有 metadata 的格式一致性地優於沒有的
- row-wise JSON 和 Markdown 在 retrieval 上差距不大，但加入 metadata prepend 後兩者都顯著提升
- row 數量的影響：部分抽樣（5-10 rows）有時比全表更好——因為 chunk 更集中

### TabRAG（NeurIPS 2025 AI4Tab）

依 Si et al. 的 TabRAG（arXiv:2511.06582），針對表格密集文件的 RAG pipeline，用「結構化語言表示」取代純文字序列化：保留 cell 座標、合併儲存格資訊、階層關係。在 TAT-DQA（金融文件）和 MP-DocVQA（多領域）上，比傳統序列化 pipeline 有顯著提升。

## 序列化 vs 切塊 vs 查詢

表格在 RAG 中的處理有三個獨立的決策點：

```
          序列化              切塊               查詢
  表格 ──────────→ 文字 ──────────→ chunks ──────────→ 結果
       格式選擇         STC / header     embed + retrieve
       (本文)           propagation       or Text2SQL
                        (chunking 文章)
```

- **序列化**決定格式（本文）：Markdown、JSON、key-value、自然語言
- **切塊**決定怎麼分段（見 [Chunking 策略](/posts/ai/2026-03-12-chunking-strategies)）：Table-Aware Chunking（STC）以 row 為最小單位，Header Propagation 把表頭 prepend 到每個 chunk
- **查詢**決定走哪條路（見 [Text-to-SQL Router](/posts/ai/2026-03-12-text-to-sql-router)）：表格夠結構化、有 schema 時，Text2SQL 直接下 SQL 比序列化 + RAG 精準得多。RAG 適合表格嵌在非結構化文件裡、沒有 DB 連線的場景

三者互相獨立但效果疊加。單改序列化格式就能提升 16 個百分點（CSV → Markdown-KV），再加 metadata prepend 和 header propagation 效果更好。

## 與 arXiv:2508.00217 Survey 的對照

arXiv:2508.00217（Tabular Data Understanding with LLMs，2025）是目前最全面的表格序列化 survey，涵蓋 serialization、visual representation、fine-tuning 三條路線。幾個值得注意的觀察：

- **格式敏感度**：LLM 對序列化格式的敏感度比預期高。同一張表格換格式，同一個模型的回答可能從對變錯
- **合併儲存格**：LaTeX 的 `\multicolumn` 能保留階層結構，但其他格式在序列化時會丟失這類關係
- **跨格式轉換**：未來研究方向之一是 serialization-to-serialization（例如 JSON → Markdown），訓練模型對格式的穩健性

## 實務建議

根據上述 benchmark 數據和研究：

**小表格（< 20 rows，能放進一個 chunk）**：
- 整張保留，不切。用 Markdown Table 格式——token 效率最高，結構完整
- 加 metadata prepend（檔案名稱 + 章節標題）

**大表格（> 20 rows，必須切塊）**：
- 用 row-wise key-value 格式（每 row 重複 key）
- 搭配 Header Propagation（每個 chunk 開頭 prepend 表頭）
- 加 metadata prepend（檔案名稱 + 章節標題 + 表格標題）

**有 schema、需要精確數值查詢**：
- 走 Text2SQL，不走序列化 + RAG

**模型夠強（GPT-4o / Claude 等級）時**：
- 依 Hacker News 的討論，模型越強格式影響越小——「用你負擔得起的最好模型，格式就不那麼重要了」
- 但在便宜模型或 embedding model 上，格式選擇仍然關鍵

## 整體來說

表格序列化是 RAG pipeline 中被低估的決策點。大部分系統預設用 Markdown Table 或 CSV——這剛好是 LLM 理解準確度最低的兩種格式。Markdown-KV（每 row 帶完整 key + `##` 分隔）在理解準確度上領先 16 個百分點，代價是 token 翻倍。

但格式不是唯一變數。Gomm & Hulsebos 的研究指出，metadata（表格標題、來源資訊）對檢索品質的影響甚至大於格式本身。最佳策略是三者疊加：選對格式 + prepend metadata + 搭配 Table-Aware Chunking。

## 參考資料

- [arXiv:2511.06582 — TabRAG: Tabular Document Retrieval via Structured Language Representations (NeurIPS 2025 AI4Tab)](https://arxiv.org/abs/2511.06582)
- [arXiv:2507.12425 — Advancing RAG for Structured Enterprise and Internal Data (2025)](https://arxiv.org/abs/2507.12425)
- [arXiv:2508.00217 — Tabular Data Understanding with LLMs: A Survey (2025)](https://arxiv.org/abs/2508.00217)
- [Gomm & Hulsebos — Metadata Matters in Dense Table Retrieval (ELLIS 2025)](https://ir.cwi.nl/pub/36085/36085.pdf)
- [Table Serialization Kitchen — 開源工具](https://daniel-gomm.github.io/blog/2025/Table-Serialization-Kitchen)
- [Improving Agents — Which Table Format Do LLMs Understand Best?](https://www.improvingagents.com/blog/toon-benchmarks)
- [KX — Mastering RAG: Precision Techniques for Table-Heavy Documents](https://kx.com/blog/mastering-rag-precision-techniques-for-table-heavy-documents)
- [Anyscale — Integrating RAG with Structured Data](https://docs.anyscale.com/rag/structured-data)
- [Chunking 策略](/posts/ai/2026-03-12-chunking-strategies) — 表格切塊（STC、Header Propagation）
- [Text-to-SQL Router](/posts/ai/2026-03-12-text-to-sql-router) — 精確查詢不走 RAG
- [ColPali：跳過 OCR 的文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval) — 視覺替代方案
