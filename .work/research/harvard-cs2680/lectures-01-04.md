# Harvard CS2680 (Fall 2026) — L1–L4 素材盤點

> 範圍：講者 Juncheng Yang 的前四堂（2026-09-02、09-09、09-14、09-16）＋作業／政策／專題頁摘要。
> 素材：`sources/slides/*.pdf`（pdftotext -layout 抽字）、`sources/pages/*.txt`、`sources/pages/index.html`。
> 頁碼一律用 **PDF 頁序**（`pdftoppm -f N` 的 N）。投影片右下角印的頁碼和 PDF 頁序不一致（例如 L1 PDF p4 印「5」、L3 PDF p64 印「74」），代表講者發佈前刪了隱藏投影片；引用時以 PDF 頁序為準。
> 圖表頁已渲染檢查：L1 p21、p47；L2 p53；L3 p64–67；L4 p26、p43。
> 查證日期：2026-10-21。

---

## L1｜2026-09-02 Course overview（`slides/1_intro.pdf`）

### 1. Deck facts
- 檔案：`slides/1_intro.pdf`，50 頁（pdfinfo）。
- 日期：2026-09-02（Week 1）。同日 Assignment 1 發布、要求註冊 AWS。
- 首頁 schedule 這一列 **沒有列 readings**。
- p47 是空白頁（渲染確認，只有頁尾）。p48 起是「Optional reading」。

### 2. 段落大綱（deck 原順序）
| 段落 | 頁 |
|---|---|
| 標題、今日計畫（課程概觀／政策與行政／AI systems 與 agentic systems） | p1–2 |
| 講者與 MaDSys 研究群、TF、破冰（同桌自我介紹 5 分鐘） | p3–7 |
| The course：學什麼、五份作業、專題、「很多學習發生在課後」 | p8–14 |
| Grading, policy and logistics：配分、修課人數、AI 使用政策、出席／筆電、運算資源、課表可能變動 | p15–21 |
| 背景調查：修過幾門系統課、熟悉哪些名詞、怎麼用 AI、Agentic Coding Levels 0–5 | p22–26 |
| Part I — AI Systems：AI vs AI Systems、為何要在意、運算／非決定性／記憶體儲存通訊／模型與 workload 快速演變／可靠度與電力 | p27–34 |
| Part II — Agentic AI Systems：agent 定義、為何需要 agent、agent 作為新型電腦、為何 agent 是系統問題、agentic systems stack、要最佳化什麼、新系統問題、可觀測性、本課要回答的 9 個問題、不涵蓋的主題 | p35–45 |
| Next class（寫「LLM basics」） | p46 |
| （空白）／Optional reading：AI agent vs assistant vs bot、三項差異 | p47–50 |

### 3. 核心概念
全部都是 **NEW**（第一堂）：
- 課程定位：graduate-level computer systems course；兩部分 Foundations（前幾堂：LLM 與 agent 入門、Claude Code 使用、設計／最佳化 coding agent）＋ Systems for LLMs & agents（多數課堂：GPU 程式與 kernel、batching／scheduling／memory management、load balancing 與 routing、KV-cache 與 prefix-cache、agent serving）（p9–10）。
- AI/ML vs AI Systems：前者問「用什麼模型、怎麼設計模型」，後者問「怎麼大規模訓練與 serve」，目標是 performance／efficiency／reliability／sustainability；本課窄化到 LLM systems（p28）。
- AI 系統與傳統系統的差異：heterogeneous compute（CPU 做 tokenization、kernel launch、tool calls；GPU 做 matmul）、prefill compute-bound vs decode memory-bandwidth-bound、執行時間取決於輸出長度（p30）；非決定性運算（浮點加法不滿足結合律、蝴蝶效應、runtime／software／hardware 三種來源）（p31）；巨大狀態（權重、KV-cache、prefix cache）與多 GPU 通訊（TP/PP/EP/CP、NCCL、NVLink、RDMA）（p32）；模型架構與 workload 快速演變（MHA/GQA/MLA/NSA/linear attention；multi-turn chat、reasoning、RAG、agents）（p33）；可靠度與電力（p34）。
- AI agent 定義：用 AI 模型對目標推理、使用外部工具、執行多步動作直到完成的自主軟體系統；plan → act → observe → adapt → deliver 五步（p36）。
- LLM 是「奇怪的電腦」：超人（知識、語言、pattern matching、寫程式）又無能（持久記憶、可靠理解 context、幻覺、不知道自己不知道、安全）（p37，引 Karpathy 影片）。
- Agent 作為新型電腦的類比：CPU→LLM、RAM→context window、周邊→tools、OS→agent harness、應用程式→agent（p38）。
- 為何 agent 是系統問題：傳統 serving 是 request→inference→response；agent serving 是 infer→tool→infer→tool→retrieval→infer… 的鏈；步驟間有依賴、延遲變異大、阻塞等工具、狀態快速成長、可並行與 speculation、任一環節都可能失敗（p39）。
- Agentic systems stack：Application → Agent/Harness（planning、context、memory、tools、subagents）→ Model serving system（batching、scheduling、routing、caching）＋External tools → Runtime/Kernels（CUDA、Triton、collectives）→ Hardware（p40）。
- 最佳化目標：「Throughput is the wrong objective for an agent」— maximize task success subject to latency/cost/resources/reliability/security；真正要量的是 task success、end-to-end latency、tokens/task、$/successful task、energy/successful task（p41）。
- Agent workload 特性 ↔ 系統問題對照表（10 組，p42）：long trajectories→state & context management；huge context→memory hierarchy & retrieval；repeated prefixes→prefix caching；branching reasoning→speculative execution；tool dependencies→dependency-aware scheduling；different models→routing；variable tool latency→async execution；external side effects→security & isolation；multiple agents→orchestration；long-running tasks→checkpointing & fault tolerance。
- Observability：distributed trace 變成巢狀 trajectory（Session > Turn > Agent step > Model request / Tool call / Tool result / Subagent）（p43）。
- Agentic Coding Levels 0–5（p26）：0 無 AI、1 自動補全、2 AI 寫函式你 review、3 交辦任務 review code、4 goal-driven（AI 全寫、測試驗證）、5 parallel agents。
- 不涵蓋：訓練（理由：inference 主導算力需求）、模型架構設計、通訊／電力／新硬體（p45）。

### 4. 具體例子與數字（可當文章 worked examples）
- 配分（p16）：五份作業 70%（1、2、4 各 10%；3、5 各 20%）、Project 16%、Presentation 10%（paper + assignment 1）、Participation 4%、Bonus 10%；4 個 late days；逾期每天扣 20%；「20% A」政策。**注意：與網站現行配分不一致，見下方「意外發現」。**
- 修課人數（p17）：規劃 40、當天已選 80、另有 68+10+6 候補／cross-registration；運算資源不會等比例增加，截止日可能搶不到 GPU。
- 運算（p20）：Claude Code API access `api.cs2680.com`、Class HPC（SLURM、RTX 6000 PRO Blackwell）、AWS、私有 GitHub repo。
- 非決定性（p31）：第 7 位小數的偏移可以翻轉下一個 token；分配律 `a*(b+c) != a*b + a*c`；相等不具遞移性。
- 記憶體（p32）：權重 GB 到 TB；KV-cache 每 token 數十到數百 KB。
- 可靠度與電力（p34）：9% AFR、50,000 hr MTBF；16K GPU 叢集每 3 小時壞一張 GPU；CPU 100–300W、GPU 700–1000W、每台 4–8 GPU；伺服器功耗 800W→6,000W（8 倍）。
- 本課要回答的 9 個問題（p44）：batching 為何提升 throughput 卻傷 agent latency？何時用大模型？KV/prefix state 放哪？同一 agent 的 request 怎麼排程？tool call 能否和 inference 重疊？何時 spawn subagent？如何在異質 GPU 與模型間 routing？30 分鐘的 agent 失敗怎麼恢復？如何最佳化 $/successful task 而非 tokens/sec？
- Optional reading（p49–50）：AI agent／AI assistant／bot 比較表（引 Google Cloud「What are AI agents」）。

