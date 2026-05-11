# 排程發布

這個專案現在支援「先合併到 `main`，等時間到自動上線」。

## 規則

- 文章維持 `draft: false`
- `date` 設成未來的發布日期
- 網站頁面、RSS、`/api/posts`、D1 sync 都會自動排除未來文章
- GitHub Actions `deploy.yml` 會在每天台北時間 `00:05` 重新 deploy 一次，把剛到點的文章釋出

## 實作位置

- 發布過濾：`src/utils/content.ts`
- 文章頁與列表頁：`src/pages/**`
- RSS：`src/pages/rss.xml.ts`、`src/pages/en/rss.xml.ts`
- API：`src/pages/api/posts.ts`
- D1 sync：`scripts/sync-to-d1.ts`
- 定時 deploy：`.github/workflows/deploy.yml`

## 編輯流程

1. 寫文章，frontmatter 正常填完。
2. 把 `date` 設成目標發布日，例如 `2026-05-20`。
3. 保持 `draft: false`，直接 merge 到 `main`。
4. 到發布日的凌晨定時 deploy 後，文章會自然出現在首頁、分類、標籤、系列、RSS。

## 本地檢查

- 如果你想在本地預覽未來文章，直接開該 markdown 看內容即可。
- `pnpm sync` 預設不會把未來文章同步到 D1。
- 真的要連未來文章一起 sync，才用：

```bash
pnpm sync -- --include-future
```
