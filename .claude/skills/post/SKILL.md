---
name: post
description: Convert a conversation, notes, or experience into a structured Markdown post under src/content/posts/<category>/ on quidproquo.cc. Use when user says 寫成文章 / 記錄一下 / 寫成介紹文 / 寫成深入介紹 / write post / deep dive, or pastes notes/transcripts and asks to publish. Do NOT use to edit an already-existing post — use the `post-update` skill instead.
---

# post skill

把任何內容（解 bug、攀岩心得、電影感想、咖啡筆記、工具介紹...）轉換成結構化的 Markdown，存到 `src/content/posts/<category>/`，並通過格式驗證。

## 觸發方式 → 模板對應

不要猜，照表選。

| 使用者語氣 | 對應模板 | 適用 |
|---|---|---|
| 「寫成文章」「記錄一下」「write post」 | `templates/tech-post.md` | 踩坑 / 問題解決（情境→問題→解法→原因） |
| 「寫成介紹文」「寫成深入介紹」「deep dive」 | `templates/tech-deep-dive.md` | 工具 / 技術 / 架構介紹（沒有第一人稱踩坑） |
| 其他分類（climbing / film / coffee / life...） | `templates/general-post.md` | 自由結構 |

## 支援的分類

`tech` / `ai` / `product` / `marketing` / `learning` / `education` / `policy` / `design` / `career` / `climbing` / `surf` / `film` / `coffee` / `life` / `travel` / `anime`

不要自己發明新分類。如果使用者描述的內容找不到合適分類，**先問使用者**，不要逕自建立新目錄。

## 執行步驟

1. **判斷分類**：根據內容本質選 category，不是看使用者用的語言或情緒。
2. **選擇模板**：依觸發方式照表對應，不混用。
3. **抽資訊**：從對話／筆記抽出 title、date（今天）、tags、tldr/description、主體段落。資訊不夠就回去問，**不要編造**。
4. **產生檔案**：
   - 路徑：`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`
   - slug：英文 kebab-case，取關鍵詞（不是中翻英整段）
   - frontmatter 必填：`title`、`date`、`category`、`tags`、`lang`
   - 細節欄位請先讀 `references/frontmatter-schema.md`
   - 寫作風格請先讀 `references/writing-guide.md`
5. **參考資料是硬要求**：如果文章引用工具、框架、官方文件、論文、版本、數據比較、外部說法 → 文末必須有 `## 參考資料` 段落。`tech` / `ai` / `learning` / `education` / `policy` / `design` / `marketing` / `product` 類預設都要有。
6. **驗證**（按順序跑，全綠才算完成）：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```
   有 error 先修，不要當作 warning 略過。
7. **請使用者 review**：把草稿丟出來，確認再 commit。
8. **commit**（取得明確同意後）：
   ```bash
   git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md
   git commit -m "post(<category>): <title summary>"
   ```
   commit 訊息照 `format-commit` 風格生成（CLAUDE.md 已指定）。

## frontmatter 速查

```yaml
---
title: "..."           # 必填
date: 2026-05-10       # 必填，YYYY-MM-DD
category: ai           # 必填，見上面分類清單
tags: [claude, skill]  # 必填，全小寫 kebab-case
lang: zh-TW            # 預設 zh-TW，英文版用 en
type: deep-dive        # 選填：debug / deep-dive / guide / project
tldr: "..."            # 選填，tech/ai/deep-dive 強烈建議
description: "..."     # 選填，SEO meta
draft: false           # 預設 false
pinned: false          # 預設 false
series:                # 選填，多篇連載用
  name: "RAG 系列"
  order: 1
---
```

## tags 命名規則

- 全小寫 kebab-case：`claude-code` ✅ `Claude Code` ❌ `claude_code` ❌
- 用既有的 tag 優先，避免同義詞分裂（`llm` vs `large-language-model`）
- 寫前先 `ls src/content/posts/<category>/` 看附近文章用了什麼 tag
- 一篇 3-7 個就好，不是越多越好

## type 怎麼選

| type | 用在 |
|---|---|
| `debug` | 純問題排解、踩坑記錄（搭 tech-post 模板） |
| `deep-dive` | 對工具 / 技術 / 概念的深入介紹 |
| `guide` | 教學、how-to、可被照著做的步驟 |
| `project` | 自己做的東西、產品紀錄 |
| 不填 | 上述都不像就不要硬填 |

## 反合理化（容易偷懶的地方）

| 想偷懶 | 為什麼不行 |
|---|---|
| 「寫個籠統的 tldr」 | tldr 是讀者決定要不要點進來的關鍵，要具體到名詞和數字 |
| 「slug 用中翻英整句」 | slug 是 URL，要短而辨識度高，取 2-4 個關鍵字 |
| 「參考資料先放泛用首頁」 | 比較多個工具就要對應到該工具的官方頁，不是放一條 anthropic.com |
| 「跳過 pnpm check:references」 | 內部連結壞了使用者點到 404，沒人會幫你抓 |
| 「直接 commit 不給 review」 | post 是公開內容，發出去前必須使用者點頭 |
| 「沒參考資料就算了」 | 引用就一定要附來源，這是站規 |

## 詳細參考

- 寫作風格與分類細節：`references/writing-guide.md`
- frontmatter 完整 schema：`references/frontmatter-schema.md`
- 模板：`templates/tech-post.md`、`templates/tech-deep-dive.md`、`templates/general-post.md`
