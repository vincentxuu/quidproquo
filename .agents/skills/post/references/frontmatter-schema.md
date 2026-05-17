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
| `difficulty` | enum | ❌ | `入門` / `進階` / `深度`，只在文章確實需要標示閱讀難度時填 |
| `draft` | boolean | ❌（預設 `false`） | `true` 時不會在列表頁/RSS 出現 |
| `pinned` | boolean | ❌（預設 `false`） | `true` 時釘在分類首頁頂端 |
| `series` | object | ❌ | `{ name: string, order: number }`，多篇連載用 |
| `glossary` | object[] | ❌ | 當篇特有術語解釋；通用詞應放全站 glossary seed，不要塞進每篇 |
| `readingTime` | number | ❌ | 由 remark plugin 自動填，不要手寫 |

## glossary 欄位

只補「不解釋會影響理解」的詞，不補所有專有名詞。

```yaml
glossary:
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "讓模型透過標準協定連接外部工具與資料來源。"
    advanced: "可把工具、資源與 prompts 暴露給支援 MCP 的 client。"
    context: "本文用它連接 research workflow 與外部資料來源。"
    links:
      - label: "MCP documentation"
        url: "https://modelcontextprotocol.io/"
```

- `term` 必填。
- `aliases` / `definition` / `advanced` / `context` / `links` 選填。
- `links` 每個項目要有 `label` 與 `url`。
- 會跨多篇文章重複出現的詞，優先補到 `src/lib/glossary/terms.ts`。

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
