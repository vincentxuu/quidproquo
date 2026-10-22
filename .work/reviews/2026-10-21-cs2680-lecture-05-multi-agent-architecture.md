審稿對象：src/content/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture.md，sha256：2ea9d9b83fb94175e344bf8f0cb3f2d5d9666df2eb723a4f649ce370ec2f7b69

post-verify、post-polish：作者自查（撰寫的子代理），2026-10-22。post-review：待獨立審稿者（未參與撰寫）填寫。

依據：投影片 `.work/research/harvard-cs2680/sources/slides/5_agent_design_2.pdf`（46 頁，頁碼用 PDF 頁序，已逐頁以 pdftotext 對過；頁尾印的號碼在 p32 之後比 PDF 頁多 2）、`.work/research/harvard-cs2680/lectures-05-08.md` L5 段、範圍卡 `.work/series-plans/harvard-cs2680.md` Order 7、查證表 `.work/research/harvard-cs2680/l5-factcheck.md`。

## post-verify

查證表 `l5-factcheck.md` 共 18 項：Confirmed 13、Confirmed（需加條件）3、Outdated 1、Contradicted 1、Not found 0。工具：Groundlane MCP 未掛載、Groundlane HTTP 401、Exa 斷線 → Keenable 搜尋＋`curl` 直接抓原頁（全部 200）。

### 逐條宣告（正文中帶數字或可查證的句子）

| # | 段落 | 宣告 | 來源 | Verdict | 正文處理 |
|---|---|---|---|---|---|
| 1 | 導言 | 第 5 堂 2026-09-23，題目 Agent Design II: Multi-Agent Systems | lectures-05-08.md L5；投影片 p1 | Confirmed | |
| 2 | 導言 | 課程不錄影 | cs2680.com/policy | Confirmed | |
| 3 | 導言 | 三段 p5–18／p19–25／p26–43，原則 p44；p3 列 memory 但沒講 | 投影片 p3、逐頁標題 | Confirmed | |
| 4 | 四個理由 | 專長、隔離、平行、context 管理 | p6 | Confirmed | |
| 5 | 三張圖 | control／task／communication graph 的問題與選項 | p7 | Confirmed | |
| 6 | 八種架構表 | 每列的運作、例子、弱點 | p9–16、p18 | Confirmed | swarm「產品裡很少用」寫成講者說法 |
| 7 | pipeline | 「one retry edge beats one more agent」 | p11 | Confirmed | |
| 8 | 混合 | supervisor＋planner＋DAG＋共用 Git＋reviewer | p17 | Confirmed | |
| 9 | 對照第 3 堂 | subagent＝supervisor–worker；agent teams 任務清單像 blackboard、mailbox 是點對點 | 第 3 堂導讀（官方 agent-teams 文件） | 本文對照 | 標明投影片沒有這樣比 |
| 10 | 自我檢查 | GPU 競標：A100 得標；T4 謊報 4 秒會得標 | p14 | Confirmed（推導） | 謊報情境是本文延伸，對應 p14 的弱點「bids are self-reported」 |
| 11 | 六種切法 | data／expertise／stage／hypothesis／tool／authority；200 檔 PR 例子 | p20 | Confirmed | |
| 12 | 子任務規格 | 八件事；差 vs 好的子任務例子 | p21 | Confirmed | |
| 13 | Anthropic | 早期短指令導致重工與缺口；要求目標、格式、工具指引、邊界 | factcheck #6 | Confirmed | |
| 14 | 粒度公式 | T_multi ≈ planning＋critical path＋communication＋merge；20 個查詢批成 4 個 | p22 | Confirmed | 30／20／35 分鐘是範圍卡指定的本文例子 |
| 15 | 切分時機 | static／dynamic／recursive／opportunistic 與上限 | p23 | Confirmed | |
| 16 | Anthropic | 早期一個簡單問題開 50 個 subagent | factcheck #6 | Confirmed | |
| 17 | 六種失敗 | overlap、gap、hidden dependency、unmergeable、lost global context、straggler 與例子 | p24–25 | Confirmed | 「怎麼防」一欄標為本文對照 p21 整理 |
| 18 | MAST | 7 個框架、14 種失敗、3 大類 | factcheck #13 | Confirmed | 依規劃表「跨篇」放延伸；六種失敗寫成第 6 堂 harness 層的子類 |
| 19 | 通訊四維度 | topology／medium／channel／format；媒介三種、通道六種 | p27–29 | Confirmed | |
| 20 | 訊息格式 | 內容自然語言、協調結構化；九種型別；靠欄位路由 | p30–32 | Confirmed | |
| 21 | 例一 | 兩個 agent 同改一檔的覆寫 | 本文例子；p12 的 consistency／concurrency | 本文補充 | 範圍卡指定的橋接例子 |
| 22 | Cognition 2026 | 寫入維持單線 | factcheck #8 | Confirmed | |
| 23 | 例二 | 購買 8 台 GPU 逾時；idempotency key、補償 | p33 | Confirmed | |
| 24 | 送達語意表 | 三種語意定義；Kafka 冪等 producer 用 id＋序號去重 | factcheck #14 | Confirmed | |
| 25 | 分散式難處 | 六項 | p34 | Confirmed | |
| 26 | 多 agent 額外挑戰 | 排程、資源分配、狀態管理；沒有事先決定的請求流程 | p35 | Confirmed | |
| 27 | LLM 額外難度 | 資訊流失、污染、過期、衝突、無人負責、迴圈 | p36 | Confirmed | |
| 28 | A2A | 規格 1.0.0；agent card 路徑與欄位 | factcheck #15 | Confirmed | |
| 29 | A2A | Message／Task／Artifact；八個狀態（四個終態、兩個中斷） | p39–40；factcheck #16 | Confirmed | |
| 30 | A2A | polling／streaming／push；標準化通訊不是編排；不透明執行 | p41；factcheck #17 | Confirmed | |
| 31 | MCP | 三原語；host 開多個 client、每個 client 接一個 server；host 管連線與同意、模型決定何時呼叫工具 | factcheck #18 | Contradicted（投影片用詞） | 正文寫現行規格用詞並點出投影片簡化了 |
| 32 | MCP vs A2A 表 | 五列 | p43 | Confirmed | 「Discovery」一列省略 |
| 33 | 二十個 MCP server | 示意說法 | p43 | Confirmed | 標「示意說法」 |
| 34 | 四條原則與結語 | | p44 | Confirmed | |
| 35 | Cognition 2025 | 兩條原則、Flappy Bird 例子、單線 agent | factcheck #7 | Confirmed | |
| 36 | Cognition 2026 | 審查 agent 不共享 context 反而抓得更多 | factcheck #8 | Confirmed | |
| 37 | Anthropic | 90.2%（內部評測）、15× token、coding 平行部分較少 | factcheck #2、#4、#5 | Confirmed | 標明自家數據與內部評測 |
| 38 | Kim | 260 種設定；+80.8%／−70%；45% 門檻；錯誤放大約四分之一（4.4 vs 17.2） | factcheck #9–#11 | Confirmed | 條件寫在每一點 |
| 39 | Tran & Kiela | 固定思考 token 預算、多跳推理 | factcheck #12 | Confirmed | |

