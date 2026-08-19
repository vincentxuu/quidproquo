---
title: "Text-to-SQL Router：精確查詢不走 RAG"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, text-to-sql, sql, query-routing, structured-query]
lang: zh-TW
tldr: "「我今年完攀幾條」這種問題，RAG 語義搜尋永遠不如直接查資料庫。讓 LLM 識別意圖、提取參數，執行預定義 SQL 模板。"
description: "Text-to-SQL Router 的設計：模板型系統、LLM 意圖識別、參數提取、Hybrid SQL+RAG 模式，以及為什麼用模板而不是讓 LLM 自由生成 SQL。"
draft: false
series:
  name: "RAG 技法大全"
  order: 17
---

> 🌏 [English version](/posts/ai/2026-03-12-text-to-sql-router-en)

RAG 系統對「幾條」、「幾次」這種計數問題有個根本弱點：**語義搜尋找的是相似文件，不是統計事實**。

「我今年完攀幾條 5.10 以上的路線」這個問題，向量搜尋可能找到幾條關於完攀記錄的文件，然後 LLM 從文件中「估算」一個數字，這個數字通常是錯的。正確的答案在資料庫裡，一條 SQL 就能取到。

Text-to-SQL Router 在 Query Classification 之後攔截這類查詢，走另一條路：**識別 SQL 查詢意圖 → 提取參數 → 執行預定義模板 → 格式化回答**。

## 為什麼用模板而不是 LLM 自由生成 SQL

LLM 自由生成 SQL 有幾個問題：
1. **Schema 幻覺**：LLM 可能引用不存在的欄位
2. **SQL 注入風險**：使用者輸入直接進 SQL，需要嚴格清洗
3. **效能問題**：LLM 生成的 SQL 可能沒有利用索引
4. **一致性**：同樣的問題，LLM 每次生成的 SQL 可能不同

模板型系統更安全、更可控：

```typescript
const SQL_TEMPLATES = {
  COUNT_ROUTES_AT_CRAG: {
    template: `SELECT COUNT(*) as count FROM routes WHERE crag_id = ?`,
    params: ['crag_id'],
    responseTemplate: '{crag_name} 共有 {count} 條路線',
  },
  MY_ASCENT_COUNT: {
    template: `
      SELECT COUNT(*) as count FROM ascents
      WHERE user_id = ?
        AND grade_numeric >= ?
        AND created_at >= ?
    `,
    params: ['user_id', 'min_grade', 'start_date'],
    responseTemplate: '你在 {period} 內完攀了 {count} 條 {grade}+ 的路線',
  },
  // ... 20+ 模板
};
```

LLM 只負責識別使用哪個模板、提取填入哪些參數，不負責生成 SQL 本身。