### 5. 待查證的主張
- p16 配分數字（已和網站衝突，以網站 policy 頁為準）。
- p17 人數 40／80／68+10+6；首頁公告 Sept 4 寫「increased capacity to 80」。
- p20 HPC GPU 型號「RTX 6000 PRO Blackwell」。
- p31 「Hopper FP8 vs Blackwell micro-scaling tiles」造成數值差異。
- p32 KV-cache「10s–100s KB per token」。
- p34 9% AFR、50,000hr MTBF、16K GPU 每 3 小時一張壞（疑似出自 Meta Llama 3 訓練報告類資料，slide 未標來源）；GPU 700–1000W；server 800W→6,000W。
- p37 Karpathy 影片時間戳 `t=874`（LLM 是 people spirits／認知缺陷段落）。
- p45 「inference dominates compute demand」。
- p49 Google Cloud 比較表的原文。

### 6. Readings
首頁 schedule 本堂未列 readings。投影片內引用：
- Karpathy, *Software is changing (again)* — https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=874（p37 引用；同時是 L3 必讀）🟡 title only（L3 有列）
- Google Cloud, *What are AI agents?* — https://cloud.google.com/discover/what-are-ai-agents（p49 optional）🟡 title only

### 7. 先備知識與斷崖
- 讀者需要：知道 LLM 是什麼、token 的概念；作業系統／分散式系統基本詞彙（policy 頁列了一長串：latency、throughput、tail latency、Amdahl’s law、mutex、RDMA、batching…）。
- **斷崖 1（p30–34）**：第一堂就丟出 prefill/decode、KV-cache、TP/PP/DP/EP、NCCL、RDMA、MLA/NSA 等大量 serving 名詞，但它們真正被講解是在 Part II；對一般讀者，這段只能當「預告地圖」，不能當教學內容寫。
- **斷崖 2（p31）**：浮點非結合律→token 翻轉的推論鏈需要數值計算背景。
- **斷崖 3（p46 vs L2 p2）**：p46 說下堂是「LLM basics」，但 L2 p2 宣布 LLM 背景課往後延，「把 LLM 當 magic reasoning box」。導讀系列若照實際上課順序，讀者在 L2–L4 都不會拿到 LLM 內部知識，需要在文章內自備最小 LLM API／token 說明。

### 8. 與作業的連結
- p11–12 直接介紹五份作業（見最後一節）；同日 Assignment 1 發布。
- p18：AI 使用鼓勵但要揭露；每份作業要上傳 session log。

---

## L2｜2026-09-09 Agents use I: How Claude Code Works（`slides/2_agent_use_1.pdf`）

### 1. Deck facts
- 檔案：`slides/2_agent_use_1.pdf`，53 頁。投影片標題寫「Agent From a User’s Perspective I: How Claude Code Works」。
- 日期：2026-09-09（9/7 Labor Day 停課）。
- p18 與 p19 內容相同（動畫 build）；p53 空白（渲染確認）。p44 起是 Optional slides（MCP 細節）。

### 2. 段落大綱
| 段落 | 頁 |
|---|---|
| Schedule update（LLM 背景往後移、多兩堂 agent design、少 GPU 課；paper presentation 改非必要、A1 sharing 改 bonus）、參與分數規則、新 TF | p1–3 |
| 今日計畫 | p4 |
| How Claude Code works：agentic loop、輸入前就有的 context、不送整個 repo、model proposes / harness executes、一個 prompt 觸發多次 inference、permissions、context 成長與 compaction、summary | p5–13 |
| Memory：tools + memory 讓 agent 有能力、context 是一種 memory、為何需要 memory、CLAUDE.md vs auto memory、CLAUDE.md 位置、該寫什麼、`.claude/rules/`、auto memory 結構、index 檢索、`/memory` `/context` `/init` `/doctor`、記憶的成本 | p14–26 |
| Tools：核心工具六類 | p27–28 |
| Extending an agent：skill／MCP／hook／plugin 四機制、在 loop 中的掛點、release workflow 範例、skill 結構與呼叫成本、MCP、hooks 生命週期、plugin 打包、四者如何搭配、`.claude/` 目錄、設計練習 | p29–42 |
| Next class | p43 |
| Optional：MCP what/why、架構、三 primitives、合作範例、安全、MCP gateway、gateway 六功能、MCP spec 2026-07-28 新內容 | p44–52 |

### 3. 核心概念
NEW（本堂首次）：
- **Agentic loop**：Gather context → Generate action → Run tool → repeat；分工是 harness / model / your machine（p6）。
- **Context before you type**：SYSTEM、PROJECT、MEMORY（CLAUDE.md）、TOOLS、SKILLS/MCP（只放名稱與描述，用到才載全文）、USER；開場就 10k+ tokens（p7）。
- **不送整個 repo**：repo 留在磁碟，靠 Grep 等工具按需拉切片（p8）。
- **Model proposes, harness executes**：模型只發出 `Bash("pytest")` 這類請求，harness 負責解析、檢查權限、執行，再把 tool_result 放回 context（p9）。
- **一個 user turn = 多次 inference 交替 tool 執行**（U M₁ T₁ M₂ T₂ … Mₙ A）（p10）。
- **Permission layer**：Manual／Accept Edits／Bypass／Auto（小模型檢查）；結果 allowed／ask／denied（p11）。
- **Context 成長與 compaction**：每步都加 token；compaction 摘要舊軌跡並重新注入 CLAUDE.md 與 memory；prefix-cache reads 佔大部分成本（p12）。
- **Working memory vs persistent memory**；agent 跨 run 無狀態，「memory」實務上就是開場時載入的檔案（p16）。
- 為何需要 memory：重複指令、重複探索、決策理由在 compaction 後消失、不同 session 行為不一致；「Memory is how instruction becomes convention」（p17）。
- **CLAUDE.md vs auto memory** 對照（誰寫、內容、範圍、載入量）（p18）；CLAUDE.md 四層位置與載入順序（managed policy → user → project → local，最近的最後讀）（p20）；該放／不該放什麼、200 行以下（p21）；`.claude/rules/` 搭配 `paths:` frontmatter 按需載入（p22）。
- **Auto memory**：四種 type（user／feedback／project／reference）、`~/.claude/projects/<project>/memory/`、MEMORY.md 當 index（p23）；index 常駐、topic 檔按需讀（p24）。
- 記憶的成本：每個常駐 token 都是每次 session 的「租金」；過時記憶比沒有更糟；把 memory 當 code 管理（p26）。「Context is rented, memory is owned」（p21）。
- **六類核心工具**：Read、Search（grep/glob）、Fetch、Edit/Write、Shell、Delegate（subagent）（p28）。
- **四種擴充機制**：Skill（how）、MCP（reach outside）、Hook（enforce）、Plugin（distribute）（p30–31、p40）。
- Skill：資料夾＋description（控制被發現）＋body（流程）＋references/scripts；model-invoked vs user-invoked；description 開場載入、body 執行時才載入；有副作用的流程應要求明確呼叫（p33–35）。
- MCP：標準協定連外部服務；MCP tool call 六步，對模型來說和本地工具幾乎一樣（p36–37）。
- Hooks：Session start／User prompt／Before tool use／After tool use／Before stopping 等事件；「model reasoning 不是事件」；可跑 command、HTTP、MCP tool、prompt、subagent（p38）。
- Plugin：skills/、hooks/、agents/、.mcp.json、.lsp.json、.claude-plugin/plugin.json；提供安裝、版本、namespace、團隊重用、marketplace 散佈（p39）。
- `.claude/` 目錄分類：Memory／Configuration／Workflows／Delegation & guardrails；`~/.claude/` 同結構；project 設定蓋過 user（p41）。
- Optional：MCP 的 N×M 問題、host/client/server 架構、Tools/Resources/Prompts 三 primitives、安全（least privilege、讀寫分離、不信任 tool output、安裝前審查）、MCP gateway（p45–52）。