## post-review

審稿者：獨立審稿子代理（未參與撰寫），2026-10-22。審的檔案 sha256 `2ea9d9b83fb94175e344bf8f0cb3f2d5d9666df2eb723a4f649ce370ec2f7b69`，與檔頭一致（審稿期間未改）。行號指這個版本。

### 機械檢查

- `pnpm check:tw`：0 blocking、0 to review。`scan-ledger.sh`：模板化轉折、高風險用詞、標題壓縮語氣都是 0。
- `register-scan.sh`：長句 16（最長 L31 88 字、L187 93 字；L187 是 p36 六項用分號串成一句，可考慮改清單）、但書 3/96 段（3%）、引述區塊 6（都是自我檢查）、數字 ≥4 的段落 7（頁碼範圍與來源說明，可接受）、姓名主詞 1（Kim 等人）、模板化轉折 0、英文術語 0。
- `pnpm check:references`：本篇只有 `-en` 還沒產出的 ERROR，依指示忽略。
- `check-course-titles.mjs` 0 issue；`check-course-guide-layout.mjs` 0 issue；`check-process-leak.mjs` exit 0。
- 站內連結：第 2／3／4 堂、orchestration patterns、communication、protocol layer 六篇都存在；兩個頁內錨點（`#課程影片來源`、`#四條設計原則與反方意見`）對得上 H2。
- 全文沒有 diagram 區塊（第 2、4 堂各有一張），見 should-fix 10。

### 事實抽驗

