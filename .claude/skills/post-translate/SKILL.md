---
name: post-translate
description: Translate an existing zh-TW post under src/content/posts/<category>/ into an English version, write it to the same category folder with `lang: en`, and link the two posts to each other. Use when user says 翻成英文 / 翻成 en / translate post / 出個英文版 and references an existing zh-TW post by URL, slug, filename, or title keyword. Skip when the source post is already `lang: en`.
---

# post-translate skill

把既有的 zh-TW 文章做出對應的英文版，存到同一個 `src/content/posts/<category>/`，靠 `lang: en` 與英文 slug 區分，並建立雙向連結。

## 路由規則

quidproquo 的雙語靠兩件事：

1. `frontmatter.lang: en` 讓 Astro 把文章歸到英文路由
2. 英文版檔名換成英文 slug（路徑同層，不開新目錄）

```
src/content/posts/ai/2026-05-08-anthropic-claude-skills-guide.md      # zh-TW
src/content/posts/ai/2026-05-08-anthropic-claude-skills-guide-en.md   # en（建議命名）
```

或者用完全不同的英文 slug（更自然，但要記得對應）。**兩種都可以，跟使用者確認後選一種一致用**。

## 執行步驟

### 1. 定位原文

```bash
rg -l "title|slug 關鍵字" src/content/posts/
```

確認原文 `lang: zh-TW`。如果原文已經 `lang: en` → 退出，提醒使用者用 `post-update`。

### 2. 確認譯法策略

跟使用者確認一次：

- **直譯**：忠實翻完整篇（適合 reference / 規格類文章）
- **改寫**：保留結構與要點，調整文化脈絡（適合有台灣 context 的踩坑文，例如「中華電信 GTM 設定」對英文讀者要重寫）
- **節譯**：只翻精華段（適合很長的整理文）

預設用「改寫」，除非使用者指定。

### 3. 建立英文檔

複製原檔到新路徑：

```bash
cp src/content/posts/<category>/YYYY-MM-DD-<zh-slug>.md \
   src/content/posts/<category>/YYYY-MM-DD-<en-slug>.md
```

修改 frontmatter：

| 欄位 | 怎麼改 |
|---|---|
| `title` | 翻成英文，避免中文括號附註 |
| `lang` | `en` |
| `tldr` / `description` | 重寫成英文，**不是 Google Translate 翻譯腔** |
| `tags` | 維持原 tag（tag 是 ID，不翻） |
| `date` | 沿用原文發文日（讀者預期是同一篇的英譯） |
| `category` / `type` / `series` | 不動 |

### 4. 翻譯內容

紀律：

- 程式碼、命令、檔案路徑、變數名 **完全不翻**
- 引用 / 專有名詞保留原文（人名、產品名、論文標題）
- 程式語言以外的地方**不要直譯**：中文連接詞、台式比喻、口語都改寫
- 截圖 / 圖片 alt text 翻譯
- 站內連結：如果指向的文章也有英文版 → 改成英文版路徑；沒有 → 保留中文版連結並在後面標 `(zh-TW only)`

**語域不會自己跟著翻過去。** 中文原稿的體裁決定（見 `../post/references/writing-guide.md#長文的體裁與語域`）在英文版一樣要成立，而且英文有中文沒有的失效方式：

- **長句直接搬過來會更難讀。** 中文一句 70 字，直譯成英文常常是 50+ 字的複合句。原文長就在這裡斷，不要等英文版再處理。
- **中文沒有被動語態問題，英文有。** 譯稿最容易生出 "it was found that" / "has been shown to" 這類無主詞句。改成誰做了什麼。
- **名詞化在英文更嚴重**：「進行了評估」→ 不是 "conducted an evaluation"，是 "evaluated"。
- **中文的「但書堆疊」翻成英文會變成一串 however / that said / it should be noted**。原文如果已經把但書收到節末，英文照做，不要因為句法不同又攤回去。
- 英文版可以用中文沒有的檢查：被動語態、副詞、Flesch-Kincaid。中文的 `register-scan.sh` 不適用英文檔。

**中文定稿之後才翻。** 中文還要改的話會翻兩次。

### 5. 雙向連結

兩篇都要互指對方：

zh-TW 版（原文）開頭加：
```markdown
> 🌏 [English version](/en/posts/<category>/<en-slug>)
```

en 版開頭加：
```markdown
> 🌏 [中文版](/posts/<category>/<zh-slug>)
```

實際 URL 結構先看 `src/pages/posts/[...slug].astro` 與 `src/pages/en/` 的路由怎麼吃 slug，**不要瞎猜**。

### 6. 參考資料連動

英文讀者點擊「中文 only」的官方連結會頭痛：

- 官方文件如果有英文頁 → 連結換成英文版
- 純中文資源（中文 blog 文章）→ 在連結後加 `(in Mandarin)`

### 7. 驗證

```bash
pnpm check:references
pnpm lint
pnpm astro check
```

### 8. Review + commit

把兩個檔案的 diff 給使用者看，確認後：

```bash
git add src/content/posts/<category>/YYYY-MM-DD-<en-slug>.md \
        src/content/posts/<category>/YYYY-MM-DD-<zh-slug>.md
git commit -m "post(<category>): add English version of <title>"
```

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「機翻整篇就好」 | 翻譯腔英文，讀者看不下去；改寫才能保留語氣 |
| 「不加雙向連結」 | 讀者不知道有另一語版本，等於沒做 |
| 「英文版用今天日期」 | date 是內容發布日，英文版是同一篇文章的另一語面，不是新文 |
| 「tag 翻成英文」 | tag 是分類 ID，翻了會破壞站內導覽聚合 |
| 「站內中文連結直接複製」 | 英文讀者點進去全中文，要不換成 en 版要不標註 |
| 「中文長句照著翻成英文長句」 | 中文 70 字一句直譯是英文 50+ 字的複合句，比原文更難讀。句子在中文版就該斷，譯稿不是修結構的地方 |
| 「原文的體裁我不用管，我只負責翻譯」 | 譯稿跟原稿是同一篇文章的兩面。原文改了結構、語域，英文版沒跟上，兩語版本就分岔了。本站踩過：中文改了三輪架構，英文版還停在最初版 |
| 「中文版之後可能還要改，先翻起來放」 | 那就會翻第二次。中文定稿才翻 |

## 詳細參考

- frontmatter schema：`../post/references/frontmatter-schema.md`
- 寫作風格：`../post/references/writing-guide.md`
