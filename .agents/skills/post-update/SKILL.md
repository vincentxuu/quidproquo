---
name: post-update
description: 'Update an existing Markdown post under a category directory in src/content/posts/ on quidproquo.cc — fix typos, refresh outdated info, add missing references, append an "更新紀錄" section, or rewrite a paragraph — while preserving the original slug, file path, and frontmatter `date`. Use when user says 更新文章 / 修一下 / 補資料 / 補參考資料 / 補充 / 翻新 / 改錯字 / refresh post / update post and references an existing post by URL, slug, filename, or title keyword. Do NOT use to create a brand new post — use the `post` skill instead.'
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
| 系列回填：同 series 新文章上線，舊文章的「接下來會寫 X」過期 | ✅ |  |
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
   可以動的：`title`、`tags`、`tldr`、`description`、`type`、`difficulty`、`pinned`、`draft`、`glossary`、文章內容。

4. **記錄更新**（預設行為）：
   - 小幅修字 → 直接改，不留痕
   - 補段落 / 補資料 / 改寫 / 換結論 → 在文末（`## 參考資料` 之前）加：
     ```markdown
     ## 更新紀錄

     - 2026-05-10：補充 X 段、加入 Y 參考資料
     ```
   - 已有 `## 更新紀錄` → 在最上面加新一行（最新在上）

5. **改完看語域**（zh-TW 1500 字以上）：改內容很容易只顧對錯，忘了讀者讀不讀得下去。搬段落、補段落之後尤其要看。

   ```bash
   bash .agents/skills/post-polish/scripts/register-scan.sh src/content/posts/<category>/<檔名>.md
   ```

   規則見 `../post/references/writing-guide.md#長文的體裁與語域`。**補進去的新段落套用同一套標準**——正文每個主張最多一個數字、建議要配可執行動作、但書不要堆疊。只是要改寫語域、內容不動的話，走 `post-polish`。

6. **參考資料連動**：
   - 動到內容引用的工具 / 文件 → 同步檢查 `## 參考資料` 是否要新增或更新連結
   - 修壞掉的連結 → 一併補上
   - 更新跟讀內容時，依 `../post/templates/shadowing-delivery-checklist.md` 核對「頁內逐字稿對照」或「原站字幕跟讀」。同步檢查中英文的標題、description、tldr、開頭和練習區；短引文、中文摘要、英文版文章及外部字幕入口均不能冒充頁內完整逐字稿。使用者要求頁內全文而僅有原站字幕時，記錄缺口，不能稱需求已完整交付。

7. **系列同步**（該文屬於 series 時）：掃同系列其他文章有沒有對本篇主題的過期承諾——「接下來會寫 X」「第一批優先順序是…」、對照表裡提到 X 卻沒連結。有的話一併回填成現況清單＋連結，中英版都改，各加 `## 更新紀錄`。實例：`2026-08-21-global-ai-cs-course-map` 寫了「系列會先完成 CMU、MIT、Berkeley 三篇學校地圖」，但這些地圖與 CS188／CS285／CS288／10-301 導讀上線後總覽一直沒回補連結。發新文章時的預防流程見 `../post/SKILL.md` 步驟 8。

8. **查證觸發條件**：
   - 如果更新內容包含價格、版本號、release 日期、API 名稱、命令旗標、統計數字、benchmark、法律/政策、研究結論，先提醒使用者這屬於 fact-layer update，建議跑 `post-verify`。
   - 若使用者要求直接更新，不要憑記憶改；至少用官方文件 / release note / 論文 / 官方 blog 作為來源。
   - 高風險資訊（價格、版本、日期、統計、研究結論）應在文中或 `## 參考資料` 明確留下來源。
   - 找不到可靠來源時，不要把不確定內容寫成肯定句；改成「待確認」或停下請使用者決定。

9. **驗證**（按順序跑，全綠才算完成）：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```

10. **diff review**：把 `git diff` 給使用者看，**得到明確 OK 才 commit**。

11. **commit**：
   ```bash
   git add src/content/posts/<category>/<檔名>.md
   git commit -m "post(<category>): update <精簡描述更新內容>"
   ```
   範例：`post(ai): update Claude Skills 補充 best-practices 章節`、`post(tech): update D1 batch timeout 修錯字`

## 課程影片狀態（更新任何課程系列文章時必做）

課程導讀文章開頭的「影片狀態」曾經兩度寫錯：把已上架的錄影標成「待確認」，或憑快取的課表說「沒有錄影」。規則適用**所有**課程系列（凡有「影片狀態」行或 `ai-course` 標籤的文章），不限單一課程：

1. **「沒有／尚未公開」比「有」更需要證據。** 宣稱沒有錄影前，必須用即時抓取（`maxAge: 0`）回到原始來源（官方播放清單、講師頻道、課程官網）逐講確認；快取結果、前一批文章的舊標籤、搜尋結果都不算。
2. **`pnpm check:course-videos`（已併入 `pnpm verify`）對全站強制：**
   - 狀態「已附影片」必須有 `youtube` 嵌入；有嵌入就必須標「已附影片」（「補充影片」例外）。
   - 中英版狀態與嵌入的影片必須一致。
   - 否定類狀態（未列、待確認、查核）若寫了查核日期，30 天內有效，過期就失敗，逼你回原始來源重查。
   - `ai-course` 標籤的文章一定要有狀態行。
3. **已逐講查證的系列，另登錄在 `scripts/config/course-videos.json`**（嚴格模式）：查到錄影填 11 碼 video ID，查過確定還沒有填 `null`，兩種都要更新 `checkedAt`；`null` 的查核 7 天內有效。新增課程文章時同步加一筆。
4. 影片後來才上架、補嵌影片時，在 `## 更新紀錄` 記一行，並同步更新登錄表。

