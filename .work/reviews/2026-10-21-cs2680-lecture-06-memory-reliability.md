審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-06-memory-reliability.md，sha256：456cb265dc59e692e1912ca729c2eb38579f677863096452d4e7876fe9a3024e

post-verify、post-polish：作者自查（撰寫的子代理），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/6_agent_design_3.pdf`（31 頁，頁碼用 PDF 頁序，已逐頁以 pdftotext 對過；頁尾印的號碼從 p19 起比 PDF 頁多 1）、`.work/research/harvard-cs2680/lectures-05-08.md` L6 段、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 8、查證表 `.work/research/harvard-cs2680/l6-factcheck.md`、閱讀頁 `sources/pages/readings_sep-28.txt`。

## post-verify

查證表 `l6-factcheck.md` 共 23 項：Confirmed 19、Confirmed（需加條件）3、Outdated 1、Contradicted 0、Not found 0。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 斷線 → Keenable 搜尋＋`curl` 直接抓原頁（arXiv export API 與 PDF、GitHub raw README、code.claude.com `.md`、ACL Anthology），Mem0／Letta 文件頁用 r.jina.ai 讀全文。LoCoMo 題數用公開的 `locomo10.json` 實際計數。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 第 6 堂 2026-09-28，題目 Agent design III: memory and reliability | 投影片 p1、課表 | Confirmed | 投影片標題的錯字（reliabiltiy）不照抄 |
| 2 | 導言 | 課程不錄影 | cs2680.com/policy | Confirmed | |
| 3 | 導言 | 記憶 p5–21、可靠度 p22–30；p3 說要續講多 agent，p4 空白 | 逐頁標題 | Confirmed | |
| 4 | context window 不是記憶 | context window = 暫時工作狀態；memory store = 跨互動持久狀態 | p5 | Confirmed | |
| 5 | 六個決定 | 六個階段與「誰擁有」 | p6 | Confirmed | |
| 6 | 寫不寫 | recall／precision 光譜與四種觸發方式 | p7 | Confirmed | |
| 7 | 寫不寫 | Claude Code auto memory 判斷下次用不用得到；可推出的不存；明講會存 | code.claude.com/docs/en/memory | Confirmed | |
| 8 | 存成什麼樣子 | 四種表示與例子、取捨 | p8 | Confirmed | 「摘要丟掉從 vLLM 換過來」是本文的推論，寫成「注意摘要那一列」 |
| 9 | 存在哪裡 | 四類儲存與產品名、擅長項目 | p9 | Confirmed | 「能回答的問題」欄標為本文補充 |
| 10 | 讀寫時機 | 自動／runtime／模型控制三種與優缺點；混合、讀寫政策可不同 | p10 | Confirmed | |
| 11 | 讀寫時機 | MEMORY.md 前 200 行或 25KB 自動載入；主題檔按需讀 | Claude Code 文件 | Confirmed | |
| 12 | 取回 | 基本流程與五個訊號 | p11 | Confirmed | 「vLLM／SGLang 語意一樣像」是本文例子 |
| 13 | 歸納 | 四個問題 → 中等信心的假設；何時歸納 | p12 | Confirmed | |
| 14 | 遺忘 | 四個理由、四種手段 | p13 | Confirmed | |
| 15 | valid time／provenance | 4 月 vLLM 被取代、6 月 SGLang 目前；Episode 28 | p14 | Confirmed | |
| 16 | valid time／provenance | Graphiti 舊事實標失效不刪除、可追回 episode | Graphiti README | Confirmed | |
| 17 | valid time／provenance | Claude Code 記錄寫入時間、索引快滿時提醒合併或刪除過期條目 | Claude Code 文件 | Confirmed | |
| 18 | 歸屬 | agent 自己管 vs 專門記憶系統 | p15 | Confirmed | |
| 19 | 三個系統表 | 投影片描述 | p16 | Confirmed | |
| 20 | 三個系統表 | Mem0 現況：多訊號、graph 自動、ADD-only | Mem0 文件、README | Outdated（投影片） | 「現況」欄寫明 |
| 21 | 三個系統表 | Graphiti 是 Zep 核心元件 | arXiv 2501.13956 | Confirmed | |
| 22 | 三個系統表 | supermemory 宣稱處理矛盾、過期自動失效 | supermemory README | Confirmed | 寫成「宣稱」 |
| 23 | Mem0 段 | 搬家例子、update／delete 要明確呼叫 | Mem0 文件 | Confirmed | 例子沿用 Mem0 文件 |
| 24 | p21 段 | 兩疊架構、中間問號；Claude Code 屬右邊 | p21 圖、Claude Code 文件 | Confirmed | 只歸類 Claude Code |
| 25 | p21 段 | MemGPT 主記憶體／磁碟、memory pressure 警告、函式呼叫搬資料 | arXiv 2310.08560 §2 | Confirmed | |
| 26 | p21 段 | Letta 是 MemGPT 團隊後來做的 | Letta README「f.k.a. MemGPT」 | Confirmed | |
| 27 | 八種失敗 | 八種失敗與說明、哈佛例子 | p18 | Confirmed | 「對應的決定」欄標為本文補充 |
| 28 | 八種失敗 | MINJA：只靠查詢就能寫入惡意紀錄 | arXiv 2503.03704 | Confirmed | |
| 29 | 評估 | 四組指標 | p19 | Confirmed | |
| 30 | 評估 | LoCoMo ACL 2024、10 段、1,540 題 | ACL Anthology、locomo README、locomo10.json 計數 | Confirmed | |
| 31 | 評估 | LongMemEval ICLR 2025、500 題、5 種能力 | arXiv 2410.10813 | Confirmed | |
| 32 | 評估 | BEAM ICLR 2026、100 段、2,000 題、最長 10M | arXiv 2510.27246 | Confirmed | |
| 33 | 評估 | 1,986 題、扣 446 題 adversarial = 1,540 | locomo10.json 計數 | Confirmed | |
| 34 | 評估 | LoCoMo-Refined 修訂 337 題、換更嚴 judge | LoCoMo_refined README | Confirmed | 標為第三方 |
| 35 | 評估 | full-context 基準線和號稱最好的記憶系統差不多 | locomo-audit README | Confirmed | 標為非同儕審查的獨立稽核 |
| 36 | 評估 | Mem0、supermemory 都宣稱領先，自家數字 | 兩家 README | Confirmed | |
| 37 | 接點 | p26 記憶錯誤列 | p26 | Confirmed | |
| 38 | 錯誤複利 | 95%／77%／60%／36%／8%；13 次 1 次 | p22；自行計算 | Confirmed | |
| 39 | 錯誤複利 | 0.95¹⁰ ≈ 0.60、0.99²⁰ ≈ 0.82 | 自行計算 | Confirmed | 標為本文補的算術 |
| 40 | 錯誤複利 | 每步獨立假設；真實更糟 | p22 | Confirmed | |
| 41 | 錯誤複利 | Sinha 等人 self-conditioning、每步正確率隨步數下降 | arXiv 2509.09677 | Confirmed | |
| 42 | 錯誤複利 | Ord：METR 題組上指數模型擬合佳，推廣未知 | arXiv 2505.05115 | Confirmed（需加條件） | 條件寫進正文 |
| 43 | 自我檢查 | 0.97³⁰ ≈ 0.40、0.99³⁰ ≈ 0.74、0.97¹⁵ ≈ 0.63 | 自行計算 | Confirmed | |
| 44 | 五層 | 五層與各層問題 | p24 | Confirmed | |
| 45 | 五層 | 第 5 堂切分失敗歸 harness 層；作業 2 五種失敗多在 harness 與工具 | 規劃表「跨篇」列；作業 2 導讀失敗表 | 編排決定 | 寫成「本系列」 |
| 46 | 五張表 | 26 列案例 | p25–29 | Confirmed | 逐列對過原文 |
| 47 | 五張表後 | Where LLM Agents Fail：根源錯誤一路傳下去 | arXiv 2509.25370 | Confirmed | |
| 48 | 為失敗而設計 | 五層原則與做法；最後一句 | p30 | Confirmed | |
| 49 | 為失敗而設計 | Beyond the Leaderboard 27 篇、多加 scaffolding 不一定更可靠 | arXiv 2607.05775 | Confirmed | |
| 50 | 綜合自我檢查 3 | 0.95⁵⁰ ≈ 0.08、0.95²⁵ ≈ 0.28、約三倍半 | 自行計算（3.6 倍） | Confirmed | |

### 範圍卡對照

- 教學例子（0.95²⁰ ≈ 0.36、10 步 ≈ 0.60、0.99 → 0.82）：已寫入「錯誤會複利」。
- 自我檢查判準（三週前的筆記用了已刪除的 API）：已寫入；範圍卡寫「memory 層」，但五層裡沒有 memory 層，照投影片 p26 歸 harness 層的「記憶錯誤」，修法照範圍卡寫 valid time／provenance 與遺忘政策。
- 四種 store 小表：已寫入「存在哪裡」。
- 前後半用 p26 接起來：「接點：把過期的筆記當成事實」一節。
- 五層歸因當主線、第 5 堂切分失敗歸 harness 層：已寫入。
- 前置連結第 2 堂（CLAUDE.md 與 auto memory）、第 4 堂（四種管理手段），回扣第 5 堂：已寫入；錨點依 github-slugger 規則推算，第 2 堂的 id 對過舊版 dist。

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `456cb265dc59e692e1912ca729c2eb38579f677863096452d4e7876fe9a3024e`，與檔頭一致（審稿期間未改）。行號指這個版本。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。
- `register-scan.sh`：長句 5（最長 L351 76 字，來源說明；L31 64 字、L98 63 字、L230 61 字、L332 66 字）、但書 9/101 段（8%）、引述區塊 6（都是自我檢查）、數字 ≥4 的段落 8（日期、頁碼、錯誤複利算術、來源說明，可接受）、姓名主詞 1（Toby Ord）、模板化轉折 0、英文術語段 3（benchmark、README，可保留）。
- `pnpm check:references`：本篇只有 `-en` 尚未產出的 ERROR，依指示忽略。
- `pnpm check:links`：25 條外部連結，0 壞。
- `check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0。
- 站內錨點：L33 第 2 堂 `#claudemd-與-auto-memory`（H3「CLAUDE.md 與 auto memory」）、第 4 堂 `#四種管理手段` 都對得上；Claude Code 文件的 `#auto-memory`、`#how-it-works` 兩個錨點存在。
- 全文沒有 diagram 區塊，見 should-fix 9。