ASSUMED（來自 L1）：agent loop 圖（p14 重用 L1 p36）、「LLM 是 stateless」、context window 類比 RAM。

### 4. 具體例子與數字
- p7：開場 context 10k+ tokens；範例 user prompt「Fix the failing auth test」。
- p8：`Grep("authentication")` 只回傳幾行。
- p10：實際鏈：pytest → grep create_session → read session.py → edit session.py → pytest all green。
- p11：`Bash("rm -rf build/")` 經權限層判斷。
- p12：典型 context 1M tokens（Sonnet / Opus / Fable, GPT 5.6）；今年稍早 256K 常見；prefix-cache reads 佔大部分成本。
- p18、p23：auto memory 每 session 載入前 200 行／25KB。
- p20：CLAUDE.md 四個路徑（`…/ClaudeCode/CLAUDE.md`、`~/.claude/CLAUDE.md`、`./CLAUDE.md` 或 `./.claude/CLAUDE.md`、`./CLAUDE.local.md`）。
- p22：`.claude/rules/testing.md`、`api-style.md`、`db-migrations.md`。
- p23：`MEMORY.md`、`user_role.md`、`feedback_testing.md`。
- p32：Release workflow 範例：跟 release 流程（Skill）、建 GitHub release（MCP）、測試失敗就擋發佈（Hook）、分享整套設定（Plugin）。
- p34：release skill 五步（讀 release notes、確認版本、跑測試、準備 commit、發佈前詢問）；`/release 2.4.0`。
- p42：設計練習答案表：API conventions→Skill；讀 Jira→MCP；每次 edit 後 format→Hook；多步部署→Skill；完成通知→Hook+MCP；擋 production 寫入→Hook 或 policy；跨 repo 共用→Plugin。**這是很好的文章互動題。**
- p47–48：MCP triage 範例 `/mcp__github__triage_issue 123 high`、`github://issues/123`、`get_related_errors`。

### 5. 待查證的主張
- p7：開場 context「10+k tokens」；Skill／MCP 只載名稱與描述。
- p11：Auto permission mode 由「a small model」檢查。
- p12：1M context 適用 Sonnet / Opus / Fable / GPT 5.6；「256K was common earlier this year」；「prefix-cache reads account for most of the cost」。
- p18、p23：auto memory「first 200 lines / 25KB」、「shared across worktrees」、「Machine-local」、「On by default; disable with /memory」、四種 type。
- p20：CLAUDE.md 載入順序與 managed policy 路徑「cannot be excluded」。
- p22：`.claude/rules/` 的 `paths:` frontmatter 行為。
- p25：`/doctor` 能「Identify content that may not belong in CLAUDE.md」。
- p38：hook 可執行的類型（command、HTTP、MCP tools、prompts、subagents）。
- p39：plugin 目錄含 `.lsp.json`。
- p41：「Project settings win over user settings」。
- p45：「An open protocol (stateless)」。
- p52：MCP spec 2026-07-28 「largest revision since launch」、stateless core、`Mcp-Method` headers、Tasks、MCP Apps、list results 可依 TTL 快取。

### 6. Readings（Sep 9）
必讀（首頁 schedule 列出）：
- How I use LLMs — Andrej Karpathy, 2025 — https://www.youtube.com/watch?v=EWvNQjAaOHw 🟡 title only
- Best practices for Claude Code — Anthropic — https://code.claude.com/docs/en/best-practices ✅ opened（Exa；Claude Code 官方文件，開頭即強調「context window fills up fast, and performance degrades as it fills」）
- Agentic Engineering Patterns — Simon Willison, 2026 — https://simonwillison.net/guides/agentic-engineering-patterns/ ✅ opened（Exa；持續更新的 guide，章節含 Principles、Working with coding agents／How coding agents work 等）

More reading：
- 主題「Configuration, context cost, and enforcement」
  - Equipping agents for the real world with Agent Skills — Anthropic, 2025 — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills 🟡
  - Code execution with MCP — Anthropic, 2025 — https://www.anthropic.com/engineering/code-execution-with-mcp 🟡
  - How skills and MCPs actually work — Lawrence Jones, 2026 — https://blog.lawrencejones.dev/demystifying-skills-and-mcps 🟡（Sep 16 也列）
  - Claude Code hooks reference — Anthropic — https://code.claude.com/docs/en/hooks 🟡
  - The Harness Is the Thing — Scott Fryxell, 2026 — https://scott-fryxell.github.io/blog/the-harness-is-the-thing 🟡
- 主題「Evidence on harness configuration and cost」
  - Guardrails Beat Guidance: A Large-Scale Study of Rules, Skills, and Persistent Configuration for Coding Agents, 2026 — https://arxiv.org/abs/2604.11088 🟡（網站摘要：679 個公開 rule 檔、25,532 條規則、5,000+ 次 Claude Code 試驗）
  - The Scaffolding Matters More Than the Interface（MCP vs CLI，7 scaffold × 5 models）, 2026 — https://arxiv.org/abs/2608.08654 🟡

（readings 頁註明：「Why read it」摘要由 AI 產生，選文由講者挑選。）

