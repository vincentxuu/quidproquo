---
name: daily-digest-common
description: "Shared commit epilogue for all daily-digest skills: en translation, progress.txt update, targeted verify, then commit/push."
---

# daily-digest-common — 共用提交尾聲

所有 daily-digest skill（除 `daily-digest-signals` 只產 JSON 外）在文章撰寫完成後、`git add` 之前，**必須依序執行以下步驟**。各 skill 的 Step 7 應引用本文件。

---

## Commit Epilogue（取代各 skill 原本的 git add/commit/push）

### E1：產英文版

```bash
# 用 post-translate skill 產英文版
# 輸入：剛寫好的 zh-TW 文章路徑
# 輸出：同目錄下的 -en.md
```

invoke `post-translate` skill，傳入剛寫好的中文版路徑。若 skill 本身已同時產出中英雙版（如 daily-digest-report、daily-digest-arxiv），跳過此步。

### E2：修 check:references WARN

```bash
node scripts/check-post-references.mjs -- "${ZH_FILE}" "${EN_FILE}"
```

若腳本支援單檔模式就只檢查新檔；否則跑全量，只看新檔的輸出。對新檔的每個 WARN：

- **「參考資料和標題/主要段落缺少明顯關鍵詞重疊」**：在「## 參考資料」補充與文章主題直接相關的來源連結（優先用文中已引用的 URL）。
- **「參考資料可能不足：主題段落 N 個，但只有 M 個連結」**：補充來源連結，讓連結數 ≥ ceil(段落數 × 0.5)。

修完後重跑確認 0 WARN。

### E3：更新 progress.txt

```bash
# 更新 Last updated 行
sed -i '' "s/^Last updated:.*/Last updated: $(TZ=Asia/Taipei date +%Y-%m-%d)/" progress.txt
```

同時在 `Recently completed` 區段補一行描述本次產出（一句話即可）。若 progress.txt 超過 85 行，先把最舊的 `Recently completed` 條目移到 `docs/progress-archive.md`。

### E4：targeted verify

```bash
# 只跑會擋 CI 的檢查，確認新檔不引入紅燈
pnpm check:references
pnpm check:lang-parity
# progress.txt 格式
grep -q "^Last updated: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}" progress.txt || echo "FAIL: progress.txt missing Last updated line"
```

三項都必須 0 error 才繼續。有 error 就修，不准 `--no-verify` 繞過。

### E5：commit + push

```bash
git add src/content/posts/daily/${TODAY}-*.md progress.txt
git commit -m "post(daily): ${COMMIT_SUBJECT} ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

提交訊息用中文（中文內容 → 中文 summary），格式 `post(daily): <主題> YYYY-MM-DD`。
