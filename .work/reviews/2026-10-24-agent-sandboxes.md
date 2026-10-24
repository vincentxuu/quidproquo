# 審稿紀錄：沙箱怎麼選（series order 2）

審稿日：2026-10-24。審稿者是沒有參與撰寫的獨立 agent，報告全文在 session scratchpad（`review-verify-b2.md`、`review-structure-b2.md`）。下表「處理結果」不採子代理自述，是事後逐條讀目前的 `agent-sandboxes.md` 與 `-en.md` 確認的（zh 與 en 都看）。

## post-verify

| 問題 | 處理結果 |
|---|---|
| S-12 ❌ CVE 共通點概括不適用 CVE-2026-25725 | 已修。zh、en 都改成「沙箱裡寫下的東西，後來被沙箱外的 Claude Code 當成可信設定或路徑」，「各自寫不到、合起來就能」只掛在 CVE-2026-39861；25725 補上 Linux bubblewrap、不存在的設定檔 |
| S-14 公開案例分類偏窄（漏沙箱自己產生規則的邏輯錯誤） | 已修。新增一段 CVE-2025-59532、CVE-2025-66479，結論句改成「就目前公開的…來看」，不再有「沒找到不等於不存在」的過程句 |
| S-15 「周邊信任鏈才是弱點」 | 已修。改成「我的判斷是…出問題的是它周邊的信任鏈」並標為判斷 |
| S-25 「兩個設定才是嚴格模式」與官方不符 | 已修。步驟 3 改成 `allowUnsandboxedCommands: false` 即官方的 Strict sandbox mode，`failIfUnavailable` 另述 |
| S-24 缺 `credentials` 只管 Bash、專案設定檔不生效 | 已修。步驟 1 有 JSON 範例與兩個但書，並加 `permissions.deny` 的 `Read(...)` |
| S-19 Strix 「API 憑證」是推論 | 已修。改為「至少包括 sudo 和對外連線」 |
| S-9 E2B 「多租戶」「服務商」是推論 | 已修。改成「每個沙箱與其他沙箱和主機隔離…不是給本機開發者包住 Claude Code 用的」 |
| S-5 E2B 缺 Firecracker 出處 | 已修。zh、en 都加 E2B docs 連結（內文與參考資料） |
| S-22 nono「不是防逃逸」出處缺 | 已修。內文與參考資料加 nono.sh security-model 連結 |
| S-10 Daytona 日期與 v0.190.0 出處是 README | 已修。內文與參考資料加 daytonaio/daytona README |
| S-11／S-13 措辭可更精確（Linux bubblewrap、「沙箱外的 Claude Code 程序」） | 已修 |
| S-18 引號內保留英文原句 | 部分修。zh 保留 "significantly lowers the impact" 並附中文，但英文夾在中文句中，post-polish 的中英混用疑慮見下 |
| S-26 可補 bypassPermissions 模式下重試不提示 | 不修（驗證者標「可補」，非錯誤；這篇已因篇幅取捨） |
| 表格 Codex 讀取範圍留空 | 已修。Codex 欄寫「文件沒有列出預設讀取範圍」 |
| 其餘 ✅（S-1～S-8、S-16、S-17、S-20、S-21、S-23、S-27～S-35） | 無需處理 |

未驗範圍（審稿者聲明）：只讀文件，未安裝或執行；smolvm／E2B／k8s／clawk 沒逐頁讀子頁。另外，審稿後新加進稿子的內容不在驗證者的 36 列裡，我事後對 scratchpad 內的官方文件抓檔核對了部分：`touch ~/sandbox-probe` 驗證法（cc-sandboxing 有）、auto-allow 模式（有）、`srt claude`（驗證者已查 S-29）。尚未對文件核對：`/sandbox` 指令、`claude --version`、`Read(~/.ssh/**)` 規則語法、`~/.srt-settings.json` 預設拒絕所有網路的括號說明、JSON 範例整體能否被 Claude Code 接受（`credentials.files[].path/mode` 驗證者只看過鍵名）。

## post-review

