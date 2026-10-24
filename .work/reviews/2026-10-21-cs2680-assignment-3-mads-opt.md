審稿對象：src/content/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt.md，sha256：dd2342c3be8ae2b2553ff1c073b3c8cb0b51ecae56e5442d0ea8a48fc7584551

post-verify、post-polish：作者自查（撰寫的分身），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：作業 3 頁面 https://cs2680.com/assignments/assignment3（2026-10-22 重抓，與 `sources/pages/assignments_assignment3.html` 規格正文無差異）、作業總覽頁、作業 3 投影片 `slides/8_assignment3.pdf`、第 7 堂 p35、第 8 堂 p2／p7／p22／p26／p29／p38、starter 檔 `assignment3.tar.gz`（只讀檔，未執行其中腳本）、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 11、查證表 `.work/research/harvard-cs2680/a3-factcheck.md`。

## post-verify

查證表 `a3-factcheck.md` 共 32 項：Confirmed 26、Observed 4、Contradicted 2（都是課程自己兩處說法不一致），沒有 Outdated 或 Not found。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 連線失敗 → `curl` 直接抓課程頁與 starter；arXiv 用 export API；Skyline 論文經 Keenable 找到 HandWiki 條目（`r.jina.ai` 讀全文）取 DOI，再用 Crossref API 核對。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 10/5 發、10/20 截止、佔 20% | 作業頁標頭 | Confirmed | |
| 2 | 導言 | 比前兩份難得多、當期中考看 | L8 p2 "Much harder than earlier assignments"、"treat it like a midterm" | Confirmed | 同頁「starting today」與 10/5 不一致，不提（查證表 #2） |
| 3 | 導言 | 「Make every token count」、黑盒 API、解題數不掉、壓成本與延遲 | 作業總覽頁 | Confirmed | |
| 4 | 先備 | 第 7 堂 p35 三指標評估、Pareto 前緣 | L7 PDF p35 | Confirmed | |
| 5 | 先備 | leaderboard 10/20 關閉；本機需 Linux x86_64、Docker、約 15 GB | 作業頁警語、Step 0 | Confirmed | |
| 6 | 兩種容器 | agent container 放 src/ 與主 loop 等；沒有網路、唯一出口是課程 API 代理；task container 每題一個、無網路 | 作業頁 Part 0；投影片 p2 | Confirmed | |
| 7 | 兩種容器 | 四個路由、Sandbox 三方法、不要用 open()／subprocess、可加路由 | 作業頁 Part 0 | Confirmed | |
| 8 | 兩種容器 | 「作業 2 的 agent 直接在題目容器裡下指令」 | 作業 2 頁面（本系列作業 2 導讀） | Confirmed | 「每步多一段 HTTP 來回」是本文推論，措辭用「多了一段來回」 |
| 9 | 評估 | extract_patch／evaluate 回傳三欄；乾淨容器跑隱藏測試；continue_task／done 語意 | 作業頁 Part 0；starter dispatcher.py | Confirmed | |
| 10 | 規格表 | 只改 src/；三個資料夾與 leaderboard 相同；三種模型可混用；5 題；35 分鐘；4 小時；$10／$30；本機 5 題、leaderboard 26 題、SWE-bench Pro 固定版本 | 作業頁 Part 0–2；投影片 p4、p5；starter 題目檔 | Confirmed（本機題數為 Observed） | 不列本機 5 題的 repo 名 |
| 11 | 規格 | starter 一次一題、什麼都不修、本機 0/5；流程自己決定 | 作業頁 Part 0、Step 3；agentic_loop.py | Confirmed | |
| 12 | 規格 | logger(k) 記每次呼叫；leaderboard 從 trace 讀 turn 數 | 作業頁 Part 0 | Confirmed | starter docstring 另說成本也從 trace 算（查證表 #15），正文不推論 |
| 13 | 自我檢查 | 第 6 題丟 DispatcherError；沒題目回 None | 作業頁 Part 0 規則；dispatcher.py | Confirmed | |
| 14 | 三把尺 | 三個指標的定義，分母都是解出題數 | 作業頁 Part 2 Step 4 | Confirmed | $5／16、$6／16、$6／17 為本文例子，算術已驗 |
| 15 | skyline | 最佳提交、≥7 題、支配定義、分層、1,1,1,4、<7 題只比題數、新提交要嚴格更好 | 作業頁 Part 2 Step 6；投影片 p7 | Confirmed | |
| 16 | skyline | Skyline operator：Börzsönyi 等人、2001、DOI 10.1109/ICDE.2001.914855 | Crossref；HandWiki | Confirmed | |
| 17 | 手算 | A、B 第 1 名，C 第 3 名；加 D 後 D 也是第 1 名、C 第 4 名 | 本文例子，依作業頁規則手算 | 已用 Python 驗算 | 範圍卡例子＋自加的 D |
| 18 | 計分 | 80 分、max(81 − r, 50)／81 − r、baseline 4 小時 $10 內 16 題、不必是最佳提交、三個例子 | 作業頁 Grading；投影片 p7 | Confirmed | 「r > 31 才有差」為本文推算 |
| 19 | 自我檢查 | 換 Starter 少 3 題排名不一定變好；新提交要嚴格更好；取消／花費扣當日 $30 | 作業頁 Step 5–6 | Confirmed | 範圍卡判準 |
| 20 | 價格表 | 三種模型、每百萬 token 的輸入／快取輸入／輸出價格；快取＝輸入的 1/20 | 作業頁 Part 1 Step 2 | Confirmed | 1/20 為本文計算 |
| 21 | 帳單 | 40 步 × 30,000 token、500 token 輸出、90% 命中；Expert 一題約 $0.55、26 題約 $14.25；Standard 約 $0.02／$0.51；Starter 約 $0.0025／$0.07；$10 ÷ 26 ≈ $0.38；不命中 Expert 一題 $2.60、差將近 5 倍 | 本文假設＋作業頁價格 | 已用 Python 驗算 | 正文標明假設 |
| 22 | 帳單 | 便宜模型可能反而比較慢 | L8 p29 "Cheaper can be slower" | Confirmed | |
| 23 | 時間 | 240 ÷ 26 ≈ 9.2 分鐘；平行時看關鍵路徑 | 本文計算；L8 p29 | Confirmed | |
| 24 | 自我檢查 | Expert 花到 $10 停下、解 12 題：$0.83；未達 16 題 baseline | 本文例子；作業頁 Step 5、Grading | 已驗算 | |
| 25 | 槓桿 | 成本公式四個因子 | L8 p7 | Confirmed | 「作業 3 每題只有一輪」為本文推論（沒有使用者來回） |
| 26 | 槓桿表 | routing 三型、每題預算與停止條件（示意）、關鍵路徑、run→measure→change one thing→re-evaluate | L8 p22、p26、p29、p38 | Confirmed | 只寫對應，不給做法 |
| 27 | 槓桿 | 便宜模型一個規劃錯誤浪費後面很多步 | L8 p22 "Hard part: one cheap planning mistake can waste many later actions" | Confirmed | |
| 28 | 槓桿 | 停止條件「N 步內沒有新的測試通過」；投影片數字是示意 | L8 p26 | Confirmed | |
| 29 | 槓桿 | 每天 $30 約夠三次滿額提交 | 作業頁 Step 5（$30／$10） | 本文計算 | |
| 30 | 槓桿 | AI Agents That Matter：只看準確率讓 agent 不必要地複雜昂貴，主張一起優化 | arXiv 2407.01502 摘要 | Confirmed | |
| 31 | 交件 | src.zip、a3-sessions.tar.gz、writeup.pdf、影片；配分 80／10／10；no late days；writeup 三題、一頁、不得用 AI 文字；影片露臉、自己的聲音、指程式碼 | 作業頁 Part 3、Grading | Confirmed | |
| 32 | 交件 | 作業總覽頁說作業 3 以 blog post 繳交 | 作業總覽頁 | Contradicted（兩頁不一致） | 一句話點出，評分表照作業 3 頁 |
| 33 | 交件 | 資安漏洞最多加總成績 3 分、濫用作廢 | 作業頁 Bonus | Confirmed | |
| 34 | 綜合題 1 | 新 B（21 題）後：B、D 第 1 名，A 第 3 名，C 第 4 名 | 本文例子 | 已用 Python 驗算 | |
| 35 | 綜合題 3 | 26 × 12 = 312 分鐘 > 240，約到第 20 題用完 | 本文計算 | 已驗算 | |
| 36 | 延伸閱讀 | 作業 2、第 8 堂、Telemetry（34）、省 token 工具結果、CMU 11-768 作業 2 的 slug | 站內檔案 frontmatter | Confirmed | 第 8 堂為同批另一分身撰寫中的檔案，已存在 |