投影片抽 22 處（`pdftotext -layout -f N -l N` 逐頁對 PDF 頁序）：p3 大綱列 memory、p45 下堂 memory；p6 四理由；p7 三張圖；p9–16 八種架構的運作、例子、弱點與頁底三欄標註；p11「one retry edge beats one more agent」；p14 三個節點的價格與 ETA、「cheapest bid under 5s」；p15「Rarely used in products」；p17 混合例子；p20 六維度與 200 檔 PR；p21 八項規格與好／差子任務；p22 公式與 20→4；p23 四種時機與上限；p24–25 六種失敗的例子；p27–29 四維度、三種媒介、六種通道；p30–32 訊息格式、型別、「Route on the fields」；p33 GPU 逾時與 idempotency key、補償；p34–36 各項難處；p37–41 A2A 流程、card、三抽象、狀態、三種追蹤、「standardizes communication, not orchestration」；p42–43 MCP 三原語、「one client speaks to many servers」、對照表五列、二十個 MCP server；p44 四原則與結語。內容與頁碼都對得上。不準的三處：L145 把歸類說成第 6 堂的內容（should-fix 4）、L162 說投影片只點名詞（should-fix 5）、L131「後三種」（nit 1）。自我檢查 GPU 競標的答案重算過：T4 10 秒被排除，A100 0.20 < H100 0.40，A100 得標；T4 謊報 4 秒會以 0.05 得標。正確。

外部來源抽 8 個，全部用 `curl` 抓原頁：
- Anthropic〈How we built our multi-agent research system〉：「Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval」「multi-agent systems use about 15× more tokens than chats」「simple, short instructions like 'research the semiconductor shortage'」「spawning 50 subagents for simple queries」「domains that require all agents to share the same context or involve many dependencies … most coding tasks involve fewer truly parallelizable tasks」。L99、L132、L234 Confirmed。
- Cognition〈Don't Build Multi-Agents〉：2025.06.12、Walden Yan；Principle 1／2 原文、Super Mario 背景與 Flappy Bird 小鳥、「single-threaded linear agent」。L230 Confirmed。
- Cognition〈Multi-Agents: What's Actually Working〉：2026.04.22，開頭「10 months ago」；「Our original observations still hold today for parallel-writer swarms」「writes stay single-threaded」「work best when the coding and review agents do not share any context beforehand」。L164、L232 Confirmed。另見 should-fix 6（註腳說和 Anthropic 結論相近）。
- MCP 2026-07-28 Architecture：「each host can run multiple client instances」「Each client is created by the host and communicates with exactly one server」「Enforces security policies and consent requirements」。L213 Confirmed。
- Confluent delivery semantics：三種語意定義原文；「the broker assigns each producer an ID and deduplicates messages using a sequence number」。L168–174 Confirmed。
- A2A specification：「Latest Released Version 1.0.0」、`GET /.well-known/agent-card.json`、「Opaque Execution」。L194–201 Confirmed。
- Kim et al. arXiv 2512.08296 v3（2026-04-08）：260 configurations、six benchmarks、Single-Agent 加四種多 agent。L236 Confirmed；17.2×／4.4× 依查證表 #10。
- Tran & Kiela arXiv 2604.02460 v2：「SAS consistently match or outperform MAS on multi-hop reasoning tasks when reasoning tokens are held constant」。L243 Confirmed（原文說的是「computation and context effects」，見 nit 5）。

### 教學規格對照（概念導讀，單堂）