### 7. 先備知識與斷崖
- 需要：什麼是 LLM API call、token、context window；知道 tool calling 是「模型輸出結構化請求、程式執行」；基本 git、shell、Markdown/YAML frontmatter。
- **斷崖 1（p12）**：「prefix-cache reads account for most of the cost」一句帶過，但 prefix cache 要到 Part II 才講；讀者需要一句白話解釋「同樣的開頭不必重算，但仍要付費」。
- **斷崖 2（p11）**：permission modes 只列名稱，Auto mode 是「小模型審核」的概念需要補例子。
- **斷崖 3（p29–42）**：四種擴充機制一次全上，且 hook 的價值（「skill 只是可用，hook 才保證被用」）要到 L3 的 Superpowers p11 才真正講清楚；導讀可考慮把 L3 p11 的論點往前提示。
- **斷崖 4（p44–52）**：Optional MCP 段跳到 gateway、protocol 版本、`Mcp-Method` header，屬於進階，導讀放延伸即可。
- 本 deck 大量是 **Claude Code 產品行為**，會隨版本變；文章需要標示查證日期。

### 8. 與作業的連結
- p28：「You will build these tools yourself in Assignment 2」。
- Readings 頁 Best practices 條目寫「Assignment 1 records each of those effects」。
- A1 本身（用 headless `claude -p --output-format stream-json` 做 web UI）直接對應 p6–13 的 loop：A1 頁面要渲染的 tool_use／tool_result 事件，就是 p9–10 的 propose/execute 鏈；subagent 樹狀視圖對應 p28 的 Delegate。

---

## L3｜2026-09-14 Agents use II: 100x Engineer with Multi-agents（`slides/3_agent_use_2.pdf`）

### 1. Deck facts
- 檔案：`slides/3_agent_use_2.pdf`，72 頁。投影片標題寫「Agent From a User’s Perspective II: Multi-agent and Best Practice」。
- 日期：2026-09-14（Week 3 週一）。
- p41 與 p42 重複；p64–67 是純圖表頁（已渲染讀取）；p70 起 Optional slides。
- **一份 deck 塞了四個主題**：plugin 案例研究、多 agent、Programming/Software 3.0 與不確定性、OpenAI Codex 使用證據。

### 2. 段落大綱
| 段落 | 頁 |
|---|---|
| 提醒（A1 due、sharing 報名、把 TF 加進 repo、新 TF Charles Wang）、Recap、今日計畫 | p1–4 |
| Case study：Superpowers plugin（同模型不同流程、9 個 skill、架構、skill 解剖、SKILL.md 內容、為何 skill 不夠要 hook、session-start script、端到端流程、設計教訓） | p5–14 |
| Case study：Caveman（為何壓縮 token、雙向壓縮、範例流程、plugin 打包、response skill、commands、hooks、MCP tools、local proxy、機制總覽） | p15–25 |
| Become a 100x engineer：三個 scaling 軸、手動 parallel agents＋git worktree、手動的極限、subagents（why、內建、定義、巢狀、多層模式、使用方式、何時用）、agent teams（用途、結構、vs subagent）、dynamic workflow、long-running `/goal`、`/loop`、summary | p26–46 |
| Optional：16 agents 寫 C compiler（規模、協調、git 作為協調層、不完美之處） | p47–50 |
| Programming / Software 3.0（講者自定義 vs Karpathy 定義）、不確定性（是否新、從意圖到結果、各層來源、best practices、「讓周邊系統可靠」） | p51–59 |
| Evidence from the field：Codex（June 2026）、OpenAI 內部（September 2026）、Delegation Ladder | p60–68 |
| Next class | p69 |
| Optional：CLI coding agent 生態圖、五個比較軸 | p70–72 |

### 3. 核心概念
NEW：
- **同模型、不同 workflow**：Superpowers 把預設「需求→寫 code→迭代修」改成 Clarify → Approve design → Detailed plan → TDD → Review & verify → Finish branch；「only the instructions differ」（p6）。
- **Process skill** 的構成：entry conditions、required/prohibited actions、human approval gates、verification requirements、next applicable skill（skill 可指名下一個 skill）（p10）。
- **Skill 只是 available，不保證被用** → 用 SessionStart hook（matcher `startup|clear|compact`）注入 bootstrap skill 到 `additionalContext`，compaction 後也會重注入（p11–12）。
- **雙向 token 壓縮**：skill 改變模型怎麼寫（output），proxy 改變模型讀到什麼（input）；保留原文供 retrieval（p16–17）。
- **Hook 不能透明改寫送給 LLM 的 request → 需要 local proxy**；自己寫 harness 則可以（p24）。Proxy vs MCP：proxy 攔截每個 request，MCP 只在被呼叫時執行（p24）。
- **TOON**（JSON ↔ TOON 編碼）出現在 Caveman MCP tools（p23），未解釋。
- **三個 scaling 軸**：parallel agents（breadth，買 wall-clock throughput 而非答案品質）、subagents（breadth+depth，買 throughput 與 focus）、long-running agent（duration，買 scope）（p27）。
- **Git worktree**：一個 repo、多個工作目錄、共享歷史（p28–29）。
- **手動平行的極限**：計畫在你腦中、session 看不到彼此、你要合併分支、不可重跑（p30）。
- **Subagent**：獨立 context window、工具與權限；好處是保留主 context、強制限制、可重用、平行、成本控制（route 到 Haiku）（p31）；內建 Explore／Plan／General-purpose（p32）；Markdown + YAML frontmatter 定義，body 成為 system prompt（p33）；巢狀（tools 要含 Agent）（p34）；多層模式（p35）；三種呼叫方式（自然語言、@-mention、`--agent`）（p36）；何時留在主對話 vs 委派（p37）。
- **Agent teams**：lead + teammates + shared task list + mailbox；teammate 不繼承對話但會載 CLAUDE.md 與 skills；實驗性、預設關閉（p38–39）；vs subagent 比較表（p40–41）。
- **Dynamic workflow**：用 JavaScript script 在背景編排大量 subagent；`ultracode` 或 `/effort ultracode` 啟動（p43）。
- **`/goal`**（可驗證終態，evaluator 每次檢查、`--max-tries`）vs **`/loop`**（定時重跑直到你停）（p44–45）。
- **Programming 1.0/2.0/3.0（講者自定義）**：1.0 直接寫機器指令、2.0 程式語言＋compiler、3.0 自然語言＋agent；生產力上升、不確定性上升（p52）。和 **Karpathy 的 Software 1.0/2.0/3.0**（code／weights／prompts）區分（p53）。
- **不確定性**：同 source 不同 output 早就存在（硬體、環境、軟體三層，2.0 怎麼解、3.0 新增什麼）（p55）；從 intent 到 result 多了「單一 prompt 的模糊輸入」（p56）；四層來源：自然語言語意、retrieval/context drift、模型生成（sampling＋軟硬體非決定性）、agent/tool loop 環境非決定性；生成出的程式本身通常是決定性的（p57）。
- **Programming 3.0 best practices**：DEFINE（先講假設、指定 outcome 而非 prompt）、CONTROL（提案與執行分離、明確管理 context）、VERIFY & GOVERN（緊縮 generate-verify loop、多量一層）（p58）；「不要期待 agent 決定性，讓周邊系統可靠；autonomy 要和風險相稱」（p59）。
- **Delegation Ladder**：Chatbot → Assistant → Agent → Multi-agent worker → Systematized workflows（p68）。

ASSUMED（來自 L2）：skill／hook／MCP／plugin 四機制與目錄結構、context／compaction、subagent 作為「Delegate」工具。（來自 L1）：L1 p31 的非決定性與 p26 Agentic Coding Levels，與本堂 p55–57、p68 呼應但沒有明說回扣。

