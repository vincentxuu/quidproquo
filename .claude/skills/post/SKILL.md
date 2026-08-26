---
name: post
description: Convert a conversation, notes, or experience into a structured Markdown post under src/content/posts/<category>/ on quidproquo.cc. Use when user says 寫成文章 / 記錄一下 / 寫成介紹文 / 寫成深入介紹 / write post / deep dive, or pastes notes/transcripts and asks to publish. Do NOT use to edit an already-existing post — use the `post-update` skill instead.
---

# post skill

把任何內容轉換成結構化的雙語 Markdown（zh-TW + en），存到 `src/content/posts/<category>/`，通過格式驗證。**每篇文章一定產出中英兩個檔案，這是一個步驟不是兩個。**

## 觸發方式 → 模板對應

| 使用者語氣 | 對應模板 | 適用 |
|---|---|---|
| 「寫成文章」「記錄一下」「write post」 | `templates/tech-post.md` | 踩坑 / 問題解決 |
| 「寫成介紹文」「寫成深入介紹」「deep dive」 | `templates/tech-deep-dive.md` | 工具 / 技術 / 架構介紹 |
| 其他分類 | `templates/general-post.md` | 自由結構 |

## 支援的分類

`tech` / `ai` / `product` / `marketing` / `learning` / `education` / `policy` / `design` / `career` / `climbing` / `surf` / `film` / `coffee` / `life` / `travel` / `anime` / `investing`

不要自己發明新分類。找不到合適的先問使用者。

## 執行步驟

### 1. 準備

1. **判斷分類**：根據內容本質選 category。
2. **選擇模板**：依觸發方式照表對應，不混用。
3. **前置 metadata gate**：補齊 category、type、title direction、slug、tags（先查既有 tag 避免分裂）、references required、glossary needed。缺關鍵資訊就問一個精準問題，**不要編造**。frontmatter 細節見 `references/frontmatter-schema.md`。
4. **抽資訊**：從對話／筆記抽出主體段落。資訊不夠就問。

### 2. 體裁閘門（1500 字以上必過）

下筆前先定三件事（細節見 `references/writing-guide.md#長文的體裁與語域`）：

- **對象**：前三段要讓沒接觸過的人知道它是什麼
- **主脊**：按判決／按部件／按時間／按論證——選一個
- **動作**：每個建議都要能寫出一句今晚就能做的動作

寫的當下遵守：每個主張最多一個數字、引述只在原話比轉述更有力時用、但書不堆疊、不替來源加上它沒有的主張。

### 3. 產生雙語檔案（一步完成，不是先寫中文再補英文）

同時產出兩個檔案：

| | 中文版 | 英文版 |
|---|---|---|
| 路徑 | `YYYY-MM-DD-<slug>.md` | `YYYY-MM-DD-<slug>-en.md` |
| `lang` | `zh-TW` | `en` |
| `title` / `tldr` / `description` | 中文 | 自然英文（不是機翻） |
| 跨語言連結 | `> 🌏 [English version](/en/posts/<category>/YYYY-MM-DD-<slug>-en)` | `> 🌏 [中文版](/posts/<category>/YYYY-MM-DD-<slug>)` |
| 其餘 frontmatter | 相同 | 相同 |

英文版規則：
- code block 不動（只翻中文註解）
- URL、檔案路徑、指令範例維持原樣
- 參考資料：翻譯描述文字；純中文來源保留原連結並標注 `(in Chinese)`

寫作風格見 `references/writing-guide.md`。

### 4. 參考資料（硬要求）

`pnpm check:references` 在以下任一條件成立時要求參考資料：
- category 是 tech / ai / learning / education / policy / design / marketing / product
- `##` 標題 ≥ 4 個、有 code fence、inline code ≥ 3、已有外部連結、含引用關鍵字 ≥ 2 個

文末必須有 `## 參考資料`（英文版 `## References`），含至少一個有效 `[text](url)` 連結。

**內文連結閘門**：文末清單不能取代內文連結。commit 前逐段掃一遍，每個第一次出現的專名——課號、課程官網、工具、論文、同系列的站上文章——都要是 inline 超連結。對照表、清單裡的專名也一樣。反例與規則見 `references/anti-shortcuts.md` 的「連結以後再補」條目。

### 5. 補齊 glossary

- 先查 `src/lib/glossary/terms.ts` 是否已有定義
- 跨文章通用 → 補到 `terms.ts`（含中英雙語）
- 僅限這篇 → 補到 frontmatter `glossary` 欄位

### 6. 驗證（兩個檔案都要通過）

```bash
pnpm check:references
pnpm lint
pnpm astro check
```

中文版另跑：`pnpm check:tw src/content/posts/<category>/<檔名>.md`

1500 字以上另跑：`bash .agents/skills/post-polish/scripts/register-scan.sh <檔案路徑>`

有 error 先修。commit 前對照 `references/anti-shortcuts.md` 反合理化清單。

### 7. Review + commit

把中英文草稿給使用者看，確認後：

```bash
git add src/content/posts/<category>/YYYY-MM-DD-<slug>.md src/content/posts/<category>/YYYY-MM-DD-<slug>-en.md
git commit -m "post(<category>): <title summary>"
```

### 8. 系列回填（新文章屬於既有 series 時必做）

新文章帶著 `series` 進到一個已經有其他篇目的連載時，較早發佈的文章很可能寫著「接下來會寫 X」「第一批優先順序是…」這類對本篇的承諾。本篇上線那一刻，那些承諾就過期了。

1. 用 `rg -l '<series 名稱>' src/content/posts/` 或逐篇查 frontmatter，列出同 series 的所有文章
2. 掃每篇的「接下來」類段落、學校／課程對照表與 `## 參考資料`，找指向本篇主題但沒有連結的地方
3. 把過期承諾改寫成現況清單＋連結（不要用「更新：…」補丁式寫法），中英版一起
4. 這些修改走 `post-update` 流程：加 `## 更新紀錄`、跑驗證、diff review 後一起或分開 commit

## 詳細參考

- 寫作風格：`references/writing-guide.md`
- frontmatter schema：`references/frontmatter-schema.md`
- 反合理化清單：`references/anti-shortcuts.md`
- 模板：`templates/tech-post.md`、`templates/tech-deep-dive.md`、`templates/general-post.md`