| 規格項 | 位置 | 判定 |
|---|---|---|
| 主問題與讀完能力 | L31 | 有，跟範圍卡一致 |
| 讀完能力一：用粒度公式判斷拆不拆 | L101–121、綜合題 1 | 公式和例子都有；但例子第二列的數字和說明對不上（should-fix 1），綜合題 1 沒給數字，讀者沒機會真的套公式（should-fix 2） |
| 讀完能力二：為選定的拆法指出最可能出錯的通訊環節 | L160–190、綜合題 2 | 只做到一部分。材料都有（p34–36 的清單、兩個例子），但沒有一處把「某種架構」對到「它最容易壞的通訊環節」；綜合題 1 的判準寫的是切分失敗，不是通訊失敗（should-fix 2） |
| 斷崖：送達語意橋接 | L162–174 | 清楚：先走例子，再給三種語意表，再接冪等與 Kafka。缺兩個接點：沒把「重送／不重送」直接對到表裡的 at-least-once／at-most-once；範圍卡點名的 partial failure 沒有對回 GPU 逾時例子（nit 6） |
| 範圍卡指定例子 30／20／35 分鐘 | L111–118 | 算術對（2+10+3+5＝20、2+25+3+5＝35）；說明文字有矛盾（should-fix 1） |
| 範圍卡指定自我檢查「回報送兩次」 | L189–190 | 有，答案正確（帶 id 去重、只回 ACK） |
| 各節自我檢查附答案或判準 | L79、L120、L189、L249–254 | 都有；綜合題 2 判準混進不相干的架構（should-fix 3） |
| 跨篇失敗分類（規劃表「跨篇」列） | L145 | 有放 MAST 延伸；但把歸類說成第 6 堂的內容（should-fix 4） |
| 反方立場是否公允 | L228–245 | 大致公允，正反兩邊都有條件。兩處把 Cognition 寫得比原文更「反」（should-fix 6） |
| 不把非投影片內容歸給講者 | L77、L145、L162、L269 | 多數有標；L145、L162 兩處不準 |
| 沒解釋就用的術語 | L66／L75 DAG、L158 runtime／payload、L174 producer／broker | 見 should-fix 7 |
| 研究過程漏進正文 | 全文 | 沒有。L27、L267–269 是讀者需要的來源說明 |
| 閱讀頁覆蓋 | 9/23 閱讀頁五篇 | AutoGen、MetaGPT 全文零次出現（should-fix 8） |
| 篇幅與折疊 | 各 H2 字數：通訊 6.7k、任務切分 4.8k、原則 3.4k、架構 2.7k | 總長比第 4 堂短，不需要折疊。A2A 欄位（L196–198）停在投影片層級，沒有違反範圍卡「不講協定欄位細節」，但已接近邊界（nit 7） |

### 🔴 must-fix

1. 外部數字與引述缺 inline link（post-review 8.5）。L234 有 90.2%、15 倍、Opus 4／Sonnet 4，整段沒有連結；L132「一個簡單的問題開了 50 個 subagent」同樣沒有連結（Anthropic 只在 L99 連過一次）。改法：L234「Anthropic 的 Research 功能」改成連到 `https://www.anthropic.com/engineering/multi-agent-research-system`；L132「Anthropic 的 Research 早期」同樣加連結。同一類但較輕的兩處順手補：L201「規格本身也強調『不透明執行』」把「規格」連到 A2A specification；L174「Kafka 的冪等 producer」連到 Confluent 文件。
   修正：L234「Anthropic 的 Research 功能」、L132「Anthropic 的 Research 早期」加 inline link；L201「規格本身」連 A2A specification；L174「Kafka 的冪等 producer」連 Confluent 文件；新補的 15 倍句也帶 Anthropic 連結。

### 🟡 should-fix

1. L116–118 粒度例子第二列的數字和說明對不上。L118 說「三段其實是依序跑的」，三個 10 分鐘子任務全部依序，關鍵路徑應該是 30，不是 25。25 代表只有一小段能重疊。改法二選一：(a) 數字照範圍卡留 25，L118 改成「後兩個子任務要等前一個的結果，只有約 5 分鐘能重疊，關鍵路徑變成 25 分鐘」；(b) 改成完全依序，關鍵路徑 30、合計 40。建議 (a)，不用改範圍卡。
   修正：採 (a)，數字留 25，說明改成「後兩個子任務要等前一個的結果，三段之中只有約 5 分鐘能重疊」。
2. 讀完能力二沒有練習，綜合題 1 也沒有數字可套公式。L249 只問「用粒度公式說明要不要拆」，判準 L250 是質性的；判準寫的「丟失整體脈絡」是 p25 的切分失敗，不是通訊失敗。改法：題目給數字，例如「單一 agent 讀完 50 份要 50 分鐘；拆給 5 個 worker，每人 10 份」，請讀者估規劃、合併的分鐘數再算；判準補一條通訊環節：「supervisor 是彙整節點，worker 交上來的摘要會丟細節（p36 資訊流失、原則 3）；要指定每個痛點附原文引述與訪談編號」。另外可以在八種架構表後加一句「每種架構最容易壞的通訊環節」：supervisor 是彙整時遺失、blackboard 是同時寫入與狀態過期、pipeline 是錯誤往下游傳、swarm 是迴圈與訊息量（p18 的 Weakness 欄就有 Errors propagate／Stale state／Groupthink 可以引用）。
   修正：綜合題 1 改成給數字（單 agent 50 分鐘；5 個 worker 各 10 份，規劃 2、溝通 3、合併 6），判準算出 2＋10＋3＋6＝21 分鐘並補通訊環節（supervisor 彙整遺失細節，p36、原則 3；每個痛點附原文引述與訪談編號）；算術自驗。八種架構表後的混合段之前新增一段清單，依 p18 弱點欄把五種架構對到最容易壞的通訊環節。
