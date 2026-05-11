# Frontmatter 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| title | string | ✅ | 文章標題 |
| date | date | ✅ | 撰寫日期，格式 YYYY-MM-DD |
| category | string | ✅ | 分類（見 SKILL.md 清單） |
| tags | string[] | ✅ | 標籤，全小寫 kebab-case，可空陣列 |
| lang | enum | ✅ | zh-TW 或 en，預設 zh-TW |
| description | string | ❌ | SEO meta description |
| tldr | string | ❌ | 一句話摘要（tech 類強烈建議填） |
| draft | boolean | ❌ | true 時不顯示（預設 false） |

## 檔名規則

`YYYY-MM-DD-<slug>.md`

slug 用英文 kebab-case，取關鍵詞：
- `2026-03-12-d1-batch-timeout.md`
- `2026-03-15-first-outdoor-lead.md`
- `2026-03-20-parasite-review.md`

## 存放路徑

`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`
