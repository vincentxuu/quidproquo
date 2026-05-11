---
name: post-update
description: Update an existing Markdown post under src/content/posts/<category>/ on quidproquo.cc — fix typos, refresh outdated info, add missing references, append a "更新紀錄" section, or rewrite a paragraph — while preserving the original slug, file path, and frontmatter `date`. Use when user says 更新文章 / 修一下 / 補資料 / 補參考資料 / 補充 / 翻新 / 改錯字 / refresh post / update post and references an existing post by URL, slug, filename, or title keyword. Do NOT use to create a brand new post — use the `post` skill instead.
---

# post-update skill

更新既有的 quidproquo 文章，但**不破壞**它的身份（slug、檔名、原始發文日期都不動）。

## 何時用 post-update vs 重發新文章

| 情境 | 用 post-update | 重發新文章 |
|---|---|---|
| 修錯字、改用詞 | ✅ |  |
| 工具版本變了，更新 API / 用法 | ✅ |  |
| 補一段、補參考資料、修壞掉的連結 | ✅ |  |
| 重組段落順序、換 tldr | ✅ |  |
| 主題、結論、立場大幅改變 |  | ✅（用 post） |
| 同一主題年度回顧 / 重新評估 |  | ✅（兩篇互相連結） |

判斷標準：**讀者看完更新版會不會覺得「這跟原本是同一篇文章」**。會 → post-update；不會 → 新發。**不確定就先問使用者**。

## 執行步驟

1. **定位文章**（必要時用 ripgrep 而不是猜）：
   ```bash
   # 用標題關鍵字
   rg -l "Claude Skills" src/content/posts/

   # 用 slug
   ls src/content/posts/*/2026-05-08-*.md
   ```
   找到多個候選 → 列出讓使用者挑，**不要自己選**。

2. **確認改動範圍**：把使用者要改的點列成 bullets，跑回去確認再動手。範圍模糊就要回去問——大改與小改的處理方式不同。

3. **保留不動的東西**：
   - 檔名（`YYYY-MM-DD-<slug>.md`）
   - frontmatter `date`（原始發文日期，**不是**今天）
   - frontmatter `category`（除非使用者明確說要搬分類）
   - frontmatter `lang`、`series`
   可以動的：`title`、`tags`、`tldr`、`description`、`type`、`pinned`、`draft`、文章內容。

4. **記錄更新**（預設行為）：
   - 小幅修字 → 直接改，不留痕
   - 補段落 / 補資料 / 改寫 / 換結論 → 在文末（`## 參考資料` 之前）加：
     ```markdown
     ## 更新紀錄

     - 2026-05-10：補充 X 段、加入 Y 參考資料
     ```
   - 已有 `## 更新紀錄` → 在最上面加新一行（最新在上）

5. **參考資料連動**：
   - 動到內容引用的工具 / 文件 → 同步檢查 `## 參考資料` 是否要新增或更新連結
   - 修壞掉的連結 → 一併補上

6. **驗證**（按順序跑，全綠才算完成）：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```

7. **diff review**：把 `git diff` 給使用者看，**得到明確 OK 才 commit**。

8. **commit**：
   ```bash
   git add src/content/posts/<category>/<檔名>.md
   git commit -m "post(<category>): update <精簡描述更新內容>"
   ```
   範例：`post(ai): update Claude Skills 補充 best-practices 章節`、`post(tech): update D1 batch timeout 修錯字`

## 反合理化（容易偷懶的地方）

| 想偷懶 | 為什麼不行 |
|---|---|
| 「順便把 frontmatter date 改成今天」 | date 是發文日期，不是更新日期。改了會破壞 RSS 與時間線排序 |
| 「順便改 slug 讓網址更好看」 | slug 是 URL，外站可能已經 link 過來，改了就 404 |
| 「跳過更新紀錄，反正 git log 看得到」 | 讀者看不到 git log。內容性更動要讓讀者知道哪段是新的 |
| 「直接動筆改，不問改動範圍」 | 大改可能應該開新文章，先問再做 |
| 「不跑驗證，反正只改一段」 | 改一段也可能弄壞參考資料連結，每次都要跑 |
| 「commit 不給 diff review 直接送」 | 公開內容，使用者要看過才能送 |

## 詳細參考

- 文章 schema：`../post/references/frontmatter-schema.md`
- 寫作風格與分類：`../post/references/writing-guide.md`
- 建立新文章：使用 `post` skill
