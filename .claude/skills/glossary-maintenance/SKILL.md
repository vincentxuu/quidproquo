---
name: glossary-maintenance
description: Use when reviewing quidproquo glossary lookup stats, deciding whether reader-searched terms should become site-wide glossary entries or article-specific frontmatter glossary entries, or checking glossary coverage after publishing content
---

# Glossary Maintenance

維護文章術語提示，讓讀者查過、容易卡住的詞回流成可點開的 glossary 解釋。

## 何時使用

- 每月內容維護時，回顧 `glossary_lookup_stats`。
- 新增或大改 3–5 篇文章後，檢查 glossary coverage。
- 使用者問「哪些詞該補 glossary」、「讀者常查哪些詞」、「要補全站詞彙還是文章詞彙」。

## 維護節奏

| 時機 | 做什麼 |
|------|--------|
| 寫新文章時 | 只補明顯會影響理解的詞 |
| 新增／大改 3–5 篇文章後 | 跑 `scripts/check-glossary-coverage.mjs`，找沒有 glossary coverage 的文章 |
| 每月一次 | 查 `glossary_lookup_stats`，整理高頻查詢詞 |

## 判斷規則

- 累積查詢 5 次以上：檢查是否需要補 glossary。
- 同一詞出現在多篇文章，或是通用概念：補到 `src/lib/glossary/terms.ts` 的 `DEFAULT_GLOSSARY_TERMS`。
- 只集中在單篇文章、專案代號、特定脈絡：補到該篇文章 frontmatter 的 `glossary`。
- 不補所有專有名詞，只補「不解釋會影響理解」的詞。

## 查詢方式

`glossary_lookup_stats` 是讀者點查 glossary 時累積的 D1 統計，不是每次寫文章都要查。

常用查詢：

```sql
SELECT term, SUM(lookup_count) AS total, COUNT(DISTINCT slug) AS post_count
FROM glossary_lookup_stats
GROUP BY term
HAVING total >= 5
ORDER BY total DESC, post_count DESC;
```

判斷某個詞集中在哪些文章：

```sql
SELECT term, slug, SUM(lookup_count) AS total
FROM glossary_lookup_stats
WHERE term = ?
GROUP BY term, slug
ORDER BY total DESC;
```

## 執行步驟

1. 跑 coverage 檢查或查 lookup stats。
2. 列出候選詞：term、total lookup、post_count、主要 slug。
3. 逐詞判斷：全站詞彙、文章詞彙、暫不處理。
4. 修改 `DEFAULT_GLOSSARY_TERMS` 或文章 frontmatter `glossary`。
5. 跑 `pnpm check:post-quality <file>` 與 `pnpm check:references <file>`；若改了全站詞彙，再抽樣打開文章確認 glossary popover 正常。

## 常見錯誤

- 把 `glossary_lookup_stats` 當成發文前必跑：錯，它適合發布後或內容維護時看。
- 看到技術名詞就全補：錯，只補會阻礙理解的詞。
- 單篇特有詞放進全站：錯，先放該篇 frontmatter，除非多篇文章都會用到。