3. L252 綜合題 2 判準寫「dynamic 或 swarm 類架構失敗難重現」，但題目是兩個 agent 固定共用一個 repo，這是 blackboard，不是 dynamic 或 swarm。照這個判準，讀者答錯架構也能拿分。改法：刪掉 dynamic／swarm 那句，改成「這是 blackboard 架構的同時寫入（p12）：兩個 agent 各自讀到舊版本再寫回，誰後寫誰贏，所以 CI 結果看執行順序而定」。
   修正：判準改成 blackboard 架構的同時寫入（p12），誰後寫誰贏、CI 看執行順序，刪掉 dynamic／swarm。
4. L145「第 6 堂講失敗歸因時，會把它們歸在 harness 這一層」不是第 6 堂的內容。第 6 堂投影片 p27 的 harness 層列的是 context truncation、memory error、state corruption、control loop error、blocking fan-out，沒有提這六種切分失敗；這是規劃表「跨篇」列的編輯決定。而且重疊、缺口、隱藏依賴也可以算子任務規格（spec 層）。改法：「本系列把這六種失敗放在第 6 堂五層歸因的 harness 層底下；其中『拖尾』就是第 6 堂 harness 層的 blocking fan-out。」
   修正：改成「本系列把這六種失敗放在第 6 堂五層歸因的 harness 層底下……其中『拖尾』就是第 6 堂 harness 層列的 blocking fan-out。重疊、缺口、隱藏的依賴也可以看成子任務規格沒寫清楚。」已回 L6 投影片 PDF 頁 26（頁尾 27）確認 blocking fan-out 在 harness 層。
5. L162「投影片在這裡只點了名詞，這一節先補兩個例子」不準確。例二（購買 8 台 GPU 逾時）就是 p33 的投影片內容，只有例一是本文補的。改法：「投影片在 p33–34 只點了名詞與一個逾時場景，這一節用兩個例子展開：第一個是本文補的，第二個延伸 p33。」
   修正：改成「投影片在 p33–34 只點了名詞與一個逾時場景。這一節用兩個例子展開：第一個是本文補的，第二個延伸 p33。」
6. 反方呈現有兩處比原文更「反」。(a) L230 只寫 Cognition 2025 的結論「一個單線的 agent」，沒寫同一篇也接受只回答問題、不寫程式的 subagent（文中以 Claude Code subagent 為例；9/23 閱讀頁的摘要也寫「where a subagent is unavoidable, give it read-only work」）。少了這點，L232 的 2026 年文章看起來像立場翻轉，其實是同一條線往外推。改法：L230 句末補「只有回答問題、不動手寫的 subagent 他認為還可以接受」，L232「修正了說法」改成「把可行的範圍說得更清楚」。(b) Cognition 2026 文的註腳說 Anthropic 隔天發的那篇「came to similar conclusions」。L228–234 把兩邊寫成反方對正方，可以在 L234 加半句：「Cognition 2026 年的文章也說，兩篇的結論其實相近。」
   修正：重讀 Cognition 兩篇原文（curl 存檔）。(a) 2025 段末補「只回答問題、不動手寫程式的 subagent，他認為還可以接受，例子是當時的 Claude Code subagent」（原文 Claude Code Subagents 一節）；「修正了說法」改「把可行的範圍說得更清楚」。(b) Anthropic 段末補 Cognition 2026 註腳 [1]：兩篇結論相近，多 agent 最先用得上的是只讀不寫的 agent。
7. 沒解釋就用的術語：L66、L75 的 DAG（建議 L66 表格前或 L75 補「DAG：有向無環圖，工作只往下游流、不會繞回來」）；L174 的 producer、broker（讀者沒修過分散式系統，建議寫「送訊息的一方（producer）」「中間存訊息的伺服器（broker）」）；L158 的 runtime、payload（建議 runtime 第一次出現補「負責轉送訊息的程式」）。
   修正：DAG 在表格 Pipeline 列補「有向無環圖：工作只往下游流，不會繞回來」；producer／broker 寫成「送訊息的一方（producer）」「中間存訊息的伺服器（broker）」；runtime、payload 第一次出現補括號說明。
