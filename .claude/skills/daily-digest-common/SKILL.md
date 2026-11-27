---
name: daily-digest-common
description: "Shared rules for all daily-digest skills: the search-tool fallback chain, the tldr field rule, and the commit epilogue (diagram pass, en translation, per-routine daily-log file, never progress.txt, targeted verify, then commit/push)."
---

# daily-digest-common — 共用規則與提交尾聲

本文件放各 daily-digest skill 共用的三塊規則：搜尋工具 fallback 鏈、tldr 欄位規則、Commit Epilogue。

Commit Epilogue：所有 daily-digest skill（除 `daily-digest-signals` 只產 JSON 外）在文章撰寫完成後、`git add` 之前，**必須依序執行 E0–E5**。各 skill 的 Step 7 應引用本文件。

---

## 搜尋工具 fallback 鏈

所有 daily-digest routine 共用，遵循全域 Web Fetch 規則。公開網頁研究與抓取**優先**用 Groundlane MCP：

| 用途 | 工具 | 說明 |
|---|---|---|
| **搜尋/發現** | Groundlane `web_search` | 合併結果去重，覆蓋面最廣 |
| **特定頁面抓取** | Groundlane `web_fetch` | 已知 URL 的頁面內容擷取 |
| **欄位抽取** | Groundlane `web_extract` | selector／table 結構化擷取 |
| **結構化 API** | 直接呼叫（GitHub `gh api`、arXiv API、Hugging Face API、MOPS/FinMind 等） | 有 API 的來源不用搜尋工具 |

各 routine 自己的「搜尋工具優先順序」若有額外列（例如 HF API），以該 routine 為準。

**Groundlane 失效不是 blocker。** 工具不存在、OAuth／token 失效（例如直接 HTTP 回 `401 invalid_token`）、逾時或配額用完，都依下面順序換下一層，routine 照常產出：

1. **Groundlane MCP**（`web_search`／`web_fetch`／`web_extract`）— 首選
2. **Groundlane 直接 HTTP**（MCP connector 不可用時）— 用 `WebFetch` POST `https://groundlane.vincent-xu-work.workers.dev/mcp`，繞過 claude.ai connector 層（環境有 `GROUNDLANE_AUTH_TOKEN` 才帶 `Authorization: Bearer`；回 401 就直接跳下一層，不要重試）
3. **Keenable keyless API** — `GET https://api.keenable.ai/v1/search/public`，Header `X-Keenable-Title: quidproquo`；10 萬次／月免費，不需要 API key。上限 10 RPS：同一批最多 3 個 query，遇 429 等 1 秒後單發重試
4. **You.com keyless** — `GET https://api.you.com/mcp?profile=free`；100 次／天免費，不需要 API key
5. **雲端 MCP fallback／平台內建搜尋** — 依序嘗試 `Exa`、`Tavily`、`linkup`、`jina`、`firecrawl`，或 agent 平台自帶的 web search（Exa 免費 MCP 常 429，撞到就換下一個）
6. **內建 `WebFetch`／平台內建 fetch** — 最後手段；搜尋到的 URL 用它讀全文，官方頁 403 時改讀其他獨立來源，不硬繞

判斷方式：先 `ToolSearch` 查 Groundlane MCP 工具是否存在且可呼叫（雲端 session 的 Groundlane 工具常是 deferred，沒載入過不算「不可用」）；若不存在或認證失敗，嘗試直接 HTTP POST Groundlane；再失敗則嘗試 Keenable／You.com keyless API；仍失敗才用雲端 MCP 和內建 WebFetch。

規則：

- 每一層失敗就換下一層，**只有 1–6 全部失敗**才算 blocker，這時把每層的錯誤訊息寫進 `docs/governance/escalation-queue.md`。
- 降級時在 daily-log 本次紀錄（或 screening record／輸出）寫 `toolDegradation`，例如 `groundlane 401 invalid_token → keenable keyless + WebFetch`，確保可追溯。
- 降級不放寬品質門檻：交叉驗證、一手來源優先、48 小時時間窗照舊。搜尋 snippet 只能用來發現候選，寫進文章前要讀到原文。
- Fallback 只送公開查詢，不傳 secrets、認證內容或私有資料。
- **禁止的是**：`stealth_fetch`、`web-fetch/fetch_page`（已退役工具）。
- **不禁止的是**：Groundlane 不可用時用 Exa／Tavily／linkup／jina／firecrawl 作為 fallback——這是全域規則允許的正常降級。
- 使用者在當次對話明確指定「只能用 Groundlane」時才不降級，指定路徑失敗就回報 blocker。

