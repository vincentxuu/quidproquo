---
title: "Text-to-SQL Router：精確查詢不走 RAG"
date: 2026-03-12
category: ai
tags: [rag, text-to-sql, sql, query-routing, structured-query]
lang: zh-TW
tldr: "「我今年完攀幾條」這種問題，RAG 語義搜尋永遠不如直接查資料庫。讓 LLM 識別意圖、提取參數，執行預定義 SQL 模板。"
description: "Text-to-SQL Router 的設計：模板型系統、LLM 意圖識別、參數提取、Hybrid SQL+RAG 模式，以及為什麼用模板而不是讓 LLM 自由生成 SQL。"
draft: false
---

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

Step 1: 取用戶歷史最高完攀難度 → grade = 5.10b (grade_numeric = 102)
Step 2: SQL 查詢 grade_numeric 95-110 的未完攀路線（Top 20）
Step 3: 把 20 條路線當 context，用 Gemma 生成推薦理由
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

## 整體來說

Text-to-SQL Router 的本質是：**承認 LLM 的局限性，讓它做自己擅長的事**。LLM 很擅長意圖理解和自然語言生成，但不擅長精確計算。統計和計數交給資料庫，推理和表達交給 LLM，這個分工讓系統的準確度顯著提升。

模板型設計也比自由 SQL 生成安全得多——SQL 注入風險、Schema 幻覺、效能問題都在模板層面解決，LLM 只做參數提取，責任邊界清晰。