### 事實抽驗

投影片抽 16 處（`pdftotext -f N -l N` 逐頁對 PDF 頁序，31 頁逐頁標題確認頁碼；p7、p21 另轉成圖看版面）：p3 大綱與 p4 空白；p5 兩個定義；p6 六問與歸屬；p8 四種表示的例子與取捨；p9 四類儲存、十個產品名與擅長項目；p10 三種時機、優缺點與「read and write policy may differ」；p11 五個訊號；p12 四個提問、medium 信心與兩種歸納時機；p13 四理由四手段；p14 April/June、superseded/current、Episode 28、SERVES_WITH；p16 三系統描述；p18 八種失敗與哈佛例子；p19 四組指標；p20 三個 benchmark 數字；p22 95/77/60/36/8％、1 in 13、獨立假設；p24 五層；p25–29 二十六列案例逐列對過；p30 五層原則與結語。頁碼全部正確，數字全部對得上。不準的三處：L65「從最挑到最寬」（should-fix 5）、L255「三個 bug 修錯了一個」（should-fix 6）、L156「這條路的起點是 MemGPT」（should-fix 4）。

算術自己重算：0.95⁵＝0.774、0.95¹⁰＝0.599、0.95²⁰＝0.358、0.95⁵⁰＝0.077（≈1/13）、0.99²⁰＝0.818、0.97³⁰＝0.401、0.99³⁰＝0.740、0.97¹⁵＝0.633、0.95²⁵＝0.277（0.277／0.077＝3.6 倍）。全部正確；L232 自我檢查的問法有問題，見 should-fix 3。

