# 審稿紀錄：2026-10-21-cs2680-lecture-08-cost-latency-harness

審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness.md，sha256：6f2efda7fe4159c06b1333f5852967cb1f0fd0acc314b8926e719521bd1a5bc1

post-verify、post-polish：作者自查（撰寫的子代理），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/8_agent_design_5.pdf`（54 頁，頁碼用 PDF 頁序，已逐頁以 pdftotext 對過）、課程筆記 `sources/pages/notes_cost-effective-agents.txt`（2026-10-22 重抓比對，正文相同）、`.work/research/harvard-cs2680/lectures-05-08.md` L8 段、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 10、查證表 `.work/research/harvard-cs2680/l8-factcheck.md`。

## post-verify

查證表 `l8-factcheck.md` 共 40 項：Confirmed 34、Confirmed（需加條件）2、Outdated 1、Contradicted 0、Not found 2、未逐項查 1。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 斷線 → `curl` 直接抓原頁、arXiv export API、OpenReview API、`gh api`（全部 200）。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 第 8 堂 2026-10-07，題目 Agent design V: cost-effective agents；配套筆記 | 投影片 p1、首頁課表 | Confirmed | |
| 2 | 導言 | 兩段 p5–38／p39–53，中間沒有過渡頁；只談 LLM 成本 | p4、p5、逐頁標題 | Confirmed | 用一句話接兩半（範圍卡要求） |
| 3 | 成本乘式 | session／turn／step 結構與六因子乘式，前兩項 GROW、後四項 SHRINK | p6、p7 | Confirmed | |
| 4 | 學生的帳 | 68%／75%、step 中位數 3／4、208K／301K、670K／650K | p8、p10、p13、p14 | Confirmed | |
| 5 | 學生的帳 | 97.6%／2.0%／0.4%、價格比 1:10:50 | p15 | Confirmed | 金額份額 71%／15%／15% 標為本文換算 |
| 6 | 少一點 turn | 總成本隨 turn 數平方成長；回頭追問的三個原因與三個做法 | p9 | Confirmed | 「有快取仍平方成長、係數變小」標為推論（factcheck #7） |
| 7 | 少一點 step | 4 次 vs 2 次模型呼叫；重用計畫與 skill；一開始讀進需要的檔 | p11 | Confirmed | |
| 8 | 少 token | input 五招、output 三招 | p16、p18、p19 | Confirmed | |
| 9 | 單價 | p21 五個倍率；routing 三型；Part II 技術 | p21、p22、p23 | Confirmed | |
| 10 | 現價表 | output 5×、批次 0.5× 可疊加、快取 0.1／0.05／0.025×、寫入 1.25×／2× | factcheck #1–#5 | Confirmed／Outdated | 快取倍率列為 Outdated，正文用表格寫現況 |
| 11 | 橋接 | tools → system → messages、改工具定義整份失效 | factcheck #8 | Confirmed | |
| 12 | 橋接 | 時間戳區塊例子：付寫入、讀不到；OpenAI 建議動態內容放最後 | factcheck #9、#10 | Confirmed | |
| 13 | 橋接 | Anthropic 512–4,096 token、5 分鐘；OpenAI GPT-5.6 以後 1,024 token、30 分鐘 | factcheck #11–#13 | Confirmed | |
| 14 | 橋接 | 筆記：較短的 prompt 不一定較便宜 | factcheck #14 | Confirmed | |
| 15 | 橋接 | Don't Break the Cache：41–80%、整份快取延遲可能變長 | factcheck #15 | Confirmed | 標為本站補充來源 |
| 16 | 手算帳單 | 65.0／23.6（36%）／80／27.1 單位 | 本文計算（python 驗算） | 本文推導 | 標明教學例子；先不計寫入加價，再補算 |
| 17 | 自我檢查 | 時間戳放開頭的後果與改法 | 範圍卡判準、factcheck #9 | Confirmed | |
| 18 | 反成本 | 四組反成本 | p25 | Confirmed | |
| 19 | 反成本 | $120／80 vs $90／75、80% 門檻 | factcheck #16 | Confirmed | |
| 20 | 預算 | $10、80 次、15 分鐘、2 次重試、p95 兩倍；停止條件 | p26 | Confirmed | 標明投影片說是示意 |
| 21 | 需不需要 LLM | 腳本、規則、小分類器、只在需要推理時用 | p27 | Confirmed | |
| 22 | 變快 | 快通常也便宜但不一定；關鍵路徑；便宜可能更慢、平行更貴 | p28、p29 | Confirmed | 連第 5 堂粒度公式 |
| 23 | 變快 | 編排四招、工具四招、平行、推測執行 | p30–34 | Confirmed | |
| 24 | 推測執行 | Speculative Actions ICLR 2026、55%、20% | factcheck #26 | Confirmed | |
| 25 | 推測執行 | PASTE、SPORK 的做法 | p37、factcheck #27–#28 | Confirmed | |
| 26 | 推測執行 | 只讀或冪等易撤銷，寫入要快照與回滾 | factcheck #18 | Confirmed | |
| 27 | 方法 | run → measure → change one thing → re-evaluate；「Remember this for your Assignment 4!」 | p38、factcheck #40 | Confirmed | 照引原句，補作業 3 的對應 |
| 28 | 架構 | 作業系統單體核心／微核心比喻 | p40 標題（Monolithic · Modular · Microkernel） | 本文補充 | 比喻的解釋是本文的橋接 |
| 29 | 架構表 | 三種架構的組法、例子、優缺點、適用 | p41–45 | Confirmed | |
| 30 | 架構 | 跑一段 Python 的三種流程 | p44 | Confirmed | 作業 2 的對照是本文延伸 |
| 31 | 八個 harness | 各一句話取向、作者 | p46、factcheck #29 | Confirmed | |
| 32 | 八個 harness | 各一個代表機制 | p47–53、factcheck #30–#38 | Confirmed（OpenClaw、Pi 部分未逐項查） | 未查到的數字（27 個頻道、42 providers、$0.05）不寫；括號註明哪些對過 |
| 33 | 八個 harness | Claude Code 沒有獨立頁 | factcheck #39 | Confirmed | |
| 34 | 綜合自我檢查 3 | 快 20%、貴 30% 是買了延遲 | factcheck #17 | Confirmed | |

範圍卡要求對照：兩個 H2 半場「前半：成本與速度」「後半：harness 架構」✅；cache 命中條件橋接段（含時間戳）✅；p21 價格比的帳單例子（prefix 穩定 vs 時間戳）✅，並指出最大成本因子與不掉成功率的改法 ✅；自我檢查判準照範圍卡 ✅；回扣總覽 60k 例子與第 2 堂 ✅；Part II 的 serving 技術只預告 ✅；八個 harness 寫文當天查 repo ✅。

站內連結：第 7 堂（order 9，Pareto、cost 指標）與作業 3（order 11）的導讀由其他分身同時撰寫，檔案尚未定稿，正文暫不連；作業 3 先連課程作業總覽頁。上線前由主 session 回填。

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `6f2efda7fe4159c06b1333f5852967cb1f0fd0acc314b8926e719521bd1a5bc1`，與 post-polish 一節記的版本一致（審稿期間未改）。行號指這個版本。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。`scan-ledger.sh`：模板化轉折、高風險用詞、標題壓縮語氣都是 0。
- `register-scan.sh`：長句 16（最長 L31 91 字，是三個問題串成一句，可接受）、但書 8/68 段（11%）、引述區塊 2（都是自我檢查）、數字 ≥4 的段落 8（L84、L109 各 6 個，見 should-fix 3 的連結問題；其餘是頁碼與日期）、姓名主詞 1（在參考資料，不在正文）、模板化轉折 0、英文術語 0。
- `pnpm check:references`：本篇只有 `-en` 還沒產出的 ERROR，依指示忽略。
- `check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`scripts/check-process-leak.mjs` exit 0（但見 should-fix 7，L203 的查證說明腳本抓不到）。
- 站內連結：第 1／2／4／5 堂、總覽、作業 2、延伸閱讀五篇都存在；`#課程影片來源` 錨點對得上 H2。跨節指代（L72、L101）都指得到；沒有西里爾字元或全形英數混入，沒有疊字殘骸。
- 全文沒有 diagram 區塊，見 should-fix 9。

