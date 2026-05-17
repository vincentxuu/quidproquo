---
name: post-translate
description: Translate an existing zh-TW post under src/content/posts/<category>/ into an English version, write it to the same category folder with lang: en, and link the two posts to each other. Use when user says 翻成英文 / 翻成 en / translate post / 出個英文版 and references an existing zh-TW post. Skip when the source post is already lang: en.
---

# post-translate skill

把既有 zh-TW 文章做出英文版，存到同一 category，同時建立雙向連結。

## 路由規則

雙語靠：

1. `frontmatter.lang: en`
2. 英文版檔名換成英文 slug，通常同層並加 `-en`

範例：

```text
src/content/posts/ai/2026-05-08-anthropic-claude-skills-guide.md
src/content/posts/ai/2026-05-08-anthropic-claude-skills-guide-en.md
```

## 執行步驟

1. **定位原文**：用 path、slug、title keyword 找。確認 `lang: zh-TW`；如果已是 `en`，改用 `post-update`。
2. **確認策略**：
   - 直譯：reference / 規格類文章
   - 改寫：保留結構與要點，調整文化脈絡（預設）
   - 節譯：只翻精華段
3. **建立英文檔**：
   - `title` 翻成英文
   - `lang: en`
   - `tldr` / `description` 重寫成自然英文
   - `tags` 維持原 tag，不翻譯
   - `date` 沿用原文發文日
   - `category` / `type` / `series` 不動
4. **翻譯內容**：
   - 程式碼、命令、檔案路徑、變數名不翻
   - 人名、產品名、論文標題保留原文
   - 中文口語、台灣脈絡要改寫，不要翻譯腔
   - 圖片 alt text 要翻
   - 站內連結若有英文版就改英文版；沒有就標 `(zh-TW only)`
5. **雙向連結**：
   - zh-TW 版開頭加 English version
   - en 版開頭加 中文版
   - 實際 URL 先看 route，不要猜
6. **參考資料連動**：
   - 官方文件若有英文頁，英文版優先連英文頁
   - 中文資源在英文文章中標 `(in Mandarin)`
7. **驗證**：
   ```bash
   pnpm check:references
   pnpm lint
   pnpm astro check
   ```
8. **diff review**：兩個檔案都給使用者看，確認後再 commit。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 機翻整篇 | 翻譯腔英文讀者看不下去 |
| 不加雙向連結 | 讀者不知道有另一語版本 |
| 英文版用今天日期 | 英文版是同一篇文章的另一語面 |
| tag 翻成英文 | tag 是 ID，翻了會破壞聚合 |

## 詳細參考

- frontmatter schema：`../post/references/frontmatter-schema.md`
- 寫作風格：`../post/references/writing-guide.md`