外部來源抽 9 個，用 `curl`（arXiv export API、GitHub raw README、code.claude.com `.md`）與 `r.jina.ai`（Mem0 文件）抓原文：
- Claude Code memory 文件：「first 200 lines of `MEMORY.md`, or the first 25KB」「skips anything it can derive from the codebase」「git history」「decides what's worth remembering based on whether the information would be useful in a future conversation」「merge or drop stale entries」「records the write time in a `modified` frontmatter field」。L72、L108、L137 Confirmed；寫入時間只在檔案以 YAML frontmatter 開頭時記錄（nit 3）。
- Mem0 How Mem0 Works：四種訊號表（Semantic／Keyword／Entity／Temporal，Platform fuse）、「I moved from Austin to Seattle … without silently rewriting the old one. Use explicit update or delete」；Graph Memory 頁「built in … no Neo4j … always on」；README「New Memory Algorithm (April 2026)」「Single-pass ADD-only extraction … nothing is overwritten」。L150、L154 Confirmed。
- Graphiti README：「invalidated — not deleted」「Every entity and relationship traces back to the episodes」。L137 Confirmed。
- MemGPT arXiv 2310.08560：虛擬 context 管理、記憶分層、OS 類比。L156 機制 Confirmed（歸類問題見 should-fix 4）。
- MINJA arXiv 2503.03704：「without assuming that the attacker can directly modify the memory bank」「only interacting with the agent via queries」「retrieved when processing later victim queries」。L173 Confirmed。
- LoCoMo `locomo10.json` 實際計數：10 段、1,986 題，category 5 共 446 題，1,986−446＝1,540。L189、L194 Confirmed。
- BEAM arXiv 2510.27246：「100 conversations and 2,000 validated questions」「up to 10M tokens」。L190 Confirmed。
- LoCoMo-Refined README：「over-credit answers that were close in topic but wrong in detail」「Revised QA samples 337」「stricter LLM judge」。L195 Confirmed。locomo-audit README：full-context 92.62% 高於 EverMemOS 92.32%，「The answer prompt, not the memory system, explains the score」。L196 Confirmed（可更具體，nit 4）。
- Sinha 等 arXiv 2509.09677：「per-step accuracy … degrades as the number of steps increases」「self-conditioning … more likely to make mistakes when the context contains their errors from prior turns」。L230 Confirmed。Ord arXiv 2505.05115：「within their suite of research-engineering tasks」「a constant rate of failing during each minute a human would take to do the task」「Whether this model applies more generally … is unknown」。L230 Confirmed，但「每分鐘」少了「人類做這題所需的」（nit 5）。Beyond the Leaderboard arXiv 2607.05775：「synthesizes 27 benchmark, taxonomy, and audit papers」「additional scaffolding does not consistently improve reliability」。L319 Confirmed。