8. 9/23 閱讀頁列了五篇：AutoGen、MetaGPT、Anthropic、Kim、Cognition。AutoGen、MetaGPT 全文零次出現，但 L268 寫「閱讀與投影片引用的數字回原文核對」，讀者會以為閱讀都涵蓋了。MetaGPT 的「每個角色交出結構化產出、下一站檢查後再接手」正好就是 p11 pipeline 與 p30–31 結構化訊息的主張。改法：在 L158 段末或延伸閱讀加一行：「閱讀還有 AutoGen（把多 agent 寫成對話）與 MetaGPT（角色之間交結構化文件），本文沒有展開」，各附 arXiv 連結。
   修正：通訊格式段後補一段，AutoGen（多 agent 寫成彼此對話）與 MetaGPT（SOP 寫進 prompt、角色像生產線分工、專長角色檢查中間結果，接近 pipeline），各附 arXiv 連結，措辭依兩篇 abstract。
9. 粒度公式算的是完成時間，不是花費，正文沒講。L245 把「值得多花 token」接到「粒度公式裡關鍵路徑與合併兩項」，讀者會以為公式也算了成本。改法：L118 後補一句「這條公式只算完成時間。三個 agent 平行跑，時間變短，token 卻是三份以上（Anthropic 量到多 agent 約是一般對話的 15 倍），值不值得是另一筆帳。」L245 改成「這也就是粒度公式（時間）與 token 帳（成本）要一起算的原因」。
   修正：粒度例子後補「這條公式只算完成時間，不算花費……Anthropic 量到多 agent 約是一般對話的 15 倍」；L245 改成「這也是粒度公式（時間）與 token 帳（成本）要一起算的原因」。
10. 圖表（post-review 9.3）：全文 0 張圖。兩處看圖會比讀字快：(a) L166–174 GPU 逾時，畫成時序圖（A→B 送出、B 執行、回覆遺失、A 逾時重送、B 用 idempotency key 認出重複並回上次結果），對照「沒有 key 就買兩次」；(b) L62–71 八種架構的形狀，畫成 8 格小圖（星狀、樹、直線、共用黑板、兩人加裁判、廣播競標、全連接、會變形）。建議至少做 (a)。
   修正：做 (a)。在送達語意段後加一張循序圖（agent A／agent B／雲端供應商，8 步逐步播放：送出、建立、完成、回覆遺失、逾時、同 key 重送、認出已處理、回上次結果），照 diagram skill 的 sequence 參考檔畫；`scripts/diagram-preview.ts` 全部 ✓，淺色、深色、375px 三張截圖都看過（手機為框內橫向捲動，符合參考檔建議）。(b) 八種架構小圖未做。

### 🟢 nit

1. L131「後三種都要設上限」：p23 寫的是「Decomposition needs spawning limits…」，對所有切分都適用。可改「切分都要設上限，動態、遞迴、自取三種尤其需要」。
   修正：改「切分都要設上限，動態、遞迴、自取三種尤其需要」。
2. L73「往往比再加一個檢查 agent 便宜」：p11 只說「one more agent」，「檢查」是本文推論。可刪「檢查」兩字，或寫「（本文的解讀）」。
   修正：改「本文的解讀是……比再加一個 agent 便宜」，刪「檢查」。
3. L64「研究員、程式、審查三個 worker」：「程式」讀起來像名詞，改「研究、寫程式、審查」。
   修正：改「研究、寫程式、審查」。
4. L241「沒有中央驗證時」：17.2 倍是 independent（各自獨立）這一種，不是所有非中央架構。改「讓 agent 各自獨立、沒有中央驗證時」。
   修正：改「讓 agent 各自獨立、沒有中央驗證時」。
5. L243 Tran 與 Kiela 的原文是「unaccounted computation and context effects」，本文只寫算力。可補「與 context 效應」。Kim 與 Tran 兩篇都是 arXiv 預印本，可在名字後註明。
   修正：補「與 context 效應」（改成「沒算進去的算力與 context 效應」）；Kim、Tran 兩處註明 arXiv 預印本。