### 4. 具體例子與數字
- Superpowers 安裝 `/plugin install superpowers@claude-plugins-official`（p5）；九個 skill 名稱與職責表（p7）；brainstorming SKILL.md 七步（p9）；hooks.json 範例（p11）；session-start bash script（p12）；「Add authentication」端到端流程（p13）。
- Caveman 安裝 `claude plugin marketplace add JuliusBrussee/caveman`（p15）；786 行 npm test 輸出壓成一行「3 tests fail: ETIMEDOUT at client.ts:88」（p16）；**「Reported: 65% fewer output tokens」，skill 本身增加 input tokens 所以整個 session 省得較少**（p17）；`/caveman ultra` 七步流程（p18）；模式 lite/full/ultra/off 與 7 個 commands（p21）；兩個 hook（SessionStart、UserPromptSubmit）（p22）；5 個 MCP tools，範例結果 `ratio: 0.72`、`recovery_handle`（p23）；proxy 依類型保留內容（logs、code、diffs、JSON、search、HTML）（p24）。
- Worktree：`claude -w feature-payments`、`claude -w bugfix-auth`（p28）；3 sessions 可以、20 sessions 需要「一個你的分身」（p30）。
- Subagent frontmatter 範例 code-reviewer（tools: Read, Glob, Grep；model: sonnet）（p33）；巢狀範例 `model: claude-sonnet-5-0`；最多 5 層、2–3 層最佳（p34）。
- `/goal "npm run lint exits with zero errors"`；「all integration tests pass」可以，「refactor the code」不行（p44）；`/loop 5m "check CI, fix whatever broke"`、預設 prompt 放 `.claude/loop.md`（p45）。
- C compiler（optional，p47–50）：16 agents、約 2,000 sessions、兩週、2B input / 140M output tokens、略低於 $20,000、約 100,000 行、可編 Linux 6.9（x86/ARM/RISC-V）、QEMU、FFmpeg、Postgres、Redis、Doom、主要測試約 99% 通過；lock file 認領任務、git 為協調層；限制：merge conflict 頻繁、大家卡同一個 kernel failure 時平行無效、16-bit x86 仍靠 GCC、產生的程式碼比 GCC 慢。
- Codex 證據（p61–63，June 2026）：最近 28 天用過 Codex：individual <1%、organizational 17.3%、OpenAI 員工幾乎全部；2026 上半年活躍用戶成長 5 倍以上；≥1 human-hour 任務 25.6%→70.2%、≥8 human-hours 2.1%→35.4%（Dec 2025→May 2026，「12× rise」）；28.6% OpenAI 用戶一週內有同時跑 5+ agents 的日子；中位員工每天約 2.5 agent-hours；P99 約 71 agent-hours／天（「+88% since April」）。
- OpenAI 內部（p64–67，September 2026，圖表頁）：agent workdays / researcher workdays 從 2026-05 約 0.5x 升到 8 月 3.14x；多數研究員有 4+ 個並行 workflow（未顯示）；每位活躍貢獻者改動行數相對 pre-2025 約 7x（標題寫「Almost 8x」）；依人類估計時長分組的成功率：<15m 任務 86% 零介入成功，64–128h 任務只有 16% 零介入、51% 需 ≥1 次介入、26% 失敗；中位研究員每日內部 coding agent 花費 2026-08 約 $600，P90 約 $7,000（p67，引 *Research acceleration: The view inside OpenAI*）。
- Optional 生態（p71–72，引「State of CLI Coding Agents, Mid-2026 (July 2026)」）：分四類列 30+ 工具；五軸比較（open/closed、locked/BYOK、sandbox/prompt、local/cloud、maximal/minimal）；OpenCode 75+ providers、Kilo 500+ models、mini-SWE-agent ~100 行 Python。

### 5. 待查證的主張
- Superpowers：九個 skill 名稱、hook matcher `startup|clear|compact`、安裝指令（p5–12）。
- Caveman：repo `JuliusBrussee/caveman`、「65% fewer output tokens」、5 個 MCP tool 名稱、TOON、proxy 設計（p15–24）。
- p24：「Hooks cannot transparently rewrite request to LLM」。
- p28：`claude -w`；「desktop app every new session gets a worktree automatically」。
- p32：Explore／Plan「skip CLAUDE.md and git status」。
- p34：「Up to 5 levels of nesting」；`claude-sonnet-5-0` model ID。
- p38：agent teams「Experimental — off by default」。
- p43：dynamic workflow 為 JavaScript；`ultracode`／`/effort ultracode`。
- p44–45：`/goal`、`--max-tries`、`/loop`、`.claude/loop.md`。
- p47–50：C compiler 所有數字（出處：Carlini, *Building a C compiler with a team of parallel Claudes*）。
- p61–63：Codex 數字（出處：*The Shift to Agentic AI: Evidence from Codex*, arXiv 2606.26959）。
- p64–67：OpenAI 內部數字（出處：*Research acceleration: The view inside OpenAI*, 2026-09-06）；「Almost 8x」vs 圖上最後一根約 7x（且為斜線推估柱）。
- p68：「OpenAI's workforce sits near the bottom」的意思（梯子底端＝哪一級）需對原文。
- p71–72：「State of CLI Coding Agents, Mid-2026」報告是否存在、各工具歸類。

### 6. Readings（Sep 14）
必讀：
- Claude Code agent teams — Anthropic — https://code.claude.com/docs/en/agent-teams ✅ opened（Exa；官方文件，確認 lead／teammates／各自 context window／互相直接溝通，並建議先考慮較輕量的 subagents）
- Software is changing (again) — Andrej Karpathy, 2025 — https://www.youtube.com/watch?v=LCEmiRjPEtQ 🟡 title only
- Research acceleration: The view inside OpenAI — OpenAI, 2026 — https://openai.com/index/research-acceleration-view-inside-openai/ ✅ opened（Exa；發佈日 2026-09-06，宣稱已達成「automated research intern by September」目標）

More reading（主題「References」）：
- Software 2.0 — Karpathy, 2017 — https://karpathy.medium.com/software-2-0-a64152b37c35 🟡
- Software 3.0 — the era of intelligent software development — Itamar Friedman, 2022 — https://medium.com/@itamar_f/software-3-0-the-era-of-intelligent-software-development-acd3cafe6cd7 🟡
- Create custom subagents — Anthropic — https://code.claude.com/docs/en/sub-agents 🟡
- Orchestrate subagents at scale with dynamic workflows — Anthropic — https://code.claude.com/docs/en/workflows 🟡
- Building a C compiler with a team of parallel Claudes — Nicholas Carlini (Anthropic), 2026 — https://www.anthropic.com/engineering/building-c-compiler 🟡
- The Shift to Agentic AI: Evidence from Codex, 2026 — https://arxiv.org/abs/2606.26959 ✅ opened（Exa；arXiv econ，2026-06-25，作者 Drew Johnston 等 6 人；就是 p60–63 數字的來源）

注意：Superpowers 與 Caveman 兩個案例 **沒有列在 readings**，只在投影片出現。