不寫進文章的：leaderboard 初始密碼格式（作業頁與投影片都有，屬帳密資訊）；本機 5 題的 repo 名；leaderboard 網址現在轉到作業 4（查證表 #31）。

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `dd2342c3…584551`，與檔頭一致（審稿期間未改）。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。
- `register-scan.sh`：長句 3（L29 68 字、L33 71 字、L196 60 字，跟 post-polish 紀錄一樣）、但書 3/74 段（4%）、引述區塊 8（都是自我檢查）、數字 ≥4 的段落 8（日期配分、規則、手算例子，屬主題，可接受）、姓名主詞 1（誤判）、模板化轉折 0、英文術語 1（benchmark，可保留）。
- `pnpm check:references`：本篇只有一個 ERROR，是 `-en` 還沒產出，照指示忽略。
- `check-course-titles.mjs`：0 issue。`check-course-guide-layout.mjs`：0 issue。`check-process-leak.mjs`：exit 0。
- 站內連結：作業 2、第 2／4／7／8 堂、Telemetry（34）、省 token 工具結果、CMU 11-768 作業 2 的 slug 都存在（`check:references` 沒報）。

### 事實抽驗

作業頁抽 18 條，對 `sources/pages/assignments_assignment3.txt` 與現行頁面（2026-10-22 curl，關鍵句逐句搜到、未變）：20%、10/5 發、10/20 23:59、leaderboard 不收 late days（存檔 L5–8）；四個路由、`Sandbox` 三方法、不要用 `open()`／`subprocess`（L48）；`evaluate` 回傳三欄（L53）；`continue_task`／`done` 語意（L55–61）；5 題上限、`DispatcherError`、沒題目回 `None`（L63）；35 分鐘、卡住全算失敗（L65）；4 小時從開第一題起算、開著的照 `done`、沒開過的算失敗（L66）；leaderboard 從 trace 讀 turn 數（L72）；只改 `src/`、三個資料夾與 leaderboard 相同（L90）；Linux x86_64、Docker、約 15 GB（L118）；三種模型價格（L132–134，九個數字逐一對過）；三個指標的定義（L150–153）；$30／天、$10／次、碰到上限停、已完成照記（L154）；支配定義、分層、≥7 題、<7 題只比題數（L155–156）；1,1,1,4、嚴格更好才取代、平手保留（L157–158）；26 題（L160）；配分 80／10／10、`max(81 − r, 50)`、baseline 16 題 4 小時 $10、三個分數例子（L194–206）；writeup 不得有 AI 文字、影片露臉、加分 3 分（L183–208）。全部 Confirmed。