6. L166–174 送達語意橋接：可在 L166 句末直接對表：「重送就是 at-least-once，不重送就是 at-most-once。」範圍卡點名的 partial failure 已在 L181（分不出慢還是掛了），可在 L166 補一句「A 分不出 B 是慢還是掛了，這就是 L181 的 partial failure」把兩處接起來。
   修正：例二補「A 也分不出 B 是很慢還是已經掛了，這就是下面會提到的『部分失敗』。重送就是下表的 at-least-once，不重送就是 at-most-once。」
7. L196–198 A2A card 欄位與八個狀態都照投影片 p38、p40 寫，沒有超出範圍卡，但已經接近「協定欄位細節」。綜合題 3 只用到 input required 與 push，若想再短，L196 可收成一句「每個 agent 在固定網址公開一張能力名片」。
   未改：範圍內，綜合題 3 仍用到狀態與推播，保留。
8. L198 的訂機票三句話屬於同一任務，出自 p39，不是 p40。可改「（p39–40）」。
   修正：改「（p39–40）」。
9. tags 8 個，超過 skill 建議的 3–7；但第 3、4 堂也是 8 個，屬系列慣例，不改也可以。
   未改：系列慣例 8 個 tags。

## post-polish

掃描結果（`register-scan.sh`，最後一版）：長句 16 句（約 96 段中，多數 60–70 字；導言 88 字那句以問號斷開，實際讀起來是兩個短問句）、但書段落 3%（綠）、引述區塊 6（誤判：全是自我檢查的 `>` 區塊）、單段數字 ≥4 有 8 段（多為頁碼範圍與日期；課程影片來源兩條是來源說明，保留）、姓名主詞 1（Kim 等人，論文作者，保留）、模板化轉折 0、英文術語 0。

| # | 位置 | 指標 | 問題 | 處理 |
|---|---|---|---|---|
| 1 | Kim 段落 | 數字 7 個、英文術語段 | 四個結果與條件擠在一段 | 改成四點清單，倍數改寫成「約四分之一」 |
| 2 | 分散式難處 | 長句（107 字） | 六項用分號串 | 改清單 |
| 3 | 對照第 3 堂 | 長句（92 字） | 括號說明加兩組對照 | 刪掉重複的括號說明、拆兩句 |
| 4 | 導言第二段 | 長句（88 字） | 問句串 | 保留：兩個問號斷開，讀起來不長 |

`pnpm check:tw`：0 blocking、0 to review。`check-course-titles.mjs`、`check-course-guide-layout.mjs`（整系列 14 篇）：0 issue。`check-process-leak.mjs`：exit 0。`check:references`：只有 `-en` 尚未產出的一條錯誤。

修正：1–3 已改；4 保留。

## 作者修正（回應 post-review）

修正後 sha256：`11b64fabf1b1cef575d5a87fe20a9302b852119423a76f02efcb1766e733ba4c`，**尚未複審**。重跑：`check:tw` 0 blocking；`register-scan.sh` 長句 20（新加的架構對通訊段落 115 字已改清單）、但書 3%、模板化轉折 0、英文術語 0；`check-course-titles.mjs`（本篇）0 issue；`check-course-guide-layout.mjs`（整系列 14 篇）0 issue；`check-process-leak.mjs` exit 0；`diagram-preview.ts` ✓；`check:references` 只剩 `-en` 尚未產出。

## 複審

審稿者：同一位獨立審稿子代理，2026-10-22。複審版本 sha256 `11b64fabf1b1cef575d5a87fe20a9302b852119423a76f02efcb1766e733ba4c`（與作者修正紀錄一致）。行號指這個版本。重跑 `check:tw` 0 blocking；`check:references` 只剩 `-en` 未產出。

### 逐項核對