### 事實抽驗

投影片抽 24 處（`pdftotext -layout -f N -l N` 逐頁對 PDF 頁序，p15 另外轉成圖片看圖例）：p6 session／turn／step；p7 乘式與 GROW／SHRINK；p8 68%／75%；p9 平方成長與三個做法；p10 中位數 3／4；p11 4 次 vs 2 次模型呼叫與另外兩招；p13 208K／301K；p14 670K／650K；p15 圖例「Cache write … 2.0% of tokens」「Cache read … 97.6%」「Output … 0.4%」與「1 : 10 : 50」；p18–19 三招；p21 五個倍率；p22 三型路由與「one cheap planning mistake」；p23 系統技術清單；p25 四種反成本與淨節省公式；p26 $10／80 calls／15 min／2 retries、2× p95、「Example limits are illustrative」；p27 四種不用 LLM 的情況；p28「usually, but not always, cheaper」；p29 serial／parallel 與兩個提醒；p30–34 五類加速；p37 PASTE `search(q) → visit(results[0].url)`、SPORK forked probe；p38 四步與「Remember this for your Assignment 4!」；p2「Assignment 3 starting today」；p40–45 三種架構（含 p45 對照表的 Typical use case 列）；p44 跑 Python 對照；p46–53 八個 harness 一句話與各頁機制。內容與頁碼都對得上。不準的兩處：L172 說「投影片用作業系統的比喻」（should-fix 8）、L64 cache write 的價格比（should-fix 5）。