投影片：作業 3 投影片 p2（三種容器、只能連 api.cs2680.com）、p4（三種模型、35 分鐘、4 小時、$30／$10）Confirmed。第 8 堂 PDF p2（"Much harder"、"treat it like a midterm"）、p7（成本乘式）、p22（三種 routing、"one cheap planning mistake"）、p26（"No new passing test in N steps"、"Example limits are illustrative"）、p29（關鍵路徑、"Cheaper can be slower"）、p38（四步迴圈）、第 7 堂 p35（支配定義、"Rank 1 is the Pareto frontier; speed is not drawn"）都 Confirmed；但 p38 的位置描述不對，見 should-fix 3。L69 的「同一個 run 裡可以任意混用」投影片 p4 沒寫，出處在作業頁 Part 1 Step 2（nit 1）。

外部來源抽 3 條：
- arXiv export API 2407.01502：題名〈AI Agents That Matter〉、2024-07-01、第一作者 Sayash Kapoor；摘要 "SOTA agents are needlessly complex and costly"、"jointly optimizing the two metrics"。L198 Confirmed。
- arXiv export API 2509.16941：題名〈SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?〉。參考資料條目 Confirmed。
- Crossref `10.1109/ICDE.2001.914855`：〈The Skyline operator〉、Borzsony／Kossmann／Stocker、Proceedings 17th International Conference on Data Engineering。L105 Confirmed。

### 算術重算（Python）

- 帳單（L159–168）：Expert 0.108＋0.24＋0.20＝$0.548，×26＝$14.25；Standard $0.0195，×26＝$0.51；Starter $0.00254，×26＝$0.066；不命中快取 Expert $2.60，是 4.74 倍；$10 ÷ 26＝$0.385。全對。另外：Expert 在這組假設下 $10 約夠 18 題。
- L93：$5／16＝0.3125、$6／16＝0.375、$6／17＝0.353。對。L174、L230：240／26＝9.23、26×12＝312、240／12＝20。對。L177：$10／12＝0.83。對。
- Pareto（L111–123）：寫成支配函式逐層剝。A、B 第 1、C 第 3；加 D 後 A、B、D 第 1、C 第 4。對。L136 的 80／80／78 對。
- 綜合題 1（L225–226）：只看名次計算，Bnew、D 第 1，A 第 3，C 第 4，跟判準一樣；但套用 L103 的平手規則後結論不同，見 must-fix 2。
- 反例：A(20, $0.30, 120 秒) 與 X(20, $0.30, 130 秒)。X 在題數、成本都並列第一，仍被 A 支配、落在第 2 層，見 must-fix 3。

