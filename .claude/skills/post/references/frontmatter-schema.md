# Frontmatter 完整 schema

對應 `src/content.config.ts` 定義。違反 schema 會在 build / `pnpm astro check` 時噴錯。

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `title` | string | ✅ | 文章標題，包雙引號避免 YAML 解析意外 |
| `date` | date（coerced） | ✅ | `YYYY-MM-DD`，發文日期 |
| `category` | string | ✅ | 分類資料夾名，見 SKILL.md 清單 |
| `tags` | string[] | ✅ | 標籤陣列；可空 `[]`，但通常 3-7 個 |
| `lang` | `'zh-TW'` \| `'en'` | ❌（預設 `zh-TW`） | 翻譯版填 `en`，路徑會出現在 `/en/...` |
| `description` | string | ❌ | SEO meta description，1-2 句，列表頁顯示 |
| `tldr` | string | ❌ | 一句話摘要；`tech` / `ai` / `deep-dive` 類強烈建議填 |
| `type` | enum | ❌ | `debug` / `deep-dive` / `guide` / `project`，沒對應就不填 |
| `draft` | boolean | ❌（預設 `false`） | `true` 時不會在列表頁/RSS 出現 |
| `pinned` | boolean | ❌（預設 `false`） | `true` 時釘在分類首頁頂端 |
| `series` | object | ❌ | `{ name: string, order: number }`，多篇連載用 |
| `readingTime` | number | ❌ | 由 remark plugin 自動填，不要手寫 |

## tags 命名規則

- 全小寫 kebab-case：`claude-code` ✅、`Claude Code` ❌、`claude_code` ❌
- 用既有 tag 優先（避免 `llm` / `large-language-model` 分裂）。寫前可以：
  ```bash
  grep -h "^tags:" src/content/posts/<category>/*.md | sort -u
  ```
- 一篇 3-7 個，**核心主題在前**

## 檔名規則

`YYYY-MM-DD-<slug>.md`

- slug 英文 kebab-case，取關鍵詞（不是整句中翻英）
- 範例：
  - `2026-03-12-d1-batch-timeout.md`
  - `2026-03-15-first-outdoor-lead.md`
  - `2026-05-08-anthropic-claude-skills-guide.md`

## 存放路徑

`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`

## 完整範例

```yaml
---
title: "Claude Skills：把專業知識打包成資料夾"
date: 2026-05-08
type: deep-dive
category: ai
tags: [claude, anthropic, claude-skills, prompt-engineering]
lang: zh-TW
tldr: "Skill 是一個資料夾、一份 SKILL.md。三層 progressive disclosure 讓 Claude 在需要時才載入細節。"
description: "解讀 Anthropic 官方指南：Skill 結構、三層漸進揭露、frontmatter 規則、撰寫測試流程。"
draft: false
---
```