| 項目 | 處理結果 |
|---|---|
| B2-1 必修：結尾用了 hook 一詞（規劃表定 order 2 不用） | 部分修。結尾已改成「動作發生之前的把關：…檢查腳本（hook）、護欄與閘道」，仍含 hook；表格範圍列也有「（第 0 篇提過的 hook）」。zh 與 en 都一樣。是作者刻意與 order 0 對齊還是要移除，需主人決定 |
| B2-2 必修：自動腳本／檢查腳本／腳本 用詞不一 | 已修（方向與建議不同）。order 2 全文統一成「檢查腳本」並指向第 0 篇，與 order 0 的「檢查腳本（稱為 hook）」同名；審稿者建議的是全系列改「自動腳本」，沒採用。order 0 本身沒動 |
| B2-3 必修：「怎麼用」缺鍵名與範例 | 已修。有完整 `settings.json` 範例、`/sandbox`、`srt claude` 與安裝指令 |
| B2-4 必修：內建工具不受沙箱管，憑證設定擋不住 Read | 已修。步驟 1 加 `permissions.deny`，並新增自我檢查題；「沙箱和權限確認是兩層」一段也補了比較基準 |
| B2-5 必修：缺「沒有獨立量測」限制句 | 已修。「目前也沒有獨立研究量過這些沙箱實際擋得住多少，這篇只比範圍，不排名」，en 同 |
| B2-6 必修：標題與內文不符 | 已修。標題改為「沙箱怎麼選：四種隔離的差別，以及 Claude Code 與 Codex 的預設差在哪」，en 同步 |
| B2-7 必修：研究過程外洩與但書堆疊 | 已修。「我沒有找到」整句移除 |
| B2-8 Daytona 孤兒段 | 已修。獨立成段並補動作「先看 repo 最近一次發版日期和授權」 |
| B2-9 Pillar 立場註記與重複 | 已修。併成一句，立場提醒刪除；但系列 order 0、1 對 Adversa 仍有立場註記，跨篇做法是否統一未處理 |
| B2-10 Codex 讀取範圍 | 已修（見上） |
| B2-11 作者分類寫成事實、「各家」 | 已修。H2「我把沙箱分成四種」、tldr「我把…分成」、「Claude Code 與 nono 都寫得很直接」；en 同 |
| B2-12 CVE 段數字密度 | 已修。修復版本收成「確認 2.1.64 以上」，新增第 0 點 `claude --version` |
| B2-13 第 5、6 點抽象或離題 | 已修。第 6 點改成情境→隔離表，第 7 點改為「掛載前先問自己」並先介紹 clawk。仍有疑慮：「本機 microVM」沒給具體啟動步驟，只寫「從它的 README 開始」 |
| B2-14 開頭與 tldr 缺答案先行 | 已修。「先講結論」一段與 tldr 末句都有 |
| B2-15 「第二道」排序說法 | 已修。改為「沙箱不防止被騙，只決定被騙之後能走多遠」；「整體來說」仍重複同一句，輕微 |
| B2-16 台灣用語與翻譯腔 | 已修。同核→共用核心、託管→代管、網路可達性→對外連線、工作區統一為工作目錄、中文引號轉述改無引號 |
| 範圍卡：自我檢查題 MCP server 是否在沙箱內 | 已修。「自我檢查」有兩題 |
| B2-18 en 小問題 | 已修。clawk 小標改為無標題的第 7 點；“Each vendor” 已改成 “Claude Code and nono are both direct about this” |
| Cursor 沒提（選填 🟢） | 不修（審稿者標可選，系列規劃未要求） |

## post-polish

| 指標 | 結果 |
|---|---|
| 長句、模板化轉折、引述區塊 | 審稿者量到 0 |
| 但書密度 | 審稿者量到 25%，黃區；B2-7、B2-9 兩處最重的已改，其餘未重測 |
| 數字密度 | CVE 段 8 個數字的問題已修（B2-12）。CVE 編號仍列在條目文字中，是連結文字 |
| 英文術語堆疊 | 審稿者判定無。microVM 首次出現是否加中文：tldr 與四種分類清單先出現「本機 microVM」，括號說明「（輕量虛擬機）」在第三項才有，未完全照建議（首次出現加括號）。部分修 |
| 中英混用 | 「這 significantly lowers the impact（大幅降低了影響）」夾英文原句在中文句內，post-polish 可能視為混用，主人決定要不要改成純轉述或獨立引述 |
| 增量歸因 | 憑證保護只對 Bash 成立、Read 工具走權限規則：已在步驟 1 與自我檢查切開 |
| 作者推論寫成事實 | 「逃逸多半發生在邊界旁邊」現標為「我的判斷」，已修 |
| 機械檢查 | 審稿者跑 check-process-leak、check-tw-terms、scan-ledger 皆無命中；`pnpm check:references` 當時環境失敗未驗。我這次沒有重跑任何檢查 |