### 教學規格對照（作業導讀）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 聚焦問題與讀完能力 | L33 | 有，照範圍卡原文 |
| 讀完能力 1：算出一組提交的 Pareto 排名 | L107–125、L225–226 | 做得到，有可走完的手算例子。但規則轉述有兩處跟作業頁對不上（must-fix 1、3），綜合題 1 沒套平手規則（must-fix 2） |
| 讀完能力 2：列出自己 agent 要先試的三個優化 | L181–201 | 部分兌現。槓桿表給了「先看什麼數字」，但正文沒有教讀者怎麼從 trace 挑出三個，也沒有練習要讀者真的列三個，見 should-fix 4 |
| 範圍卡例子 A／B／C、分數 80／80／78 | L111–121、L136 | 照範圍卡，算對；另加 D 說明「題數少也能第 1」，好 |
| 範圍卡自我檢查：換 Starter 少 3 題 | L138–139 | 有，答案與範圍卡一致，還補了嚴格更好、花費照扣。「全場最便宜就一定第 1 層」要加「唯一」（must-fix 3） |
| 各節自我檢查附答案或判準 | L80–81、L138–139、L176–177、L200–201、L225–231 | 全部有答案或判準；L81、L177、L230 核對正確 |
| 排名規則逐字對照作業頁 | L95–103 | 支配定義（L100）、≥7 題、1,1,1,4、<7 題、嚴格更好（L103）都對得上；H3 標題 L95 與 tldr L11 的口語版對不上，見 must-fix 1 |
| 邊界：不放官方解答、不給具體解法 | L181–201 | 大致守住。槓桿表只寫對應與觀測數字；「例如不把時間戳、隨機 id 放進 system prompt」「要不要先規劃再一次做多個動作」偏做法，但都是第 8 堂通用內容，不算排行榜解法（nit 4） |
| 課程誠信 | 全文 | 沒列帳密（初始密碼格式沒寫）、沒列本機 5 題 repo 名、沒有可跳的題；L215 交代 writeup 不准用 AI 文字 |
| 沒解釋就用的術語 | L78「turn 數」、L214「late days」、L210「Canvas」 | turn 見 should-fix 2；late days、Canvas 見 nit 3 |
| 研究過程漏進正文 | L243「算術已另外驗算」 | 偏審稿紀錄，nit 5 |
| 影片狀態行、來源區放在後面 | L27、L240–243 | 符合 |
| inline 來源（8.5） | 全文 | 有數字的規則句都有作業頁或投影片連結；假設例子都標明「本文教學例子」 |
| 圖表（9.3） | L39–61 | 該有圖卻沒有，見 should-fix 5 |
| 衍生內容（4.5） | tldr L11、glossary L15–22 | glossary 兩條與作業頁一致；tldr 的「沒有人三項都不輸你」與 must-fix 1 同一問題 |

### 🔴 must-fix

1. **L95 標題「沒有人三項都贏你，你就是第 1 名」跟作業頁的支配定義不符；tldr L11「沒有人三項都不輸你」也不精確。** 作業頁是 "at least as good on all three metrics and better on at least one"。照 L95 的寫法，別人只要有一項跟你平手、另兩項比你好，你就還是第 1 名，但實際上你被支配了。題數是整數，同分很常見，所以這不是邊角情況。L95 跟 L100 的正確定義也互相矛盾。建議改法：L95 改成「Skyline：沒有人支配你，你就是第 1 名」，或寫成「沒有人每一項都不比你差、還至少一項比你好」；tldr 同步改成「沒有人在三項都不比你差、還至少一項比你好，你就是第 1 名」。
   修正：回作業頁原文逐字確認（"One submission dominates another if it is at least as good on all three metrics and better on at least one."）。H3 改為「Skyline：沒有人支配你，你就是第 1 名」；tldr 改為「沒有人在三項都不比你差、還至少一項比你好，你就是第 1 名」。

