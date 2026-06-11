---
title: "Text-to-SQL Router: Precise Queries That Skip RAG"
date: 2026-03-12
type: guide
category: ai
tags: [rag, text-to-sql, sql, query-routing, structured-query]
lang: en
tldr: "Questions like 'how many routes did I complete this year' will never be answered well by RAG semantic search — querying the database directly is far more accurate. Let the LLM identify intent, extract parameters, and execute predefined SQL templates."
description: "Designing a Text-to-SQL Router: template-based systems, LLM intent recognition, parameter extraction, Hybrid SQL+RAG mode, and why templates beat free-form LLM-generated SQL."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-text-to-sql-router)

RAG systems have a fundamental weakness when it comes to counting questions like "how many" or "how often": **semantic search finds similar documents, not statistical facts**.

For a question like "how many 5.10+ routes did I complete this year," vector search might find a few documents about ascent records, then the LLM "estimates" a number from those documents — and that number is usually wrong. The correct answer lives in the database, retrievable with a single SQL query.

The Text-to-SQL Router intercepts these queries after Query Classification and takes a different path: **identify SQL query intent → extract parameters → execute predefined template → format response**.

## Why Templates Instead of Free-Form LLM-Generated SQL

Free-form SQL generation by LLMs has several problems:
1. **Schema hallucination**: The LLM may reference non-existent columns
2. **SQL injection risk**: User input goes directly into SQL, requiring strict sanitization
3. **Performance issues**: LLM-generated SQL may not leverage indexes
4. **Inconsistency**: The same question may produce different SQL each time

A template-based system is safer and more controllable:

```typescript
const SQL_TEMPLATES = {
  COUNT_ROUTES_AT_CRAG: {
    template: `SELECT COUNT(*) as count FROM routes WHERE crag_id = ?`,
    params: ['crag_id'],
    responseTemplate: '{crag_name} has {count} routes in total',
  },
  MY_ASCENT_COUNT: {
    template: `
      SELECT COUNT(*) as count FROM ascents
      WHERE user_id = ?
        AND grade_numeric >= ?
        AND created_at >= ?
    `,
    params: ['user_id', 'min_grade', 'start_date'],
    responseTemplate: 'You completed {count} routes graded {grade}+ in {period}',
  },
  // ... 20+ templates
};
```

The LLM is only responsible for identifying which template to use and extracting the parameters to fill in — it does not generate the SQL itself.

## LLM Intent Recognition

Tool Calling lets the LLM select a template and extract parameters:

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

When the Query Classifier labels a query as `sql`, the Tool Selection step simultaneously fills in the `sql_template_id`:

```
Q: "How many routes at Longdong are graded 5.11 or above?"
→ query_type: 'sql'
→ sql_template_id: 'COUNT_ROUTES_AT_CRAG_BY_GRADE'
→ params: { crag_id: 'longtung', min_grade: 110 }
```

## Execution Flow

```
query_type === 'sql'
    ↓
[SQL Template Engine]
    ├→ Execute template SQL
    ├→ Retrieve results (number / list)
    └→ Format response (lightweight LLM)
    ↓
Early return (skip entire RAG pipeline)
```

SQL query responses don't need LLM reasoning — they just need numbers plugged into a template. A lightweight string-formatting prompt is enough to produce the answer:

```
This year ({year}), you completed a total of {count} routes at Longdong,
including {advanced_count} graded 5.11 or above. Your most recent ascent was {latest_route}.
```

This kind of response is extremely cheap to produce and highly accurate (the numbers come straight from the database).

## Hybrid Mode: SQL + RAG

The `query_type === 'hybrid'` scenario is more complex: first use SQL to get candidates, then use the LLM for semantic recommendations.

```
Q: "Recommend routes that match my current level"

Step 1: Retrieve user's historical highest ascent grade → grade = 5.10b (grade_numeric = 102)
Step 2: SQL query for unascended routes with grade_numeric 95-110 (Top 20)
Step 3: Pass 20 routes as context, use Gemma to generate recommendation reasoning
```

SQL ensures candidate difficulty is precise; the LLM handles personalized recommendation narratives. The two complement each other: SQL's precision + LLM's language capabilities.

## Fallback Strategy

When SQL returns no results, fall back to Complex RAG:

```typescript
if (sqlResults.length === 0) {
  ctx.queryType = 'complex';
  // Continue through the full RAG pipeline
}
```

For example: "Are there any 5.15 routes at Longdong?" — SQL returns nothing, so we fall back to RAG, use semantic search to find related information, and respond with "The hardest route at Longdong is..."

## Overall Takeaway

The essence of the Text-to-SQL Router is: **acknowledge the LLM's limitations and let it do what it's good at**. LLMs excel at intent understanding and natural language generation, but they're poor at precise calculations. Hand counting and statistics to the database, reasoning and expression to the LLM — this division of labor significantly improves system accuracy.

The template-based design is also far safer than free-form SQL generation — SQL injection risk, schema hallucination, and performance issues are all resolved at the template layer. The LLM only performs parameter extraction, keeping the responsibility boundary clean.

---

## References

- [DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction](https://arxiv.org/abs/2304.11015)
- [Spider: A Large-Scale Human-Labeled Dataset for Complex and Cross-Domain Semantic Parsing and Text-to-SQL Task](https://arxiv.org/abs/1809.08887)
- [A Survey on Employing Large Language Models for Text-to-SQL Tasks](https://arxiv.org/html/2407.15186v5)
- [Spider Benchmark: Yale Semantic Parsing and Text-to-SQL Challenge](https://yale-lily.github.io/spider)
