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

### E4：環境準備 + targeted verify

雲端沙箱一開始沒有 `node_modules`，下面的檢查腳本要 `gray-matter`。**只允許這一種安裝方式**：

```bash
pnpm install --frozen-lockfile
```

- routine 的 `sources` 已含 `lanefoundry/gatelane`（2026-09-21 起），`@lanefoundry/gatelane-sdk` 裝得起來。若 install 失敗，把錯誤前 5 行寫進 progress.txt 本次條目，**照樣往下跑能跑的檢查**（`check:tw` 不需要任何依賴，一定要跑），不要嘗試修環境。
- 裝完後 `simple-git-hooks` 會把 pre-commit（= `pnpm verify`）裝進 `.git/hooks/`。這是預期行為，commit 會因此多跑 2–3 分鐘 `astro check`，等它跑完。

**硬規則（Tier 3，違反等於這次 routine 失敗）**：
- 不准動 `.git/hooks/` 底下任何檔案（`rm`、改內容、`chmod` 都不行）。
- 不准為了讓 install 過而改 `package.json`／`pnpm-lock.yaml`（包括「暫時拿掉再還原」）。
- 不准 `SKIP_SIMPLE_GIT_HOOKS=1`、`--no-verify`、`core.hooksPath` 之類繞 hook。
- pre-commit 紅燈時：紅在**自己這次新增／修改的檔案** → 修到綠；紅在**既有檔案** → 修它（A 級用語替換、series order 撞號這類 5 分鐘內能修的）並一起 commit；修不動的 → 把紅燈輸出寫進 `docs/governance/escalation-queue.md` 新條目，**不 commit、直接結束**，讓人隔天處理。四個選項裡沒有「繞過」。
- 為什麼這麼嚴：2026-09-20／21 四支 routine（日報、arxiv、funding、tool）都是寫完文章後卡在 `rm .git/hooks/pre-commit` 的權限提示，session 永遠等不到人按，文章全部遺失。繞 hook 比紅燈本身代價更高。

```bash
# 只跑會擋 CI 的檢查，確認新檔不引入紅燈
pnpm check:references
pnpm check:lang-parity
pnpm check:tw            # A 級用語（用戶→使用者、技術棧→tech stack、對標、賦能、品類…）擋 commit，每次必跑
pnpm check:series-order  # series order 撞號擋 commit
# progress.txt 格式
grep -q "^Last updated: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}" progress.txt || echo "FAIL: progress.txt missing Last updated line"
```

五項都必須 0 error／0 blocking 才繼續。有 error 就修，不准 `--no-verify` 繞過。`check:tw` 的 `[WARN]` 是 B 級看語境，`[ERROR]` 才擋。

### E5：commit + push

```bash
git add src/content/posts/daily/${TODAY}-*.md progress.txt
git commit -m "post(daily): ${COMMIT_SUBJECT} ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

提交訊息用中文（中文內容 → 中文 summary），格式 `post(daily): <主題> YYYY-MM-DD`。