2. **L225–226 綜合題 1 的判準違反 L103 自己寫的平手規則。** B 原本的最佳提交是第 1 名，新提交也是第 1 名，名次沒有「嚴格變好」。照作業頁 "On a tie, the current best stays"，新提交不會取代舊的 B，四個人的名次維持 A、B、D 第 1，C 第 4。判準卻把新 B 當成已經生效（Python 算出新 B 也是第 1 名）。建議改法有兩種：(a) 題目改成「如果 B 當初交的就是 21 題、$0.20、100 秒那筆」，判準不變；(b) 保留題目，判準改成「新 B 也是第 1 名，名次沒有嚴格變好，所以不會取代舊的 B，名次不變。這題要考的就是平手規則」。(b) 能順便測到 L103 這條規則，比較建議。
   修正：採 (b)。作業頁原文 "A new submission becomes your best only if it ranks strictly better than your current best. On a tie, the current best stays." 綜合題 1 改成「B 又交了一次」，判準先算新提交第 1 名，再套平手規則：舊的 B 也是第 1 名，不取代，名次維持 A、B、D 第 1、C 第 4，並註明若生效 A 會掉到第 3。Python 重驗：新提交在 {A, C, D} 中排第 1；四人最終名次 {A:1, B:1, D:1, C:4}。

3. **L125「三項裡只要有一項是第一，你就一定在第 1 層」與 L139「如果你變成全場最便宜的，就一定在第 1 層」少了「單獨」這個條件，有反例。** A(20 題, $0.30, 120 秒)、X(20 題, $0.30, 130 秒)：X 的題數和成本都並列第一，仍被 A 支配，落在第 2 層。建議改法：L125 改成「三項裡只要有一項是**唯一**的第一（沒有人跟你並列），你就一定在第 1 層」；L139 改成「如果你變成全場唯一最便宜的（每題成本），而且題數仍在 7 題以上，就一定在第 1 層」。
   修正：兩處都加上「唯一」與「解出 7 題以上」。L125 段補上審稿的反例（A 20 題 $0.30 120 秒、X 20 題 $0.30 130 秒，X 落第 2 層）並說明理由（別人要支配你，那一項至少得跟你一樣好）。L139 改為「全場唯一最便宜的（每題成本沒有人跟你一樣低），而且仍解出 7 題以上」。Python 重驗：反例 {A:1, X:2}；另隨機產生 20,000 組六人提交（題數 7–26），「有一項唯一第一 ⇒ 第 1 層」0 例違反。所有排名例子（A／B／C、加 D、綜合題 1）重算結果與正文一致。

### 🟡 should-fix

1. **L78「leaderboard 上的數字也會不對」說得太廣。** 作業頁只說 leaderboard 從 trace 讀 turn 數，turn 數顯示在 Past submissions 的每題結果裡，不是三個排名指標之一。成本照 Step 4 是 API 帳號被扣的錢。讀者照現在的寫法，可能以為漏記會影響排名。另外，查證表 #15 指出 starter 的 docstring 說成本與 turn 數都從 trace 算，兩處說法不一。建議改成：「作業頁說 leaderboard 從 trace 讀每題的 turn 數（顯示在 Past submissions），starter 的註解還說成本也從 trace 算。兩處說法不一，最保險的做法是每次呼叫都記。」
   修正：照建議改寫：作業頁說 leaderboard 從 trace 讀每題的 turn 數（顯示在 Past submissions），starter 註解說成本也從 trace 算，兩處說法不一，最保險是每次呼叫都記。不再說「leaderboard 上的數字也會不對」。

2. **「turn／輪」這個詞前後指的不是同一件事。** L78 的 turn 是作業頁 trace 裡每題的 turn 數（實際上接近模型呼叫次數）；L181 用第 8 堂的 Turns/Task，說「作業 3 每題只有一輪」。讀者會困惑：每題只有一輪，leaderboard 為什麼還要數 turn？建議 L78 寫成「turn 數（每題的模型呼叫輪數）」，L181 改成「第 8 堂說的『輪』是使用者來回一次；作業 3 沒有使用者，每題只有一輪，所以能動的是每輪幾步、每步多少 token、每個 token 多少錢，加上時間。這跟 leaderboard 上的 turn 數不是同一個東西」。
   修正：L78 的 turn 加註「大致是這題呼叫了幾次模型」；L181 改成「第 8 堂說的『輪』是使用者來回一次……這跟 leaderboard 上每題的 turn 數不是同一件事」。

3. **L196「第 8 堂最後一頁」不對。** PDF 共 54 頁，p38 是成本與速度這一段的最後一頁，後面還有 harness 架構（p39 起，到 p54「Next class」）。這頁投影片還寫著「Remember this for your Assignment 4!」。建議改成「第 8 堂講成本那一段的最後一頁（p38）……這頁投影片是提醒作業 4 用的，同一套流程放到作業 3 也適用」。
   修正：改為「第 8 堂講成本那一段的最後一頁，列了一個四步的迴圈（p38）」，並補「這頁投影片寫著是給作業 4 用的提醒，同一套流程放到作業 3 也適用」。