價格與快取規則，2026-10-22 `curl` 抓 `platform.claude.com/docs/en/about-claude/pricing.md`、`…/build-with-claude/prompt-caching.md`、`developers.openai.com/api/docs/guides/prompt-caching.md` 原文逐條對：
- L92 output 5×：模型表每一列 output／input 都是 5（Opus 5.5 $4／$20、Sonnet 5.5 $2／$10、Haiku 5.5 $0.10／$0.50、Fable 5.1 $10／$50 等）。Confirmed。
- L93 批次 0.5× 可疊加：「50 percent discount on both input and output tokens」「These multipliers stack with other pricing modifiers, including the Batch API discount」。Confirmed。
- L94 命中倍率：「0.1x base input price (0.025x on Claude Fable 5.1 and Claude Mythos 5.1; 0.05x on Claude Opus 5.5 and Claude Sonnet 5.5)」，模型表 Opus 5.5 $0.20、Sonnet 5.5 $0.10 也對得上。Confirmed，只漏了 Mythos 5.1（nit 1）。
- L95 寫入 1.25×／2×：「5-minute cache write 1.25x base input price」「1-hour cache write 2x base input price」。Confirmed。L97「只用一次就虧」與文件「caching pays off after one cache read for the 5-minute duration」一致。
- L107 順序與工具定義：「`tools`, `system`, and `messages` (in that order)」「Modifying tool definitions … invalidates the entire cache」。Confirmed。
- L108 時間戳例子：文件 block 6 例子「You pay for a fresh cache write on every request and never get a read」「Move `cache_control` to block 5」。Confirmed。OpenAI「place those at the end rather than the beginning, or move them into later conversation messages」。Confirmed。
- L109 最短長度與存活時間：Anthropic「512 tokens for Claude Fable 5.1 … Opus 5.5 … Haiku 5.5」到「4,096 tokens for Claude Opus 4.6 … Haiku 4.5」；「5-minute lifetime … refreshed for no additional cost each time」。OpenAI「1,024 tokens for GPT-5.6 and later」「`"30m"` (default)」。Confirmed。補充：OpenAI 在 GPT-5.6 以後對 `30m` 寫入也收 1.25×、`12h` 收 2.5×，正文沒提，不算錯（L128 只說「以 Anthropic 的 1.25× 計」）。

其他外部來源 3 個：
- Lumer et al. arXiv 2601.06007 abstract：三家廠商、「over 500 agent sessions」、「reduces API costs by 41-80%」、「naive full-context caching, which can paradoxically increase latency」。L111 Confirmed。
- Speculative Actions arXiv 2510.04371 abstract：「gaming, e-commerce, and web search environments」「up to 55% next-action prediction accuracy, translating into up to 20% latency reductions」，題名「A Lossless Framework for Faster Agentic Systems」與 L240 一致。L166 Confirmed。
- 課程筆記（存檔 `sources/pages/notes_cost-effective-agents.txt`）：$120／80、$90／75、80% 門檻（〈Measure the whole episode〉）；「shorter prompt is not necessarily a cheaper prompt」（〈Lower serving cost…〉）；「Read-only or idempotent operations are easier to cancel」「20% faster but 30% more expensive」（〈Reduce waiting…〉）。L111、L146、L176、L214 Confirmed。