---

## tldr 欄位規則

`tldr` 欄位是 frontmatter，前端不會把它當 markdown 渲染，請用純文字，不要寫 `**`、`[]()` 等 markdown 語法。建議 1–2 句話，只講今天最核心的一個重點，不要塞全部重點。

---

## Commit Epilogue（取代各 skill 原本的 git add/commit/push）

### E0：圖解（依 diagram skill 補圖）

文章寫完、翻譯之前，逐節問一次：**讀者看圖會不會比讀這段文字更快懂？** 有多步驟流程、分支判斷、元件或架構關係、選項定位比較、層級、時間順序的段落，就讀 `../diagram/SKILL.md` 選圖型，照它的流程用 ```` ```diagram ```` 區塊畫（每篇 0–3 張；圖型配合內容，不要每張都是方框箭頭）。

- 常見對應：論文方法／系統架構 → 架構圖或流程圖；框架新版的控制流改變 → 前後對照；多個工具／模型／方案比較 → 比較矩陣或象限圖；資安事件的攻擊鏈、發布時程 → 循序圖或時間軸；定價前後 → 前後對照或長條圖。
- 圖只能畫正文已寫、有來源的內容；不確定的關係不畫實線。
- 純新聞條列、沒有結構可畫的段落不硬畫。真的整篇都沒有適合的段落，在 daily-log 本次紀錄寫「圖解：無適合段落」，不用另外說明。
- 已同時產出中英雙版的 skill（daily-digest-report、daily-digest-arxiv），兩版都要放同一張圖（座標相同，只換文字）；其他 skill 先畫在中文版，E1 的 `post-translate` 會把圖一起翻過去。

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

### E3：寫當日 routine 紀錄（不碰 progress.txt）

每支 routine 只寫自己的檔：`.work/daily-log/${TODAY}/${SKILL_NAME}.md`（`SKILL_NAME` 是 skill 名稱，例如 `daily-digest-arxiv`）。

```bash
mkdir -p ".work/daily-log/${TODAY}"
# 用 Write 工具寫 .work/daily-log/${TODAY}/${SKILL_NAME}.md
```

內容：一句話寫本次產出（或「無合格事件，未產出」），再條列例外，例如 `toolDegradation`、「圖解：無適合段落」、「diagram-preview 未跑：無瀏覽器」、install 錯誤、跳過的檢查。查證細節、候選清單這類過程不用寫，commit message 和文章本身就是紀錄。

**不准改 `progress.txt` 或 `docs/progress-archive.md`**（`pnpm verify` 會擋 `progress.txt` 出現 `daily-digest-*` 條目）。理由：一天十支 routine 都改 `progress.txt` 同幾行，本機只要有沒推的 commit 碰到它，pull 必衝突（2026-11-09 一次 merge 衝突、合併後 91 行超上限就是這樣來的）。一支 routine 一個檔，彼此不會撞。真的需要人處理的事照舊登錄 `docs/governance/escalation-queue.md`。

### E4：環境準備 + targeted verify

雲端沙箱一開始沒有 `node_modules`，下面的檢查腳本要 `gray-matter`。**只允許這一種安裝方式**：

```bash
pnpm install --frozen-lockfile
```

- routine 的 `sources` 已含 `lanefoundry/gatelane`（2026-09-21 起），`@lanefoundry/gatelane-sdk` 裝得起來。若 install 失敗，把錯誤前 5 行寫進 daily-log 本次紀錄，**照樣往下跑能跑的檢查**（`check:tw` 不需要任何依賴，一定要跑），不要嘗試修環境。
- 裝完後 `simple-git-hooks` 會把 pre-commit（= `pnpm verify`）裝進 `.git/hooks/`。這是預期行為，commit 會因此多跑 2–3 分鐘 `astro check`，等它跑完。

**硬規則（Tier 3，違反等於這次 routine 失敗）**：
- 不准動 `.git/hooks/` 底下任何檔案（`rm`、改內容、`chmod` 都不行）。
- 不准為了讓 install 過而改 `package.json`／`pnpm-lock.yaml`（包括「暫時拿掉再還原」）。
- 不准 `SKIP_SIMPLE_GIT_HOOKS=1`、`--no-verify`、`core.hooksPath` 之類繞 hook。
- pre-commit 紅燈時：紅在**自己這次新增／修改的檔案** → 修到綠；紅在**既有檔案** → 修它（A 級用語替換、series order 撞號這類 5 分鐘內能修的）並一起 commit；修不動的 → 走下方「被擋住時：成品落地」，把成品推上去、登錄 `docs/governance/escalation-queue.md`，讓人隔天處理。四個選項裡沒有「繞過」。
- 為什麼這麼嚴：2026-09-20／21 四支 routine（日報、arxiv、funding、tool）都是寫完文章後卡在 `rm .git/hooks/pre-commit` 的權限提示，session 永遠等不到人按，文章全部遺失。繞 hook 比紅燈本身代價更高。

**被擋住時：成品落地（2026-11-26，Q-054）**：只 `git add` 留在暫存區等於沒做。暫存區只存在這個容器裡，容器一回收，整天的成品就蒸發（Q-053、Q-054 兩次都是這樣；2026-11-25 一整天的 daily 文章因此補不回來）。紅燈修不動時：

```bash
mkdir -p ".work/blocked/${TODAY}/${SKILL_NAME}"
git reset -q                                                    # 先清掉暫存區，只提交落地檔
cp src/content/posts/daily/${TODAY}-*<本次檔名>*.md ".work/blocked/${TODAY}/${SKILL_NAME}/"   # 本次新增的文章（中英）
# 連同 daily-log 與 escalation-queue 新條目一起提交；這三處都在 pre-commit 的安全路徑，不會觸發文章檢查
git add ".work/blocked/${TODAY}/${SKILL_NAME}" ".work/daily-log/${TODAY}/${SKILL_NAME}.md" docs/governance/escalation-queue.md
git commit -m "docs(governance): 登錄 <Q 編號>，${SKILL_NAME} 成品暫存於 .work/blocked" -- ".work/blocked/${TODAY}/${SKILL_NAME}" ".work/daily-log/${TODAY}/${SKILL_NAME}.md" docs/governance/escalation-queue.md
git push origin main || { git pull --rebase origin main && git push origin main; }
```

- escalation 條目要寫明：被擋的檢查與完整輸出、成品在 `.work/blocked/<日期>/<skill>/`、解除後接手第一步 `git mv` 回 `src/content/posts/daily/` 再 commit，不需重做內容或重新查證。
- 不要把文章留在 `src/content/posts/` 底下 commit（會被同一個紅燈擋），也不要改檔名去閃避檢查。
- 連 `.work/` 的 commit 都被擋，才可以結束，並在最終回覆寫出被擋的完整輸出。

```bash
# 只跑會擋 CI 的檢查，確認新檔不引入紅燈
pnpm check:references
pnpm check:lang-parity
pnpm check:tw            # A 級用語（用戶→使用者、技術棧→tech stack、對標、賦能、品類…）擋 commit，每次必跑
pnpm check:series-order  # series order 撞號擋 commit
pnpm check:diagram-text  # 圖裡的字疊字、壓框線、線穿字、超出 viewBox；純 Node，沒有瀏覽器也照樣擋
pnpm emoji:fix src/content/posts/daily/${TODAY}-*.md  # 原始稿不放 emoji：🌏 → :globe:、✅ → ✓、⚠️ → :warning:，先自動換掉
pnpm check:no-emoji      # 還有 emoji 就擋 commit（code 區塊裡的不算）
# 有 diagram／flow-diagram 區塊的新檔，中英各跑一次（沒有區塊的檔案不要跑，腳本會回 exit 2）
grep -lE '^```(diagram|flow-diagram)$' src/content/posts/daily/${TODAY}-*.md | while read f; do
  pnpm exec tsx scripts/diagram-preview.ts "$f" --out "/tmp/diagram-preview/$(basename "$f" .md)" --skip-if-no-browser
done```

六項加 diagram-preview 都必須 0 error／0 blocking 才繼續（`check:diagram-text` 或 diagram-preview 有 ✗ 就修圖：最常見的是標題和右對齊的小字擠在同一列，把小字移到標題下一行、左對齊。環境沒有瀏覽器而 diagram-preview 被 skip 時，`check:diagram-text` 仍然必須 0 error，並在 daily-log 註明「diagram-preview 未跑：無瀏覽器，check:diagram-text 已過」）。有 error 就修，不准 `--no-verify` 繞過。`check:tw` 的 `[WARN]` 是 B 級看語境，`[ERROR]` 才擋。

### E5：commit + push

```bash
git add src/content/posts/daily/${TODAY}-*.md ".work/daily-log/${TODAY}/${SKILL_NAME}.md"
git commit -m "post(daily): ${COMMIT_SUBJECT} ${TODAY}"
git push origin main || { git pull --rebase origin main && git push origin main; }
```

提交訊息用中文（中文內容 → 中文 summary），格式 `post(daily): <主題> YYYY-MM-DD`。