4. **讀完能力 2「列出自己 agent 要先試的三個優化」沒有對應的練習或步驟。** L183–190 的表格只給了「先看什麼數字」，L200 的自我檢查也只問一個槓桿。建議在槓桿表後面加一小段步驟，或在綜合自我檢查加一題：「本機跑一次，把表格第三欄的六個數字從 trace 填出來，挑跟 $0.38／題、9.2 分鐘／題差最多的三列，就是你先試的三個」，判準是三個都有對應的 trace 數字。這樣只教怎麼挑，不給做法，不違反邊界。
   修正：槓桿表後加三步清單（從 trace 填第三欄 → 換算成每題錢與分鐘、對照 $0.38／題與 9.2 分鐘／題 → 差距最大的三列）。綜合自我檢查加第 4 題：給一組 trace 數字，問哪三列離目標最遠、各舉依據的數字；判準只考讀 trace 與找差距，不給優化做法。

5. **圖表（9.3）：L39–61 的兩種容器與 evaluate → continue／done 流程適合畫成一張圖。** 作業頁本身就有架構圖（存檔 L15–41：agent container、task container、facility、grading container 四塊與箭頭），文中只用條列交代。作業 2 導讀也有同類的流程圖。建議用 `diagram` skill 畫一張架構＋流程圖：agent container（`src/`、dispatcher client）→ HTTP → task container（sandbox_server、`/app`）；`evaluate(k)` → grading container → 失敗數／總數回到 agent → `continue_task` 或 `done`。L107 的 skyline 分層也可以考慮畫成二維散點示意（題數 × 每題成本），並註明「時間軸沒畫」，跟第 7 堂 p35 一樣。
   修正：用 flow-diagram 畫了一張六步流程圖，放在「評估結果會回來給你」一節末尾：agent container（你的 agent、dispatcher client）、課程 API、task container k（sandbox_server、/app）、facility run_all.py、grading container。節點與箭頭只取作業頁 Part 0 架構圖有的元件與連線；facility 啟動／移除 task container 那條線省略並寫在 caption。`diagram-preview.ts` 全 ✓（第一、二輪修過 group 標籤被線穿過、標籤壓框），淺色、深色、375px 手機三張截圖都看過；手機上圖在框內左右捲動，與作業 2 那張相同。skyline 散點示意沒有畫：A／B／C／D 的表格加逐對比較已經能走完，三個指標畫成二維會丟掉時間軸。

### 🟢 nit

1. L69：「同一個 run 裡可以任意混用」的出處是作業頁 Part 1 Step 2（"It may use any of the three models in one run"），投影片 p4 只列三種模型。建議把連結換成作業頁，或兩個都放。
   修正：規格表模型列改為投影片 p4（三種模型）＋作業頁 Part 1 Step 2（可混用）兩個連結。

2. L68：規格表「不能改的」可以補半句「`dispatcher/student_name.json` 例外，要填自己的名字」；L71 可以補「同一題一次只能有一個評估在跑」（作業頁 L64），會影響平行的寫法。
   修正：「不能改的」補 `dispatcher/student_name.json` 要填名字；「每次評估」補「同一題一次只能有一個評估在跑」。

3. L214「late days」、L210「Canvas」沒解釋。讀者是做過作業 2 的人，大概知道；非修課生不一定。可以寫「late days（課程給的遲交天數額度）」「Canvas（課程的教學平台）」。
   修正：late days 補「（課程給的遲交天數額度）」，Canvas 補「（課程的教學平台）」。

4. L187–188：「例如不把時間戳、隨機 id 放進 system prompt」「要不要先規劃再一次做多個動作」已經接近做法。兩者都是第 8 堂內容，不算排行榜解法，可以留；要更守邊界的話，改成只寫「每次請求的開頭維持不變」，並附第 8 堂快取那頁的連結。
   修正：快取列改為只寫「每次請求的開頭維持不變」並連第 8 堂 p21（原文 "Maintain stable prefixes"）；減少步數列拿掉「要不要先規劃再一次做多個動作」。

5. L243「算術已另外驗算」偏審稿紀錄，可以拿掉，只留「是本站補充」。
   修正：來源說明改為「文中的排名例子、帳單估算、自我檢查與流程圖是本站補充」，拿掉「算術已另外驗算」。

6. L105「第 7 堂在講評估時也畫過這張圖」：p35 圖上只畫了能力與成本兩軸（"speed is not drawn"）。可以補「圖上只畫了兩個指標」。
   修正：補「圖上只畫了能力與成本兩個指標，時間沒畫」。

7. L174「平行本身就會讓這個指標變好」：第 8 堂 p29 同時寫了 "Parallel costs more: less waiting, more total tokens"。可以補半句「總 token 也可能變多」，跟後面「花錢的速度變快」對得起來。
   修正：補「代價是總 token 可能變多（第 8 堂 p29）」。