帳單例子用 Python 重算（`calls = [10000 + 1000*i for i in range(5)]`）：不用快取 60.0＋5.0＝65.0；穩定 prefix 10＋2.0＋2.1＋2.2＋2.3＝18.6，＋5.0＝23.6，是 65 的 36.3%；時間戳破壞且照樣標快取 60×1.25＋5＝80.0；穩定 prefix 加寫入加價 12.5＋(1.0＋1.25)＋(1.1＋1.25)＋(1.2＋1.25)＋(1.3＋1.25)＋5＝27.1。四個數字都對。前提（開場 10,000、每步 +1,000、5 次呼叫、輸入合計 60,000）和總覽 L94–105 一致；本篇多加了「每次輸出 200 token、算在那 1,000 裡」，總覽只說工具結果，兩者不衝突。p15 金額份額也重算過：97.6：20：20 → 70.9%／14.5%／14.5%，與 L64–66 一致。

### 教學規格對照（概念導讀，單堂）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L31 | 有，跟範圍卡一致 |
| 讀完能力：把成本拆成六個因子、指出最大的因子與不掉成功率的改法 | L41–47、L113–130、綜合題 | 只做到一半。乘式有、帳單有，但帳單沒有回頭對到乘式：沒有一句說「這個任務 turn＝1、step＝5、每步平均 12,000 token、單價由快取決定，所以最大的因子是單價」；三題綜合題也沒有一題讓讀者自己拆（should-fix 1） |
| 斷崖：prefix cache 命中條件橋接 | L99–111 | 方向對，例子也選得好；但「一路比到第一個不同的地方」和 Anthropic 只在標記處存檔的說法互相打架，「快取標記」也沒解釋（should-fix 2） |
| 範圍卡指定例子：穩定 vs 時間戳 | L113–130 | 算術全對；L128 說「比對從第一行就斷了」，但兩段前才說工具定義排在 system 前面（should-fix 4）；L130「都不碰成功率」與下一節反成本矛盾（should-fix 6） |
| 範圍卡指定自我檢查（時間戳） | L132–133 | 有，答案正確 |
| 綜合自我檢查 | L209–214 | 有判準；第 1 題題目數字自相矛盾（should-fix 3）|
| 兩個 H2 半場與轉場 | L33、L170–172 | 有，L172 用「這些手段要放在哪裡」接得自然，符合斷崖表 |
| 不把非投影片內容歸給講者 | L60、L128、L172、L205、L229 | 多數有標；L172 作業系統比喻不準（should-fix 8） |
| 沒解釋就用的術語 | L84 prefix（L103 才解釋）、L108 快取標記、L148／L168 p95、L176 冪等、L195 Lark 文法 | 見 should-fix 2、nit 3 |
| 研究過程漏進正文 | L203 | 括號裡「2026-10-22 查過各 repo……都對過官方文件或原始碼」是查證紀錄，應移到來源說明（should-fix 7）。L88、L227–229 是讀者需要的時間戳與來源說明，可留 |
| 系列前置連結 | L146、L168 | 範圍卡前置是 order 1 與 order 9；正文連了第 1 堂，沒連第 7 堂（Pareto、成本指標），作業 3 連到課程網站而不是本系列的作業 3 導讀（should-fix 10） |
| 篇幅 | 前半約占 2/3 | 後半兩張表把八頁濃縮得好，不需要折疊 |

### 🔴 must-fix

1. 課程筆記的數字與引述沒有 inline link（post-review 8.5）。L146 有 $120／$90／80 題／75 題／80% 門檻，L111 引筆記一句話，L176 引筆記的規則，三處都只寫節名，沒有連結（筆記只在 L29 連過一次）。改法：三處的「課程筆記」各自連到對應錨點：L111 `https://cs2680.com/notes/cost-effective-agents#serving`、L146 `#objective`、L176 `#latency`（錨點 2026-10-22 從原頁 HTML 確認存在）。同一類：L109 整條有 Anthropic 512–4,096、5 分鐘，OpenAI 1,024、30 分鐘，但連結只放在 L107、L108 兩條；L109 的「Anthropic 的最短長度」「OpenAI」各補一個連結（Anthropic 可連 `…/prompt-caching#cache-limitations`，OpenAI 同 L108）。
   修正：三處課程筆記改成 inline 連結到 #serving、#objective、#latency；「太短不快取」條的 Anthropic 連 `prompt-caching#cache-limitations`、OpenAI 連 `prompt-caching#summary-of-model-differences`。

### 🟡 should-fix