框架提供的現成方案走的是另一條路。LlamaIndex 的 `NLSQLTableQueryEngine` 會把 table schema 塞進 prompt、讓 LLM 直接生出 SQL 並執行；它的官方文件自己就掛了一段警語，說執行任意 SQL 是資安風險，建議搭配唯讀資料庫、受限角色或沙箱。schema 很多時還得改用 `SQLTableRetrieverQueryEngine` 先檢索 table schema，否則 prompt 會爆掉。這條路彈性最大，代價是你得自己扛上面那串防護；查詢型態收斂、可窮舉的系統（像這裡的攀岩統計）用模板划算得多。用法與參數以[官方 Text-to-SQL 指南](https://developers.llamaindex.ai/python/examples/index_structs/struct_indices/sqlindexdemo/)為準。

## LLM 意圖識別

使用 Tool Calling 讓 LLM 選擇模板並提取參數：

```typescript
const tools = [{
  name: "execute_sql_query",
  parameters: {
    template_id: { enum: Object.keys(SQL_TEMPLATES) },
    params: {
      crag_id: "string?",
      min_grade: "number?",
      start_date: "string?",
      // ...
    }
  }
}];
```

Query Classifier 把查詢標記為 `sql` 時，Tool Selection step 同時填入 `sql_template_id`：

```
Q: 「龍洞有幾條 5.11 以上的路線」
→ query_type: 'sql'
→ sql_template_id: 'COUNT_ROUTES_AT_CRAG_BY_GRADE'
→ params: { crag_id: 'longtung', min_grade: 110 }
```

## 執行流程

```
query_type === 'sql'
    ↓
[SQL Template Engine]
    ├→ 執行模板 SQL
    ├→ 取得結果（數字 / 列表）
    └→ 格式化回答（輕量 LLM）
    ↓
早期 return（跳過整個 RAG pipeline）
```

SQL 查詢的回答不需要 LLM 推理，只需要把數字填入模板，用一個輕量的字串格式化 prompt 就能產出回答：

```
你今年（{year}年）在龍洞一共完攀了 {count} 條路線，
其中 5.11 以上的有 {advanced_count} 條。最近完攀的是 {latest_route}。
```

這樣的回答成本極低，準確度極高（數字來自資料庫）。

## Hybrid 模式：SQL + RAG

`query_type === 'hybrid'` 的場景更複雜：先用 SQL 取候選，再用 LLM 做語義推薦。

```
Q: 「推薦適合我目前程度的路線」

Step 1: 取使用者歷史最高完攀難度 → grade = 5.10b (grade_numeric = 102)
Step 2: SQL 查詢 grade_numeric 95-110 的未完攀路線（Top 20）
Step 3: 把 20 條路線當 context，用生成模型寫出推薦理由
```

SQL 確保候選的難度精確，LLM 負責個性化推薦敘述。兩者的優勢互補：SQL 的精確 + LLM 的語言能力。

## Fallback 策略

SQL 查無結果時，回退到 Complex RAG：

```typescript
if (sqlResults.length === 0) {
  ctx.queryType = 'complex';
  // 繼續走完整 RAG pipeline
}
```

例如：「龍洞有沒有 5.15 的路線」，SQL 查無，fallback 到 RAG，用語義搜尋找相近的資訊，回答「龍洞最難的路線是...」。

## 別拿 benchmark 分數當採購依據

Text-to-SQL 這個領域的 benchmark 分數要特別小心引用。Spider 1.0（2018）作為第一個大規模跨領域資料集仍是必讀的問題定義，但今天的評估重心已經移到更貼近真實企業場景的 [Spider 2.0](https://spider2-sql.github.io/)（真實 enterprise 工作流問題）與 [BIRD](https://bird-bench.github.io/)（強調資料內容、規模與執行效率）。

更關鍵的是：2026 年一份針對標註品質的實證研究指出，BIRD Mini-Dev 與 Spider 2.0-Snow 的標註錯誤率分別高達 52.8% 與 62.8%；把 BIRD Dev 子集修正後重跑 leaderboard 上 16 個開源 agent，相對表現變動介於 -7% 到 +31%，名次最多移動 9 位，而且修正前後的排名相關性從強相關掉到幾乎不相關（Spearman r 由 0.85 降到 0.32）。換句話說，**「某方法在 X benchmark 拿到 Y% execution accuracy」這種數字不足以決定你要不要採用它**，尤其不能拿來比較名次相近的兩個方法。

實務上的判準還是回到自己的資料：拿你系統真實會遇到的 20-50 個問題手寫正確 SQL 當回歸測試，比任何公開排行榜都有參考價值。

## 整體來說

Text-to-SQL Router 的本質是：**承認 LLM 的局限性，讓它做自己擅長的事**。LLM 很擅長意圖理解和自然語言生成，但不擅長精確計算。統計和計數交給資料庫，推理和表達交給 LLM，這個分工讓系統的準確度顯著提升。

模板型設計也比自由 SQL 生成安全得多——SQL 注入風險、Schema 幻覺、效能問題都在模板層面解決，LLM 只做參數提取，責任邊界清晰。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction](https://arxiv.org/abs/2304.11015)
- [Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task](https://arxiv.org/abs/1809.08887)
- [A Survey on Employing Large Language Models for Text-to-SQL Tasks](https://arxiv.org/abs/2407.15186)
- [Spider Benchmark: Yale Semantic Parsing and Text-to-SQL Challenge](https://yale-lily.github.io/spider)
- [Spider 2.0：企業級真實 text-to-SQL 工作流評測](https://spider2-sql.github.io/)
- [BIRD：大規模資料庫的 text-to-SQL 評測](https://bird-bench.github.io/)
- [Pervasive Annotation Errors Break Text-to-SQL Benchmarks and Leaderboards (2026)](https://arxiv.org/abs/2601.08778)
- [LlamaIndex Text-to-SQL 指南（NLSQLTableQueryEngine / SQLTableRetrieverQueryEngine）](https://developers.llamaindex.ai/python/examples/index_structs/struct_indices/sqlindexdemo/)