## post-polish

`register-scan.sh`（修改後）：

- 長句 3：L29 導言副標句 68 字、L33 聚焦問題 71 字、「一次只改一件事」那條 60 字。前兩句是引述加說明、拆開會斷掉副標與目標的對應；第三句是條列項目。保留。
- 已改寫：「舉例來說」那句 77 字拆成三句；「快取輸入指的是」74 字拆成兩句；writeup 配分那條 99 字改成主項加三個子項清單。
- 但書 3／74 段（4%）。引述區塊 8，都是自我檢查。
- 數字 ≥4 的段落 8：日期配分、規則條列、手算例子，屬本篇主題，可接受；手算都放進表格或條列。
- 姓名主詞 1：L29「CS2680 的作業 3」被 regex 當成英文姓名，誤判。原本「Kapoor 等人的〈AI Agents That Matter〉指出」已改成以論文為主詞。
- 模板化轉折 0。一般英文術語 1（benchmark），保留。
- `check:tw`：0 blocking、0 to review。`check-course-titles.mjs`、`check-course-guide-layout.mjs`（本篇）：0 issue。`check-process-leak.mjs`：exit 0。`check:references`：本篇只剩 `-en` 尚未產出的一個 ERROR。
- 金額 `$`：本篇 frontmatter 沒有 `math: true`，站上的 remark-math 只對 opt-in 文章生效，不需跳脫。

## 修正紀錄（作者）

2026-10-22：依 post-review 修正 3 項 must-fix、5 項 should-fix、7 條 nit（各項後的「修正：」行）。修正後 sha256 `27655ab3223688cfb8623e81ada32b8853f1a82d0d2bf75de1b4a95180315dbd`。尚未複審。重跑：`check:tw` 0 blocking；register-scan 長句 2（導言副標句 68 字、聚焦問題 71 字，理由同 post-polish）、但書 3%、模板化轉折 0；課程標題與版面 0 issue；process-leak exit 0；`diagram-preview.ts` 全 ✓；`check:references` 只剩 `-en` 尚未產出。第 7、8 堂中文稿已在工作目錄，本篇連到兩者的連結都存在（check:references 未報）。

## 複審

複審者：同一位獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `27655ab3…315dbd`，與作者修正紀錄一致。

### 機械檢查（重跑）

