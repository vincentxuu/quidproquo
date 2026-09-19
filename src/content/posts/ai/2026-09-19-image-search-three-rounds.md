---
title: "找不到那張蟲害照片：Image Search 的三輪修正"
date: 2026-09-19
category: ai
type: debug
tags: [rag, image-search, elasticsearch, cjk, agent-tools, debugging]
lang: zh-TW
tldr: "AI 助理平台的圖片搜尋連續三輪修正：第一輪把 node_type 過濾推進 ES query 解決文字 chunk 搶佔問題；第二輪讓 filename 匹配不再依賴 LLM 是否傳參數；第三輪從 Postgres icontains 換成 ES match 解決 CJK 部分匹配失效。"
description: "記錄一次 RAG 圖片檢索從「搜不到」到「搜得準」的三輪除錯過程，涵蓋 Elasticsearch 過濾策略、LLM 工具參數設計、CJK 分詞匹配。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-image-search-three-rounds-en)

## TL;DR

某政府農業機構用我們的 AI 助理平台查蟲害照片，結果不是搜不到，就是搜到錯的物種。三輪修正，每一輪都以為修好了，結果下一輪才發現真正的問題藏得更深：文字 chunk 搶佔 top-k → LLM 不一定會傳 `file_name` 參數 → [Postgres](https://www.postgresql.org/docs/current/functions-matching.html) 的 `icontains` 對中日韓文的部分匹配根本不可靠。

## 情境

平台的知識庫支援文字和圖片兩種節點（node）。使用者上傳農業病蟲害的圖鑑——每張圖片有檔名（如 `黃吹綿介殼蟲-無-生態圖-a4901.jpg`）和描述文字。當使用者問「黃吹綿介殼蟲的圖片」，agent 會呼叫 `image_search` tool，從 [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) 檢索相關圖片節點。

理論上很直覺。實際上，連續三週收到客戶回報：搜不到圖、搜到錯的圖、或者根本沒回傳圖片。

## 第一輪：文字 chunk 搶佔 top-k

### 問題

`image_search` 回傳的結果裡混進大量文字節點。使用者問的是圖片，但 top-k 的位子被文字 chunk 佔滿了。

### 排查

查 ES query，發現 `image_search` tool 跟 `retrieve_text_nodes` 用的是同一個底層檢索函式。差別只在事後過濾——先從 ES 拿回 top-k 結果，再在 Python 裡 `filter(node_type == 'image')`。

問題是：如果 top-k 設為 12，而其中 10 筆是文字、2 筆是圖片，最終只剩 2 張圖。更糟的情況，12 筆全是文字，圖片直接消失。

### 根因

node_type 的過濾發生在 ES 查詢**之後**，而不是**之內**。ES 不知道你只要圖片，它按相關度排序時自然會把高度匹配的文字 chunk 排在前面。

### 修法

把 `node_type` 過濾條件推進 [ES query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) 的 `filter` clause：

```python
# Before: post-filter in Python
results = es_search(query, top_k=12)
images = [r for r in results if r.node_type == "image"]

# After: filter inside ES query
results = es_search(
    query,
    top_k=12,
    filters=[{"term": {"node_type": "image"}}]
)
```

12 個位子全部留給圖片節點。

### 以為修好了

測試環境驗證通過。客戶反映「搜得到圖了」。但兩天後，又收到回報：「有些蟲的照片還是出不來。」

---

## 第二輪：LLM 不一定會傳你設計的參數

### 問題

`image_search` tool 有一個 optional 參數 `file_name`，讓 LLM 可以傳入精確的檔名來做 exact match。設計意圖是：如果使用者明確指定了某張圖，用檔名直接撈比語意搜尋更準。

但觀察線上 agent 的 tool call 記錄，發現 LLM **大多數時候不會傳 `file_name`**。即使使用者的問句裡包含了足夠的資訊可以推斷檔名。

### 排查

追蹤 tool schema，`file_name` 標記為 optional。在 LLM 的決策邏輯裡，optional 就是「可傳可不傳」。模型有時會傳，有時不會——取決於 prompt 的措辭和 context 長度。

更深的問題：即使 LLM 傳了 `file_name`，匹配邏輯也不穩定。程式碼裡的判斷是 `if file_name:`，所以當 LLM 沒傳時，整個 filename matching 路徑被跳過，直接走純語意搜尋。

### 根因

**把關鍵的檢索策略交給 LLM 的 optional 參數決定**，等於讓檢索品質依賴 LLM 的 tool call 行為——而這個行為是不確定的。

### 修法

改成 deterministic：不管 LLM 有沒有傳 `file_name`，都從使用者的原始 query 自動偵測可能的檔名模式，然後同時走兩條路（語意搜尋 + 檔名匹配），合併結果：

```python
def image_search(query: str, file_name: str | None = None):
    # 不再完全依賴 LLM 傳 file_name
    detected_name = auto_detect_filename(query) or file_name

    # 兩條路並行
    semantic_results = es_semantic_search(query, node_type="image")
    exact_results = (
        filename_match(detected_name) if detected_name else []
    )
    return merge_and_deduplicate(exact_results, semantic_results)
```

### 以為修好了

搜得到的圖片數量明顯增加。但客戶很快又回報：「搜『黃吹綿介殼蟲圖片』，照片還是沒出來，但搜『黃吹綿介殼蟲』就有。」

差一個「圖片」兩個字，結果完全不同。

---

## 第三輪：CJK 的 substring 匹配不是你想的那樣

### 問題

使用者搜尋「黃吹綿介殼蟲圖片」，知識庫裡的檔名是 `黃吹綿介殼蟲-無-生態圖-a4901.jpg`。

直覺上，「黃吹綿介殼蟲」是檔名的一部分，應該匹配得到。但實際上搜不到。

### 排查

filename matching 用的是 [Postgres](https://www.postgresql.org/docs/current/functions-matching.html) 的 `icontains`（Django ORM 的 `__icontains`），它底層是 SQL 的 `LIKE '%...%'`：

```sql
SELECT * FROM nodes
WHERE filename ILIKE '%黃吹綿介殼蟲圖片%'
```

問題在於：使用者輸入的是 `黃吹綿介殼蟲圖片`（含「圖片」二字），但檔名裡沒有「圖片」——它是 `黃吹綿介殼蟲-無-生態圖-a4901.jpg`。`ILIKE` 做的是**精確子字串匹配**，不是模糊匹配。「黃吹綿介殼蟲圖片」不是檔名的子字串，所以搜不到。

但如果用 [Elasticsearch 的 `match` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)，它會先經過分詞器（analyzer）把查詢拆成 tokens：`黃吹綿` `介殼蟲` `圖片`。然後用這些 tokens 去匹配檔名的 tokens：`黃吹綿` `介殼蟲` `無` `生態圖` `a4901`。部分匹配就有分數，不需要整段子字串完全吻合。

### 根因

**Postgres 的 `ILIKE` 做的是位元組層級的子字串搜尋，不理解 CJK 的詞彙邊界。** 對英文來說，`icontains` 通常夠用——空格天然分詞。但中文沒有空格，「黃吹綿介殼蟲圖片」跟「黃吹綿介殼蟲-無-生態圖」在位元組層級沒有包含關係。

### 修法

把 filename matching 從 Postgres `icontains` 換成 [ES `match` query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)，利用 CJK 分詞器（如 [ICU analyzer](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html) 或 [smartcn](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html)）處理中文：

```python
# Before: Postgres icontains (byte-level substring)
nodes = Node.objects.filter(filename__icontains=query)

# After: ES match with CJK analyzer
results = es_client.search(
    index="knowledge_nodes",
    body={
        "query": {
            "bool": {
                "must": [
                    {"match": {"filename": query}},
                    {"term": {"node_type": "image"}}
                ]
            }
        }
    }
)
```

搜「黃吹綿介殼蟲圖片」→ 分詞成 `黃吹綿` `介殼蟲` `圖片` → 匹配到 `黃吹綿介殼蟲-無-生態圖-a4901.jpg`（前兩個 token 命中）→ 有分數，回傳。

## 為什麼會這樣

三輪修正，每一輪的根因在不同層級：

| 輪次 | 層級 | 根因 |
|---|---|---|
| 1 | ES query 設計 | `node_type` 過濾放錯位置，文字 chunk 搶佔圖片的 top-k 配額 |
| 2 | LLM tool 參數設計 | 把檢索策略交給 optional 參數，LLM 不一定會傳 |
| 3 | 資料庫匹配策略 | Postgres `icontains` 不理解 CJK 詞彙邊界，ES `match` + 分詞器才行 |

看起來是三個獨立的 bug，但它們有共同的設計盲點：**把「搜尋」當成一個原子操作，忽略了每一層（ES query → LLM 決策 → 字串匹配）都有自己的假設和限制。**

## 學到的事

1. **過濾要在資料庫層做，不要事後在程式碼裡篩。** ES 的 `filter` clause 跟 Python 的 list comprehension 結果不同——前者影響 top-k 的組成，後者只是砍結果。
2. **不要假設 LLM 一定會填你設計的 optional 參數。** 如果某個參數對結果品質至關重要，要嘛改成 required，要嘛在後端自動偵測，不要留給模型「可填可不填」。
3. **CJK 文字的匹配不能用英文世界的 substring 邏輯。** 沒有空格天然分詞，`ILIKE '%..%'` 在中文場景會嚴重漏搜。用 ES 的全文搜尋 + CJK 分詞器是正途。

## 參考資料

- [Elasticsearch Bool Query — filter clause](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) — 把過濾條件推進 ES query 的做法
- [Elasticsearch Match Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html) — 全文搜尋的基礎 query type
- [Elasticsearch ICU Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html) — CJK 分詞器
- [Elasticsearch Smart Chinese Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html) — 中文分詞器
- [PostgreSQL Pattern Matching — LIKE](https://www.postgresql.org/docs/current/functions-matching.html) — `ILIKE` 的底層行為
