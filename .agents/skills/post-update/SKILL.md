---
name: post-update
description: Update an existing Markdown post under src/content/posts/<category>/ on quidproquo.cc while preserving slug, file path, and frontmatter date. Use for 修一下 / 補資料 / 補參考資料 / 補充 / 翻新 / 改錯字 / refresh post / update post when the user references an existing post by URL, slug, filename, or title. Do NOT create a new post; use `post` instead.
---

# post-update skill

更新既有文章，但**不破壞**它的身份：slug、檔名、原始發文日期都不動。

## 何時用

| 情境 | 用 post-update | 重發新文章 |
|---|---|---|
| 修錯字、改用詞 | ✅ | |
| 工具版本變了，更新 API / 用法 | ✅ | |
| 補一段、補參考資料、修壞掉的連結 | ✅ | |
| 重組段落順序、換 tldr | ✅ | |
| 主題、結論、立場大幅改變 | | ✅ |
| 同一主題年度回顧 / 重新評估 | | ✅ |

判斷標準：讀者看完更新版會不會覺得「這跟原本是同一篇文章」。不確定就先問使用者。

## 執行步驟

1. **定位文章**：用 `rg`、slug 或 filename 找，不猜。多個候選就列出讓使用者挑。
2. **確認改動範圍**：把使用者要改的點列成 bullets，範圍模糊就先問。
3. **保留不動**：
   - 檔名
   - frontmatter `date`
   - frontmatter `category`（除非使用者明確說要搬分類）
   - frontmatter `lang`、`series`
4. **可修改**：`title`、`tags`、`tldr`、`description`、`type`、`difficulty`、`pinned`、`draft`、`glossary`、文章內容。
5. **記錄更新**：
   - 小幅修字：直接改，不留痕
   - 補段落 / 補資料 / 改寫 / 換結論：在 `## 參考資料` 前加或更新 `## 更新紀錄`
   - 已有 `## 更新紀錄`：最新一行放最上面
6. **參考資料連動**：
   - 動到工具 / 文件 / 版本 / 數據，就同步檢查 `## 參考資料`
   - 修壞掉連結時一併補上
7. **查證觸發條件**：
   - 如果更新包含價格、版本號、release 日期、API 名稱、命令旗標、統計、benchmark、法律/政策、研究結論，先提醒這屬於 fact-layer update，建議跑 `post-verify`
   - 若使用者要求直接更新，不要憑記憶改；至少引用官方文件 / release note / 論文 / 官方 blog
   - 找不到可靠來源時，不要寫成肯定句；改成「待確認」或停下請使用者決定
8. **驗證**：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```
9. **diff review**：把 `git diff` 給使用者看，得到明確 OK 才 commit。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 把 date 改成今天 | date 是發文日期，不是更新日期 |
| 順便改 slug | slug 是 URL，改了可能 404 |
| 不問範圍直接大改 | 大改可能應該開新文章 |
| 版本/價格靠印象更新 | 這類資訊容易過時，必須查官方來源或跑 post-verify |
| 不跑驗證 | 改一段也可能弄壞參考資料或 schema |

## 詳細參考

- 文章 schema：`../post/references/frontmatter-schema.md`
- 寫作風格與分類：`../post/references/writing-guide.md`
- 建立新文章：`post`