## 反合理化（容易偷懶的地方）

| 想偷懶 | 為什麼不行 |
|---|---|
| 「順便把 frontmatter date 改成今天」 | date 是發文日期，不是更新日期。改了會破壞 RSS 與時間線排序 |
| 「順便改 slug 讓網址更好看」 | slug 是 URL，外站可能已經 link 過來，改了就 404 |
| 「跳過更新紀錄，反正 git log 看得到」 | 讀者看不到 git log。內容性更動要讓讀者知道哪段是新的 |
| 「在段落後面加一句補充」 | 不要用補丁式寫法（「另外值得留意」「補充說明」「更新：…」）。把新事實重寫進原有段落，讓文章讀起來像從頭就是這樣寫的 |
| 「直接動筆改，不問改動範圍」 | 大改可能應該開新文章，先問再做 |
| 「版本/價格靠印象更新」 | 這類資訊容易過時，必須查官方來源或先跑 post-verify |
| 「只改中文版，英文版之後再說」 | 兩語版本會分岔，而且分岔了不會有人提醒你。本站踩過：中文改了三輪架構，英文版還停在最初版。改完就同步，或明確告訴使用者哪一邊還沒動 |
| 「補一段進去就好，體裁不用管」 | 新段落套的是舊習慣。補進去的段落常常是全篇數字最密、但書最多的一段——因為它是「剛查完資料」的狀態 |
| 「改完跑過 verify 就好」 | verify 驗的是格式。**改過兩輪以上就要從頭讀一遍**——開頭的承諾跟內文對不對得上、跨節指代還指不指得到、前後結論有沒有打架、同一個數字全篇一致嗎。本站踩過：一篇改了三輪，機械檢查全綠，讀一遍才發現開頭寫「錯了一次」但內文三次、某節說「這五個詞要收」後面卻說「推翻了一個」、還有一處混進西里爾字母。檢查清單見 `post-review` 步驟 6.7 |
| 「這節分類講錯了，補一段解釋清楚」 | 站上若已有系列在管那個主題，補充就是把它的內容複製一份過來，之後兩處各自過期。正確的修法是縮短該節、只留分界與轉手連結——修完應該**變短**。檢查清單見 `post-review` 步驟 6.8 |
| 「新文章發了，同系列的舊總覽不用動」 | 連載的早期文章常寫「接下來會寫 X」。X 上線那天，那些承諾就過期了，讀者卻以為東西還不存在。本站踩過：`global-ai-cs-course-map` 承諾的四篇學校地圖與四門單課導讀全部上線後，總覽仍停在「之後會寫」，一條連結都沒有。屬於 series 就跑步驟 7 的系列同步 |
| 「課表上沒列影片，所以沒有影片」 | 課表可能是快取、可能晚於影片上架。本站踩過兩次：第 7、8 講錄影早已上架卻標「待確認」，第 10 講當天上架卻被說成沒有。「沒有」必須即時回原始來源（播放清單、講師頻道）查，並更新 `course-videos.json` 的 `checkedAt` |
| 「沿用前一批文章的狀態標籤」 | 舊標籤可能本來就錯，而且會隨時間過期。每次更新課程系列都要重查，不要繼承 |
| 「整句取代舊文字，反正新的比較完整」 | 取代前先看被取代的那行有什麼：本站踩過把查證說明整句蓋掉，只在 `git diff` 時才發現。取代後一定看 diff 的 `-` 行，確認沒有丟掉仍然成立的內容 |
| 「不跑驗證，反正只改一段」 | 改一段也可能弄壞參考資料連結，每次都要跑 |
| 「commit 不給 diff review 直接送」 | 公開內容，使用者要看過才能送 |

## 詳細參考

- 文章 schema：`../post/references/frontmatter-schema.md`
- 寫作風格與分類：`../post/references/writing-guide.md`
- 建立新文章：使用 `post` skill