1. 讀完能力「拆成六個因子、指出該從哪個下手」沒有被練到。L41–47 給了乘式，L113–130 給了帳單，但兩者沒接起來，讀者不會自己把帳單套回乘式。改法：L130 段前加一段把帳單代進乘式：「這個任務只有 1 個使用者、1 個 session、1 個 turn、5 個 step，每個 step 平均讀 12,000 token。前四項都已經很小，帳單從 65 降到 23.6 靠的是最後一項：單價。換成 p13 那種每步 20 萬 token 的學生 session，最大的因子就變成每個 step 的 token 數。」再把一題綜合題換成拆解題，例如用 p8–15 的學生數字：「一個 session 只有 1 個 turn，但這個 turn 走了 40 步，主 agent 每步 200K token，97.6% 是 cache read。六個因子裡該先動哪個？」判準：前兩項不砍；turn 已經是 1；先看 step 數（批次工具呼叫、先規劃）與每步 token（截掉舊工具輸出、交給 subagent），單價已經靠快取壓到底，再壓只能換模型，要量成功率。
   修正：帳單後新增一段把例子代回乘式（1 使用者、1 session、1 turn、5 step、每步平均 12,000 token，65→23.6 靠單價；p13 那種每步 20 萬 token 的 session 最大因子變成每步 token 數）。綜合自我檢查新增第 1 題拆解題（1 turn、40 步、每步 200K、97.6% cache read），判準照審稿建議；原 1–3 題順延為 2–4。平均 12,000 用 Python 驗過。
2. 橋接段的比對規則和 Anthropic 的實際做法打架。L103 說「比對從第一個 token 開始，一路比到第一個不同的地方為止」，照這個說法，時間戳之前的內容應該都能命中；但 L108 引的 Anthropic 例子是 block 1–5 不變、block 6 有時間戳，結果「從來沒讀到過」。原因是 Anthropic 只在標了 `cache_control` 的位置寫入快取（文件：「writes occur only at breakpoints」），沒標的地方即使前面一樣也不算。讀者看到兩段會以為其中一段寫錯。另外「快取標記」在 L108 第一次出現，沒說是什麼。改法：L103 句末補一句「serving 端的原理是逐 token 比到第一個不同處；但 API 計價只認你標記過的位置，Anthropic 要你在 prompt 裡用 `cache_control` 標出『快取到這裡』，命中的是『到某個標記為止完全一樣』的那段。」L108 就能直接接「標記放在會變的那段上，就永遠對不上」。
   修正：重讀 Anthropic〈How automatic prefix checking works〉與 OpenAI〈How prefix matching works〉後改寫橋接段：先講 serving 端逐 token 比到第一個不同處（補「KV cache」），再另起一段講 API 計價只認快取標記（`cache_control`，breakpoint）、快取只存在標記位置、往回找上次存過的位置、自動快取把標記放在最後一個可快取區塊。時間戳一條改寫成文件原例（前五區塊不變、第六區塊含時間戳、標記在第六區塊、解法移到第五區塊），並註明自動快取有同樣的問題、OpenAI 也只在特定邊界比對。「順序固定」一條補上工具定義排最前面、改 system 時工具定義不受影響。
3. 綜合題 1（L209）題目數字自相矛盾。cache read 占 token 的比例基本上就是命中率；命中率掉到 20%，cache read 就不可能還占 95%。改法：「上週 cache read 占 input token 的 95%，這週掉到 20%，總花費翻倍。」判準不用動。
   修正：題目改為「上週一個 agent 的 cache read 占 input token 的 95%，這週掉到 20%，總花費翻倍」，判準不動（現為第 2 題）。
4. L128「把時間放進 system prompt 的第一行……比對從第一行就斷了」不精確。L107 剛說 Anthropic 依 `tools` → `system` → `messages` 比對，工具定義排在 system 前面，所以斷點在工具定義之後，不是整個 prompt 的第一個 token。這張帳單的結論不變（工具定義那段沒有另外標記，就不會命中），但前後兩段說法不一致，讀者會卡住。改法：「每次呼叫的 system prompt 都不同，比對在工具定義之後就斷了；工具定義那段沒有另外標快取，所以五次都沒有命中。」
   修正：改為「每次呼叫的 system prompt 都不同，比對在工具定義之後就斷了；工具定義那段沒有另外放快取標記，所以五次都沒有命中」。
5. L64「cache write」列的價格比寫 10，等於把寫入當一般 input 價，但 L95 剛說寫入要 1.25×。用 12.5 算是 68%／18%／14%，結論（cache read 最大）不變。改法二選一：(a) L60 句末補「價格比照 p15 投影片的 1 : 10 : 50，沒算寫入加價；算進去，寫入的份額約 18%」；(b) 價格比改 12.5、金額份額改約 68%／18%／14%，並註明是用 Anthropic 5 分鐘寫入價。建議 (a)，保留投影片原數字。
   修正：採 (a)。表前說明改為「價格比照投影片寫的 1 : 10 : 50，沒算寫入快取的加價；照 Anthropic 5 分鐘快取的 1.25× 算，寫入的份額約 18%，cache read 仍約 68%」；Python 重算 68.4%／17.5%／14.0%。