### 教學規格對照（概念導讀，單堂）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L31 | 有，跟範圍卡一致 |
| 讀完能力一：替 agent 回答記憶設計清單 | L35–201、綜合題 1 | 六個決定逐節都有機制與 SGLang 例子，教得完整。但綜合題 1 要讀者「用 p17 的清單」，正文從沒介紹過 p17；判準也漏了「何時歸納」（should-fix 1） |
| 讀完能力二：把失敗案例歸到五層之一 | L235–305、綜合題 2 | 分類表齊全，L302 點出同一症狀可能來自不同層，但沒給「怎麼判斷」的步驟；本節自我檢查的答案 L207 已經直接講過（should-fix 2） |
| 範圍卡例子 0.95²⁰／10 步／0.99 | L211–228 | 有，算術正確，標明為本文補的算術 |
| 範圍卡自我檢查「三週前的筆記、已刪除的 API」 | L304–305 | 有；照 p26 歸 harness 層，偏離範圍卡「memory 層」的理由寫在 post-verify 範圍卡對照，合理 |
| 斷崖：四種 store 小表 | L89–98 | 有，「能回答的問題」一欄用同一筆 SGLang 記憶示範，對沒修過資料庫的讀者很有效；「交易」沒解釋（nit 6） |
| 斷崖：前後半用 p26 接起來 | L205–207 | 有，接得自然 |
| 跨篇：五層歸因當主線、第 5 堂切分失敗歸 harness | L247 | 有，與第 5 堂 L157 一致；作業 2 那句不夠準（nit 7） |
| 各節自我檢查附答案或判準 | L200、L232、L304、L321–334 | 都有；L200 題目缺條件（should-fix 3b）、L232 問法比的不是同一個量（should-fix 3a） |
| 不把非投影片內容歸給講者 | L27、L85、L89、L146、L160、L223、L351 | 多數有標；L65 排序、L156 MemGPT 歸類是本文推論卻寫得像投影片內容 |
| 沒解釋就用的術語 | L94 交易、L319 scaffolding、L269 fan-out | 見 nit 6 |
| 研究過程外漏 | 全文 | 沒有。L27、L349–351 是讀者需要的底本與標示 |
| 閱讀頁覆蓋 | 9/28 閱讀頁六篇 | RAG（2020）全文零次出現（should-fix 7）；MemGPT、Where LLM Agents Fail、Beyond the Leaderboard 在正文，MAST、Overthinking 在延伸閱讀 |
| 篇幅與折疊 | 6,131 漢字：記憶 3,094、可靠度 2,071、綜合題 424 | 與第 5 堂（6,194）相當，不必折疊。L249–300 五張案例表共 26 列較長，可選擇性折疊（nit 9） |
| 圖 | 0 張 | 見 should-fix 9 |

### 🔴 must-fix

無。頁碼、數字、外部來源抽驗都對得上，機械檢查全過，教學主幹完整。

### 🟡 should-fix

1. L323 綜合題 1 叫讀者「用 p17 的清單逐項回答」，但正文從沒介紹 p17；p17 的七項（Observe、Select、Encode、Store、Retrieve、Reflect／consolidate「Does this update or contradict an old memory?」、Forget）也沒有「歸誰管」。判準 L325–330 的六點沒有涵蓋「何時歸納」，「什麼時候取回」只隱含在「開場只載入短索引」。改法：題目改成「用前面的六個決定加上歸屬逐項回答」；判準補一點「同一個糾正出現兩三次才升格為慣例，並標上信心；一次就寫成長期規則是過度歸納」，並把「開場只載入一份短索引、細節在任務需要時才讀」明寫成「取回時機」那一項。若想保留 p17，在 L59 後加一句介紹它是六個決定的收尾清單。
   修正：題目改成「用前面的六個決定加上歸屬逐項回答」；判準改成依決定分項，補「歸納：同一個糾正出現兩三次才升格成慣例並標信心」與「取回時機：開場只載入短索引，細節在任務需要時才讀」；另在六個決定那節末補一句介紹 p17 是收尾清單。