| 原項 | 位置 | 結果 |
|---|---|---|
| 🔴 1 inline link | L109、L130、L144、L188、L279、L312 | 到位 |
| 🟡 1 粒度第二列 | L128 | 到位，「只有約 5 分鐘能重疊」與 25 分鐘一致 |
| 🟡 2 綜合題 1 給數字＋通訊環節 | L327–328、L75–83 | 到位。算術重算：50÷5＝10 分鐘關鍵路徑，2＋10＋3＋6＝21 < 50，正確。L75–83 的對照清單：Pipeline／Blackboard／Committee／Swarm 與 p18 Weakness 欄（Errors propagate、Stale state、Groupthink、O(n²) messages）一致；Supervisor 一列 p18 寫的是「Planner bottleneck」，本文寫成彙整丟細節（出自 p9、p36），段首已標「本文把它對到通訊上」，可接受（見 nit A） |
| 🟡 3 綜合題 2 判準 | L330 | 到位 |
| 🟡 4 第 6 堂歸類 | L157 | 到位；L6 p27 harness 層確有 blocking fan-out |
| 🟡 5 投影片只點名詞 | L176 | 到位 |
| 🟡 6 Cognition 反方 | L308、L310、L312 | 回原文核對：(a) 2025 文 Claude Code Subagents 一節「the subtask agent is usually only tasked with answering a question, not writing any code」，並說這樣主 agent 的 context 可以撐更久、是「purposefully simple approach」；寫成「他認為還可以接受」是合理轉述。(b) 2026 文註腳 [1]「came to similar conclusions about the first area of applicability being in readonly agents」，L312「多 agent 最先用得上的是只讀不寫的 agent」正確 |
| 🟡 7 術語 | L66、L170、L188 | 到位 |
| 🟡 8 AutoGen／MetaGPT | L172 | 措辭回 arXiv abstract 核對：MetaGPT「encodes SOPs into prompt sequences」「assembly line paradigm」「agents with human-like domain expertise to verify intermediate results」，三點都對；AutoGen「multi-agent conversation」對；兩個 arXiv 號（2308.08155、2308.00352）標題相符。但參考資料沒有收這兩篇（見仍須修 3） |
| 🟡 9 時間 vs 成本 | L130、L323 | 方向到位，但引入一個推理錯（見仍須修 1） |
| 🟡 10 循序圖 | L190–252 | 與 p33 一致：A 請 B 購買 8 台 GPU、回覆遺失、A 不知道 B 執行了沒；idempotency key 也是 p33 列的做法。雲端供應商這個參與者、key 值 `t-17`（借自 p31 的 task_id 樣式）與重送去重流程是本文補的，caption 已寫明。step 文字、箭頭方向、活動條（B 在 1–4、6–8 步）與正文一致 |
| 🟢 1–9 | L144、L73、L64、L319、L321、L180、L276 | 都到位；🟢 7（A2A 欄位）、🟢 9（tags）作者未改，原本就是可選 |

### 仍須修

1. 🟡 L130「token 卻至少是三份」推理錯，而且是我在 should-fix 9 給的建議句造成的。工作切成三份，總工作量沒有變三倍；多出來的是每個 agent 都要各自讀一次背景、指令與相關資料，加上溝通與合併。改法：「三個 agent 平行跑，時間變短，token 卻比單一 agent 多：每個 agent 都要各自讀一次背景與指令，還要加上溝通與合併。」後半 Anthropic 15 倍那句保留。
2. 🟡 L180「這就是下面會提到的『部分失敗』」指向不存在的詞：L254–261 的清單沒有出現「部分失敗」。改法：L259 改成「分不出一個 agent 是很慢，還是已經掛了（部分失敗，partial failure）。」
3. 🟢 L172 新連的 AutoGen、MetaGPT 沒進 `## 參考資料`。建議補兩條：`[Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation (2023)](https://arxiv.org/abs/2308.08155)`、`[Hong et al., MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework (2023)](https://arxiv.org/abs/2308.00352)`。

nit A（可選）：L77 可補「（p18 寫的是 planner 瓶頸；本文從 p9、p36 看通訊面）」。

結論：仍須修 1、2 兩項（各一句），3 建議順手補；改完不需要再整篇複審，對一下這三處即可。

修正（2026-10-22，主 session）：L130 照複審建議改為「token 卻比單一 agent 多：每個 agent 都要各自讀一次背景與指令，還要加上溝通與合併」；L259 清單補「（部分失敗，partial failure）」，對上 L180 的指涉；參考資料補 AutoGen（Wu et al., 2308.08155）與 MetaGPT（Hong et al., 2308.00352），題名與第一作者對 arXiv API 確認。複審指定的三處已全部處理；check:tw 0 blocking。

最終結論（2026-10-22，審稿子代理，核對 sha256 `1a3e8acdf8120f4dd1a17c92ac47310d06d0da6e7a93c7851db50c03b43aeeaf`）：L130 改寫正確；L259 已補「部分失敗，partial failure」，L180 的指涉對得上；L359–360 補了 AutoGen、MetaGPT 兩條。check:tw 0 blocking。結論：通過。