6. L130「改法有兩個方向，都不碰成功率」說太滿。第二個方向「工具輸出只留需要的欄位」正是下一節 L141 的反成本「被丟掉的檔案之後要重讀」，也可能丟掉之後需要的資訊。改法：「第一個方向不碰成功率；第二個方向要小心反成本（下一節），砍掉的欄位之後若要用，得再讀一次。」
   修正：改成「第一個不碰成功率……第二個是讓 context 長得慢一點……這一招要小心下一節講的反成本，砍掉的欄位之後若要用，得再讀一次」。
7. 研究過程漏進正文。L203 括號後半「2026-10-22 查過各 repo 都存在且仍在更新；Codex 預設無網路與 Lark 文法、……都對過官方文件或原始碼」是查證紀錄，讀者用不到。改法：L203 只留「（整理自 p46–53。）」；查證的一句併進 L228「八個 harness 的機制對照各 repo 與官方文件」那條，已經有了，可以直接刪。
   修正：L203 只留「（整理自 p46–53。）」；查證說明已在〈課程影片來源〉「八個 harness 的機制對照各 repo 與官方文件」一條。
8. L172「投影片用作業系統的比喻回答」不準。p39–45 只用了 monolithic／modular／microkernel 三個名字，沒有任何一頁提到作業系統或核心；「單體核心、微核心」的解釋是本文補的。改法：「這三個名字借自作業系統：作業系統有……；投影片把 harness 排成同樣的光譜（p40）。」
   修正：改成「投影片用三個借自作業系統的名字回答。作業系統有……；投影片把 harness 排成同樣的光譜（p40）」。
9. 圖表（post-review 9.3）：全文 0 張圖。兩處看圖比讀字快：(a) L113–130 帳單，畫成「五次呼叫 × context 長條」對照圖，左欄 prefix 穩定（每條長條前段標命中、後段 1,000 標新內容），右欄時間戳在 system prompt（整條都是未命中），讀者一眼看出 18.6 vs 60 從哪來；這也正好說明 should-fix 2 的「命中到哪裡為止」。(b) L152 關鍵路徑（p29），畫成甘特圖：上排依序六段相加，下排 Plan → Worker A／B 平行 → Merge，紅線標關鍵路徑。建議至少做 (a)。
   修正：照 diagram skill 畫 (a)：長條圖（橫條、兩欄），左欄 prefix 穩定（灰＝命中 0.1×、綠＝付全價），右欄 system prompt 開頭放時間戳（整條付全價），每列標該次 input 費用，底部小計 18.6／60.0，圖例兩項，caption 註明教學例子與 0.1×、未計寫入加價。座標由 Python 從 context 長度算出（每 70 token 1 px）並驗算每列費用。`scripts/diagram-preview.ts` ✓（no overlapping, clipped or tiny text），淺色、深色桌面與 375px 手機三張截圖都看過；手機上圖內左右捲動，是元件設計，整頁不橫向捲動。(b) 甘特圖未做。
10. 系列前置連結不完整。範圍卡前置寫 order 1、order 9；L146 連了第 1 堂，但 Pareto 與成本指標在第 7 堂（`/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation`），正文沒有連。L168 的作業 3 連到 `cs2680.com/assignments`，本系列已有作業 3 導讀（`/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt`，order 11）。改法：L146「這裡補上限制：它要和成功率門檻一起看」後補「（第 7 堂的柏拉圖前緣是同一件事的多指標版本）」並連第 7 堂；L168「作業 3」改連站內作業 3 導讀。兩篇目前都在工作區、還沒 commit，要和本篇一起上線才加；若不同批上線就先留外部連結。
   修正：L146 句末補「第 7 堂的柏拉圖前緣，是同一件事的多指標版本」並連 `/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation`（該文 L358 確有柏拉圖前緣段）；L168 作業 3 改連 `/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt`。兩篇都在工作目錄，需與本篇同批上線。

### 🟢 nit