`check:tw` 0 blocking；`check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0；`check:references` 本篇只剩 `-en` 尚未產出；register-scan 長句 2（L29、L33，照 post-polish 理由保留）。

### 逐項核對

- **支配定義（must-fix 1）**：L237 H3「沒有人支配你，你就是第 1 名」、L242 規則句、tldr L11「沒有人在三項都不比你差、還至少一項比你好」，跟作業頁 "at least as good on all three metrics and better on at least one" 一致（存檔 L155、現行頁 curl 確認）。已修。
- **平手規則（must-fix 2）**：L245 照作業頁 "ranks strictly better … On a tie, the current best stays"。L375–376 綜合題 1 改成「B 又交了一次」，判準先算新提交名次、再套平手規則。Python 重算：新提交與 A、C、D 排是 {Bn:1, D:1, A:3, C:4}；舊 B 也是第 1 → 平手，不取代；最終 A、B、D 第 1、C 第 4；「若生效 A 掉到第 3」也對。已修。
- **唯一第一（must-fix 3）**：L267、L281 都加了「唯一」與「解出 7 題以上」。L267 的理由（別人要支配你，那一項至少得跟你一樣好）在邏輯上成立。反例 {A:1, X:2} 重算正確。另跑 20,000 組隨機六人提交：「有一項唯一第一 ⇒ 第 1 層」0 例違反。已修。
- **其他排名例子**：A／B／C → {A:1, B:1, C:3}；加 D → {A:1, B:1, D:1, C:4}；分數 80／80／78。都跟正文一致。
- **should-fix 1–3**：L220 改寫成作業頁與 starter 兩種說法並陳。starter `trace_logger.py` 的確寫 "computes cost and turn counts from this trace"，`api_request` 事件帶 `iteration`，所以「大致是這題呼叫了幾次模型」有依據。L323 把「輪」跟 turn 數分開了。L346 改成「講成本那一段的最後一頁」並註明作業 4。都已修。
- **nit**：L211 雙連結；L210、L213 補規則；L360、L364 補術語解釋；L329 只寫「開頭維持不變」並連第 8 堂 p21（PDF p21 原文 "Maintain stable prefixes"，確認）；L247、L316、L400 都照建議改了。
- **流程圖（L63–203）**：節點有 agent container、你的 agent（src/）、dispatcher client、課程 API、task container k（sandbox_server、/app）、facility run_all.py、grading container 隱藏測試。連線有 agent→API、agent→task（HTTP POST）、dispatcher⇄facility、facility→grading（套 patch）、grading→facility（失敗／總數）。全部對得上作業頁 Part 0 的架構圖（存檔 L15–41），沒有作業頁沒有的元件或連線。省略「facility 啟動與移除 task container」已寫在 caption。六個步驟的文字也都對得上 Part 0 原文。`diagram-preview` 沒有重跑，沿用作者紀錄的全 ✓。
- **課程誠信**：L334–340「先試三個」只講怎麼從 trace 挑，沒寫任何改法。L381–387 綜合題 4 的判準明寫「只考讀 trace、找差距，不考怎麼改」，答案只指出快取、停止條件、平行三列與依據的數字，沒有給參數或做法。槓桿表拿掉了「先規劃再一次做多個動作」。沒有新增帳密、題目 repo 名或可跳的題。通過。

### 新發現

🟡 should-fix（1 項）：**L336–338 的三步跟綜合題 4 對不起來，第 2 步照字面做不到。** 第 2 步要讀者把「表格第三欄的數字」換算成每題錢與分鐘、再對照 $0.38 與 9.2 分鐘。但第三欄多半是比例或分布（快取命中率、步數分布、等評估的時間占比），沒辦法逐列換算成錢或分鐘，所以第 3 步「差距最大的三列」沒有可比的量。綜合題 4 的判準也沒用到第 2 步，是直接看哪幾列數字異常。建議改法：第 2 步改成「先算這次每題花多少錢、多少分鐘，跟 $0.38／題、9.2 分鐘／題比，看錢和時間哪一項超得多」；第 3 步改成「在超標的那一項底下，挑第三欄數字最反常的三列」。綜合題 4 可以順便補一句估算：照題目數字（prompt 從 4,000 線性漲到 60,000、命中 20%、全 Expert，假設每步輸出 500 token），一題約 $1.9，是 $0.38 的 5 倍，所以先看錢的三列。這樣練到的才是正文教的步驟（Python 估算：輸入約 1.09M token，約 $1.93）。

沒有發現新的事實錯誤或算術錯誤。

結論：沒有 must-fix 了；仍須修 1 項 should-fix（L336–338 的三步與綜合題 4 對齊），修完即可通過。

修正（作者）：2026-10-22，照複審建議改 L336–338 的三步：第 2 步改為「先算這次整體每題花多少錢、多少分鐘，跟 $0.38／題、9.2 分鐘／題比，看錢和時間哪一項超得多」；第 3 步改為「在超標的那一項底下，挑第三欄數字最反常的三列」。綜合題 4 判準補估算：prompt 4,000→60,000 線性、34 步共約 109 萬 token、命中 20%、全 Expert、假設每步輸出 500 token，一題約 $1.9，是 $0.38 的 5 倍（Python：輸入 1,088,000 token，快取 $0.0218＋未快取 $1.7408＋輸出 $0.17＝$1.933，÷0.3846＝5.02 倍），所以先看錢的列。仍不給優化做法。修正後 sha256 `ebac1ddb7ea52e2b0098036de546931d07b7cf4958adfc9e7a9e22a03bc459d0`。`check:tw` 0 blocking；register-scan 長句 2（L29、L33，理由同前）。

最終複核（2026-10-22，sha256 `ebac1ddb…bc459d0`）：L336–338 的三步已改成「先比整體每題錢／時間 → 在超標的那一項底下挑三列」，跟綜合題 4 的判準對得上。估算用 Python 重算：1,088,000 token，$0.0218＋$1.7408＋$0.17＝$1.933，是 $0.385 的 5.02 倍，正確。三步和判準都沒有給優化做法。🟢 nit（不擋）：題目沒給每題時間，判準「錢超得比時間多」推不出來；而且列出的第三列「關鍵路徑與平行」是時間的列，跟「先看跟錢有關的列」不一致。可以把那句改成「錢超了 5 倍，先看跟錢有關的列；一半時間在等評估，時間那一列也值得列進來」。結論：通過。

修正（作者）：2026-10-22，照最終複核 nit 改綜合題 4 判準：題目沒給每題時間，原句「錢超得比時間多」改為「錢超了 5 倍，先看跟錢有關的列；牆鐘時間有一半在等評估，時間那一列也值得列進來」（題目數字：一半時間在等評估，核對一致）。sha256 `ca30f5cb0bf58607d1fc7d9a3c96bd0c83edac876028b9bbf592844af6806627`。check:tw 0 blocking。