### 7. 先備知識與斷崖
- 需要：L2 的四種擴充機制；git branch／worktree 基本概念；JSON、bash script 能看懂；「compaction」是什麼。
- **斷崖 1（p11–12、p22）**：hook 的 JSON 設定與 `additionalContext` 注入機制，前提是讀者懂 L2 p38 的生命週期事件。
- **斷崖 2（p24）**：proxy 位於 agent 和 model provider 之間攔截 request——需要讀者理解「agent 每一步都是一個 HTTP API request」，L2 沒有明講到這層。
- **斷崖 3（p23）**：TOON 無解釋。
- **斷崖 4（p51 起）**：從 Claude Code 操作技巧突然跳到 Programming 3.0 的哲學框架與不確定性分析，再跳到 OpenAI 組織數據；三段之間只有很鬆的連結。導讀可能要拆成兩篇（「多 agent 實作」vs「Software 3.0 與委派的實證」）。
- **斷崖 5（p55）**：「2.0 怎麼解不確定性」表格假設讀者懂 cross-compilation、memory consistency、idempotent APIs。

### 8. 與作業的連結
- p2：A1 due、A1 sharing 報名、把講者與 TF 加入 repo。
- p26：「How do you finish the assignments in two hours?」作為多 agent 段落的引子（玩笑式）。
- 未直接連到 A2/A3；但 Caveman 的 token 壓縮與 subagent 隔離都是 A3（Mads-Opt：減 token、壓 context）的可用手法——**這是推論，slide 未明說**。

---

## L4｜2026-09-16 Agents design I: context management and tool design（`slides/4_agent_design_1.pdf`）

### 1. Deck facts
- 檔案：`slides/4_agent_design_1.pdf`，56 頁。投影片標題「Agent Design I: context management and tool design」。
- 日期：2026-09-16。同週日（Sep 20）A1 截止。
- p14 與 p15 重複；p26（SWE-agent 消融圖）與 p43（context 長度與位置圖）已渲染讀取；p55 起 Optional Reading。

### 2. 段落大綱
| 段落 | 頁 |
|---|---|
| Logistics（A1 本週日截止、分享 repo、填 Google form、A1 sharing 週四報名）、今日計畫 | p1–3 |
| Agent loop：ReAct、agent loop pseudo-code、harness designer 要做的事、coding agent 三元件 | p4–7 |
| Tool design：該提供哪些工具？Search/Read 四法（glob/grep、semantic、extrinsic signals、LSP）＋比較；Edit 四法（whole-file、unified diff、search/replace、AST）＋取捨圖；Execution（shell 的力量與要考慮的事）；另外五種常用工具；tool design best practices；「只給 shell 行不行？」 | p8–26 |
| Context management：用語演進（prompt→context→harness→goal engineering） | p27–28 |
| Prompt engineering：7 種技巧（zero-shot、few-shot、role、CoT、ToT、self-consistency、chaining、meta prompting）、怎麼選、「有些技巧已過期」、四個 best practices | p29–40 |
| Context engineering：定義（Karpathy）、context 是有限資源、長度與位置都會傷準確率、context window 解剖、四種管理手段（admission、offloading、transformation、compaction）、五種 context 失敗 | p41–50 |
| Agent = Model × Harness：換 harness 準確率 2× | p51–53 |
| Next class、Optional：Beyond ReAct（Reflexion、Plan-and-execute、Tree search） | p54–56 |

### 3. 核心概念
NEW：
- **ReAct**：Thought → Action → Observation；與 reason-only（無檢查、錯誤累積成自信幻覺）、act-only（沒有計畫、重複自己）對比（p4）。
- **Agent loop pseudo-code**：messages 陣列、`for step in range(MAX_STEPS)`、call_model、append、final_answer 就 return、否則 validate → execute_tool → append tool message；超過步數 raise（p5）。
- **Harness designer 的工作**：寫 tool definitions、組 context、validate request／check permission／run、處理結果並管理 context（p6）。
- **Coding agent 三元件**：Model + loop；Tools + guardrails；State（context + memory）——「三元件共用一個 context window，要一起設計」（p7）。
- **Search/Read 四法**與比較表（p10–14）；結論「start with grep; reach for an index or LSP when names run out」。
- **Edit 四法**與 token cost × robustness 取捨（p17–21）。
- **Shell**：composition、reach、persistence、blast radius（p22）；要考慮 isolation、failure signal、output 量、duration、budgets（p23）。
- **另外五種常用工具**：memory/notes、subagents、web search/fetch（先讀已安裝的原始碼再上網）、browser/visual feedback、ask the user（p24）。
- **Tool design best practices**：few orthogonal tools、purpose-built 勝過 generic（`search_orders(customer_id)` 勝過 `run_sql`）、token-cheap output（tool design is context design）、errors that teach、idempotent by default（p25）。
- **Prompt → Context → Harness → Goal Engineering** 的用語演進（2023–24 / 2025–26 / 2026 / Now→Next）（p28）。
- **Prompt engineering 技巧譜系**與「何時用、何時換下一招」（p30–38）；「Some of the techniques are already expired — find out yourself in assignment」（p39）；「prompting advice is model-specific — re-tune whenever you switch」（p40）。
- **Context engineering** 定義（Karpathy 引言）（p41）；context 是有限資源：cost、latency、attention（p42）。
- **Context window 解剖**（示意 token 預算）（p44）。
- **四種管理手段**，從 preventive & lossless 到 lossy & irreversible：Admission → Offloading → Transformation → Compaction（p45–49）。
- **五種 context 失敗**：Poisoning、Distraction、Confusion、Clash、Drift（p50，引 Breunig 2025）。
- **Agent = Model × Harness**：模型能力定上限，harness 決定實際表現（p51–53）。
- Optional：Reflexion、Plan-and-execute、Tree search（p56）。

ASSUMED：L2 的 agentic loop、compaction、auto memory、subagent；L1 的 prefill/decode 與 prefix cache（p42「bigger prompts take longer to prefill and decode」直接用了 prefill/decode 這兩個詞，但 LLM 背景課已延後）。