1. L94 命中倍率漏了 Mythos 5.1（與 Fable 5.1 同為 0.025×）。改「Fable 5.1、Mythos 5.1 是 0.025×」。另外可以在 L128 後補半句：帳單用 0.1× 算；換成 Opus 5.5 的 0.05×，穩定 prefix 是 21.3 單位。
   修正：Mythos 5.1 回 2026-10-22 定價頁確認（註 1：「Cache hits and refreshes on Claude Fable 5.1 and Claude Mythos 5.1 are priced at 0.025x the base input price」），表格改為「Fable 5.1、Mythos 5.1 是 0.025×」。帳單後補「換成快取只收 0.05× 的 Opus 5.5，穩定 prefix 是 21.3 單位」，Python 驗算 16.3＋5＝21.3。
2. L130「任務一長，各步的 cache read 加總會超過它」可以給數字：照這個例子的成長速度，大約第 9 次呼叫起 cache read 累計超過第一次的 10 單位。
   修正：補「大約從第 9 次呼叫起，cache read 的累計就超過這 10 單位」，Python 驗算（第 9 次累計 10.8）。
3. 術語：L84 第一次出現「prefix」，L103 才解釋，可在 L84 寫「prefix（每次請求開頭那段相同的內容）」；L176「冪等」補「（重做一次結果也一樣）」；L148、L168 的 p95 補「（最慢的 5%）」。讀者是工程師，這三個都不嚴重。
   修正：L84 改「讓 prefix（每次請求開頭那段相同的內容）保持穩定」；冪等補「（重做一次結果也一樣）」；p26 段 p95 補「（最慢的 5%）」。L168 的 p95 沿用前面的解釋，未重複。另補 Lark 文法的半句白話。
4. L103「模型每處理一段輸入，都會算出一份中間結果」可補「（KV cache）」，讀者點 L220 延伸閱讀時對得上名字。
   修正：補「（KV cache）」。
5. L109「agent 等一個跑很久的工具，回來時快取可能已經過期」可接半句「這時可以改用 1 小時的快取（寫入 2×）」，讓 L95 那一列有用處。
   修正：補「這時可以改用 1 小時的快取，寫入價是 2×」。

## 修正狀態

修正後 sha256：`110ec9a366d1db7669182996c26553e3843b50205454865b7633a48f84eaedf3`（2026-10-22，作者）。尚未複審。重跑：check:tw 0 blocking；課程標題 0 issue；版面（整系列 20 篇）0 issue；process-leak exit 0；diagram-preview ✓；check:references 只剩英文版未產出的 `-en`。

## post-polish

register-scan（2026-10-22，sha 6f2efda7…）：

- 長句 16 句。已改寫 4 處：導言問題句、input 做法清單、獨立評測句、p15 段落改成表格。剩下的多是列舉或規則條列（Anthropic 時間戳例子、最短長度、教學例子前提），拆開會斷掉對應關係，保留。
- 但書密度 8／68 段（11%）。
- 數字密度：p21 現價段原本單段 15 個數字，改成對照表；p15 段原本 8 個數字，改成份額／價格比／金額份額表。剩下 4–6 個數字的段落是導言日期與頁碼、條列項，保留。
- 研究者姓名當主詞 1 處，在參考資料條目，不在正文。
- 模板化轉折句型 0、一般英文術語 0。
- check:tw 0 blocking；課程標題 0 issue；版面（整系列 20 篇）0 issue；process-leak exit 0；check:references 只報英文版未產出的 `-en` 連結。

## 複審

複審者：同一位獨立審稿子代理，2026-10-22。審的檔案 sha256 開頭 `110ec9a366d1db76`，與作者回報一致。行號指這個版本。

### 機械檢查

