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
3. **前置 metadata gate**：產文前先把必要決策補齊，缺關鍵資訊就問一個精準問題，**不要編造**。
   - `category`：必須是支援分類之一。
   - `type/template`：debug / deep-dive / guide / project / general，並對應模板。
   - `title direction`：標題要包含主題、錯誤關鍵字或具體場景。
   - `slug`：英文 kebab-case，2-4 個關鍵字。
   - `tags`：3-7 個、全小寫 kebab-case、核心主題在前，優先沿用既有 tag。
   - `lang`：`zh-TW` 或 `en`。
   - `references required`：tech / ai / learning / education / policy / design / marketing / product 預設需要。**其他 category 也不例外**——只要標題 ≥ 4 個、有 code block、inline code ≥ 3、已有外部連結、或包含引用關鍵字（「官方」「論文」「比較」等）≥ 2 個，腳本同樣觸發要求。寫前先預估文章結構，確認是否需要先備好連結。
   - `glossary needed`：標出不解釋會影響理解的專有名詞（見下方 glossary 步驟）。
4. **抽資訊**：從對話／筆記抽出 title、date（今天）、tags、tldr/description、主體段落。資訊不夠就回去問，**不要編造**。
5. **產生中文版檔案**：
   - 路徑：`src/content/posts/<category>/YYYY-MM-DD-<slug>.md`
   - slug：英文 kebab-case，取關鍵詞（不是中翻英整段）
   - frontmatter 必填：`title`、`date`、`category`、`tags`、`lang`
   - 細節欄位請先讀 `references/frontmatter-schema.md`
   - 寫作風格請先讀 `references/writing-guide.md`
   - 在 frontmatter `---` 後加跨語言連結：`> 🌏 [English version](/posts/<category>/YYYY-MM-DD-<slug>-en)`
6. **產生英文版檔案**：
   - 路徑：`src/content/posts/<category>/YYYY-MM-DD-<slug>-en.md`
   - frontmatter：`lang: en`，title / tldr / description 翻成自然英文，其餘欄位不動
   - 在 frontmatter `---` 後加跨語言連結：`> 🌏 [中文版](/posts/<category>/YYYY-MM-DD-<slug>)`
   - 全文翻成清晰的技術英文；code block 不動（只翻中文註解）
   - URL、檔案路徑、指令範例維持原樣
   - 參考資料：翻譯描述文字；純中文來源保留原連結並標注 `(in Chinese)`
7. **參考資料是硬要求**：`pnpm check:references` 在以下任一條件成立時就會要求參考資料（不論 category）：
   - category 是 `tech` / `ai` / `learning` / `education` / `policy` / `design` / `marketing` / `product`
   - 文章 `##` 標題 ≥ 4 個
   - 有 code fence（` ``` `）
   - inline code ≥ 3 個
   - 已有外部連結
   - 含「官方」「文件」「論文」「比較」等引用關鍵字 ≥ 2 個

   觸發後，文末必須有 `## 參考資料`（英文版 `## References`）段落，且包含至少一個有效 Markdown 連結 `[text](url)`——純文字書名或「待補連結」都會報 error。
8. **補齊 glossary**：回頭看步驟 3 標出的 `glossary needed` 詞彙，逐一確認是否已有定義：
   - 先查 `src/lib/glossary/terms.ts`（全站 glossary），看 term 和 aliases 是否已涵蓋。
   - **跨文章通用的術語**（如 ETF、再平衡、RAG）→ 補到 `src/lib/glossary/terms.ts`，格式照既有 entry（含中英雙語 definition / advanced / context / links）。
   - **僅限這篇文章的特殊詞**（如某個冷門工具的內部術語）→ 補到該篇 frontmatter 的 `glossary` 欄位，格式見 `references/frontmatter-schema.md`。
   - 判斷標準：「這個詞會不會在其他文章也出現？」→ 是就放全站，否就放 frontmatter。
   - 每個術語都要有中英雙語定義（`definition` + `definition_en`），讓英文版文章也能用。
9. **驗證**（按順序跑，全綠才算完成，兩個檔案都要通過）：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```
   有 error 先修，不要當作 warning 略過。
10. **請使用者 review**：把中英文草稿都丟出來，確認再 commit。
11. **commit**（取得明確同意後）：
   ```bash
   git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md src/content/posts/<category>/YYYY-MM-DD-<slug>-en.md
   git commit -m "post(<category>): <title summary>"
   ```
   commit 訊息照專案格式生成：`post(<category>): <title summary>`。

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
| 「論文連結只放在文末」 | 論文 / 工具名稱第一次出現就要是可點擊超連結；讀者在文章中間就想點，等到文末才能點會流失 |
| 「跳過 pnpm check:references」 | 內部連結壞了使用者點到 404，沒人會幫你抓 |
| 「直接 commit 不給 review」 | post 是公開內容，發出去前必須使用者點頭 |
| 「沒參考資料就算了」 | 引用就一定要附來源，這是站規 |
| 「life / climbing 類不用參考資料」 | 標題 ≥ 4 個就會觸發 check:references，不論 category；純文字書名也不算連結 |
| 「glossary 之後再補」 | 讀者第一次看到不懂的詞就會離開，hover tooltip 是即時救援，不是事後補丁 |

## 詳細參考

- 寫作風格與分類細節：`references/writing-guide.md`
- frontmatter 完整 schema：`references/frontmatter-schema.md`
- 模板：`templates/tech-post.md`、`templates/tech-deep-dive.md`、`templates/general-post.md`