### 4. 具體例子與數字
- Search 範例：「fix the login timeout」— `grep -rn "timeout" src/` 37 hits / 12 files → `glob src/**/auth/*.ts` → `auth/retry.ts` `RETRY_MS = 500`（p10）；「where do we rate-limit?」semantic 第一次就找到 throttle.ts，Aider repo map（p11）；checkout crash：stack trace `cart.ts:88` → `tax.ts:20-60` → `pytest tests/tax.py`（p12）；rename `charge()`→`capture()`：42 call sites / 7 files（p13）。
- Edit 範例：whole-file 120 行改 4 行（p17）；unified diff `@@ -41,3 +41,3 @@`、`git apply`（p18）；search/replace `retries = 3 → 5`（p19）；AST `add_param(fetchUser)` timeout 預設 5s、18 個 caller（p20）。
- p26（圖）：SWE-agent 消融（GPT-4）：Purpose-built SWE-agent 18.0%、Full interaction history 15.0%、Full-file view 12.7%、Shell only 11.0%、No specialized editor 10.3%；圖上有紅字「No on GPT-4」（意指在 GPT-4 上只給 shell 不行）；接著問「Can we just provide the shell tool? Find out when you work on the assignment!」。
- Prompt 範例：support ticket 分類 zero-shot / few-shot（p30–31）；SRE postmortem role（p32）；CoT 3×4+5×2=22（p33）；ToT checkout latency 三方案打分（p34）；self-consistency 5 samples T=0.7、4/5=0.8，3/5 交給人（p35）；email → extract → validate → reply 三階段 chaining（p36）；meta prompting 8/10 → 10/10（p37）；翻譯西班牙文 prompt 結構（p40）。
- p43（圖）：輸入長度 1K→400K，simple lookup 降到 73%、with distractors 降到 46%；20 份文件中答案位置第 1/5/10/15/20：76%/61%/55%/59%/71%（引 Context Rot (Chroma)；Liu et al., “Lost in the Middle,” TACL 12 (2024)）。
- p44：示意預算 system ~2K、tool definitions ~6K、retrieved ~25K、project env ~8K、message history ~80K and growing。
- p46：raw DOM 48,000 tokens → 只留價格與標題 900 tokens（98% smaller）。
- p47：60 個 tool schema 常駐 42,000 tokens → index + 3 schemas 3,100 tokens（93% smaller）。
- p48：每個結果都保留 96,000 tokens → 只留最新狀態 24,000 tokens（75% smaller，沒有做摘要）。
- p49：compaction 警告：保留輸出 headroom、保留 system prefix、壓縮後重新注入關鍵事實。
- p52：Lewis (arXiv:2608.26218, 2026)：SWE-bench Verified 43/169 → 72/169；SWE-bench Pro 31/316 → 72/316；改動：舊 tool output 壓縮、保留近期觀察、偵測重複與停滯、卡住時介入；「Some apparent model failures are actually context- and control-loop failures」。

### 5. 待查證的主張
- p11：Aider repo map 的實際輸出格式。
- p26：SWE-agent 消融數字（出自 SWE-agent 論文，Yang et al. 2024）；「Shell only 11.0%」被紅字蓋住，需對原論文表格確認該列名稱與數值。
- p28：各術語年份（Prompt 2023–24、Context 2025–26、Harness 2026、Goal Now→Next）——講者自己也聲明「People love coining terms」。
- p41：Karpathy 引言原文。
- p43：Chroma Context Rot 曲線數值（73%、46%）與 Lost in the Middle 數值（76/61/55/59/71）；後者原論文主要是 20 docs 設定，需確認對應模型。
- p44、p46–48：都是「illustrative」數字，文章要標示為示意，不是實測。
- p50：Breunig 原文是否就是這五類（原文有 poisoning、distraction、confusion、clash；Drift 是否在原文中需確認）。
- p52：Lewis 論文的數字與條件（Exa 已確認論文存在：arXiv 2608.26218，2026-08-26，作者 Sydney Lewis，比較同一 harness 兩種設定、三個 benchmark；摘要說是「Under tight context」條件下，slide 沒提這個前提）。

### 6. Readings（Sep 16）
必讀：
- ReAct: Synergizing Reasoning and Acting in Language Models, 2022 — https://arxiv.org/abs/2210.03629 ✅ opened（Exa；Yao et al.，Princeton＋Google）
- A practical guide to building agents — OpenAI, 2025 — https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents ✅ opened（Exa；給產品／工程團隊的入門指南，定義「agents are systems that independently accomplish tasks on your behalf」）
- LLM Powered Autonomous Agents — Lilian Weng, 2023 — https://lilianweng.github.io/posts/2023-06-23-agent 🟡 title only

More reading：
- 主題「Agent」
  - Building Effective Agents — Anthropic, 2024 — https://www.anthropic.com/engineering/building-effective-agents 🟡
  - What Is an Agent Harness? Harness Engineering Explained — Tejas Kumar, 2026 — https://tej.as/blog/what-is-an-agent-harness 🟡
  - Agent Patterns: Patterns, Anti-Patterns, and Primitives for Coding Agents — https://agentpatterns.ai/ 🟡
- 主題「Structuring context for cache reuse」
  - Effective context engineering for AI agents — Anthropic, 2025 — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents 🟡
  - Context Engineering: A Practical Guide for AI Agents — Sourcegraph, 2026 — https://sourcegraph.com/blog/context-engineering 🟡
  - Less Context, Better Agents (context pruning), 2026 — https://arxiv.org/abs/2606.10209 🟡
  - Lost in the Middle: How Language Models Use Long Contexts, 2023 — https://arxiv.org/abs/2307.03172 🟡
  - Diagnosing and Mitigating Context Rot in Long-horizon Search, 2026 — https://arxiv.org/abs/2606.29718 🟡
- 主題「Tool design」
  - Writing effective tools for agents — with agents — Anthropic, 2025 — https://www.anthropic.com/engineering/writing-tools-for-agents 🟡
  - How Foundational Models Became Superhuman in Bash — Philipp Schmid, 2026 — https://www.philschmid.de/superhuman-bash 🟡
  - Toolformer, 2023 — https://arxiv.org/abs/2302.04761 🟡
  - How skills and MCPs actually work — Lawrence Jones, 2026 — https://blog.lawrencejones.dev/demystifying-skills-and-mcps 🟡（Sep 9 也列）

投影片引用但 **未列入 readings**：Lewis, *Same Model, Different Harness*（arXiv 2608.26218）✅ opened（Exa，見上）；Breunig, *How Contexts Fail and How to Fix Them* (2025) 🟡；Chroma *Context Rot* 🟡；SWE-agent 論文（p26 圖，slide 未標出處）🟡；AST 影片 https://www.youtube.com/watch?v=lCrC-qojPpU（p20）🟡。

### 7. 先備知識與斷崖
- 需要：L2 的 agentic loop；Python 讀得懂（p5 pseudo-code）；OpenAI 式 messages／role／tool_call_id 結構；grep/glob、git diff 格式；embedding 的直覺（p11）；LSP 是什麼（p13）；AST（p20，slide 只給影片連結）。
- **斷崖 1（p5）**：從 L2「用 Claude Code」跳到「自己寫 loop 的 pseudo-code」——這是使用者視角 → 設計者視角的轉折點，也是 A2 的起點；導讀需要補「一次 API call 長什麼樣、tool schema 長什麼樣」。
- **斷崖 2（p11、p13、p20）**：embedding、LSP、AST 三種技術各一頁帶過。
- **斷崖 3（p26）**：SWE-agent 消融圖沒有出處、沒有說明 benchmark（推測是 SWE-bench）、還被紅字遮住；只留「去作業找答案」。
- **斷崖 4（p42–43）**：「prefill and decode」「attention」用語假設讀者已有 LLM 內部知識，但 LLM 背景課已延後。
- **斷崖 5（p28 → p29）**：先宣告 prompt engineering 是 2023–24 的舊說法，接著花 12 頁教 prompt 技巧，再說「有些已過期」；寫導讀時要明說這段是「詞彙與歷史」而非現行最佳實務。

### 8. 與作業的連結
- p26：「Can we just provide the shell tool? Find out when you work on the assignment!」——對應 A2（公開 A2 頁面確認提供 `bash`、`read_file`、`edit_file(path, old_string, new_string)`、`done` 四個工具，即 shell＋search/replace 編輯；後端模型 `qwen3.6-35b-a3b`，經 `api.cs2680.com` OpenAI 相容端點；benchmark SWE-bench Pro＋自建 4 題）。
- p39：「Some of the techniques are already expired — Find out yourself in assignment!」。
- p53：「Experiment yourself in assignment: agent loop, prompt, tool, context management, failure handling all matter」——對應 A2（建 loop）與 A3（Mads-Opt：壓 token、重組 context）。
- p2：A1 本週日（Sep 20）截止、A1 sharing 報名。