`pnpm check:tw` 0 blocking；`check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0；`check:references` 只剩 `-en` 未產出的 ERROR；`pnpm exec tsx scripts/diagram-preview.ts` 1 張圖 ✓（no overlapping, clipped or tiny text），深色桌面截圖看過，長條、數字、圖例都清楚。全文沒有殘留的「第 N 題」交叉指代。

### 橋接段逐句對文件（2026-10-22 curl 存檔）

- L103「從第一個 token 往後比，比到第一個不同的地方」講的是 serving 端原理，L105 緊接著用「但 API 計價不是逐 token 比的」切開。上一輪 should-fix 2 的矛盾已解。
- L105 快取標記：Anthropic〈How automatic prefix checking works〉「Cache writes occur only at your breakpoint … The system does not write entries for any earlier position」「Cache reads look backward for entries that prior requests wrote … It is looking for prior writes, not for stable content」。「快取只存在標記的位置」「往回找上次存過的位置」「沒在那裡存過也不算」三句都對得上。自動快取「applies the cache breakpoint to the last cacheable block」也對。正文沒寫 20 個區塊的往回找上限，對這篇的讀者不需要。錨點 `#how-automatic-prefix-checking-works` 存在。
- L109 工具定義位置：〈What invalidates the cache〉「the cache follows the hierarchy: `tools` → `system` → `messages`. Changes at each level invalidate that level and all subsequent levels」；表格「Tool definitions」三欄都是 ✘。「改 system prompt，工具定義那段不受影響」符合層級規則（表格裡改 system 的列，Tools cache 都是 ✓）。Confirmed。
- L110 時間戳原例：文件「large static system context (blocks 1 through 5) followed by a per-request block containing a timestamp and the user message (block 6). You set `cache_control` on block 6」「never wrote an entry at any of those positions … never get a read」「Move `cache_control` to block 5」「Automatic caching has the same problem」。正文的五句逐一對得上。OpenAI「只在特定的邊界比對」對〈How prefix matching works〉「walks through only the cache lookup boundaries」，Confirmed；時間戳建議原句上一輪已對過。
- L130「比對在工具定義之後就斷了；工具定義那段沒有另外放快取標記，所以五次都沒有命中」和 L105、L109 一致。
- L111 兩個新錨點：Anthropic `#cache-limitations`（〈Cache limitations〉標題存在）、OpenAI `#summary-of-model-differences`（文件內有同名錨點）。「1 小時快取，寫入 2×」對定價頁「1-hour cache write 2x base input price」，Confirmed。

### 新數字 Python 重算

- L182 每步平均 12,000：60,000 ÷ 5 ＝ 12,000。✓
- L132 Opus 5.5 穩定 prefix：10 ＋ (0.5＋1)＋(0.55＋1)＋(0.6＋1)＋(0.65＋1) ＝ 16.3，加 output 5 ＝ 21.3。✓
- L184 第 9 次：第 2 次起每次 cache read ＝ 1.0、1.1、1.2……；累計到第 8 次是 9.1，到第 9 次是 10.8，第一次超過 10。✓
- L60 寫入加價後的份額：97.6×1 ：2.0×12.5 ：0.4×50 ＝ 97.6 ：25 ：20 → 68.4%／17.5%／14.0%，正文寫「寫入約 18%，cache read 仍約 68%」。✓
- 圖的小計 18.6／60.0 與表 L126 一致。座標 1 px ＝ 70 token：10,000→142.9、11,000→157.1、12,000→171.4、13,000→185.7、14,000→200.0、1,000→14.3；左欄綠段起點 96＋前一次 context＝238.9／253.1／267.4／281.7；數字標籤在長條尾端＋8。全部對。第 1 次左欄整條綠（全新內容付全價、未計寫入加價），和 caption 一致。

### Mythos 5.1 倍率

定價頁註 1「Cache hits and refreshes on Claude Fable 5.1 and Claude Mythos 5.1 are priced at 0.025x the base input price」，L94 已補上。✓

### 新綜合題 1（L263–264）

題目 1 turn、40 步、每步 200K、97.6% cache read，數字範圍與 p10／p13／p15 的學生紀錄同一量級。判準的順序（前兩項不砍 → turn 已是 1 → 先動 step 數與每步 token → 單價已靠快取壓低，換模型要先量成功率）和 L182 的「每步 20 萬 token 時最大因子是每步 token 數」一致，也對到 p11、p16、p22／p25。讀完能力「拆成六個因子、指出該從哪個下手」現在有 L182 的示範加一題練習，做到了。原第 1 題改成「95% 掉到 20%」，矛盾已解。

### 有沒有引入新錯

逐段讀過改動處（L60、L84、L94、L103–111、L130–132、圖、L182–184、L200、L202、L222、L226、L249、L263–270），沒有發現新的事實錯誤或前後不一致。L200 第 7 堂連結、L222 作業 3 連結指向的兩篇目前在工作區，仍要和本篇同批上線（作者已註明）。

可選小建議（不阻擋）：L182「前四項都已經很小」可寫明是「使用者、session、turn、step 四項」，讀者不必回頭數乘式。

結論：通過

修正（作者，2026-10-23）：照複審「可選」把 L182「前四項」寫明為使用者數、每人 session 數、每個 session 的 turn 數、每個 turn 的 step 數（與乘式用詞一致），並把「最後一項單價」改為「最後一項：每個 token 的價格」。check:tw 0 blocking。修正後 sha256：eb402930808f117f710a3af1de32c2f942f82fa1793ca6b597d4e53b70f5584c。英文版已產出：src/content/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness-en.md。