2. 讀完能力二（歸到五層）只有分類，沒有判斷步驟。L302 說「要分辨，得回頭看執行軌跡」，卻沒說軌跡裡看什麼；L304 的自我檢查，答案在 L207 接點一節已經原文講過，測不到歸因能力。改法：(a) L302 段末補一個判斷順序：「從第一個出錯的步驟往回問：任務規格有沒有說清楚？工具回給 agent 的內容正不正確？harness 有沒有把該給的資訊放進 context？前面都沒問題、模型還是做錯，才是模型層。以『服務掛了』為例：工具第一次就回逾時、agent 沒重試，是工具層的偶發失敗（p28）；工具回的訊息清楚，agent 卻推論成網路斷線，是模型層的推理錯誤（p27）。」(b) L304 換一題接點一節沒講過的案例，例如「agent 收到工具回的空清單就說『沒有符合的檔案』，其實是 `grep` 路徑打錯回了 exit code 2」，答案：工具層靜默失敗（p28），修法是把「空的」和「失敗」分開。
   修正：(a) 五張表後補「本文整理的判斷順序」五步，並用「服務掛了」示範工具層（p28）與模型層（p27）的分辨；(b) 新增自我檢查：`grep` 路徑打錯回 exit code 2 卻被當成空結果 → 工具層靜默失敗（p28）。原「三週前的筆記」題因範圍卡指定保留，移到接點一節後面，當作接起前後兩半的檢查。
3. 兩題自我檢查的題目本身有問題：
   - (a) L232 問「哪個方案每段一次就成功的機率比較高」，方案 A 只有一段（30 步，0.74），方案 B 是每段 15 步（0.63），比的不是同一個量；拆段的真正好處（重做成本）沒有被量化。改法：問題改成「兩個方案各自一次跑完整個任務的機率是多少？平均要跑幾步才完成？」答案：基準 0.97³⁰ ≈ 0.40，失敗就整段重來，平均約 30／0.40 ≈ 75 步；提到 0.99：0.99³⁰ ≈ 0.74，平均約 41 步；拆兩段：整個任務一次全對仍是 0.63² ≈ 0.40，但錯了只重做該段，平均約 2 × 15／0.63 ≈ 47 步。結論：拆段沒有讓「一次全對」變高，省的是重做；提升每步可靠度兩者都改善。（假設失敗在段尾才發現；已自算。）
   - (b) L200 只說新指令「在對話裡提過一次」，沒說它有沒有被存進記憶。如果沒存，正確答案是「寫不寫」，不是「過期」。改法：題目補「兩句話都已經存進記憶」。
   修正：(a) 題目改問「各自一次跑完整個任務的機率、平均要跑幾步」，答案照建議：0.40／約 75 步、0.74／約 41 步、拆段 0.63²≈0.40／約 47 步，結論改成「拆段省的是重做」。Python 驗算：0.97³⁰=0.401、30/0.401=74.8；0.99³⁰=0.740、30/0.740=40.6；0.97¹⁵=0.633、0.633²=0.401、2×15/0.633=47.4。(b) 題目補「兩句話都已經存進記憶」。
4. L156「依官方文件，Claude Code 目前屬於右邊。這條路的起點是閱讀清單上的 MemGPT……MemGPT 的團隊後來做成了 Letta」：「這條路」緊接在右邊（記憶做在 runtime 裡、儲存是 markdown 檔）之後，讀起來像 MemGPT／Letta 是右邊的起點。但 p21 把「Letta built-in」放在左邊的記憶管理層，Letta 的儲存也是資料庫不是 markdown 檔；而且 p21 兩疊的 agent runtime 都列了 Claude Code、Letta、Codex，表示同一個 runtime 兩種接法都可能，問號正是這個意思。改法：「p21 兩疊的最上層都列了 Claude Code、Letta、Codex：同一個 agent 兩種接法都可以。依官方文件，Claude Code 目前用右邊那種。閱讀清單上的 MemGPT 是另一條線的起點：讓模型自己管記憶。它把 context window 當主記憶體……MemGPT 團隊後來做成 Letta，投影片把 Letta 的內建記憶放在左邊那疊的記憶管理層。」
   修正：回 p21 圖確認 Letta built-in 在左邊記憶管理層、兩疊最上層都列 Claude Code／Letta／Codex。照建議改寫並拆成兩段：「兩疊最上層都列…同一個 agent 兩種接法都可以」；MemGPT 改成「另一條線的起點：讓模型自己管記憶」，句末補「投影片把 Letta 的內建記憶放在左邊那疊的記憶管理層」。
5. L65「投影片列了四種觸發寫入的方式，從最挑到最寬」：p7 的四項沒有標排序，版面上「Explicit user request」還正好對齊左軸的「write every interaction／high recall」那一端，和本文的排序相反；「定期讓 LLM 回顧」是不是最寬也說不準（它看全部，但仍挑著寫）。改法：刪「從最挑到最寬」，改「投影片列了四種觸發寫入的方式：」。
   修正：回 p7 圖確認四項沒有標排序（左軸是 write every interaction／high recall 到 selective writing／high precision，右邊四項並列）。刪「從最挑到最寬」。