---

## Assignments & project summary

### 五份作業（Mads = Modern Agent Design and Systems）
| # | 名稱 | 發布 → 截止 | 權重（作業頁／policy 頁） | 內容 | 公開狀態（2026-10-21） |
|---|---|---|---|---|---|
| 1 | **Mads-Lens**: Watch the agent work | Wed Sep 2 → Sun Sep 20 11:59pm | 10% | 用 Claude Code 做一個驅動 Claude Code 的 web UI：spawn `claude -p --output-format stream-json --verbose`、即時串流 trajectory、tool result 摺疊、per-call 與 per-run 狀態、`--resume` 續對話、顯示 cost／duration／turns（來自 result event 的 `total_cost_usd`、`duration_ms`、`num_turns`）、subagent 樹狀（依 `parent_tool_use_id`）＋outline。禁用 Agent SDK 與 API key（用 Harvard 登入）、禁用 agent framework。交付：code、writeup（what built／三個 session-anchored 觀察／想改 Claude Code 的一件事）、2–3 分鐘 demo 影片（Canvas）、session 檔。配分：七功能各 10%、writeup 20%、視覺 10%。估 4–6 小時。 | 完整頁面公開（已下載） |
| 2 | **Mads-Loop**: Build the loop | Mon Sep 21 → Sun Oct 4 | 10% | 用 starter code 自建 `madsLoop` harness：tool calling（schema）、context 管理、retries、termination、壞輸出／壞工具下的 graceful failure；SWE-bench Pro 評測＋自建 4 題；hidden tests 測 runtime 不測模型。估 10–12 小時。 | 公開（`cs2680.com/assignments/assignment2`，本地未下載） |
| 3 | **Mads-Opt**: Make every token count | Mon Oct 5 → Tue Oct 20 | 20% | 模型仍是黑盒 API；在 task success 不變下壓 cost 與 latency：減 token／呼叫、改用便宜模型、tool 執行重疊、壓縮／重組 context、改 control flow。Leaderboard 排名（solve rate＋cost），交 blog post。估 10–15 小時。 | 公開（`/assignments/assignment3`）；另有 `slides/8_assignment3.pdf` |
| 4 | **Mads-Serve**: Own the serving engine | Wed Oct 21 → Tue Nov 10 | 20% | 拿掉 frontier API，自己 serve 7–8B open-weight 模型；量品質損失、診斷原因、靠 harness 補回；不准換大模型或退回商用 API。估 10–14 小時。 | **未公開**（redirect 到 `/to_release`） |
| 5 | **Mads-Stack**: Optimize the full stack | Wed Nov 11 → Sun Nov 29 | 10% | loop、模型、serving 全部可動；先 profile 全路徑、寫下效能假設，再跨層最佳化、重跑同一 workload 判斷哪個改動真的有效。Leaderboard（solve rate、API＋GPU cost、latency），交 blog post。估 12–18 小時。 | **未公開**（同上） |

- 全部個人作業；一個私有 GitHub repo（`assignment1/`…`assignment5/`），加入講者與 4 位 TF（`1a1a11a`、`LauYeeYu`、`SeverinaZheng`、`G6KlayWang`、`AdvaithRavishankar`）。
- A1、A2、A4 交 writeup；A3、A5 交公開 blog post。每份都要附 Claude Code session 檔與 AI 使用揭露。
- Leaderboard（A3、A5）：100 分＝80 performance＋20 write-up/video；`performance = max(80 − rank, 50 if beat baseline)`。Leaderboard 於 2026-10-08 上線（leaderboard.cs2680.com）。

### 政策重點（policy 頁）
- 現行配分：A1 10%、A2 10%、A3 20%、A4 20%、A5 10%、Final project 20%、Participation 10%、Bonus 最多 10%（選擇性 presentation 每次最多 4%、course feedback 最多 4%、「現行 AI 解不出的題目」每題 2%）。20% A 政策。無考試。
- 4 個 late days（整天計），用完後每天扣 20%，5 天歸零；不適用 sharing session 與 poster。
- AI 使用：鼓勵、必須揭露；每份作業交 code＋writeup＋session 檔；writeup 須自己寫，完全 AI 生成會扣分。
- 不錄影；出席 expected 但不點名，participation 要主動發言（L2 p3：每堂最多 1 分，課後找 TF 登記）。
- 旁聽可以，但不提供運算資源。
- 先備背景：CS61＋至少一門研究所系統課；policy 頁列出一長串「不熟大部分就不適合修」的系統名詞。

### Final project（20%，個人）
- 兩軌：**Product track**（做出比最強現有方案更好的工具；需實測至少 3 個最接近的工具＋直接丟給 frontier model 的結果）或 **Research track**（原創、可證偽的主張；agent-side 或 systems-side；形式為 Measurement／Mechanism／Reproduction and boundary／Instrument）。
- 時程：Proposal Wed Oct 28 11:59pm（2%，九段固定結構，含 75%/100%/125% 目標）→ Poster & demo Mon Dec 7 9:00–13:00 SEC 1.402（10%，含 peer evaluation）→ Blog post＋repo Tue Dec 8 11:59pm（8%，PR 到課程 blog repo；需含 AI 使用說明與可重現性要求）。
- Blog/repo 評分四維度等權：Problem & motivation、Technical execution、Evaluation、Reporting。頁面明說：主要想法沒成功的專題，只要 blog 解釋預期、實測與落差原因，仍可拿到接近滿分。

---

## 意外發現（給規劃者）
1. **配分三套說法不一致**：L1 p16（A1/2/4 各 10%、A3/5 各 20%、Project 16%、Presentation 10%、Participation 4%）vs 首頁＋policy＋作業頁（A1/2/5 各 10%、A3/4 各 20%、Project 20%、Participation 10%）。首頁 bonus 寫 course feedback「up to 6%」，policy 頁寫「up to 4%」。文章應以 policy 頁為準並註明課程中途調整。
2. **L1 預告的「LLM basics」被取消／延後**（L2 p2），L2–L4 都把 LLM 當黑盒，但 L4 p42 又用到 prefill/decode。
3. **L3 一份 deck 塞四個主題**（plugin 案例、多 agent、Software 3.0 與不確定性、OpenAI 使用數據），適合拆成兩篇。
4. **L3 的 Superpowers／Caveman 案例與 L4 的 Lewis 論文、SWE-agent 消融都不在 readings 清單裡**，只在投影片出現。
5. **A4、A5 頁面尚未公開**（redirect `/to_release`）；A2、A3 頁面已公開但本地 sources 沒下載。
6. 投影片印的頁碼與 PDF 頁序不同（有隱藏頁被移除），引用以 PDF 頁序為準。
7. 多頁重複（L2 p18–19、L3 p41–42、L4 p14–15）與空白頁（L1 p47、L2 p53），是動畫 build／占位，非缺漏。