6. L255「三個 bug 修錯了一個」：p25 原文「Fixed the wrong one of three」是「三個可能的 bug 裡修到不對的那一個」，本文的寫法讀成「修了三個、其中一個修壞」，意思不同。改法：「有三個可能的 bug，修到不是使用者指的那一個」。
   修正：回 p25 原文確認「Fixed the wrong one of three」。改成「有三個可能的 bug，修到不是使用者指的那一個」。
7. 9/28 閱讀頁六篇中，RAG（Lewis 等 2020）全文零次出現，L349 卻把閱讀頁列為底本。L112 的「基本取回流程：向量搜尋、取前 k 筆、放進 prompt」正好就是 RAG。改法：L112 句末補「這就是閱讀清單上 [RAG](https://arxiv.org/abs/2005.11401)（2020）的做法：把知識從模型權重搬到一個可以改的外部索引」，參考資料補一條。
   修正：取回一節補「這就是閱讀清單上 RAG（2020）的做法：把知識從模型權重搬到一個可以改的外部索引」，參考資料補 Lewis et al. (2020)，題名對 arXiv API 確認。
8. L198「Mem0 和 supermemory 的首頁都宣稱自己在這些 benchmark 上領先，數字都是自家測的」：數據宣稱沒有 inline link（post-review 8.5），兩家的連結只出現在前一小節的表裡；而且實際出處是 README 不是首頁。改法：「Mem0 與 supermemory 的 README 都宣稱……」，把兩個名字各連到 README（Mem0 README 寫「92.5 on LoCoMo」，可順帶寫出這個數字）。
   修正：改成「Mem0 與 supermemory 的 README 都宣稱…例如 Mem0 寫 LoCoMo 92.5 分」，兩個名字各連到 GitHub README。
9. 圖表（post-review 9.3）：全文 0 張圖，第 5 堂有一張。兩處看圖比讀字快：(a) L211–228 錯誤複利，畫一張步數 1–50 的折線圖，0.95 與 0.99 兩條線，標出 20 步的 0.36 與 0.82，把「每步多 4 個百分點」的效果直接畫出來；(b) L156 p21 兩疊架構，畫成左右兩欄的分層對照圖（runtime／記憶管理／儲存三層），中間問號，配合 should-fix 4 的改寫。建議至少做 (a)。
   修正：做 (a)：照 `types/line.md` 畫折線圖，放在錯誤複利算術之後。步數 0–50 每 5 步一點、兩條線（0.95 accent 有點、0.99 s1），標 20 步 36%／82% 與線尾 8%／61%；換算 y=300−%×2.4、x=80+8.4×步數，座標由 Python 算出。`scripts/diagram-preview.ts` 全部 ✓，淺色、深色、手機三張截圖看過（手機為框內左右捲動，屬 441–640 寬的設計）。(b) p21 對照圖沒做：改寫後的兩段文字已講清楚，一篇以一張圖為限。

### 🟢 nit

1. L160「指出該回頭檢查六個決定裡的哪一個」：欄內有「讀寫時機」「出處」「有效時間」「歸屬」，都不在 p6 的六個決定裡。改「該回頭檢查哪一個設計決定」。
   修正：改成「該回頭檢查哪一個設計決定」。
2. L115「範圍：同一個使用者、同一個專案、同一個任務」：p11 還有 entity，可補「同一個實體」。
   修正：補「同一個實體」。
3. L137「它寫記憶檔時會記下寫入時間」：文件寫的是檔案以 YAML frontmatter 開頭時，才把寫入時間記在 `modified` 欄位。可補「（檔案開頭有 frontmatter 時）」。
   修正：改成「記憶檔開頭有 frontmatter 時，它會記下寫入時間」。
4. L196 locomo-audit 可更具體：「稽核者用整段對話直接回答，分數 92.62%，比號稱最好的 EverMemOS（92.32%）還高；差距來自回答用的 prompt，不是記憶系統」。
   修正：照建議寫出 92.62% vs 92.32% 與「差距來自回答用的 prompt」，並拆兩句。
5. L230 Ord：「每分鐘有固定機率失敗」的「分鐘」是人類做這題所需的時間，不是 agent 跑的時間。改「人類做這題每多花一分鐘，agent 就多一份固定的失敗機率」。
   修正：改成「人類做這題每多花一分鐘，agent 就多一份固定的失敗機率」。
6. 術語：L94「交易」補「（幾筆寫入要嘛全部成功、要嘛全部不算）」；L319 scaffolding 改「外圍的輔助機制（scaffolding）」；L269 fan-out 第一次出現可補「同時派出多個 sub-agent」。
   修正：交易補括號說明；scaffolding 改「外圍的輔助機制（scaffolding）」；fan-out 列補「（同時派出多個 sub-agent）」。
7. L247「作業 2 要處理的五種失敗，大多落在 harness 與工具兩層」：對照作業 2 導讀的表，壞的 tool call 源頭在模型、proxy 回 429 是 p29 的環境層頻率限制，context 膨脹與不收斂在 harness，執行卡住在工具。可改「作業 2 的五種失敗分散在模型、harness、工具、環境四層，但修法都寫在 harness 裡」，順便點出「出錯的層」和「修的地方」不一定同一層。
   修正：改成「作業 2 的五種失敗分散在模型、harness、工具、環境四層，但修法都寫在 harness 裡」，並點出出錯的層和修的地方不一定同一層。
8. L332 綜合題 2 判準：輸出截斷在很多 harness（包括作業 2 的「放回歷史前先截斷」）是 harness 做的。判準可接受「工具層或 harness 層，看截斷發生在哪」。
   修正：判準改成截斷發生在工具算工具層、發生在 harness 放回歷史時算 harness 層；「第一個出錯的步驟」改成「截斷那一步」。
9. L249–300 五張案例表共 26 列，篇幅可接受；若想縮，可保留任務規格與 harness 兩張，其餘三張放進 `<details>`（綜合題 2 用到工具與模型表，折疊時要確保題目仍讀得懂）。
   修正：不折疊：綜合題 2 用到工具與模型表，全部展開較好讀，篇幅與第 5 堂相當。
10. L98「[第 4 堂]…講語意搜尋時介紹過」：可直接連到第 4 堂的 `#找程式碼四種方法`。
   修正：第 4 堂連結改到 `#找程式碼四種方法`（對照第 4 堂 H3「找程式碼：四種方法」依 github-slugger 規則推算）。
11. L349「頁碼一律用 PDF 頁序」：投影片角落印的頁碼從 p19 起比 PDF 頁多 1，讀者對照時可能困惑，可補半句說明。
   修正：課程影片來源一節補「投影片角落印的頁碼從 p19 起比 PDF 頁序多 1」。

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 5 句以下（原 14 句，改寫後剩餘多為 61–66 字的判準或來源說明）、但書段落 8%、引述區塊 6（全是自我檢查的 `>` 區塊）、單段數字 ≥4 有 8 段（日期、頁碼範圍、錯誤複利算術、來源說明，保留）、姓名主詞 1（Toby Ord，論文作者，保留）、模板化轉折 1（auto memory 段，已改寫）、英文術語段 3（benchmark、README，保留）。

| # | 位置 | 指標 | 問題 | 處理 |
|---|---|---|---|---|
| 1 | Mem0 對照段 | 長句（96 字） | 改動、例子、更新方式擠一句 | 拆三句 |
| 2 | 導言第二段 | 長句（88 字） | 兩個能力串一句 | 拆兩句 |
| 3 | Claude Code 混合 | 長句（71 字） | 括號內上限擠在句中 | 拆三句 |
| 4 | 歸納時機 | 長句（71 字） | 兩種時機與「背景做」串一句 | 拆兩句 |
| 5 | Claude Code 時間戳 | 長句（75 字） | 分號串兩件事 | 拆三句 |
| 6 | MemGPT | 長句（72 字） | 類比與機制串一句 | 拆三句 |
| 7 | MINJA | 長句（66 字） | 拆兩句 | 已改 |
| 8 | auto memory | 模板化轉折「不是…而是」 | | 改成「會先判斷」 |
| 9 | 接點、Ord、Where Agents Fail | 長句 65–73 字 | | 各拆一處 |

`pnpm check:tw`：0 blocking、0 to review。`check-course-titles.mjs`（本篇）0 issue；`check-course-guide-layout.mjs`（中文 9 篇）0 issue。`check-process-leak.mjs`：exit 0。`check:references`：本篇只有 `-en` 尚未產出的一條錯誤。

修正：1–9 已改。

## 作者修正（回應 post-review）

修正後 sha256：`266bd40a8a759f5377e62e63bf985a16deeeeac3a18f774989706dad5cc39297`，**尚未複審**。9 項 should-fix 全改（9 只做折線圖 (a)），nit 1–8、10、11 已改，nit 9 不改（理由見該項）。各項做法見上方每項後的「修正：」。

重跑：`check:tw` 0 blocking；`register-scan.sh` 長句 5（新增段落中 86、95、69 字三句已拆）、但書 9%、模板化轉折 0；`check-course-titles.mjs`（本篇）0 issue；`check-course-guide-layout.mjs`（中文 12 篇）0 issue；`check-process-leak.mjs` exit 0；`scripts/diagram-preview.ts` ✓（淺色、深色、手機截圖已看）；`check:references` 本篇只剩 `-en` 尚未產出。

## 複審

複審者：同一位獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `266bd40a8a759f5377e62e63bf985a16deeeeac3a18f774989706dad5cc39297`，與作者回報一致。行號指這個版本。

### 機械檢查

- `pnpm check:tw` 0／0；`check:references` 本篇只剩 `-en` 未產出；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0。
- `scripts/diagram-preview.ts`：1 張圖，✓ no overlapping, clipped or tiny text。
- 第 4 堂錨點 `#找程式碼四種方法`：第 4 堂 H3「找程式碼：四種方法」，依 github-slugger 去掉全形冒號，對得上。

### 逐項核對

| 項目 | 位置 | 結果 |
|---|---|---|
| S1 綜合題 1、p17 | L59、L387–395 | 到位。題目改成六個決定加歸屬，判準補了取回時機與歸納兩點。L59「p17 把這六步收成一份設計清單」略寬（p17 是 Observe 開頭的七項），可接受 |
| S2 判斷順序與新題 | L362–374 | 判斷順序與 grep 題已補；grep 題答案正確（`grep` 路徑錯回 exit 2、被包成空結果 → p28 靜默失敗，修法照 p30「錯誤和空的結果分開」）。但「服務掛了」例子和判斷順序第 2 步對不起來，見下方「仍須修」 |
| S3a 30 步題 | L284–285 | Python 重算：0.97³⁰＝0.401、30／0.401＝74.8；0.99³⁰＝0.740、30／0.740＝40.6；0.97¹⁵＝0.633、0.633²＝0.401、2×15／0.633＝47.4。數字與結論都對，假設（段尾才發現、只重做該段）有寫在題目裡 |
| S3b make check 題 | L254 | 到位，補了「兩句話都已經存進記憶」 |
| S4 p21／MemGPT | L156–158 | 回 p21 圖確認：兩疊最上層都列 Claude Code、Letta、Codex，「Letta built-in」在左邊記憶管理層。改寫正確，MemGPT 不再被讀成右邊的起點 |
| S5 p7 排序 | L65 | 到位，「從最挑到最寬」已刪；p7 四項確實沒標排序 |
| S6 p25 | L309 | 到位，「有三個可能的 bug，修到不是使用者指的那一個」符合「Fixed the wrong one of three」 |
| S7 RAG | L112、L422 | 到位；arXiv 2005.11401 即 Lewis 等 2020 |
| S8 Mem0／supermemory | L249 | 到位，連到兩家 README；「LoCoMo 92.5」與 Mem0 README「92.5 on LoCoMo」一致 |
| S9 折線圖 | L230–276 | Python 依 y＝300−p×240、x＝80＋8.4n 重算 0、5…50 步共 22 個點，與 polyline／circle 座標逐點一致；標籤 36%、82%、8%、61%（0.99⁵⁰＝0.605）都對；caption 標明 0.99 線是本文補算 |
| nit 1–8、10、11 | 各處 | 都已照建議改，抽看 L136（frontmatter 條件）、L246（EverMemOS 92.62／92.32）、L279（Ord 改成人類每多花一分鐘）、L302（作業 2 四層）、L399（截斷看發生在哪）、L414（頁碼差 1），內容正確 |
| nit 9 不折疊 | — | 理由成立 |

### 仍須修

1. L372「服務掛了」例子的第一句和 L364–368 的判斷順序互相矛盾。兩個例子裡工具回的都是「逾時」，而且這個逾時是真的，照第 2 步「工具回給 agent 的內容正不正確、完不完整」，兩例都會通過工具層，落到第 5 步的模型層，但正文把第一例判為工具層。p28 的意思是：這次逾時是偶發的、重試就會成功，工具層沒先退避重試就把一次逾時交出去（修法「Retry with backoff before judging」）。改法：第一句改成「逾時只是偶發的，重試就會成功；工具沒先退避重試就把這次逾時交給 agent，是工具層的偶發失敗（p28）」，第 2 步改成「工具有沒有正確處理並回報（例如偶發失敗該不該先重試）？」，兩例的分界就清楚了：前者重試就好，後者是真的 deadlock、重試也沒用。

沒有發現其他新錯。

結論：仍須修 1 項（上方第 1 項，一句改寫加一個步驟措辭）；改完即可通過，不必再整篇複審，只需核對 L364–372。

修正（作者）：照複審建議改兩處。判斷順序第 2 步改為「工具有沒有正確處理並回報？例如暫時性的失敗，該不該先重試再回報」；「服務掛了」第一例改為「逾時只是偶發的，重試就會成功；工具沒先退避重試，就把這次逾時交給 agent，是工具層的偶發失敗（p28）」，對應 p28 flaky call 的修法「Retry with backoff before judging」。第二例（模型層，p27）不動。修正後 sha256：`541dd1fc8076b1a3dc1ea1552e549faf2b3fc9fc6798df12419ef1f513e0f14d`。`check:tw` 0 blocking。

最終核對（sha256 `541dd1fc8076b1a3dc1ea1552e549faf2b3fc9fc6798df12419ef1f513e0f14d`，L361–372）：第 2 步已改成「工具有沒有正確處理並回報？例如暫時性的失敗，該不該先重試再回報」，第一例改成偶發逾時、工具沒先退避重試（p28），與判斷順序一致；第二例（真 deadlock，p27）落在第 5 步模型層，分界清楚。沒有引入新錯。

結論：通過
